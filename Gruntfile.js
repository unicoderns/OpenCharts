/*global module, require*/

module.exports = function(grunt) {
    // URI paths for our tasks to use.
    grunt.uri = './';
    grunt.source = 'sources/';
    grunt.build = 'build/';
    grunt.uriSrc = grunt.uri + grunt.source;
    grunt.uriBuild = grunt.uri + grunt.build;
    grunt.uriTask = grunt.uri + 'grunt/';

    // Our task object where we'll store our configuration.
    var tasks = {};
    tasks.concat = {};

    // Lint Tasks
    tasks = require(grunt.uriTask + 'js-lint.js')(grunt, tasks);

    // Typescript Tasks
    tasks = require(grunt.uriTask + 'js-typescript.js')(grunt, tasks);

    // Minify Tasks
    tasks = require(grunt.uriTask + 'js-minify.js')(grunt, tasks);

    // Register The Tasks
    grunt.registerTask('typescript', ['ts']);
    grunt.registerTask('lint', ['tslint']);
    grunt.registerTask('minify', ['uglify']);
    grunt.registerTask('default', ['lint', 'typescript', 'minify']);

    // Initialize The Grunt Configuration
    grunt.initConfig(tasks);
};