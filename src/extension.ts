import * as vscode from 'vscode';
import {Configurator} from './Configurator'



export function activate(context : vscode.ExtensionContext) {
    console.log("SearchScope:" + 'Congratulations, your extension "search-scope" is now active!');
    let configurator = new Configurator();
    let configPath = vscode.workspace?.workspaceFolders && vscode.workspace?.workspaceFolders[0] ? vscode.workspace?.workspaceFolders[0].uri.fsPath : ''
    configurator.loadConfig(configPath)
    if (configurator.config?.errors.length) {
        for(let error of configurator.config?.errors) {
            console.error(error)
        }
    }
    const toggleSearch = vscode.commands.registerCommand('search-scope.toggleSearch', function () {
        if (configurator.isConfigLoaded && configurator.isConfigCorrect && configurator.config?.searchScopes) {
            const quickPick = vscode.window.createQuickPick();
            quickPick.items = configurator.config?.searchScopes?.map(label => ({ label }));
            quickPick.onDidChangeSelection(selection => {
                if (selection[0]) {
                    vscode.commands.executeCommand("workbench.action.findInFiles", {
                        query: '',
                        filesToInclude: selection[0].label,
                        filesToExclude: configurator.config?.filesToExclude,
                        contextLines: configurator.config?.contextLines,
                        matchWholeWord: configurator.config?.matchWholeWord,
                        isCaseSensitive: configurator.config?.isCaseSensitive,
                        isRegexp: configurator.config?.isRegexp,
                        useExcludeSettingsAndIgnoreFiles: configurator.config?.useExcludeSettingsAndIgnoreFiles,
                        useIgnores: configurator.config?.useIgnores,
                        showIncludesExcludes: configurator.config?.showIncludesExcludes,
                        triggerSearch: configurator.config?.triggerSearch,
                        focusResults: configurator.config?.focusResults,
                    });
                }
            });
            quickPick.onDidHide(() => quickPick.dispose());
            quickPick.show();
        }
    });
    context.subscriptions.push(toggleSearch);
}

// This method is called when your extension is deactivated
export function deactivate() {
}
