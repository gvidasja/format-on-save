import * as vscode from 'vscode'
import * as yaml from 'yaml'
import { Uri } from 'vscode'
import { resolve } from 'path'

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('extension.formatOnSave', async () => {
    vscode.workspace.getConfiguration().update('editor.formatOnSave', true)

    if (vscode.workspace.rootPath) {
      const DEFAULT_CONFIG = {
        trailingComma: 'es5',
        tabWidth: 2,
        semi: false,
        singleQuote: true,
        printWidth: 100,
      }

      const CONFIG_FILE_NAME = Uri.file(resolve(vscode.workspace.rootPath, '.prettierrc.yml'))

      const configExists = await vscode.workspace.fs
        .stat(CONFIG_FILE_NAME)
        .then(() => true, () => false)

      const newConfig = configExists
        ? {
            ...DEFAULT_CONFIG,
            ...yaml.parse((await vscode.workspace.fs.readFile(CONFIG_FILE_NAME)).toString()),
          }
        : DEFAULT_CONFIG

      await vscode.workspace.fs.writeFile(CONFIG_FILE_NAME, Buffer.from(yaml.stringify(newConfig)))
    }

    vscode.window.showInformationMessage('Format On Save enabled')
  })

  context.subscriptions.push(disposable)
}

export function deactivate() {}
