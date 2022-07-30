import * as vscode from 'vscode'
import { uriToGitPath } from '../git'
import { getWebviewContent } from './webview'

export type ShowSidebarArgs = {
  gitPath?: string
  annotationId?: number
}

const setupSidebar = (context: vscode.ExtensionContext) => {
  let currentPanel: vscode.WebviewPanel | undefined = undefined
  vscode.commands.registerCommand(
    'colleq.showSidebar',
    async (options?: ShowSidebarArgs) => {
      const columnToShowIn = vscode.ViewColumn.Beside
      const activeTextEditor = vscode.window.activeTextEditor

      const gitPath =
        options?.gitPath ??
        (activeTextEditor?.document.uri &&
          (await uriToGitPath(activeTextEditor?.document.uri)))

      if (!gitPath) {
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
        currentPanel.webview.html = await getWebviewContent(gitPath)

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
