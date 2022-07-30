import * as vscode from 'vscode'

import helloWorld from './helloWorld'
import setupSidebar from './sidebar/index'

import { output } from './log'

const decorationType = vscode.window.createTextEditorDecorationType({
  isWholeLine: true,
})

const showSidebarUri = (args: string[]) =>
  vscode.Uri.parse(
    `command:colleq.showSidebar?${encodeURIComponent(JSON.stringify(args))}`
  )

const hoverMarkdown = `
**Evert Timberg**: There's a race condition here, I think.
Consider the case where...

---
[View conversation in sidebar](${showSidebarUri(['bob', 'todd'])})
`

const decorate = (editor: vscode.TextEditor) => {
  const sourceCode = editor.document.getText()
  const regex = /(console\.log)/

  const decorationsArray: vscode.DecorationOptions[] = []
  const sourceCodeArr = sourceCode.split('\n')

  for (let line = 0; line < sourceCodeArr.length; line++) {
    const match = sourceCodeArr[line].match(regex)

    if (match !== null && match.index !== undefined) {
      const hoverMessage = new vscode.MarkdownString(hoverMarkdown)
      hoverMessage.isTrusted = true

      const decoration: vscode.DecorationOptions = {
        range: new vscode.Range(
          new vscode.Position(line, sourceCodeArr[line].length),
          new vscode.Position(line, sourceCodeArr[line].length)
        ),
        hoverMessage,
        renderOptions: {
          after: {
            contentText: '👥 2',
            color: '#69afcf',
            margin: '3em',
          },
        },
      }
      decorationsArray.push(decoration)
    }
  }

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

  vscode.workspace.onWillSaveTextDocument((event) => {
    const openEditor = vscode.window.visibleTextEditors.filter(
      (editor) => editor.document.uri === event.document.uri
    )[0]
    decorate(openEditor)
  })
}

export function deactivate(): void {
  // recycle resource...
}
