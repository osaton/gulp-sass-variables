'use strict';

const sassVariables = require('../index'),
      gutil = require('gulp-util'),
      fs = require('fs'),
      path = require('path'),
      gulp = require('gulp'),
      sass = require('gulp-sass'),
      tap = require('gulp-tap'),
      should = require('should');

let createVinyl = function createVinyl(filename, contents) {
  let base = path.join(__dirname, 'scss'),
      filePath = path.join(base, filename);

  return new gutil.File({
    'cwd': __dirname,
    'base': base,
    'path': filePath,
    'contents': contents || fs.readFileSync(filePath)
  });
};

describe('gulp-sass-variables', function() {
  it('isNull() file should pass ', function (done) {
    let stream = sassVariables();
    let emptyFile = {
      'isNull': function () {
        return true;
      }
    };

    stream.on('data', function(data) {
      data.should.equal(emptyFile);
      done();
    });

    stream.write(emptyFile);
  });

  it('isStream() file should emit error', function (done) {
    let stream = sassVariables();
    let streamFile = {
      'isNull': function () {
        return false;
      },
      'isStream': function () {
        return true;
      }
    };

    stream.on('error', function(err) {
      err.message.should.equal('Streaming not supported');
      done();
    });

    stream.write(streamFile);
  });

  it('should emit error if passed other than object', function (done) {
    let stream = sassVariables(false);

    let sassFile = createVinyl('prepend-test.scss');

    stream.on('error', function(err) {
      err.message.should.equal('Variables object expected');
      done();
    });

    stream.write(sassFile);

  });

  it('should prepend file with defined variables', function (done) {
    let stream = sassVariables({
      $ENV: 'test'
    });

    let sassFile = createVinyl('prepend-test.scss');

    stream.on('data', function(file) {
      should.exist(file);
      should.exist(file.path);
      should.exist(file.relative);
      should.exist(file.contents);
      should.equal(path.basename(file.path), 'prepend-test.scss');
      String(file.contents).should.equal(
        fs.readFileSync(path.join(__dirname, 'expected/prepend-test.scss'), 'utf8')
      );
      done();
    });

    stream.write(sassFile);
  });

  it('should work with strings and numbers', function (done) {
    let stream = sassVariables({
      $STRING: 'string',
      $INT: 200,
      $FLOAT: 1234.1234,
      $BOOLEAN: false
    });

    let sassFile = createVinyl('type-test.scss');

    stream.on('data', function(file) {
      should.exist(file);
      should.exist(file.path);
      should.exist(file.relative);
      should.exist(file.contents);
      should.equal(path.basename(file.path), 'type-test.scss');
      String(file.contents).should.equal(
        fs.readFileSync(path.join(__dirname, 'expected/type-test.scss'), 'utf8')
      );
      done();
    });

    stream.write(sassFile);
  });

  it('should work with gulp-sass', function (done) {
    let streamDoneCount = 0;

    let streamDone = function () {
      streamDoneCount++;
      if(streamDoneCount === 2) {
        done();
      }
    }
    // Without modification
    gulp.src(path.join(__dirname, '/scss/compile-test-original.scss'))
      .pipe(sass())
      .pipe(tap(function(file) {
        should.exist(file);
        should.exist(file.path);
        should.exist(file.relative);
        should.exist(file.contents);
        should.equal(path.basename(file.path), 'compile-test-original.css');
        String(file.contents).should.equal(
          fs.readFileSync(path.join(__dirname, 'expected/compile-test-original.css'), 'utf8')
        );
        //done();
      }))
      .on('end', function () {
        streamDone();
      });

    // With variable
    gulp.src(path.join(__dirname, '/scss/compile-test.scss'))
      .pipe(sassVariables({
        $ENV: 'production'
      }))
      .pipe(sass())
      .pipe(tap(function(file) {
        should.exist(file);
        should.exist(file.path);
        should.exist(file.relative);
        should.exist(file.contents);
        should.equal(path.basename(file.path), 'compile-test.css');
        String(file.contents).should.equal(
          fs.readFileSync(path.join(__dirname, 'expected/compile-test.css'), 'utf8')
        );
        //done();
      }))
      .on('end', function () {
        streamDone();
      });
  });
});
