type EnvKeys = {
    MONGO_DB_URL: string,
    MONGO_DB_PWD: string,
    RATE_LIMIT_WINDOW: number,
    REQUEST_LIMIT: number,
    RABBIT_MQ_URL: string,
    RABBIT_MQ_EXCHG_NAME: string,
    REGISTRATION_SECRET_KEY: string,
    AUTHORIZER_SECRET_KEY: string,
    REFRESHER_SECRET_KEY: string,
}

export const envKeys = (): EnvKeys => {
    if (process.env.ENV === 'STG') {
        return {
            MONGO_DB_URL: process.env.MONGO_STG || '',
            MONGO_DB_PWD: process.env.MONGO_STG_PSWD || '',
            RATE_LIMIT_WINDOW: parseInt(process.env.STG_RATE_LIMIT_WINDOW || '900000'), // 15 minutes
            REQUEST_LIMIT: parseInt(process.env.STG_REQUEST_LIMIT || '60'), // Limit each IP to 60 requests per `window` (here, per 15 minutes).
            RABBIT_MQ_URL: process.env.STG_RABBIT_MQ_URL || '',
            RABBIT_MQ_EXCHG_NAME: process.env.STG_RABBIT_MQ_EXCHG_NAME || '',
            REGISTRATION_SECRET_KEY: process.env.STG_REGISTRATION_SECRET_KEY || '',
            AUTHORIZER_SECRET_KEY: process.env.STG_AUTHORIZER_SECRET_KEY || '',
            REFRESHER_SECRET_KEY: process.env.STG_REFRESHER_SECRET_KEY || ''
        }
    }

    return {
        MONGO_DB_URL: process.env.MONGO_LOCAL || '',
        MONGO_DB_PWD: '',
        RATE_LIMIT_WINDOW: parseInt(process.env.LOCAL_RATE_LIMIT_WINDOW || '6000'), // 1 minute
        REQUEST_LIMIT: parseInt(process.env.LOCAL_REQUEST_LIMIT || '10'), // Limit each IP to 10 requests per `window` (here, per 1 minute).
        RABBIT_MQ_URL: process.env.LOCAL_RABBIT_MQ_URL || '',
        RABBIT_MQ_EXCHG_NAME: process.env.LOCAL_RABBIT_MQ_EXCHG_NAME || '',
        REGISTRATION_SECRET_KEY: process.env.LOCAL_REGISTRATION_SECRET_KEY || '{b60abea4-622f-4430-ac2d-41f198583a5a}',
        AUTHORIZER_SECRET_KEY: process.env.LOCAL_AUTHORIZER_SECRET_KEY || '{e013d815-5737-49d4-8399-c18719240605}',
        REFRESHER_SECRET_KEY: process.env.LOCAL_REFRESHER_SECRET_KEY || '{e44fc1c1-131e-4a0e-8e1e-01f991a536a5}'
    }
}