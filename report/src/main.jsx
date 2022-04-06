/*
 * main.jsx
 * Components and charts rendering
 */

import { render } from "preact";

import { ModeSelector } from "./components/mode-selector";
import { FileExplorer } from "./components/file-explorer";
import { Indicator } from "./components/indicator";
import { Chart } from "./components/chart";

import "./styles/main.css";

/*
 * Mount components
 */

// Mode selector
render(<ModeSelector />, document.getElementById("modeSelector"));

// File explorer
render(<FileExplorer />, document.getElementById("fileExplorer"));

// Size indicator
render(<Indicator name="Size" stat="s" description="Child files size" />,
  document.getElementById("sizeIndicator"));

// Files indicator
render(<Indicator name="Files" stat="fc" description="Child files count" />,
  document.getElementById("filesIndicator"));

// Directories indicator
render(<Indicator name="Directories" stat="dc" description="Child directories count" />,
  document.getElementById("directoriesIndicator"));

// Depth indicator
render(<Indicator name="Max depth" stat="d" description="Maximum level of nesting" />,
  document.getElementById("depthIndicator"));

// Children chart
render(<Chart name="Files & directories" description="Main child files and directories"
              data={(dir, type, mode) => dir.d.c.map(i => ({
                name: files[i].n,
                value: files[i].t === "dir" ? files[i][type][mode] : (mode === "s" ? files[i].s : 0)
              }))} />,
  document.getElementById("childrenChart"));

// Extensions chart
render(<Chart name="Extensions" description="Most used extensions in child files"
              data={(dir, type, mode) => mode === "d" ? [] : Object.keys(dir[type].e)
                .map(e => ({ name: e, value: dir[type].e[e][mode] }))} />,
  document.getElementById("extensionsChart"));

// Modification years chart
render(<Chart name="Modification years"
              description="Most frequent modification years in child files"
              data={(dir, type, mode) => mode === "d" ? [] : Object.keys(dir[type].y)
                .map(e => ({ name: e, value: dir[type].y[e][mode] }))} />,
  document.getElementById("yearsChart"));
