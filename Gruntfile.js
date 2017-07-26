module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    versionControlHeader: '/*!\n' +
                          ' * Blueprints v<%= pkg.version %>\n' +
                          ' * Latest update: <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                          ' */\n',
    clean: {
      build: {
        src: [
          'build/*',
          '!build/bootstrap-partials'
        ]
      },
      dist: {
        src: ['dist']
      }
    },

    portPickIndie: {
      options: {
        port: 3000,
        extra: 1
      }
    },

    sass: {
      build: {
        options: {
          sourceMap: true
        },

        files: {
          './build/blueprints.css': './src/blueprints.scss',
          './build/app.css': './docs/assets/app.scss'
        }
      }
    },

    usebanner: {
      versioning: {
        options: {
          position: 'top',
          banner: '<%= versionControlHeader %>',
          linebreak: true
        },
        files: {
          src: ['./dist/blueprints.min.css', './dist/blueprints.min.js']
        }
      }
    },

    postcss: {
      build: {
        map: {
          inline: false,
          prev: './build/blueprints.css.map',
          annotation: './build/'
        },

        processors: [
          require('autoprefixer')({ browsers: 'last 2 versions'})
        ],

        files: {
          './build/blueprints.css': './build/blueprints.css',
          './build/app.css': './build/app.css'
        }
      },

      dist: {
        options: {
          map: {
            inline: false,
            prev: './build/blueprints.css.map',
            annotation: './dist/'
          },

          processors: [
            require('cssnano')()
          ]
        },

        src: './build/blueprints.css',
        dest: './dist/blueprints.min.css'
      }
    },

    gitclone: {
      bootstrap: {
        options: {
          repository: 'https://github.com/twbs/bootstrap.git',
          branch: 'v3.3.6',
          directory: './node_modules/bootstrap-partials'
        }
      }
    },

    copy: {
      build: {
        files: [
          {
            cwd: './node_modules/bootstrap-partials/docs/_includes',
            expand: true,
            src: ['css/**.html', 'components/**.html'],
            dest: './build/docs/bootstrap-partials'
          },
          {
            src: './src/core/palette.definition.json',
            dest: './build/docs/palettes.json'
          },
          {
            cwd: './node_modules/etica-font-pack',
            expand: true,
            src: ['**/*'],
            dest: './build/fonts/lft-etica'
          },
          {
            cwd: './node_modules/glyphicons_pro/fonts',
            expand: true,
            src: ['**/*'],
            dest: './build/fonts/glyphicons-pro'
          }
        ]
      },

      dist: {
        files: [
          {
            cwd: './build/fonts',
            expand: true,
            src: ['**/*'],
            dest: './dist/fonts'
          }
        ]
      }
    },

    watch: {
      sass: {
        files: ['src/**/*.scss', 'docs/assets/*.scss', '!src/core/_variables/**'],
        tasks: ['sass:build']
      }
    },

    uglify: {
      options : {
        sourceMap : true,
        sourceMapIncludeSources : true,
        sourceMapIn : '<%= concat.blueprints.dest %>.map'
      },

      dist: {
        files : {
          './dist/blueprints.min.js': ['<%= concat.blueprints.dest %>']
        }
      }
    }
  });

  grunt.config('concat', {
    options: {
      sourceMap: true
    },

    vendor: {
      src: [
        './node_modules/angular/angular.js',
        './node_modules/angular-ui-router/release/angular-ui-router.js'
      ],
      dest: './build/docs/vendor.bundle.js'
    },

    blueprints: {
      src: [
        './node_modules/webcomponentsjs/micro.js',
        './src/core/webcomponents/**/*.js'
      ],
      dest: './build/blueprints.js'
    },

    app: {
      src: ['./docs/app/**/*.js', '!./docs/app/bootstrap/**/*'],
      dest: './build/docs/app.compiled.js'
    }
  });

  // Bootstrap doc partial parsing
  grunt.registerTask('docs:parse', 'parses Bootstrap partials', function() {
    var files = grunt.file.expand('./build/docs/bootstrap-partials/**/*.html');
    var highlight = function(contents) {
      return contents
        .replace(/\{\%\shighlight\s(html|scss)\s\%\}/g, '<div hljs>')
        .replace(/\{\%\sendhighlight\s\%\}/g, '</div>');
    };

    files.forEach(function(path) {
      var contents = grunt.file.read(path);
      grunt.file.write(path, highlight(contents));
    });
  });

  // Parsing the common (globals) _variables into a single JSON file
  // The other _variables (such border color for specific component) are not important for now
  // Those will be retrieved via the documentation application (educational purposes: blueprints)
  // For documentation (and understanding its limitations): https://www.npmjs.com/package/grunt-scss-to-json
  grunt.registerTask('sass:json', 'parses scss _variables to JSON', function() {
    grunt.log.writeln('Parsing styleguide\'s variables into a JSON file'['green']);

    var converter = require('scss-to-json'),
        directory = './src/core/_variables/common/',
        files = grunt.file.expand({ cwd: directory }, ['*.scss']),
        data = files.reduce(function(acc, file) {
          var node = file.replace('.scss', '');
          acc[node] = converter(directory + file);

          return acc;
        }, {});

    grunt.file.write('./build/docs/_variables.json', JSON.stringify(data));
    grunt.log.ok('Output: ./build/docs/_variables.json'['green']);
  });

   /* Initializes the server, hosting the application */
  grunt.registerTask('serverUp', 'initializes the express server', function() {
    grunt.task.run('portPickIndie')
    .then(function() {
      var done = this.async();
      var port = process.env.PORT || grunt.config.get('port-pick-1');
      
      require('./server.js').listen(port).on('close', done);
      grunt.log.writeln('Application running on http://localhost:%s'['green'], [port]);
    });
  });

  /* Build the current application */
  grunt.registerTask('build', [
    'clean:build',
    'sass:build',
    'sass:json',
    'copy:build',
    'postcss:build',
    'docs:parse',
    'concat:vendor',
    'concat:blueprints',
    'concat:app'
  ]);

  /* Prepare dist */
  /* We add a couple of steps here (these ones are not required in development process) */
  /* We move|copy the used fonts and we JS files */
  grunt.registerTask('dist', [
    'build',
    'clean:dist',
    'copy:dist',
    'postcss:dist',
    'uglify',
    'usebanner'
  ]);


  /* Initializes the server and first-run compiles the application */
  grunt.registerTask('default', ['build']);
  grunt.registerTask('start', function() {
    
    // We are doing this here because the npm package doesn't include the folder we want
    // In the following releases we won't need these files anymore
    if (!grunt.file.isDir('./node_modules/bootstrap-partials')) {
      grunt.log.writeln('No bootstrap partials detected. They will need to be cloned.');
      grunt.task.run('gitclone:bootstrap');
    }

    grunt.task.run('build');
    grunt.task.run('serverUp');
  });
};