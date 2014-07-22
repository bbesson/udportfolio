'use strict';

var ngrok = require('ngrok');

module.exports = function (grunt) {

    // configurable paths
    var yeomanConfig = {
        app: 'dev',
        dist: 'dist'
    };
    try {
        yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
    } catch (e) {}

    // Load grunt tasks
    require('load-grunt-tasks')(grunt);

    // Grunt configuration
    grunt.initConfig({
        yeoman: yeomanConfig,
        pagespeed: {
            options: {
                nokey: true,
                locale: 'en_US',
                threshold: 40
            },
            local: {
                options: {
                    strategy: 'desktop'
                }
            },
            mobile: {
                options: {
                    strategy: 'mobile'
                }
            }
        },

        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            css: '<%= yeoman.app %>/css/*.css',
            options: {
                dest: '<%= yeoman.dist %>'
            },
        },

        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    '<%= yeoman.dist %>/index.html': '<%= yeoman.app %>/index.html'
                }
            }
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        'img/{,*/}*.{gif,webp,png,jpg,jpeg}',
                        'js/*.js',
                        // 'css/*.css'
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp/img',
                    dest: '<%= yeoman.dist %>/images',
                    src: [
                        'generated/*'
                    ]
                }]
            },
            styles: {
                expand: true,
                cwd: '<%= yeoman.app %>/css',
                // dest: '<%= yeoman.dist %>/css',
                dest: '.tmp/css',
                src: '{,*/}*.css'
            }
        },

        cssmin: {
            // By default, your `index.html` <!-- Usemin Block --> will take care of
            // minification. This option is pre-configured if you do not wish to use
            // Usemin blocks.
            dist: {
                files: {
                    '<%= yeoman.dist %>/css/main.css': '.tmp/css/style.css'
                    // [
                    //     '.tmp/css/{,*/}*.css',
                    //     // '<%= yeoman.dist %>/styles/temp.css',
                    //     // '<%= yeoman.app %>/styles/{,*/}*.css'
                    // ]
                }
            }
        },

        usemin: {
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/css/{,*/}*.css'],
            // js: ['<%= yeoman.dist %>/js/{,*/}*.js'],
            options: {
                dirs: ['<%= yeoman.dist %>']
            }
        },

        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },

        uglify: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/js/perfmatters.js': [
                        '<%= yeoman.app %>/js/perfmatters.js'
                    ]
                }
            }
        }
    });

    // Register customer task for ngrok
    grunt.registerTask('psi-ngrok', 'Run pagespeed with ngrok', function () {
        var done = this.async();
        var port = 8000;

        ngrok.connect(port, function (err, url) {
            if (err !== null) {
                grunt.fail.fatal(err);
                return done();
            }
            grunt.config.set('pagespeed.options.url', url);
            grunt.task.run('pagespeed');
            done();
        });
    });

    // Task for minifying everything
    grunt.registerTask('build', [
        'clean:dist',
        'useminPrepare',
        'copy:styles',
        'htmlmin',
        'copy:dist',
        'cssmin',
        'uglify',
        'usemin'
    ]);

    // Register default tasks
    grunt.registerTask('default', ['psi-ngrok']);
};
