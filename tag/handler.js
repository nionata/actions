import { getInput } from '@actions/core'
import { exec } from '@actions/exec'
import { context, getOctokit } from '@actions/github'

const pr = context.payload.pull_request
const client = getOctokit(getInput('repo_token'))
const { owner, repo } = context.repo

run()

async function run() {

    // verify the pull request was merged
    if(!pr.merged) {
        console.log('Pr was not merged. Aborting action!')
        return
    }

    // attempt to create a release
    try {

        // based on the title, check what type of release this is
        const { title } = pr
        const isHotfix = title.match(/hotfix/gi)
        const isVersioned = title.match(/v\d+.\d+(?:.\d+)?/gi)

        //
        // on hotfix, release with an incremented patch version
        //
        if (isHotfix) {

            let lastTag = await getLastTag()

            // add a .0 to the end of a tag without a path version
            if (lastTag.length === 4) 
                lastTag = lastTag.concat(['.', '0'])

            // increment the patch version
            lastTag[5] = parseInt(lastTag[5], 10)+1
    
            // get the specific version
            const version = lastTag.join('')
            console.log(`Hotfix - releasing ${version}`)

            // create the release and return
            await createRelease(version) 
            return
        }

        //
        // on versioned, release with the passed version
        //
        if (isVersioned) {

            // make sure only one version was captured
            if (isVersioned.length > 1) {
                console.log('Pr title contained more than one version. Aborting action!')
                return
            }

            // get the specific version
            const version = isVersioned[0]
            console.log(`Versioned - releasing ${version}`)

            // create the release and return
            await createRelease(version) 
            return
        }

        //
        // on non-descript, release with an incremented minor version
        //
        let lastTag = await getLastTag()

        // increment the minor version
        lastTag[3] = parseInt(lastTag[3], 10)+1

        // get the specific version
        const version = lastTag.join('')
        console.log(`Minor - releasing ${version}`)

        // create the release and return
        await createRelease(version) 
        return
    } catch (error) {
        console.log(error.message)
    }
}

async function createRelease(ver) {

    console.log(`Creating release...`)

    const { body } = pr
    const tagCreateResponse = await client.repos.createRelease({
        owner, 
        repo,
        tag_name: ver,
        name: ver,
        body
    })

    console.log('Release created', JSON.stringify(tagCreateResponse, null, 4))
}

async function getLastTag() {

    // fetch tags
    await _exec('git fetch --prune --unshallow --tags')

    // get the last tag sha
    const previousTagSha = (await _exec('git rev-list --tags --topo-order --max-count=1')).stdout.trim()

    // get the last tag
    const tag = (await _exec(`git describe --tags ${previousTagSha}`)).stdout.trim()

    // return all the tag parts
    return tag.match(/(v)(\d+)(.)(\d+)(.)?(\d+)?/).slice(1).filter(item => item !== undefined)
}

async function _exec(command) {
    let stdout = ''
    let stderr = ''

    try {
        const options = {
            listeners: {
                stdout: (data) => {
                    stdout += data.toString()
                },
                stderr: (data) => {
                    stderr += data.toString()
                },
            },
        }

        const code = await exec(command, undefined, options)

        return {
            code,
            stdout,
            stderr,
        }
    } catch (err) {
        return {
            code: 1,
            stdout,
            stderr,
            error: err,
        }
    }
}