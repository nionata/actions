import { createAxiosInstance, getAppName } from './util.js'
import { createApp, deleteApp } from './dataaccess.js'
import { run } from './controller.js'

import * as dotenv from 'dotenv'
dotenv.config()

let instance

//
// util
//
test('util should create an axios instance', async () => {

    const host = 'https://api.heroku.com'
    const token = process.env.HEROKU_TOKEN

    instance = createAxiosInstance(host, token)

    expect(instance.defaults.baseURL).toBe(`${host}/`)
})

//
// dataaccess
//
test('dataaccess should create an app', async () => {

    const pipeline = process.env.PIPELINE_ID
    const stage = 'development'
    const name = getAppName('stem-c', 1)

    let response, error
    try {
        response = await createApp(instance, pipeline, stage, name)
    } catch (err) {
        error = err   
    }

    expect(error).toBeUndefined()
    expect(response).not.toBeUndefined()
    expect(response).toHaveProperty('app_name', name)
    expect(response).toHaveProperty('DATABASE_URL')
})

test('dataaccess should delete an app', async () => {

    const name = getAppName('stem-c', 1)

    let error
    try {
        await deleteApp(instance, name)
    } catch (err) {
        error = err   
    }

    expect(error).toBeUndefined()
})

//
// controller
//
test('controller should create an app when the pr state is open', async () => {

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
        response = await run(...Object.values(request))
    } catch (err) {
        error = err   
    }

    expect(error).toBeUndefined()
    expect(response).not.toBeUndefined()
    expect(response).toHaveProperty('app_name', name)
    expect(response).toHaveProperty('DATABASE_URL')
})

test('controller should delete an app when the pr state is closed', async () => {

    const request = {
        base: 'stem-c',
        pipeline: process.env.PIPELINE_ID,
        stage: 'development',
        token: process.env.HEROKU_TOKEN,
        state: 'closed',
        pr: '1'
    }
    const name = getAppName(request.base, request.pr)

    let response, error
    try {
        response = await run(...Object.values(request))
    } catch (err) {
        error = err   
    }

    expect(error).toBeUndefined()
    expect(response).not.toBeUndefined()
    expect(response).toHaveProperty('app_name', name)
    expect(response).not.toHaveProperty('DATABASE_URL')
})

test('controller should throw an error when the pr state is not valid', async () => {

    const request = {
        state: 'invalid'
    }

    let error
    try {
        await run(...Object.keys(request))
    } catch (err) {
        error = err   
    }

    expect(error).not.toBeUndefined()
})