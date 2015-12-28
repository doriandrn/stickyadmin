module.exports = function(grunt) {
	'use strict';
  
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    paths: {
    	css: 'lib/css',
    	js: 'lib/js',
    	fonts: 'lib/fonts',
    	assets: 'lib/assets'
    },
    jshint: {   
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true,
          document: true
        }
      },
      files: [
      	'Gruntfile.js',
      	'!<%= paths.js %>/*.min.js', 
      	'<%= paths.js %>/sticky-*.js',
      	'!<%= paths.js %>/sticky-admin-deps.js',
      ],
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
        	'<%= paths.js %>/*.js'
        ],
        dest: '<%= paths.js %>/.min.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          '<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    // Minify all .css files
	cssmin: {
		minify: {
			expand: true,
			cwd: '<%= paths.css %>/',
			src: ['*.css'],
			dest: '<%= paths.css %>/',
			ext: '.min.css'
		}
	},
    
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'qunit']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Tasks
  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('compile', ['jshint', 'cssmin', 'concat', 'uglify'] );
};