module.exports = function (grunt) {
  grunt.initConfig({
    uglify: {
      pkg: grunt.file.readJSON('package.json'),
      options: {
        mangle: true,
        compress: true
      },
      all_vendor_js: {
        files: [{
          expand: true,
          cwd: 'lib/',
          dest: 'lib/',
          ext: '.js',
          src: ['./**/*.js', '!./**/*.min.js']
        }]
      }
    }
  })
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.registerTask('default', ['uglify'])
}
