const fs = require("fs-extra");
const gulp = require("gulp");
const path = require("path");
const execa = require("execa");
const sourcemaps = require("gulp-sourcemaps");
const babel = require("gulp-babel");
const ts = require("gulp-typescript");
const typedoc = require("gulp-typedoc");

const runner = (args, cmd) => async jestEnv => {
  const cmdPath = path.join("node_modules", ".bin", cmd);
  return await execa(cmdPath, args, {
    stdio: "inherit",
    env: { JEST_ENV: jestEnv }
  });
};

const devJestRunner = runner(process.argv.slice(3), "jest");
const CIJestRunner = runner(["--ci", ...process.argv.slice(3)], "jest");

async function clean() {
  let promises = Promise.all([fs.remove("junit.xml"), fs.remove("dist")]);

  return await promises;
}

function tsGen() {
  const { compilerOptions } = require("./tsconfig");

  delete compilerOptions.isolatedModules;
  delete compilerOptions.allowJs;

  return gulp
    .src(["src/**/*.ts", "!src/**/__tests__/**", "!src/**/__mocks__/**"])
    .pipe(ts(compilerOptions))
    .dts.pipe(gulp.dest("dist"));
}

function compile() {
  process.env.BABEL_ENV = "development";
  const babelConfig = require("./babel.config");
  delete babelConfig.sourceMaps;
  delete babelConfig.ignore;

  return gulp
    .src(["src/**/*.ts", "src/run.js","!src/**/*.d.ts"])
    .pipe(sourcemaps.init())
    .pipe(babel(babelConfig))
    .pipe(
      sourcemaps.write(".", {
        sourceRoot: file => {
          return path.posix.relative(path.posix.dirname(file.relative), "");
        }
      })
    )
    .pipe(gulp.dest("build"));
}

function typeDoc() {
  return gulp
    .src(["src/**/*.ts", "!src/**/__tests__/**", "!src/**/__mocks__/**"])
    .pipe(
      typedoc({
        module: "commonjs",
        out: "api/",
        ignoreCompilerErrors: true
      })
    );
}

function copyStatic() {
  return gulp
    .src(["README.md", "license", "package.json", "src/**/*.d.ts", "src/**/__snapshots__/**"])
    .pipe(gulp.dest("build"));
}

async function testUnit() {
  return await devJestRunner("dev-unit");
}

async function testE2e() {
  return await devJestRunner("dev-e2e");
}

async function testCIUnit() {
  return await CIJestRunner("ci-unit");
}

async function testCIE2e() {
  return await CIJestRunner("ci-e2e");
}

const build = gulp.series(clean, tsGen, compile, copyStatic);

module.exports = {
  clean,
  build,
  compile,
  copyStatic,
  testUnit,
  testE2e,
  testCIUnit,
  testCIE2e,
  tsGen,
  typeDoc
};
