import * as vscode from 'vscode'
import { getBuiltInGitApi } from './git'

import { type ShowSidebarArgs } from './sidebar'

import { output } from './log'

export type Annotation = {
  id: number
  lineNumber: number
  username: string
  message: string
  externalUri?: string
}

export type Document = {
  /**
   * Relative path from the git root.
   */
  treePath: string
  annotations: Array<Annotation>
}

const showSidebarUri = (arg: ShowSidebarArgs) =>
  vscode.Uri.parse(
    `command:colleq.showSidebar?${encodeURIComponent(JSON.stringify([arg]))}`
  )

export const renderDecorationMarkdown = (
  treePath: string,
  annotation: Annotation
) => {
  const hoverMarkdown = `**${annotation.username}**: ${annotation.message}
---
[View conversation in sidebar](${showSidebarUri({
    treePath,
    annotationId: annotation.id,
  })})`

  const markdownString = new vscode.MarkdownString(hoverMarkdown)
  markdownString.isTrusted = true
  return markdownString
}

export const lookupDocument = async (
  treePath: string
): Promise<Document | undefined> => {
  const api = await getBuiltInGitApi()
  if (!api) {
    output.appendLine('FATAL: could not instantiate vscode.git extension.')
    return undefined
  }
  const repo = api.repositories[0]

  return {
    treePath,
    annotations: [
      {
        id: 1,
        lineNumber: 32,
        username: 'Evert Timberg',
        message: `There's a race condition here, I think.
          Consider the case where...`,
      },
    ],
  }
}
