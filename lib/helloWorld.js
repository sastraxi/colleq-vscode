"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = __importDefault(require("vscode"));
function helloWorld() {
    vscode_1.default.window.showInformationMessage('Hello Visual Studio Code!');
}
exports.default = helloWorld;
//# sourceMappingURL=helloWorld.js.map