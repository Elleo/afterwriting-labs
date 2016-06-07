(function () {
	var config = require.config({
		baseUrl: 'js',
		paths: {
			templates: '../templates/compiled',
			templates_raw: '../templates',
			test_screenplays: '../templates/test_screenplays',
			jquery: 'libs/jquery-1.11.1.min',
			handlebars: 'libs/handlebars',
			logger: 'libs/logger',
			saveAs: 'libs/FileSaver',
			d3: 'libs/d3.min',
			modernizr: 'libs/modernizr',
			pdfkit: 'libs/pdfkit',
			impromptu: 'libs/jquery-impromptu.min',
			jstree: 'libs/jstree.min',
			cookie: 'libs/jquery.cookie',
			dropbox: 'libs/dropbox.min',
			p: '../node_modules/protoplast/dist/protoplast.min',
			acceptance: '../test/acceptance',
         text: '../node_modules/text/text',
            Blob: 'libs/Blob'
		},
		shim: {
			handlebars: {
				exports: 'Handlebars'
			},
			logger: {
				exports: 'Logger'
			},
			saveAs: {
				exports: 'saveAs'
			},
			modernizr: {
				exports: 'Modernizr'
			},
			dropbox: {
				exports: 'Dropbox'
			},
            Blob: {
                exports: 'Blob'
            }
		}
	});

	// __TEST and __COVERAGE global vars are generated by template task
	// when creating runner.html and coverage.html test runners
	if (typeof __TEST !== 'undefined') {
		config.baseUrl = '../js/';
		require.config(config);
	}
	else if (typeof __COVERAGE !== 'undefined') {
		config.baseUrl = '../coverage/js/';
		require.config(config);
	}
})();