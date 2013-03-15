/*
 * grunt-scriptlinker
 * https://github.com/scott-laursen/grunt-scriptlinker
 *
 * Copyright (c) 2013 scott-laursen
 * Licensed under the MIT license.
 */

'use strict';

var util = require('util');

module.exports = function(grunt) {

	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks

	grunt.registerMultiTask('scriptlinker', 'Your task description goes here.', function() {
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			startTag: '<!--SCRIPTS-->',
			endTag: '<!--SCRIPTS END-->',
			fileTmpl: '<script src="%s"></script>',
			appRoot: ''
		});


		// Iterate over all specified file groups.
		this.files.forEach(function (f) {
			var scripts = '',
				page = '',
				newPage = '',
				start = -1,
				end = -1;

			// Create string tags
			scripts = f.src.filter(function (filepath) {
					// Warn on and remove invalid source files (if nonull was set).
					if (!grunt.file.exists(filepath)) {
						grunt.log.warn('Source file "' + filepath + '" not found.');
						return false;
					} else { return true; }
				}).map(function (filepath) {
					return util.format(options.fileTmpl, filepath.replace(options.appRoot, ''));
				}).join('');


			if (!grunt.file.exists(f.dest)) {
				grunt.log.warn('Destination file "' + f.dest + '" not found.');
			} else {
				page = grunt.file.read(f.dest);

				start = page.indexOf(options.startTag);
				end = page.indexOf(options.endTag);

				if (start === -1 || end === -1 || start >= end) {
					grunt.log.warn('Destination file\'s "' + f.dest + '" start and/or end tag is not correctly setup.');
				} else {
					newPage = page.substr(0, start + options.startTag.length) + scripts + page.substr(end);
					// Insert the scripts
					grunt.file.write(f.dest, newPage);
					grunt.log.writeln('File "' + f.dest + '" updated.');
				}
			}
		});
	});

};
