import * as vscode from 'vscode'

import helloWorld from './helloWorld'

const decorationType = vscode.window.createTextEditorDecorationType({
  isWholeLine: true,
})

const hoverMarkdown = `
# Look at this stuff
It's **stuff**
---
[Open in sidebar](vscode://sastraxi.colleq-vscode/)
---
<a href="vscode://sastraxi.colleq-vscode/">Hello</a>
`

const decorate = (editor: vscode.TextEditor) => {
  const sourceCode = editor.document.getText()
  const regex = /(console\.log)/

  const decorationsArray: vscode.DecorationOptions[] = []
  const sourceCodeArr = sourceCode.split('\n')

  for (let line = 0; line < sourceCodeArr.length; line++) {
    const match = sourceCodeArr[line].match(regex)

    if (match !== null && match.index !== undefined) {
      const decoration: vscode.DecorationOptions = {
        range: new vscode.Range(
          new vscode.Position(line, sourceCodeArr[line].length),
          new vscode.Position(line, sourceCodeArr[line].length)
        ),
        hoverMessage: hoverMarkdown,
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

//Create output channel
const output = vscode.window.createOutputChannel('Colleq')

//Write to output.
output.appendLine('Colleq started.')

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'VSCodeExtensionBoilerplate.helloVSCode',
      () => helloWorld()
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
