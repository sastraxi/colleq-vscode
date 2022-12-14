import * as vscode from 'vscode'

import helloWorld from './helloWorld'
import setupSidebar from './sidebar/index'

import { output } from './log'
import { uriToTreePath } from './git'
import { lookupDocument } from './store'

import groupBy from 'lodash/groupBy'
import { renderDecorationMarkdown } from './decoration'

const decorationType = vscode.window.createTextEditorDecorationType({
  isWholeLine: true,
})

const decorate = async (editor: vscode.TextEditor) => {
  const treePath = await uriToTreePath(editor.document.uri)
  if (!treePath) return []

  const document = await lookupDocument(treePath)
  if (!document) return []

  const sourceCode = editor.document.getText()
  const sourceCodeArr = sourceCode.split('\n')

  const decorationsArray = Object.entries(
    groupBy(document.annotations, (x) => x.lineNumber)
  ).map(([strLineNumber, annotations]) => {
    const hoverMessage = renderDecorationMarkdown(treePath, annotations)
    const lineNumber = +strLineNumber
    const line = lineNumber - 1
    const decoration: vscode.DecorationOptions = {
      range: new vscode.Range(
        new vscode.Position(line, sourceCodeArr[line].length),
        new vscode.Position(line, sourceCodeArr[line].length)
      ),
      hoverMessage,
      renderOptions: {
        after: {
          contentText: `👥 ${
            annotations.length === 1
              ? annotations[0].username
              : annotations.length
          }`,
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
