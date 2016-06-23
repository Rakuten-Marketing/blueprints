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
          './build/blueprints.css': './src/blueprints.scss'
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
        files: ['src/**/*.scss'],
        tasks: ['sass']
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
    grunt.log.ok('Serving docs');

    var done = this.async();

    require('./server.js')
      .listen(process.env.PORT || 3000)
      .on('close', done);
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
