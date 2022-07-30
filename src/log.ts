import * as vscode from 'vscode'

// Create output channel
export const output = vscode.window.createOutputChannel('Colleq')

// Write to output.
output.appendLine('Colleq started.')
