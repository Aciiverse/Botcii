import botciiConfig from "../botcii.config";

export namespace I18nSW {
    export interface I18nSWLanguage {
        [key: string]: string | undefined
    }

    export interface I18nSWGetTextOptions {
        lang?: string,
        values?: string[]
    }

    /**
     * @method gets a text from by a key
     * @param {string} key the key identifier for the text
     * @param {I18nSWGetTextOptions} options? language or values for replacement (optional parameter)
     * @returns {string} the text you want
     * @author Flowtastisch
     * @memberof ScriptWerk
     * @date 20.05.2024
     */
    export const getText = (key: string, options?: I18nSWGetTextOptions): string => {
        const   config = botciiConfig,
                selLng = config.i18nSW.selectedLanguage,
                falLng = config.i18nSW.selectedLanguage;

        // Check language identifier
        if (options && options.lang) {
            // -> Given Language valid
            const txtx = importLng(options.lang);

            if (txtx) {
                // -> file loaded
                const txt = txtx[key];

                if (txt) {
                    // -> text exists
                    if (options.values) {
                        // -> replace values exist
                        const replacedTxt = replaceValuesInsideMsg(txt, options.values);
                        return replacedTxt;
                    }
                    
                    return txt;
                }
            }
        }

        if (selLng) {
            // -> Selected Language valid
            const txtx = importLng(selLng);

            if (txtx) {
                // -> file loaded
                const txt = txtx[key];

                if (txt) {
                    // -> text exists
                    if (options && options.values) {
                        // -> replace values exist
                        const replacedTxt = replaceValuesInsideMsg(txt, options.values);
                        return replacedTxt;
                    }

                    return txt;
                }
            }
        }

        if (falLng) {
            // -> Fallback Language valid
            const txtx = importLng(falLng);

            if (txtx) {
                // -> file loaded
                const txt = txtx[key];

                if (txt) {
                    // -> text exists
                    if (options && options.values) {
                        // -> replace values exist
                        const replacedTxt = replaceValuesInsideMsg(txt, options.values);
                        return replacedTxt;
                    }

                    return txt;
                }
            }
        }

        // -> No fallback language exists -> Error
        console.error("Please select a language or add a fallbackLanguage.");
        return "";
    }

    /**
     * @method gets the cofig with all texts
     * @param {string} language the language you want
     * @returns {I18nSWLanguage | undefined} the config with all texts
     * @author Flowtastisch
     * @memberof ScriptWerk
     * @date 20.05.2024
     */
    const importLng = (language: string): I18nSWLanguage | undefined  => {
        try {

            const translations: { default: I18nSWLanguage } = require(`../i18n.sw/${language}.i18n.sw.js`);
            return translations.default;

        } catch (error) {

            console.error("Error at translation file loading:", error);
            return undefined;

        }
    },

    /**
     * @method replaces the "{0}" inside text with the given values
     * @param {string} msg the message with replaceble values
     * @param {string[]} values the values for the msg inside
     * @returns {string} msg string with values
     * @author Flowtastisch
     * @memberof ScriptWerk
     * @date 20.05.2024
     */
    replaceValuesInsideMsg = (msg: string, values: string[]): string => {
        values.forEach(e => {
            msg = msg.replace("{0}", e);
        });

        return msg;
    }

}