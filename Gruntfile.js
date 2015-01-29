/* jshint node:true */
'use strict';

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jscs: {
      options: {
        config: '.jscsrc'
      },
      src: {
        src: ['Gruntfile.js', 'src/**/*.js']
      }
    },

    jshint: {
      src: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: ['Gruntfile.js', 'src/**/*.js']
      }
    },

    clean: {
      dist: ['dist']
    },

    concat: {
      dist: {
        options: {
          banner: '/*! <%= pkg.name %> v<%= pkg.version %>' +
            ' - (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>' +
            ' - <%= pkg.license.type %>' +
            ' */\n'
        },
        src: ['src/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },

    uglify: {
      dist: {
        options: {
          sourceMap: true,
          preserveComments: 'some'
        },
        files: {
          'dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.js']
        }
      }
    }

  });

  grunt.registerTask('test', ['jscs', 'jshint']);
  grunt.registerTask('build', ['clean', 'concat', 'uglify']);
  grunt.registerTask('default', ['test', 'build']);

};
