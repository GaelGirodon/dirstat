/*
 * dirstat.js
 */

/**
 * DirStat Vue.js application
 */
var app = new Vue({
    el: '#app',
    // Application data
    data: {
        // Path to the directory to scan
        dir: '',
        // Scan request currently processing
        processing: false,
        // Request error
        error: null,
        // Path to the current parent entry
        path: [],
        // Tree map
        graph: null,
        // Tree map sum mode
        mode: 'size'
    },
    // Computed properties
    computed: {
        // Current entry
        current: function () {
            return this.path.length >= 0 ? this.path[this.path.length - 1] : null;
        },
        // Entries currently displayed
        entries: function () {
            var c = this.current;
            return c ? c.children : [];
        },
        // Available modes
        modes: function () {
            return ['count', 'size', 'depth'];
        }
    },
    // Methods
    methods: {
        // Scan the given directory
        scan: function () {
            this.error = null;
            this.processing = true;
            this.$http.get('stat?path=' + this.dir).then(function (data) {
                var entry = data.body;
                this.path = [entry];
                document.getElementById('treemap-container').innerHTML = '';
                this.graph = new d3plus.Treemap()
                    .select('#treemap-container')
                    .detectResize(true)
                    .detectResizeDelay(250)
                    .height(640)
                    .data(this.entries)
                    .groupBy('name').sum(this.mode)
                    .tooltipConfig({
                        title: function (d) {
                            return d.name
                        }, body: this.mapStats
                    })
                    .on('click', this.openEntry)
                    .render();
                this.processing = false;
            }).catch(function (err) {
                this.processing = false;
                this.error = 'Unable to scan the given directory'
                    + (err.body.message ? ': ' + err.body.message : '') + '.';
            });
        },
        // Map entry stats to a string
        mapStats: function (d) {
            return '<strong>Size:</strong> ' + Math.round(d.size / (1024 * 1024)) + ' MB<br>'
                + '<strong>Count:</strong> ' + d.count + ' entries<br>'
                + '<strong>Depth:</strong> ' + d.depth
        },
        // Render the tree map
        renderTreemap: function () {
            this.graph.sum(this.mode).data(this.entries).render();
        },
        // Open an entry (zoom in tree map)
        openEntry: function (d) {
            // Find child entry in entries and open it
            var entry = this.entries.find(function (c) {
                return c.name === d.name;
            });
            if (entry.children && entry.children.length > 0) {
                this.path.push(entry);  // Push entry to path
                this.renderTreemap();   // Render tree map
            } // else: stop if children list is empty
        },
        // Back to previous level in path
        back: function () {
            if (this.path.length > 1) {
                this.path.pop();
                this.renderTreemap();
            }
        },
        // Go back to another parent entry in the path
        backTo: function (to) {
            var previousPathLength = this.path.length;
            while (this.path.length > 1 && this.current !== to) {
                this.path.pop();
            }
            if (this.path.length !== previousPathLength) {
                this.renderTreemap(); // Current entry changed
            }
        }
    }
});
