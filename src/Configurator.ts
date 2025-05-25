import * as fs from 'fs';
import * as RJSON from 'relaxed-json';
import * as path from 'path'

type ConfigFileOptions = {
    filesToExclude: string,
    contextLines: number,
    matchWholeWord: boolean,
    isCaseSensitive: boolean,
    isRegexp: boolean,
    useExcludeSettingsAndIgnoreFiles: boolean,
    useIgnores: boolean,
    showIncludesExcludes: boolean,
    triggerSearch: boolean,
    focusResults: boolean,
    searchScopes: string[]
};
type ConfigOptions = {
    filesToExclude: string,
    contextLines: number,
    matchWholeWord: boolean,
    isCaseSensitive: boolean,
    isRegexp: boolean,
    useExcludeSettingsAndIgnoreFiles: boolean,
    useIgnores: boolean,
    showIncludesExcludes: boolean,
    triggerSearch: boolean,
    focusResults: boolean,
    searchScopes: string[],
    errors:string[]
};
export class Configurator {
    isConfigLoaded = false
    isConfigCorrect = false

    config?: ConfigOptions
    isCorrect() {
        return this.isConfigCorrect && this.isConfigLoaded
    }
    loadConfig(rootPath : string) {
        this.isConfigCorrect = false
        this.isConfigLoaded = false
        let configText = fs.readFileSync(rootPath + path.sep + '.search-scope-config.json')
        let filesToExclude: string = ''
        let contextLines: number = 5
        let matchWholeWord: boolean = false
        let isCaseSensitive: boolean = false
        let isRegexp: boolean = false
        let useExcludeSettingsAndIgnoreFiles: boolean = true
        let useIgnores: boolean = true
        let showIncludesExcludes: boolean = true
        let triggerSearch: boolean = false
        let focusResults: boolean = false
        let searchScopes:string[] = []
        let errors:string[] = []
        try {
            let optionsText = Buffer.from(configText).toString('utf8')
            const config: ConfigFileOptions = <ConfigFileOptions>RJSON.parse(optionsText);

            // If port is set in config file (Like in Sublime) then use that, default is 22
            if (config.filesToExclude) {
                filesToExclude = config.filesToExclude;
            }
            if (config.contextLines) {
                contextLines = config.contextLines
            }
            if (config.searchScopes) {
                searchScopes = config.searchScopes
            }
            if (config.matchWholeWord) {
                matchWholeWord = config.matchWholeWord
            }
            if (config.isCaseSensitive) {
                isCaseSensitive = config.isCaseSensitive
            }
            if (config.isRegexp) {
                isRegexp = config.isRegexp
            }
            if (config.useExcludeSettingsAndIgnoreFiles) {
                useExcludeSettingsAndIgnoreFiles = config.useExcludeSettingsAndIgnoreFiles;
            }
            if (config.useIgnores) {
                useIgnores = config.useIgnores
            }
            if (config.showIncludesExcludes) {
                showIncludesExcludes = config.showIncludesExcludes
            }
            if (config.triggerSearch) {
                triggerSearch = config.triggerSearch
            }
            if (config.focusResults) {
                focusResults = config.focusResults
            }
        } catch (e) {
            errors.push('Error: Unable to parse search-scope-config.json!')
        }
        this.config = <ConfigOptions>{
            filesToExclude,
            contextLines,
            matchWholeWord,
            isCaseSensitive,
            searchScopes,
            isRegexp,
            useExcludeSettingsAndIgnoreFiles,
            useIgnores,
            showIncludesExcludes,
            triggerSearch,
            focusResults,
            errors,
        }
        if (errors.length === 0) {
            this.isConfigCorrect = true
            this.isConfigLoaded = true
        }
    }
}