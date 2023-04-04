// With help from https://weblog.jamisbuck.org/2010/12/29/maze-generation-eller-s-algorithm

// -- Imports --
import { grid } from "/modules/grid.js";
import { createToolbar } from "/modules/toolbar-overlay.js";

createToolbar(false);

// -- Initialize Variables --

// HTML Elements
/** @type {HTMLCanvasElement} */
let cnv = document.getElementById("mazeCanvas");

// -- Candvas & Context Setup --
/** @type {CanvasRenderingContext2D} */
let ctx = cnv.getContext("2d");

cnv.width = screen.width;
cnv.height = screen.height;

// -- Add Event Listeners --

// -- Functions --

// -- Draw Loop --

let test = new grid(8, 6);

// Temporary: Just for testing systems from console
window.test = test;
