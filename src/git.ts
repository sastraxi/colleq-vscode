import * as vscode from 'vscode'
import { GitExtension, API as BuiltInGitApi } from './typings/git'
import { output } from './log'

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

/**
 * @return A relative path that does not start with a "/"".
 */
export const uriToTreePath = async (uri: vscode.Uri) => {
  const api = await getBuiltInGitApi()
  if (!api) {
    output.appendLine('FATAL: could not instantiate vscode.git extension.')
    return undefined
  }
  const repo = api.repositories[0]

  const rootUriStr = repo.rootUri.toString()
  const documentUriStr = uri.toString()
  if (!documentUriStr.startsWith(rootUriStr)) {
    output.appendLine(
      `SKIP: ${documentUriStr} is not in git root ${rootUriStr}`
    )
    return undefined
  }

  return rootUriStr.endsWith('/')
    ? documentUriStr.substring(rootUriStr.length)
    : documentUriStr.substring(rootUriStr.length + 1)
}
