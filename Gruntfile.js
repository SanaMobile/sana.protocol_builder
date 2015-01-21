module.exports = function(grunt) {

    // Project configuration
    grunt.initConfig({
        less: {
            debug: {
                options: {
                    paths: ['sana_builder/static/less/bootstrap-v3.3.0'],
                    compress: true
                },
                files: {
                    'sana_builder/static/less/bootstrap.css': 'sana_builder/static/less/bootstrap-v3.3.0/bootstrap.less'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('default', ['less']);

};
