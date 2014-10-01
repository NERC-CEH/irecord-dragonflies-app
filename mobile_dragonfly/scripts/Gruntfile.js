module.exports = function(grunt) {

    var  controller_banner = "/*!\n" +
        " * Mobile App page controllers. \n" +
        " * Version: <%= pkg.version %>\n" +
        " *\n" +
        " * <%= pkg.homepage %>\n" +
        " *\n" +
        " * Author <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>\n" +
        " * Released under the <%= _.pluck(pkg.licenses, 'type').join(', ') %> license.\n" +
        " */\n";

    var  app_banner = "/*!\n" +
        " * App wide configuration and controls. \n" +
        " * Version: <%= pkg.version %>\n" +
        " *\n" +
        " * <%= pkg.homepage %>\n" +
        " *\n" +
        " * Author <%= grunt.template.today('yyyy') %> <%= pkg.author.name %>\n" +
        " * Released under the <%= _.pluck(pkg.licenses, 'type').join(', ') %> license.\n" +
        " */\n";


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        karma: {
            unit: {
                configFile: 'test/karma.conf.js'
            }
        },
        concat: {
            options: {
                // define a string to put between each file in the concatenated output
                separator: '\n\n'
            },
            dist: {
                options: {
                    banner: controller_banner
                },
                // the files to concatenate
                src: ['src/controllers/*.js'],
                // the location of the resulting JS file
                dest: 'dist/controllers.js'
            },
            dist2: {
                options: {
                    banner: app_banner
                },
                // the files to concatenate
                src: [
                    'src/conf.js',
                    'src/app.js'
                ],
                // the location of the resulting JS file
                dest: 'dist/app.js'
            }
        },
        uglify: {
            dist: {
                options: {
                    // the banner is inserted at the top of the output
                    banner: controller_banner
                },
                files: {
                    'dist/controllers.min.js': ['<%= concat.dist.dest %>']
                }
            },
            dist2: {
                options: {
                    // the banner is inserted at the top of the output
                    banner: app_banner
                },
                files: {
                    'dist/app.min.js': ['<%= concat.dist2.dest %>']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-karma');

    // the default task can be run just by typing "grunt" on the command line
    grunt.registerTask('default', ['concat', 'uglify']);

};
