import * as vscode from 'vscode'
import { type ShowSidebarArgs } from './sidebar'
import { type Annotation } from './store'

const showSidebarUri = (arg: ShowSidebarArgs) =>
  vscode.Uri.parse(
    `command:colleq.showSidebar?${encodeURIComponent(JSON.stringify([arg]))}`
  )

export const renderDecorationMarkdown = (
  treePath: string,
  annotations: Array<Annotation>
) => {
  const hoverMarkdown = annotations
    .map(
      (annotation) => `**${annotation.username}**: ${annotation.message}
---
[View conversation in sidebar](${showSidebarUri({
        treePath,
        annotationId: annotation.id,
      })})`
    )
    .join('\n\n')

  const markdownString = new vscode.MarkdownString(hoverMarkdown)
  markdownString.isTrusted = true
  return markdownString
}
