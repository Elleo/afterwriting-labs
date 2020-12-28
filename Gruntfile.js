module.exports = function(grunt) {

    var test_specs = grunt.file.expand({
        filter: "isFile",
        cwd: "test/unit"
    }, ["**/*.js"]);
    var test_specs_list = test_specs.map(function(name) {
        return "'../test/unit/" + name.substr(0, name.length - 3) + "'";
    }).join(', ');

    var integration_test_specs = grunt.file.expand({
        filter: "isFile",
        cwd: "test/integration"
    }, ["**/*.js"]);
    var integration_specs_list = integration_test_specs.map(function(name) {
        return "'../test/integration/" + name.substr(0, name.length - 3) + "'";
    }).join(', ');

    var acceptance_specs = grunt.file.expand({
        filter: "isFile",
        cwd: "test/acceptance/spec"
    }, ["**/*.js"]);
    var acceptance_specs_list = acceptance_specs.map(function(name) {
        return "'../acceptance/spec/" + name.substr(0, name.length - 3) + "'";
    }).join(', ');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        handlebars: {
            compile: {
                options: {
                    amd: true
                },
                files: {
                    'samples/compiled.js': ['**/*.fountain']
                }
            },
            test: {
                options: {
                    amd: true
                },
                files: {
                    'test/data/test_screenplays.js': ['test/**/*.fdx', 'test/**/*.fountain']
                }
            }
        },
        requirejs: {
            compile: {
                options: {
                    optimize: "none",
                    baseUrl: "js",
                    mainConfigFile: 'js/afterwriting-bootstrap.js',
                    include: ["libs/require", "afterwriting-bootstrap"],
                    out: "bundle/js/afterwriting.js",
                    onBuildWrite: function(moduleName, path, contents) {
                        if (moduleName === 'logger') {
                            contents = contents.replace(/\/\/invoke[\s\S]*\/\/\/invoke/g, '');
                        } else if (moduleName === 'libs/codemirror/lib/codemirror') {
                            contents = '';
                        }
                        return contents;
                    }
                }
            }
        },
        concat: {
            bootstrap: {
                options: {
                    separator: ''
                },
                src: ['js/main.js', 'js/bootstrap/index.js'],
                dest: 'js/afterwriting-bootstrap.js'

            },
            codemirror: {
                options: {
                    separator: ';'
                },
                src: ['bundle/js/afterwriting.js', 'js/libs/codemirror/lib/codemirror.js'],
                dest: 'bundle/js/afterwriting.js'
            }
        },
        clean: {
            prebuild: {
                src: ['bundle/*', 'afterwriting/*'],
                force: true
            },
            bootstrap: ['js/afterwriting-bootstrap.js', 'afterwriting.html']
        },
        cssmin: {
            build: {
                files: {
                    'bundle/css/afterwriting.css': ['css/reset.css', 'css/*.css', 'js/libs/**/show-hint.css']
                }
            }
        },
        copy: {
            gfx: {
                expand: true,
                src: ['fonts/**'],
                dest: 'bundle'
            },
            html: {
                expand: true,
                flatten: true,
                src: ['html/index.html', 'html/afterwriting.html'],
                dest: ''
            },
            pdfjs: {
                expand: true,
                flatten: true,
                src: ['js/libs/pdfjs/build/pdf.min.js', 'js/libs/pdfjs/build/pdf.min.worker.js'],
                dest: 'bundle/js/pdfjs'
            },
            fonts: {
                expand: true,
                flatten: true,
                src: ['js/fonts/*.js'],
                dest: 'bundle/js/fonts'
            }
        },
        gitcheckout: {
            pages: {
                options: {
                    branch: 'gh-pages'
                }
            },
            master: {
                options: {
                    branch: 'master',
                    tags: true
                }
            },
            develop: {
                options: {
                    branch: 'develop'
                }
            }
        },
        gitmerge: {
            master: {
                options: {
                    branch: 'master'
                }
            }
        },
        gitpush: {
            pages: {
                options: {
                    branch: 'gh-pages'
                }
            },
            master: {
                options: {
                    branch: 'master'
                }
            },
            develop: {
                options: {
                    branch: 'develop'
                }
            }
        },
        gitadd: {
            all: {
                options: {
                    all: true
                }
            }
        },
        gitcommit: {
            version: {
                options: {
                    message: "v<%= pkg.version %>"
                }
            }
        },
        gittag: {
            version: {
                options: {
                    tag: "v<%= pkg.version %>"
                }
            }
        },
        compress: {
            build: {
                options: {
                    archive: 'afterwriting.zip'
                },
                files: [
                    {
                        src: 'bundle/**'
                    },
                    {
                        src: 'gfx/**'
                    },
                    {
                        src: 'afterwriting.html'
                    },
                    {
                        src: 'privacy.html'
                    },
                    {
                        src: 'terms.html'
                    }
                ]
            }
        },
        replace: {
            last_update: {
                src: ['html/*'],
                overwrite: true,
                replacements: [{
                    from: /last_update[=?0-9a-z\-_]*\"/g,
                    to: "last_update=<%= grunt.template.today('yyyy-mm-dd_HH-MM') %>\""
                }]
            },
            footer: {
                src: ['js/utils/common.js'],
                overwrite: true,
                replacements: [{
                    from: /footer: '[^']*'/g,
                    to: "footer: 'version: <%= pkg.version %> (<%= grunt.template.today('yyyy/mm/dd') %>)'"
                }]
            }
        },
        bumpup: 'package.json',

        template: {
            test: {
                options: {
                    data: {
                        mode: "__TEST",
                        specs: test_specs_list
                    }
                },
                files: {
                    'test/runner.html': ['test/template/runner.template']
                }
            },
            integration: {
                options: {
                    data: {
                        mode: "__TEST",
                        specs: integration_specs_list
                    }
                },
                files: {
                    'test/integration-runner.html': ['test/template/integration.test.template']
                }
            },
            acceptance: {
                options: {
                    data: {
                        specs: acceptance_specs_list
                    }
                },
                files: {
                    'test/acceptance/tests.js': ['test/template/acceptance.tests.template']
                }
            },
            coverage: {
                options: {
                    data: {
                        mode: "__COVERAGE",
                        specs: test_specs_list
                    }
                },
                files: {
                    'test/coverage.html': ['test/template/runner.template']
                }
            }
        },

        shell: {
            unit: {
                command: "node tools/test-runner.js http://localhost:8001/test/runner.html?reporter=json-stream"
            },
            "unit-debug": {
                command: "node tools/test-runner.js http://localhost:8001/test/runner.html?reporter=html true"
            },
            integration: {
                command: "node tools/test-runner.js http://localhost:8001/test/integration-runner.html?reporter=json-stream"
            },
            "integration-debug": {
                command: "node tools/test-runner.js http://localhost:8001/test/integration-runner.html?reporter=html true"
            },
            acceptance: {
                command: "node tools/test-runner.js http://localhost:8001/acceptance.html?reporter=json-stream"
            },
            "acceptance-debug": {
                command: "node tools/test-runner.js http://localhost:8001/acceptance.html?reporter=spec true"
            },
            coverage: {
                command: "node tools/test-runner.js http://localhost:8001/test/coverage.html?reporter=json-stream"
            },
            istanbul_instrument: {
                command: 'istanbul instrument --output coverage --no-impact js && istanbul instrument --output coverage/test/data --no-impact test/data'
            },
            istanbul_report: {
                command: 'istanbul report text'
            },
            jsdoc: {
                command: 'jsdoc -c jsdoc.conf.json -R README.md -P package.json -t node_modules/docdash -u docs/tutorials'
            },
            uglify: {
                command: 'uglifyjs --compress --mangle --output bundle/js/afterwriting.js -- bundle/js/afterwriting.js'
            }
        },

        express: {
            server: {
                options: {
                    script: 'server.js',
                    node_env: 'test'
                }
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-git');
    grunt.loadNpmTasks('grunt-bumpup');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-template');

    grunt.registerTask('utest', ['express:server', 'handlebars:test', 'template:test', 'shell:unit', 'express:server:stop']);
    grunt.registerTask('utest:debug', ['express:server', 'handlebars:test', 'template:test', 'shell:unit-debug']);

    grunt.registerTask('itest', ['express:server', 'handlebars:test', 'template:integration', 'shell:integration', 'express:server:stop']);
    grunt.registerTask('itest:debug', ['express:server', 'handlebars:test', 'template:integration', 'shell:integration-debug']);

    grunt.registerTask('atest', ['express:server', 'handlebars:test', 'template:acceptance', 'shell:acceptance', 'express:server:stop']);
    grunt.registerTask('atest:debug', ['express:server', 'handlebars:test', 'template:acceptance', 'shell:acceptance-debug']);

    grunt.registerTask('test', ['utest', 'itest', 'atest']);
    grunt.registerTask('coverage', ['express:server', 'template:coverage', 'shell:istanbul_instrument', 'shell:coverage', 'shell:istanbul_report', 'express:server:stop']);
    grunt.registerTask('doc', ['shell:jsdoc']);
    
    grunt.registerTask('build', ['clean:prebuild', 'handlebars:compile', 'replace', 'concat:bootstrap', 'requirejs', 'shell:uglify', 'concat:codemirror', 'cssmin', 'copy', 'compress', 'doc', 'clean:bootstrap']);

};