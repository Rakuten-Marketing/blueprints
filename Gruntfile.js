var scssToJson = require('scss-to-json')
  , path = require('path');

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
        files: ['src/**/*.scss', 'docs/assets/*.scss'],
        tasks: ['sass', 'sass:json']
      }
    }
  });

  // Bootstrap doc partial parsing
  grunt.registerTask('docs:parse', 'parses Bootstrap partials', function() {
    grunt.log.ok('Parsing Bootstrap doc partials');

    var files = grunt.file.expand('./docs/partials/bootstrap/**/*.html');

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

  // Serve the docs
  grunt.registerTask('docs:serve', 'serves the docs', function() {
    var done = this.async();
    var port = process.env.PORT || 3000;

    require('./server.js')
      .listen(port)
      .on('close', done);

    grunt.log.ok('Serving docs on http://localhost:%s', [port]);
  });

  // Parse SCSS variables
  grunt.registerTask('sass:json', 'parses scss variables to JSON', function() {
    grunt.log.ok('Parsing SCSS variables to JSON');

    var done = this.async();
    var variablesPath = './src/core/_variables/';
    var variables = grunt.file.expand({
      cwd: variablesPath
    }, [
      '*.scss',
      '!styles.scss',
    ]);

    var template = ''
      + '(function() {\n'
      + ' \'use strict\';\n'
      + '  window.Blueprints = window.Blueprints || {};\n'
      + '  window.Blueprints.variables = <%= variables %>;\n'
      + '})();'

    var data = { variables: null };

    var mappedVariables = variables.reduce(function(acc, file) {
      var contents = scssToJson(variablesPath + file);
      var pairs = Object.keys(contents).map(function(key) {
        return {
          variable: key,
          value: contents[key]
        };
      });

      acc[path.basename(file, '.scss')] = pairs;

      return acc;
    }, {});

    data.variables = JSON.stringify(mappedVariables);

    grunt.file.write(
      './build/variables.js',
      grunt.template.process(template, { data: data })
    );
  });

  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', [
    'clean:build',
    'sass',
    'gitclone:bootstrap',
    'copy:bootstrap'
  ]);
  grunt.registerTask('dist', ['build', 'copy:dist'])
  grunt.registerTask('docs:build', [
    'build',
    'docs:parse',
  ]);
  grunt.registerTask('docs', ['docs:build', 'docs:serve']);
};
