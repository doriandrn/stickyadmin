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
    filesAdmin: [
    	'<%= paths.js %>/toastr.js',
        '<%= paths.js %>/sticky-admin.js',
        '<%= paths.js %>/anysearch.js',
        '<%= paths.js %>/jquery-labelauty.js',
        '<%= paths.js %>/selectordie.js',
        '<%= paths.js %>/jquery.mCustomScrollbar.js',
        '<%= paths.js %>/jquery.qtip.js',
        '<%= paths.js %>/moment-with-locales.js',
        '<%= paths.js %>/odometer.js',
        '<%= paths.js %>/slick.js',
    ],
    filesLogin: [
    	'<%= paths.js %>/toastr.js', 
    	'<%= paths.js %>/backstretch.js', 
        '<%= paths.js %>/sticky-login.js',
    ],
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
      	'<%= paths.js %>/sticky-*.js',
      	'!<%= paths.js %>/*.min.js', 
      	'!<%= paths.js %>/sticky-*.min.js', 
      ],
    },
    concat: {
      options: {
        separator: ';'
      },
      admin: {
        src: "<%= filesAdmin %>",
        dest: '<%= paths.js %>/sticky-admin.min.js'
      },
      login: {
        src: "<%= filesLogin %>",
      	dest: '<%= paths.js %>/sticky-login.min.js'
      },
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          '<%= paths.js %>/sticky-admin.min.js': ['<%= concat.admin.dest %>'],
          '<%= paths.js %>/sticky-login.min.js': ['<%= concat.login.dest %>'],
          '<%= paths.js %>/sticky-tracker.min.js': ['<%= paths.js %>/sticky-tracker.js']
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
  grunt.registerTask('testjs', ['jshint']);
  grunt.registerTask('compile', ['jshint', 'cssmin', 'concat', 'uglify'] );
  grunt.registerTask('makejs', ['concat', 'uglify']);
};