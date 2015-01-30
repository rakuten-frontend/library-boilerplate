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
      options: {
        jshintrc: '.jshintrc'
      },
      src: {
        src: ['Gruntfile.js', 'src/**/*.js']
      }
    },

    mocha: {
      options: {
        reporter: 'Spec',
        run: true
      },
      test: {
        options: {
          urls: ['http://localhost:<%= connect.test.options.port %>/']
        }
      }
    },

    connect: {
      test: {
        options: {
          port: 9001,
          open: false,
          middleware: function (connect) {
            return [
              connect.static('test'),
              connect().use('/bower_components', connect.static('bower_components')),
              connect.static('src')
            ];
          }
        }
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
    },

    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        updateConfigs: ['pkg'],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['-a'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Release v%VERSION%',
        push: true,
        pushTo: 'origin',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d',
        globalReplace: false
      }
    }

  });

  grunt.registerTask('test', ['jscs', 'jshint', 'connect:test', 'mocha']);
  grunt.registerTask('build', ['clean', 'concat', 'uglify']);
  grunt.registerTask('default', ['test', 'build']);

  grunt.registerTask('release', 'Test, build and bump package.', function (type) {
    grunt.task.run([
      'test',
      'bump-only:' + (type || 'patch'),
      'build',
      'bump-commit'
    ]);
  });

};
