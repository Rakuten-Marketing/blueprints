module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    clean: {
      src: [
        'build/*',
        '!build/bootstrap-partials'
      ]
    },

    portPickIndie: {
      options: {
        port: 3000,
        extra: 1
      }
    },

    sass: {
      options: {
        sourceMap: true
      },
      build: {
        files: {
          './build/blueprints.css': './src/blueprints.scss',
          './build/app.css': './docs/assets/app.scss'
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

        src: './build/blueprints.css'
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
          directory: './build/bootstrap-partials'
        }
      }
    },

    copy: {
      palette: {
        files: [
          {
            src: './src/core/palette.definition.json',
            dest: './build/docs/palettes.json'
          }
        ]
      },

      build: {
        files: [
          {
            cwd: './build/bootstrap-partials/bootstrap/docs/_includes',
            expand: true,
            src: ['css/**.html', 'components/**.html'],
            dest: './build/docs/partials/'
          },

          {
            cwd: './node_modules/bootstrap-sass/assets/fonts',
            expand: true,
            src: ['**/*'],
            dest: './build/fonts'
          },

          {
            cwd: './node_modules/etica-font-pack',
            expand: true,
            src: ['*.otf', '*.woff'],
            dest: './build/fonts/etica-font-pack'
          },

          {
            cwd: './node_modules/glyphicons_pro/fonts',
            expand: true,
            src: ['**/*'],
            dest: './build/fonts'
          }
        ]
      },

      fonts: {
        files: [
          {
            cwd: './build/fonts',
            expand: true,
            src: ['*.otf', '*.woff'],
            dest: './dist/fonts'
          },
          {
            cwd: './build/fonts/etica-font-pack',
            expand: true,
            src: ['*.otf', '*.woff'],
            dest: './dist/fonts/etica-font-pack'
          }
        ]
      }
    },

    watch: {
      sass: {
        files: ['src/**/*.scss', 'docs/assets/*.scss', '!src/core/_variables/**'],
        tasks: ['sass:build']
      },

      palette: {
        files: ['src/core/palette.definition.json'],
        tasks: ['copy:palette']
      }
    },

    uglify: {
      options : {
        sourceMap : true,
        sourceMapIncludeSources : true,
        sourceMapIn : '<%= concat.blueprints.dest %>.map'
      },
      blueprints: {
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
      // TODO: Lines #132 and #133 should go out soon.
      src: [
        './node_modules/jquery/dist/jquery.js',
        './node_modules/bootstrap-sass/assets/javascripts/bootstrap.js',
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
    grunt.log.ok('Parsing Bootstrap doc partials');

    var files = grunt.file.expand('./build/bootstrap-partials/docs/_includes/**/*.html');

    var highlight = function(contents) {
      return contents
        .replace(/\{\%\shighlight\s(html|scss)\s\%\}/g, '<div hljs>')
        .replace(/\{\%\sendhighlight\s\%\}/g, '</div>')
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
  grunt.registerTask('server:restore', 'initializes the express server', function() {
    var done = this.async(),
        port = process.env.PORT || grunt.config.get('port-pick-1');

    require('./server.js')
      .listen(port)
      .on('close', done);

    grunt.log.writeln('Application running on http://localhost:%s'['green'], [port]);
  });

  /* Build the current application */
  grunt.registerTask('build', [
    'clean',

    'sass:build',
    'postcss:build',
    'sass:json',
    'docs:parse',
    'copy:palette',
    'copy:build',
    'concat:vendor',
    'concat:blueprints',
    'concat:app'
  ]);

  /* Prepare dist */
  grunt.registerTask('dist', [
    'build',
    'postcss:dist',
    'concat:blueprints',
    'copy:fonts',
    'uglify'
  ]);

  /* Initializes the server and first-run compiles the application */
  grunt.registerTask('default', ['build']);
  grunt.registerTask('server', function() {
    // Clone partials if they don't exist
    if (!grunt.file.isDir('./build/bootstrap-partials')) {
      grunt.log.writeln('No bootstrap partials detected. They will need to be cloned.');
      grunt.task.run('gitclone:bootstrap');
    }

    grunt.task.run('build');
    grunt.task.run('portPickIndie');
    grunt.task.run('server:restore');
  });
};
