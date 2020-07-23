# auto
GitHub actions that enable an automated CI/CD pipeline

![Test](https://github.com/STEM-C/auto/workflows/Test%20all%20actions/badge.svg) ![Build](https://github.com/STEM-C/auto/workflows/Build%20all%20actions/badge.svg)
<br/>

## Actions

### Review

Create and delete apps on a heroku pipeline
``` yaml
inputs:
  base:
    description: 'The base name of the app'
    required: true
  pipeline: 
    description: 'A heroku pipline id to add the new app to'
    required: true
  stage:
    description: 'A stage to add the app to'
    required: false
    default: 'development'
  token:
    description: 'API token of the heroku account'
    required: true
outputs:
  app_name: 
    description: 'The name of the app that is created'
  database_url:
    description: 'The postgresql url of the provisioned db'
```

### Tag

Automatically tags on pull requests into master

``` yaml
inputs:
  repo_token:
    required: true
    description: 'The GITHUB_TOKEN secret'
```

<br/>

## Contributing

### Dependencies

All dependencies are managed in a central `package.json`. Each action will be bundled individually and only include what they use

### Scripts

#### `yarn test`

> Runs on all PR to `develop` and `master`

Test all actions that have a `test.js` 

#### `yarn build`

> Runs on all pushes to `master`

Uses [ncc](https://www.npmjs.com/package/@zeit/ncc) to compile each action into its own `build/index.js` file

### Create an Action

> Official [actions](https://docs.github.com/en/actions/creating-actions) documentation

1. Create a new folder `<your action name>` in the project root
2. Create `action.yml`, `handler.js`, and `test.js` files in your new folder
3. Setup the action to run `build/index.js` and fill out the other relevant fields in `action.yml` 

``` yaml
# auto/<your action name>/action.yml
name: ''
description: ''
inputs:
  input_name:
    description: ''
    required: true
outputs:
  output_name: 
    description: ''
runs:
  using: 'node12'
  main: 'build/index.js'
```

4. Create functionality in `handler.js` and write some tests in `test.js`
5. Merge your branch into `master`
6. Create a new release with an [incremental minor version](https://semver.org/)
7. Use your action in a [workflow](https://docs.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow)

``` yaml
- name: Use your action
  uses: STEM-C/auto/<your action name>@vX.X
```



