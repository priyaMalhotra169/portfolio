

module.exports = function(grunt) {
grunt.initConfig({

	 postcss: {
		    options: {
		      /*map: true, // inline sourcemaps*/

		      // or
		      map: {
		          inline: false, // save all sourcemaps as separate files...
		          annotation: 'css/maps/' // ...to the specified directory
		      },
		      processors: [
		        require('autoprefixer')({browsers: 'last 3 versions'}) // add vendor prefixes
		      ]
		    },
		    dist: {
		      files: [{
			          expand: true,
				      cwd: 'raw-css',
				      src: ['*.css','!*.min.css'],
				      dest: 'css',
				      ext: '.css'
			      }]
		    },
		    priya:{
		    	files: [{
			        expand: true,
				      cwd: 'raw-css',
				      src: ['*.css','!*.min.css'],
				      dest: 'css',
				      ext: '.css'
			      }]
		    }
	  },


	px_to_rem: {

		options: {
	        base: 16,
	        fallback: true,
	        fallback_existing_rem: true,
	        ignore: [],
	        map: false
	      },

	    dist: {  
	      files: [{
	          expand: true,
		      cwd: 'raw-css',
		      src: ['*.css','!*.min.css'],
		      dest: 'css',
		      ext: '.css'
	      }]
	    },
	    priya:{
	    	files: [{
	        expand: true,
		      cwd: 'raw-css',
		      src: ['*.css','!*.min.css'],
		      dest: 'css',
		      ext: '.css'
	      }]
	    }

	 },

	
	cssmin: {
	  target: {
	    files: [{
	      expand: true,
	      cwd: 'raw-css',
	      src: ['*.css','!*.min.css'],
	      dest: 'css',
	      ext: '.css'
	    }]
	  }
	},

	watch:{
	  css: {
	    files: ['raw-css/*.css'],
	    tasks: ['px_to_rem:dist']
	  }  
	}


});


	// Load grunt plugins.

	// grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-postcss');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	// grunt.loadNpmTasks('grunt-contrib-jade');
	// grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-px-to-rem');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['postcss:priya']);


};

