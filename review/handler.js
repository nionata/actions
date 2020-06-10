import { getInput, setOutput, setFailed } from '@actions/core'
import { context } from '@actions/github'
import { run } from './controller'

const getInputs = (inputs) => inputs.map(input => getInput(input))
const handler = async () => {

	try {
		const inputs = getInputs(['base', 'pipeline', 'stage', 'token'])
		const { state, number: pr } = context.payload.pull_request
		console.log(`[PR] ${pr} ${state}`)

		const { app_name, DATABASE_URL } = await run({ ...inputs, state, pr })
		setOutput('app_name', app_name)
		setOutput('DATABASE_URL', DATABASE_URL)
	} catch (err) {

		console.log('Action failed.', err)
		setFailed(error.message)
	}
}

handler()