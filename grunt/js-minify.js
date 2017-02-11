/*global module*/

module.exports = function(grunt, tasks) {
    // Load our node module required for this task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // The configuration for a specific task.
    tasks.uglify = {
        dist: {
            cwd: grunt.build, // The current working directory.
            dest: grunt.build, // The destination directory to store our minified files.
            expand: true,
            ext: '.min.js', // The extension to use for our minified file.
            flatten: true,
            src: [
                'opencharts.js' // Specific rule to minify our concat file.
            ]
        }
    };

    return tasks;
};