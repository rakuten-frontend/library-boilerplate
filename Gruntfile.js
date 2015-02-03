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

    release: {
      options: {
        changelogText: '### <%= version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n',
        file: 'package.json',
        additionalFiles: ['bower.json'],
        indentation: '  ',
        folder: '.',
        tagName: 'v<%= version %>',
        commitMessage: 'Release v<%= version %>',
        tagMessage: 'Release v<%= version %>'
      },
      bump: {
        options: {
          bump: true,
          changelog: true,
          add: false,
          commit: false,
          tag: false,
          push: false,
          pushTags: false,
          npm: false,
          npmtag: false
        }
      },
      commit: {
        options: {
          bump: false,
          changelog: false,
          add: true,
          commit: true,
          tag: true,
          push: true,
          pushTags: true,
          npm: true,
          npmtag: false
        }
      }
    }

  });

  grunt.registerTask('test', ['clean', 'sass', 'csslint', 'jscs', 'jshint', 'connect:test', 'mocha']);
  grunt.registerTask('build', ['clean', 'sass', 'autoprefixer', 'concat', 'uglify', 'cssmin']);
  grunt.registerTask('default', ['test', 'autoprefixer', 'concat', 'uglify', 'cssmin']);

  grunt.registerTask('publish', 'Release package after test, build and bump.', function (type) {
    type = type || 'patch';
    grunt.task.run([
      'test',
      'release:bump:' + type,
      'build',
      'release:commit:' + type
    ]);
  });

};
