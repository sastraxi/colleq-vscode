import * as vscode from 'vscode'
import { getWebviewContent } from './webview'

const setupSidebar = (context: vscode.ExtensionContext) => {
  let currentPanel: vscode.WebviewPanel | undefined = undefined
  vscode.commands.registerCommand('colleq.showSidebar', () => {
    const columnToShowIn = vscode.ViewColumn.Beside
    const activeTextEditor = vscode.window.activeTextEditor

    if (!activeTextEditor) {
      return
    }

    if (currentPanel) {
      // If we already have a panel, show it in the target column
      currentPanel.reveal(columnToShowIn)
    } else {
      // Otherwise, create a new panel
      currentPanel = vscode.window.createWebviewPanel(
        'colleqSidebar',
        'Colleq: Conversations',
        {
          viewColumn: columnToShowIn,
          preserveFocus: true,
        },
        {}
      )
      currentPanel.webview.html = getWebviewContent(
        activeTextEditor.document.uri
      )

      // Reset when the current panel is closed
      currentPanel.onDidDispose(
        () => {
          currentPanel = undefined
        },
        null,
        context.subscriptions
      )
    }
  })
}

export default setupSidebar
