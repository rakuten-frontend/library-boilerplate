/* jshint node:true */
'use strict';

module.exports = function (grunt) {

  var pkg = grunt.file.readJSON('package.json');
  var lastRelease = 'v' + pkg.version;

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    pkg: pkg,

    banner: '/*! <%= pkg.name %> v<%= pkg.version %>' +
      ' - (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>' +
      ' - <%= pkg.license.type %>' +
      ' */\n\n',

    clean: {
      dist: 'dist',
      tmp: 'tmp',
      docs: ['docs/styleguide', 'docs/api']
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
      },
      test: {
        files: {
          'tmp/<%= pkg.name %>.css': 'sass/<%= pkg.name %>.scss'
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
      test: {
        src: 'tmp/<%= pkg.name %>.css'
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

    kss: {
      docs: {
        options: {
          css: 'dist/<%= pkg.name %>.css'
        },
        files: {
          'docs/styleguide': 'sass'
        }
      }
    },

    jsdoc: {
      docs: {
        options: {
          destination: 'docs/api'
        },
        src: 'js/**/*.js'
      }
    },

    buildcontrol: {
      docs: {
        options: {
          dir: 'docs',
          branch: 'gh-pages',
          commit: true,
          push: true,
          message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
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
    },

    changelog: {
      options: {
        dest: 'CHANGELOG',
        insertType: 'prepend',
        logArguments: [
          '--pretty=format:%s',
          '--no-merges'
        ],
        template: 'v<%= pkg.version %>:\n  date: <%= grunt.template.today("yyyy-mm-dd") %>\n{{> features}}',
        featureRegex: /^(.*)$/gim,
        partials: {
          features: '{{#if features}}  changes:\n{{#each features}}{{> feature}}{{/each}}{{else}}{{> empty}}{{/if}}',
          feature: '    - {{this}}\n',
          empty: '    - (none)\n'
        }
      },
      initial: {
        options: {
          partials: {
            features: '  changes:\n    - Initial release',
          }
        }
      },
      update: {
        options: {
          after: lastRelease
        }
      }
    },

    'npm-publish': {
      options: {
        abortIfDirty: true
      }
    }

  });

  grunt.registerTask('test', ['clean:tmp', 'sass:test', 'csslint', 'jscs', 'jshint', 'connect:test', 'mocha']);
  grunt.registerTask('build', ['clean:dist', 'sass:dist', 'autoprefixer', 'concat', 'uglify', 'cssmin']);
  grunt.registerTask('docs', ['clean:docs', 'kss', 'jsdoc']);
  grunt.registerTask('default', ['test', 'build', 'docs']);

  grunt.registerTask('release', 'Release package after test, build and bump.', function (type) {
    grunt.task.run([
      'test',
      'bump-only:' + (type || 'patch'),
      'build',
      'changelog:' + (lastRelease === 'v0.0.0' ? 'initial' : 'update'),
      'docs',
      'bump-commit',
      'buildcontrol',
      'npm-publish'
    ]);
  });

};
