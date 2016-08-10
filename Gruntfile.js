module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    clean: {
      build: {
        src: [
          'build/**'
        ]
      }
    },

    sass: {
      options: {
        sourceMap: true
      },
      build: {
        files: {
          './build/blueprints.css': './src/blueprints.scss',
          './build/docs/app.css': './docs/assets/app.scss'
        }
      }
    },

    sass_compile_imports: {
      compile: {
        options: {
          quiet: true,
          importPath: 'core/variables'
        },
        target: './src/_variables.scss',
        files: [{
          expand: true,
          cwd   : './src/core/variables/',
          src   : ['**/*.scss', '!**/common/**']
        }]
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
            cwd: './node_modules/bootstrap-partials/bootstrap/docs/_includes',
            expand: true,
            src: ['css/**.html', 'components/**.html'],
            dest: './build/docs/partials/'
          },

          {
            cwd: './src/core/fonts/',
            expand: true,
            src: ['**/*'],
            dest: './build/fonts'
          }
        ]
      }
    },

    watch: {
      sass: {
        files: ['src/**/*.scss', 'docs/assets/*.scss', '!src/core/variables/**'],
        tasks: ['sass']
      },
      variables: {}
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

    app: {
      src: ['./docs/app/**/*.js', '!./docs/app/bootstrap/**/*'],
      dest: './build/docs/app.compiled.js'
    }
  });

  // Creating a file with all the @imports, this task will read the content of variables/ folder
  // No need to add the new entries manually
  grunt.registerTask('sass:imports', 'adds all the required files as imports and compile', function() {
    var done = this.async();
    grunt.log.writeln('→ Reading all the variables/ files from project'['green'].bold);
    grunt.task.run('sass_compile_imports');

    done(true);
    grunt.log.ok('Output: ./src/_variables.scss'['green'].bold);
    grunt.task.run('sass');
  });

  // Parsing the common (globals) variables into a single JSON file
  // The other variables (such border color for specific component) are not important for now
  // Those will be retrieved via the documentation application (educational purposes: blueprints)
  // For documentation (and understanding its limitations): https://www.npmjs.com/package/grunt-scss-to-json
  grunt.registerTask('sass:json', 'parses scss variables to JSON', function() {
    grunt.log.writeln('→ Parsing styleguide variables into a JSON'['green'].bold);

    var data = {},
        converter = require('scss-to-json'),
        directory = './src/core/variables/common/',
        files = grunt.file.expand({
          cwd: directory
        }, ['*.scss']);

    files.forEach(function(file) {
      var node = file.replace('.scss', '');
      data[node] = converter(directory + file);
    });

    grunt.file.write(
      './build/docs/variables.json',
      JSON.stringify(data)
    );

    grunt.log.ok('Output: ./build/docs/variables.json'['green'].bold);
  });

  /* Initializes the server, hosting the application */
  grunt.registerTask('server:restore', 'initializes the express server', function() {
    var done = this.async(),
        port = process.env.PORT || 3000;

    require('./server.js')
      .listen(port)
      .on('close', done);

    grunt.log.writeln('→ Application running on http://localhost:%s'['green'].bold, [port]);
  });

  /* Build the current application and update distribution files (blueprints) */
  grunt.registerTask('build', [
    'clean:build',
    'sass:json',
    'sass:imports',
    'copy:build',
    'concat'
  ]);

  /* Initializes the server and first-run compiles the application */
  grunt.registerTask('default', ['server']);
  grunt.registerTask('server', [
    'build',
    'gitclone:bootstrap',
    'server:restore'
  ]);
};