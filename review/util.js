import axios from 'axios'

const { create } = axios

export const getAppName = (base, pr) => `${base}-pr-${pr}`

export const createAxiosInstance = (host, token) => create({
    baseURL: `${host}/`,
    headers: {
        'Authorization': `Bearer ${token}`,
        'Accept':'application/vnd.heroku+json; version=3'
    }
})