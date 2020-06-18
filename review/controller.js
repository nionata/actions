import { createAxiosInstance, getAppName } from './util.js'
import { createApp, deleteApp } from './dataaccess.js'

export const run = async ({ base, pipeline, stage, token, state, pr }) => {

	const axios = createAxiosInstance('https://api.heroku.com', token)
    const name = getAppName(base, pr)

    if (state == 'open') {

        return await createApp(axios, pipeline, stage, name)
    } else if (state == 'closed') {

        await deleteApp(axios, name)
    } else {
        
        throw Error(`Invalid pr state ${state}`)
    }
}