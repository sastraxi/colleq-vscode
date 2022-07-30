import * as vscode from 'vscode'
import { uriToTreePath } from '../git'
import { getWebviewContent } from './webview'

export type ShowSidebarArgs = {
  treePath?: string
  annotationId?: number
}

const setupSidebar = (context: vscode.ExtensionContext) => {
  let currentPanel: vscode.WebviewPanel | undefined = undefined
  vscode.commands.registerCommand(
    'colleq.showSidebar',
    async (options?: ShowSidebarArgs) => {
      const columnToShowIn = vscode.ViewColumn.Beside
      const activeTextEditor = vscode.window.activeTextEditor

      const treePath =
        options?.treePath ??
        (activeTextEditor?.document.uri &&
          (await uriToTreePath(activeTextEditor?.document.uri)))

      if (!treePath) {
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
          {
            enableCommandUris: true,
            enableScripts: true,
          }
        )
        currentPanel.webview.html = await getWebviewContent(treePath)

        // Reset when the current panel is closed
        currentPanel.onDidDispose(
          () => {
            currentPanel = undefined
          },
          null,
          context.subscriptions
        )
      }
    }
  )
}

export default setupSidebar
