import strings from './translations/sv_strings.json'

class I18n {
    strings: object;

    constructor() {
        this.strings = strings;
    }
    get get(): any {
        return this.strings;
    }
}

export default new I18n();
