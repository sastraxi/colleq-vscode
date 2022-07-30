import vscode from 'vscode'

export default function helloWorld(people: string[]) {
  vscode.window.showInformationMessage(
    `Welcome to colleq, ${people.join(', ')}!`
  )
}
