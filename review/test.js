import { expect } from 'chai'
import { createAxiosInstance, getAppName } from './util'
import { createApp, deleteApp } from './dataaccess'
import { run } from './controller'

import * as dotenv from 'dotenv'
dotenv.config()

let instance

describe('auto', async function() {
    describe('review', async function() {        
        describe('util', async function() {
            it('should create an axios instance', async function() {

                const host = 'https://api.heroku.com'
                const token = process.env.HEROKU_TOKEN

                instance = createAxiosInstance(host, token)

                expect(instance.defaults.baseURL).to.equal(`${host}/`)
            })
        })
        
        describe('dataaccess', async function() {
            it('should create an app', async function() {

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

            it('should delete an app', async function() {

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
        
        describe('controller', async function() {
            it('should create an app when the pr state is open', async function() {

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

            it('should delete an app when the pr state is closed', async function() {

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

            it.only('should throw an error when the pr state is not valid', async function() {

                const request = {
                    state: 'invalid'
                }

                let error
                try {
                    await run(request)
                } catch (err) {
                    error = err   
                }

                console.log(error)

                expect(error).to.exist
            })
        })
    })
})