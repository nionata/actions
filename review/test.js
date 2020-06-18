import { createAxiosInstance, getAppName } from './util'
import { createApp, deleteApp } from './dataaccess'
import { run } from './controller'

import * as dotenv from 'dotenv'
dotenv.config()

let instance

test('auto', async () => {
    test('review', async () => {        
        test('util', async () => {
            test('should create an axios instance', async () => {

                const host = 'https://api.heroku.com'
                const token = process.env.HEROKU_TOKEN

                instance = createAxiosInstance(host, token)

                expect(instance.defaults.baseURL).to.equal(`${host}/`)
            })
        })
        
        test('dataaccess', async () => {
            test('should create an app', async () => {

                const pipeline = process.env.PIPELINE_ID
                const stage = 'development'
                const name = getAppName('stem-c', 1)

                let response, error
                try {
                    response = await createApp(instance, pipeline, stage, name)
                } catch (err) {
                    error = err   
                }

                expect(error).to.not.exist
                expect(response).to.exist
                expect(response).to.haveOwnProperty('app_name').equals(name)
                expect(response).to.haveOwnProperty('DATABASE_URL')
            })

            test('should delete an app', async () => {

                const name = getAppName('stem-c', 1)

                let error
                try {
                    await deleteApp(instance, name)
                } catch (err) {
                    error = err   
                }

                expect(error).to.not.exist
            })
        })
        
        test('controller', async () => {
            test('should create an app when the pr state is open', async () => {

                const request = {
                    base: 'stem-c',
                    pipeline: process.env.PIPELINE_ID,
                    stage: 'development',
                    token: process.env.HEROKU_TOKEN,
                    state: 'open',
                    pr: '1'
                }
                const name = getAppName(request.base, request.pr)

                let response, error
                try {
                    response = await run(request)
                } catch (err) {
                    error = err   
                }

                expect(error).to.not.exist
                expect(response).to.exist
                expect(response).to.haveOwnProperty('app_name').equals(name)
                expect(response).to.haveOwnProperty('DATABASE_URL')
            })

            test('should delete an app when the pr state is closed', async () => {

                const request = {
                    base: 'stem-c',
                    token: process.env.HEROKU_TOKEN,
                    state: 'closed',
                    pr: '1'
                }

                let error
                try {
                    await run(request)
                } catch (err) {
                    error = err   
                }

                expect(error).to.not.exist
            })

            test('should throw an error when the pr state is not valid', async () => {

                const request = {
                    state: 'invalid'
                }

                let error
                try {
                    await run(request)
                } catch (err) {
                    error = err   
                }

                expect(error).to.exist
            })
        })
    })
})