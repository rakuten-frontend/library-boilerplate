'use strict';

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    clean: {
      dist: ['dist']
    },

    copy: {
      dist: {
        files: [{
          expand: true,
          cwd: 'src',
          dest: 'dist',
          src: ['**']
        }]
      }
    },

    uglify: {
      dist: {
        options: {
          sourceMap: true
        },
        files: {
          'dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.js']
        }
      }
    }

  });

  grunt.registerTask('test', []);
  grunt.registerTask('build', ['clean', 'copy', 'uglify']);
  grunt.registerTask('default', ['test', 'build']);

};
