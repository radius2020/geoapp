/* eslint-env node */
const gulp = require('gulp');
const imageMin = require('gulp-imagemin');
const resize = require('gulp-image-resize');
const rename = require('gulp-rename');
const del = require('del');

// Outside of the above required plugins, you'll also need to download either GraphicsMagick or ImageMagick. The links are on the quiz page. I chose to use GraphicsMagick, but either will work. Just download the installer file for your OS, and let it install. You won't need it to show in any code, it just has to be on your computer.

// Clean will remove the images folder, if it already exists, so we don't risk getting any duplicate folders
// For larger projects, should update / change this to something that instead watches for new / changed files and updates those, instead of deleting the folder and completely redoing it
gulp.task('clean', function() {
  return del('./images');
});

// The main workhorse! We pass it clean so that it won't start running until clean has finished
gulp.task('reduce-images', ['clean'], function() {
  gulp.src('./images_src/*.{jpg, png}') // Pass in your original image source patch, and extensions to watch
      .pipe(resize({ // This plugin resizes the initial images
        width: 400, // Currently using pixels; can also use percentages like so: '50%'
        quality: 0.5, // Adjusts image quality, on a scale of 0 (low) - 1 (high)
      }))
      .pipe(imageMin()) // This plugin compresses the resized images
      .pipe(rename(function(path) {
        path.basename += '-optimized';
      })) // This plugin adds a tag onto the end of the filepath name, so you know it's not the original file
      .pipe(gulp.dest('./images')); // Then you pass the finished file into a new, ready for build directory
});

// This function will copy any image files we don't need optimized into the new build directory, after clean has done it's thing
gulp.task('copy-fixed', ['clean'], function() {
  return gulp.src('images_src/fixed/*.{gif,jpg,png}')
      .pipe(gulp.dest('./images/fixed'));
});

// This is how you'll run everything! Just type gulp into the terminal and it'll run all the functions
gulp.task('default', ['clean', 'copy-fixed', 'reduce-images']);
