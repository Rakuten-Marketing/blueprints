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
          './build/docs.css': './docs/assets/docs.scss'
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
          directory: './build/bootstrap'
        }
      }
    },

    copy: {
      bootstrap: {
        files: [
          {
            cwd: './build/bootstrap/docs/_includes/',
            expand: true,
            src: ['css/**', 'components/**'],
            dest: './docs/partials/bootstrap/'
          },

          {
            cwd: './build/bootstrap/',
            expand: true,
            src: ['fonts/**'],
            dest: './build/'
          }
        ]
      },

      dist: {
        files: [
          {
            cwd: './build',
            expand: true,
            src: ['blueprints.css', 'fonts/**'],
            dest: './dist/'
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
        convertor = require('scss-to-json'),
        directory = './src/core/variables/common/',
        files = grunt.file.expand({
          cwd: directory
        }, ['*.scss']);

    files.forEach(function(file) {
      data[file] = convertor(directory + file);
    });

    grunt.file.write(
      './build/docs/variables.json',
      JSON.stringify(data)
    );

    grunt.log.ok('Output: ./build/docs/variables.json'['green'].bold);
  });



  // Bootstrap doc partial parsing
  grunt.registerTask('docs:parse', 'parses Bootstrap partials', function() {
    grunt.log.ok('Parsing Bootstrap doc partials');

    var files = grunt.file.expand('./docs/partials/bootstrap/**/*.html');

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

  // Serve the docs
  grunt.registerTask('docs:serve', 'serves the docs', function() {
    var done = this.async();
    var port = process.env.PORT || 3000;

    require('./server.js')
      .listen(port)
      .on('close', done);

    grunt.log.ok('Serving docs on http://localhost:%s', [port]);
  });


  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', [
    'clean:build',
    'sass:json',
    'sass:imports',
    'gitclone:bootstrap',
    'copy:bootstrap'
  ]);
  grunt.registerTask('dist', ['build', 'copy:dist']);
  grunt.registerTask('docs:build', [
    'build',
    'docs:parse',
  ]);
  grunt.registerTask('docs', ['docs:build', 'docs:serve']);
};
