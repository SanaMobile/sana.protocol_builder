module.exports = function(grunt) {

    // Project configuration
    grunt.initConfig({
        less: {
            debug: {
                options: {
                    paths: ['src-backend/static/less/bootstrap-v3.3.0'],
                    compress: true
                },
                files: {
                    'src-backend/static/less/bootstrap.css': 'src-backend/static/less/bootstrap-v3.3.0/bootstrap.less'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('default', ['less']);

};
