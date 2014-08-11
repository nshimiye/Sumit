Package.describe({
	summary: "A wrapper for pdf2htmlEX"
});

Package.on_use(function (api) {

	api.add_files(['pdf2htmlEXWrapper.js'], 'server');

	if (api.export)
		api.export('pdf2htmlEX');
});