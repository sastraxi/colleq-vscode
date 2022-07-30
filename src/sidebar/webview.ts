import * as vscode from 'vscode'
import { getAnnotations } from '../store'

export const getWebviewContent = (documentUri: vscode.Uri) => {
  const annotations = getAnnotations(documentUri)
  return `
    <h1>Sidebar</h1>
    <p>
        Some day some amazing things will be here.
    </p>
  `
}
