import * as vscode from 'vscode'
import { lookupDocument } from '../store'

export const getWebviewContent = async (treePath: string) => {
  const document = await lookupDocument(treePath)
  if (!document) {
    return `No file found.`
  }
  return `
    <h1>${document.treePath}</h1>
    <p>
        Some day some amazing things will be here.
    </p>
  `
}
