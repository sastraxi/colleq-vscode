import * as vscode from 'vscode'
import { getBuiltInGitApi } from './git'

import { output } from './log'

export type Annotation = {
  lineNumber: number
  username: string
  message: string
  externalUri: string
}

export const getAnnotations = async (
  documentUri: vscode.Uri
): Promise<Array<Annotation>> => {
  output.appendLine(`got document uri: ${documentUri}`)

  const api = await getBuiltInGitApi()
  if (!api) {
    output.appendLine('FATAL: could not instantiate vscode.git extension.')
    return []
  }

  const repo = api.repositories[0]
  const { commit, name } = repo.state.HEAD!
  output.appendLine(`git: ${commit} ${name}`)

  return []
}
