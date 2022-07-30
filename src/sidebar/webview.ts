import * as vscode from 'vscode'
import { lookupDocument } from '../store'

export const getWebviewContent = async (gitPath: string) => {
  const document = await lookupDocument(gitPath)
  if (!document) {
    return `No file found.`
  }
  return `
    <h1>${document.gitPath}</h1>
    <p>
        Some day some amazing things will be here.
    </p>
  `
}
