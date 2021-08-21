/*
 * main.js
 * Components and charts rendering
 */

/*
 * Mount components
 */

// Mode selector
render(html`
  <${ModeSelector}/>`, document.getElementById("modeSelector"));

// File explorer
render(html`
  <${FileExplorer}/>`, document.getElementById("fileExplorer"));

// Size indicator
render(html`
    <${Indicator} name="Size" stat="s" description="Child files size"/>`,
  document.getElementById("sizeIndicator"));

// Files indicator
render(html`
    <${Indicator} name="Files" stat="fc" description="Child files count"/>`,
  document.getElementById("filesIndicator"));

// Directories indicator
render(html`
    <${Indicator} name="Directories" stat="dc" description="Child directories count"/>`,
  document.getElementById("directoriesIndicator"));

// Depth indicator
render(html`
    <${Indicator} name="Max depth" stat="d" description="Maximum level of nesting"/>`,
  document.getElementById("depthIndicator"));

// Children chart
render(html`
    <${Chart} name="Files & directories" description="Main child files and directories"
              data="${(dir, type, mode) => dir.d.c.map(i => ({
                name: files[i].n,
                value: files[i].t === "dir" ? files[i][type][mode] : (mode === "s" ? files[i].s : 0)
              }))}"/>`,
  document.getElementById("childrenChart"));

// Extensions chart
render(html`
    <${Chart} name="Extensions" description="Most used extensions in child files"
              data="${(dir, type, mode) => mode === "d" ? [] : Object.keys(dir[type].e)
                .map(e => ({name: e, value: dir[type].e[e][mode]}))}"/>`,
  document.getElementById("extensionsChart"));

// Modification years chart
render(html`
    <${Chart} name="Modification years" description="Most frequent modification years in child files"
              data="${(dir, type, mode) => mode === "d" ? [] : Object.keys(dir[type].y)
                .map(e => ({name: e, value: dir[type].y[e][mode]}))}"/>`,
  document.getElementById("yearsChart"));
