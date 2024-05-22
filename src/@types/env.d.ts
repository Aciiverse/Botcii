declare namespace NodeJS {
    interface ProcessEnv {
        TOKEN:      string | undefined,
        CLIENTID:   string | undefined,
        GUILDID:    string | undefined,
        MODE:       'DEV' | 'PROD' | undefined
    }
}