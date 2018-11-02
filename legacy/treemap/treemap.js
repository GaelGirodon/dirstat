/*
 * treemap.js
 * Tree Map script
 */

/**
 * Vue application
 */
let app = new Vue({
        el: '#app',
        // Application data
        data: {
            // Path to current parent entry
            path: [],
            // Tree map
            graph: null,
            // Tree map sum mode
            mode: 'count'
        },
        // Computed properties
        computed: {
            // Current entry
            current: function () {
                return this.path.length >= 0 ? this.path[this.path.length - 1] : null;
            },
            // Entries currently displayed
            entries: function () {
                let c = this.current;
                return c ? c.children : [];
            },
            // Available modes
            modes: () = > ['count', 'size', 'depth']
    },
    // When app is mounted
    mounted
:

function () {
    this.$http.get('dir-stats.json?t=' + Date.now()).then((data) = > {
        let entry = data.body;
    this.path.push(entry);
    this.graph = new d3plus.Treemap()
        .select('#treemap')
        .data(this.entries)
        .groupBy('name').sum(this.mode)
        .tooltipConfig({title: d = > d.name, body
:
    this.mapStats
})
.
    on('click', this.openEntry)
        .render();
})
    ;
}

,
// Methods
methods: {
    // Map entry stats to a string
    mapStats: (d) =
>
    `${Math.round(d.size / (1024 * 1024))} MB`
    + ` / ${d.count} entries / depth ${d.depth}`,
        // Render the tree map
        renderTreemap
:

    function () {
        this.graph.sum(this.mode).data(this.entries).render();
    }

,
    // Open an entry (zoom in tree map)
    openEntry: function (d) {
        // Find child entry in entries and open it
        let entry = this.entries.find(c = > c.name === d.name
    )
        ;
        if (entry.children && entry.children.length > 0) {
            this.path.push(entry);  // Push entry to path
            this.renderTreemap();   // Render tree map
        } // else: stop if children list is empty
    }
,
    // Back to previous level in path
    back: function () {
        if (this.path.length > 1) {
            this.path.pop();
            this.renderTreemap();
        }
    }
,
    // Go back to another parent entry in the path
    backTo: function (to) {
        let previousPathLength = this.path.length;
        while (this.path.length > 1 && this.current !== to) {
            this.path.pop();
        }
        if (this.path.length !== previousPathLength) {
            this.renderTreemap(); // Current entry changed
        }
    }
}
})
;
