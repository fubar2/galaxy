/**
 * Grunt task to build static/style resources (css, sprites)
 * @param  {Object} grunt main grunt file
 * @return {Function} callback to build this task
 */
/* global module */
module.exports = function(grunt) {
    "use strict";

    var _ = grunt.util._,
        fmt = _.sprintf,
        styleDistPath = "../static/style/blue",
        imagesPath = "../static/images",
        stylePath = "./galaxy/style/scss",
        lessFiles = ["base", "autocomplete_tagging", "embed_item", "library", "trackster", "circster", "reports"];

    // Create sprite images and .less files
    grunt.config("sprite", {
        options: {
            algorithm: "binary-tree"
        },
        "history-buttons": {
            src: fmt("%s/history-buttons/*.png", imagesPath),
            dest: fmt("%s/sprite-history-buttons.png", styleDistPath),
            imgPath: fmt("sprite-history-buttons.png"),
            destCss: fmt("%s/sprite-history-buttons.scss", stylePath)
        },
        "history-states": {
            src: fmt("%s/history-states/*.png", imagesPath),
            dest: fmt("%s/sprite-history-states.png", styleDistPath),
            imgPath: fmt("sprite-history-states.png"),
            destCss: fmt("%s/sprite-history-states.scss", stylePath)
        },
        fugue: {
            src: fmt("%s/fugue/*.png", imagesPath),
            dest: fmt("%s/sprite-fugue.png", styleDistPath),
            imgPath: fmt("sprite-fugue.png"),
            destCss: fmt("%s/sprite-fugue.scss", stylePath)
        }
    });

    // Compile less files
    grunt.config("less", {
        options: {
            compress: true,
            paths: [stylePath],
            strictImports: true
        },
        dist: {
            files: _.reduce(
                lessFiles,
                function(d, s) {
                    var output = fmt("%s/%s.css", styleDistPath, s),
                        input = fmt("%s/%s.less", stylePath, s);
                    d[output] = [input];
                    return d;
                },
                {}
            )
        }
    });

    // -------------------------------------------------------------------------- watch & rebuild less files
    // use 'grunt watch-style' (from a new tab in your terminal) to have grunt re-copy changed files automatically
    //
    // the conditional prevents reconfiguration of 'normal' (.js) grunt watch from grunt-tasks/scripts.js

    if (this.cli.tasks.indexOf("watch-style") > -1) {
        grunt.config("watch", {
            watch: {
                // watch for changes in the src dir
                files: [stylePath + "/**"],
                tasks: ["sprite", "less"],
                options: {
                    spawn: false
                }
            }
        });
    }

    grunt.loadNpmTasks("grunt-contrib-less");
    grunt.loadNpmTasks("grunt-spritesmith");
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.registerTask("watch-style", ["watch"]);
    grunt.registerTask("style", ["sprite", "less"]);
};
