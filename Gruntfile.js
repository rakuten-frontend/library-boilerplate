/* jshint node:true */
'use strict';

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    banner: '/*! <%= pkg.name %> v<%= pkg.version %>' +
      ' - (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>' +
      ' - <%= pkg.license.type %>' +
      ' */\n\n',

    clean: {
      dist: 'dist'
    },

    sass: {
      options: {
        style: 'expanded',
        loadPath: 'bower_components',
        sourcemap: 'auto'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.css': 'sass/<%= pkg.name %>.scss'
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: [
          '> 1%',
          'last 2 versions',
          'Firefox ESR',
          'Opera 12.1'
        ],
        map: {
          inline: false
        }
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.css': 'dist/<%= pkg.name %>.css'
        }
      }
    },

    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      dist: {
        src: 'dist/<%= pkg.name %>.css'
      }
    },

    jscs: {
      options: {
        config: '.jscsrc'
      },
      grunt: {
        src: 'Gruntfile.js'
      },
      src: {
        src: 'js/**/*.js'
      },
      test: {
        src: 'test/spec/*.js'
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      grunt: {
        src: 'Gruntfile.js'
      },
      src: {
        src: 'js/**/*.js'
      },
      test: {
        src: 'test/spec/*.js'
      }
    },

    mocha: {
      options: {
        reporter: 'Spec',
        run: true
      },
      test: {
        options: {
          urls: ['http://localhost:<%= connect.test.options.port %>/test/']
        }
      }
    },

    connect: {
      test: {
        options: {
          port: 9001,
          open: false,
          base: '.'
        }
      }
    },

    concat: {
      options: {
        banner: '<%= banner %>'
      },
      css: {
        src: ['dist/<%= pkg.name %>.css'],
        dest: 'dist/<%= pkg.name %>.css'
      },
      js: {
        src: ['js/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },

    cssmin: {
      dist: {
        options: {
          keepSpecialComments: '*'
        },
        files: {
          'dist/<%= pkg.name %>.min.css': 'dist/<%= pkg.name %>.css'
        }
      }
    },

    uglify: {
      dist: {
        options: {
          sourceMap: true,
          preserveComments: 'some'
        },
        files: {
          'dist/<%= pkg.name %>.min.js': 'dist/<%= pkg.name %>.js'
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

  grunt.registerTask('test', ['clean', 'sass', 'csslint', 'jscs', 'jshint', 'connect:test', 'mocha']);
  grunt.registerTask('build', ['clean', 'sass', 'autoprefixer', 'concat', 'uglify', 'cssmin']);
  grunt.registerTask('default', ['test', 'autoprefixer', 'concat', 'uglify', 'cssmin']);

  grunt.registerTask('release', 'Test, build and bump package.', function (type) {
    grunt.task.run([
      'test',
      'bump-only:' + (type || 'patch'),
      'build',
      'bump-commit'
    ]);
  });

};
