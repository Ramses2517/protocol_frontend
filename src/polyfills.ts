// Polyfills for Node.js API in browser
import { Buffer } from 'buffer';
import process from 'process';

// Global definitions
window.Buffer = window.Buffer || Buffer;
window.process = window.process || process;

// For compatibility with @ton libraries
global.Buffer = global.Buffer || Buffer;
global.process = global.process || process; 