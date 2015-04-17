module.exports = function(grunt) {

    // Project configuration
    grunt.initConfig({
        less: {
            debug: {
                options: {
                    paths: ['src/static/less/bootstrap-v3.3.0'],
                    compress: true
                },
                files: {
                    'src/static/less/bootstrap.css': 'src/static/less/bootstrap-v3.3.0/bootstrap.less'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('default', ['less']);

};
