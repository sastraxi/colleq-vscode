import * as vscode from 'vscode'

import helloWorld from './helloWorld'
import setupSidebar from './sidebar/index'

import { output } from './log'
import { uriToGitPath } from './git'
import { lookupDocument, renderDecorationMarkdown } from './store'

const decorationType = vscode.window.createTextEditorDecorationType({
  isWholeLine: true,
})

const decorate = async (editor: vscode.TextEditor) => {
  const gitPath = await uriToGitPath(editor.document.uri)
  if (!gitPath) return []

  const document = await lookupDocument(gitPath)
  if (!document) return []

  const sourceCode = editor.document.getText()
  const sourceCodeArr = sourceCode.split('\n')

  const decorationsArray = document.annotations.map((annotation) => {
    const hoverMessage = renderDecorationMarkdown(gitPath, annotation)
    const line = annotation.lineNumber - 1
    const decoration: vscode.DecorationOptions = {
      range: new vscode.Range(
        new vscode.Position(line, sourceCodeArr[line].length),
        new vscode.Position(line, sourceCodeArr[line].length)
      ),
      hoverMessage,
      renderOptions: {
        after: {
          contentText: `👥 ${annotation.username}`,
          color: '#69afcf',
          margin: '2em',
        },
      },
    }
    return decoration
  })
  editor.setDecorations(decorationType, decorationsArray)
}

export function activate(context: vscode.ExtensionContext): void {
  setupSidebar(context)

  context.subscriptions.push(
    vscode.commands.registerCommand('colleq.hello', (...people: string[]) =>
      helloWorld(people)
    )
  )

  const handleUri = (uri: vscode.Uri) => {
    const queryParams = new URLSearchParams(uri.query)
    output.appendLine(`Handle URI: ${uri.toString()}`)
    if (queryParams.has('say')) {
      vscode.window.showInformationMessage(
        `URI Handler says: ${queryParams.get('say') as string}`
      )
    }
  }

  context.subscriptions.push(
    vscode.window.registerUriHandler({
      handleUri,
    })
  )

  vscode.workspace.onWillSaveTextDocument(async (event) => {
    const openEditor = vscode.window.visibleTextEditors.filter(
      (editor) => editor.document.uri === event.document.uri
    )[0]
    await decorate(openEditor)
  })
}

export function deactivate(): void {
  // recycle resource...
}
