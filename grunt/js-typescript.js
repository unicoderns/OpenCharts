/*global module*/

module.exports = function(grunt, tasks) {
    // Load our node module required for this task.
    grunt.loadNpmTasks('grunt-ts');

    // The configuration for a specific task.
    // In this case we have more than a single concat task. We need to append our task to our `tasks.concat` object that
    // way we're not overriding any of other previous tasks.
    tasks.ts = {
        options: {
            module: 'amd',
            target: 'es5', //or es3 
            sourceMap: true,
            declaration: true,
            fast: 'never',
            out: grunt.build + "opencharts.js"
        },
        main: {
            src: [
                grunt.uriSrc + '**/*.ts',
                '!' + grunt.uriSrc + '/references/**/*.ts' // Exclude reference files
            ],
            out: 'build/opencharts.js'
        }
    };

    return tasks;
};