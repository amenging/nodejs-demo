var gulp = require('gulp');
	sass = require('gulp-sass');


gulp.task('testSass', function () {
  gulp.src('sass/style.scss') //该任务针对的文件
    .pipe(sass()) //该任务调用的模块
    .pipe(gulp.dest('public/css')); //将会在src/css下生成index.css
});

gulp.task('default',['testSass']);