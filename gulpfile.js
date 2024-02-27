// gulpプラグインの読み込み
var gulp = require("gulp");
// Sassをコンパイルするプラグインの読み込み
var sass = require("gulp-sass");
//
var connect = require('gulp-connect');

gulp.task('default', function() {
  // place code for your default task here
});

// style.scssをタスクを作成する
gulp.task("sass", function () {
  // style.scssファイルを取得
  return (
    gulp
    .src("htdocs/**/*.scss")
    // Sassのコンパイルを実行
    .pipe(
      sass({
        outputStyle: "compressed"
      })
    )
    // cssフォルダー以下に保存
    .pipe(gulp.dest("htdocs"))
  );
});

gulp.task('connect', function() {
  connect.server({
    root: './htdocs/',
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src('./htdocs/*.html')
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch('htdocs/**/*.scss', ['sass']);
});

//gulp.task('default', ['sass:watch']);
gulp.task('default', ['connect', 'watch']);
