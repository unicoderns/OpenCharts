/*global module*/

module.exports = function(grunt, tasks) {  
    // Load our node module required for this task.
    grunt.loadNpmTasks('grunt-tslint');

    // The configuration for a specific task.
    tasks.tslint = {
        // The files that we want to check.
        src: [
            grunt.uriSrc + '/**/*.ts',
            '!' + grunt.uriSrc + '/references/**/*.ts' // Exclude reference files
        ] 
    };

    return tasks;
};