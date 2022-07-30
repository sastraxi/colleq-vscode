import * as vscode from 'vscode'
import { GitExtension, API as BuiltInGitApi } from './typings/git'

export const getBuiltInGitApi = async (): Promise<
  BuiltInGitApi | undefined
> => {
  try {
    const extension = vscode.extensions.getExtension(
      'vscode.git'
    ) as vscode.Extension<GitExtension>
    if (extension !== undefined) {
      const gitExtension = extension.isActive
        ? extension.exports
        : await extension.activate()

      return gitExtension.getAPI(1)
    }
  } catch {
    return undefined
  }
}
