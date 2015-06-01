module.exports = function(grunt) {
	
	/*
	 *
	 *	Html
	 *
	 */
	grunt.registerTask("build-html", function () {
		console.log("Building html pages");
		
		var fs = require("fs");
		var templates = [];
		var file = require("file");
		file.walkSync("templates", function (dirPath, dirs, files) {

			var ammendedDirPath = dirPath.replace(/^templates\\/, "")
			if (files)
				for (var f = 0, ff = files.length; f < ff; f++) {
					var data = fs.readFileSync(dirPath + "\\" + files[f], {encoding: "UTF-8"});

					templates.push('<script id="' +
							   (ammendedDirPath + "\\" + files[f].replace(/\.html$/, "")).replace(/\\/g, ".")
							   + '" type="text/template">\n' + 
								fs.readFileSync(dirPath + "\\" + files[f], {encoding: "UTF-8"})
								+ '\n</script>');
				}
		});

		function getDirective (forFile) {

			var dir = /##\s*insert:\s*[\w\-]+\s*##/.exec(forFile);
			if (dir) {
				var output = function (replaceWith) {
					return forFile.replace(dir[0], replaceWith);
				}

				output.directive = dir[0]
					.replace(/^##\s*insert:\s*/, "")
					.replace(/\s*##$/, "");
				return output;
			}
		}

		templates = templates.join("\n\n");

		var layout = fs.readFileSync("_layout.html", {encoding: "UTF-8"});
		file.walkSync("pages", function (dirPath, dirs, files) {

			for (var i = 0, ii = files.length; i < ii; i++) {
				var partial = dirPath + "\\" + files[i];
				var page = layout;

				var dir;
				while (dir = getDirective(page)) {

					if (dir.directive === "page-content") {
						page = dir(fs.readFileSync(partial, {encoding: "UTF-8"}));
					} else if (dir.directive === "page-name") {
						page = dir("Wipeout");
					} else if (dir.directive === "templates") {
						page = dir(templates);
					} else if (dir.directive === "site-directory") {
						page = dir("v2-alpha");
					} else
						throw "Invalid directive: " + dir.directive;
				}

				fs.writeFileSync(partial.replace(/^pages\\/, ""), page);
			}
		});
	});
	
	/*
	 *
	 *	Javascript
	 *
	 */
	
    var debugFile = "scripts/<%= pkg.name %>.debug.js",
        releaseFile = "scripts/<%= pkg.name %>.js";
    
    var bower = grunt.file.readJSON('bower.json'),
        pkg = grunt.file.readJSON('package.json');
	
    var banner =  '// ' + pkg.name + ' v' + pkg.version + '\n// (c) ' + pkg.author + ' ' + new Date().getFullYear() + '\n// http://www.opensource.org/licenses/mit-license.php\n';
    
    var releaseOptions = {
        process: function (content, srcPath) {
            return banner + content;
        }
    };
	
    var dependencies = [
		"scripts/app/compiler.js",
		"scripts/app/Utils.js"
	];
	
    var src = [ 
        'scripts/begin.js',
        'scripts/app/**/*.js', 
        'scripts/end.js'
	];
    
    src.splice(1, 0, dependencies);
	
	var watch = src.slice();
	watch.push('pages/**/*.html', 'templates/**/*.html');
    
    // Project configuration.
    grunt.initConfig({
        pkg: pkg,
        
        concat: {
            options: {
                separator: '\n\n'
            },
            build: {
                src: src,
                dest: debugFile
            }
        },
        
        uglify: {
            build: {
                src: debugFile,
                dest: releaseFile
            }
        },
        
        watch: {
            files: watch,
            tasks: ['default']
        },
        
        copy: {
            releaseDebug: {
                options: releaseOptions,
                src: debugFile, 
                dest: 'release/<%= pkg.name %>-<%= pkg.version %>.debug.js'
            },
            release: {
                options: releaseOptions,
                src: releaseFile, 
                dest: 'release/<%= pkg.name %>-<%= pkg.version %>.js'
            }
        }
    });

    // plugins
    require('load-grunt-tasks')(grunt);

    grunt.registerTask('build', ['concat:build']);
    grunt.registerTask('rebuild', ['build', 'uglify']);
    grunt.registerTask('test', ['rebuild']);
    grunt.registerTask('release', ['test', 'copy:releaseDebug', 'copy:release']);
    
    grunt.registerTask('default', ['build', 'build-html']);
};