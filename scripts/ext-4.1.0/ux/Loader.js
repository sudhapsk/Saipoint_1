/* (c) Copyright 2014 SailPoint Technologies, Inc., All Rights Reserved. */
'use strict';

/**
 * Project: identityiq
 * Author: michael.hide
 * Created: 6/23/14 10:40 AM
 */

// 100822: Taken from Extjs 3.2.1.  Dynamically loads js/css files and allows room for expansion.
// See: http://www.sencha.com/forum/showthread.php?107796-Ext.ux.Loader-Load-js-css-Files-Dynamically

Ext.namespace('Ext.ux');

Ext.ux.Loader = Ext.apply({}, {
    load: function(fileList, callback, scope, preserveOrder) {
        var scope = scope || this,
            head = document.getElementsByTagName('head')[0],
            fragment = document.createDocumentFragment(),
            numFiles = fileList.length,
            loadedFiles = 0,
            me = this;

        // Loads a particular file from the fileList by index. This is used when preserving order
        var loadFileIndex = function(index) {
            head.appendChild(
                me.buildScriptTag(fileList[index], onFileLoaded)
            );
        };

        /**
         * Callback function which is called after each file has been loaded. This calls the callback
         * passed to load once the final file in the fileList has been loaded
         */
        var onFileLoaded = function() {
            loadedFiles++;

            //if this was the last file, call the callback, otherwise load the next file
            if (numFiles === loadedFiles && typeof callback === 'function') {
                callback.call(scope);
            }
            else {
                if (preserveOrder === true) {
                    loadFileIndex(loadedFiles);
                }
            }
        };

        if (preserveOrder === true) {
            loadFileIndex.call(this, 0);
        }
        else {
            //load each file (most browsers will do this in parallel)
            Ext.each(fileList, function(file, index) {
                fragment.appendChild(
                    this.buildScriptTag(file, onFileLoaded)
                );
            }, this);

            head.appendChild(fragment);
        }
    },

    buildScriptTag: function(filename, callback) {
        var exten = filename.substr(filename.lastIndexOf('.') + 1);
        //console.log('Loader.buildScriptTag: filename=[%s], exten=[%s]', filename, exten);
        if (exten === 'js') {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = filename;

            //IE has a different way of handling <script> loads, so we need to check for it here
            if (script.readyState) {
                script.onreadystatechange = function() {
                    if (script.readyState === 'loaded' || script.readyState === 'complete') {
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            }
            else {
                script.onload = callback;
            }
            return script;
        }
        if (exten === 'css') {
            var style = document.createElement('link');
            style.rel = 'stylesheet';
            style.type = 'text/css';
            style.href = filename;
            callback();
            return style;
        }
    }
});