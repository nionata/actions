const core = require('@actions/core')
const github = require('@actions/github')
const axios = require('axios')

const getInputs = (inputs) => inputs.map(input => core.getInput(input))
const HEROKU_HOST = 'https://api.heroku.com'

axios.defaults.baseURL = `${HEROKU_HOST}/`
axios.defaults.headers.common['Accept'] = 'application/vnd.heroku+json; version=3'

const run = async () => {

	try {

		const [ pipeline, stage, HEROKU_TOKEN ] = getInputs(['pipeline', 'stage', 'HEROKU_TOKEN'])
		const { state, number: pr } = github.context.payload.pull_request
		axios.defaults.headers.common['Authorization'] = `Bearer ${HEROKU_TOKEN}`
		console.log(`[PR] ${pr} ${state}`)

		// perform validation?

		// run based on the pr state
		if (state == 'open') {

			let { app_name, DATABASE_URL }  = await createApp(pipeline, stage, pr)
			// add to the pr a link
			core.setOutput('app_name', app_name)
			core.setOutput('DATABASE_URL', db_url)
		} else if (state == 'closed') {

			await deleteApp(pr)
		} else {
			
			throw Error(`Invalid pr state ${state}`)
		}
	} catch (error) {

		console.log('Action failed. Error:', error)
		core.setFailed(error.message)
	}
}

const createApp = async (pipeline, stage, pr) => {

	// create the new app
	const app = {
		name: `stem-c-pr-${pr}`,
		region: 'us',
		stack: 'container'
	}
	console.log(`creating ${app.name}`)
	const appResponse = await axios.post(`apps`, app)
	const { id: appId } = appResponse.data

	// add the app to the pipeline
	const coupling = {
		appId,
		pipeline,
		stage
	}
	console.log(`adding to pipeline`)
	await axios.post(`pipeline-couplings`, coupling)

	// provision a postgresql db
	const db = {
		plan: 'heroku-postgresql',
		attachment: {
			name: 'DATABASE'
		}
	}
	console.log(`provisioing db`)
	await axios.post(`apps/${appId}/addons`, db)

	// get the database url from the config
	const configResponse = await axios.get(`apps/${appId}/config-vars`)
	const { DATABASE_URL } = configResponse.data

	return { app_name: app.name, DATABASE_URL }
}

const deleteApp = async (pr) => {

	// delete the app
	const appName = `stem-c-pr${pr}`
	console.log(`deleting ${appName}`)
	await axios.delete(`/apps/${appName}`)
}

run()