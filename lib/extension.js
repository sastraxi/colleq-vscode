"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const helloWorld_1 = __importDefault(require("./helloWorld"));
const decorationType = vscode.window.createTextEditorDecorationType({
    isWholeLine: true,
});
const hoverMarkdown = `
# Look at this stuff
It's **stuff**
---
[Open in sidebar](vscode://sastraxi.colleq-vscode/)
---
<a href="vscode://sastraxi.colleq-vscode/">Hello</a>
`;
const decorate = (editor) => {
    const sourceCode = editor.document.getText();
    const regex = /(console\.log)/;
    const decorationsArray = [];
    const sourceCodeArr = sourceCode.split('\n');
    for (let line = 0; line < sourceCodeArr.length; line++) {
        const match = sourceCodeArr[line].match(regex);
        if (match !== null && match.index !== undefined) {
            const decoration = {
                range: new vscode.Range(new vscode.Position(line, sourceCodeArr[line].length), new vscode.Position(line, sourceCodeArr[line].length)),
                hoverMessage: hoverMarkdown,
                renderOptions: {
                    after: {
                        contentText: '👥 2',
                        color: '#69afcf',
                        margin: '3em',
                    },
                },
            };
            decorationsArray.push(decoration);
        }
    }
    editor.setDecorations(decorationType, decorationsArray);
};
//Create output channel
const output = vscode.window.createOutputChannel('Colleq');
//Write to output.
output.appendLine('Colleq started.');
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('VSCodeExtensionBoilerplate.helloVSCode', () => (0, helloWorld_1.default)()));
    const handleUri = (uri) => {
        const queryParams = new URLSearchParams(uri.query);
        output.appendLine(`Handle URI: ${uri.toString()}`);
        if (queryParams.has('say')) {
            vscode.window.showInformationMessage(`URI Handler says: ${queryParams.get('say')}`);
        }
    };
    context.subscriptions.push(vscode.window.registerUriHandler({
        handleUri,
    }));
    vscode.workspace.onWillSaveTextDocument((event) => {
        const openEditor = vscode.window.visibleTextEditors.filter((editor) => editor.document.uri === event.document.uri)[0];
        decorate(openEditor);
    });
}
exports.activate = activate;
function deactivate() {
    // recycle resource...
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map