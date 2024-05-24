declare namespace NodeJS {
    interface ProcessEnv {
        TOKEN:          string | undefined,
        CLIENTID:       string | undefined,
        GUILDID:        string | undefined,
        MODE:           'DEV' | 'PROD' | undefined,
        DB_HOST:        string | undefined,
        DB_USER:        string | undefined,
        DB_NAME:        string | undefined,
        DB_PASSWORD:    string | undefined,
        DB_PORT:        string | undefined,
    }
}