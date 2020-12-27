# actions
GitHub actions for repo automation

![Build and Tag](https://github.com/stream-monkey/actions/workflows/Build%20and%20Tag/badge.svg) ![Test all actions](https://github.com/stream-monkey/actions/workflows/Test%20all%20actions/badge.svg)

<br/>


## Tag

Automatically create a release and tag on merged pull requests

### Inputs

``` yaml
repo_token:
  required: true
  description: 'The GITHUB_TOKEN secret'
```

### Use

``` yaml
# ./github/workflows/tag.yml

name: Tag
on:
  pull_request:
    branches: [ master ]
    types: [ closed ]
jobs:
  tag-master:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Tag Master
        uses: nionata/actions/tag@vX.X
        with:
          repo_token: "${{ secrets.GITHUB_TOKEN }}"
```

The release and tag are dependent on the pull request. The tag follows [semantic versioning](https://semver.org/), `vMAJOR.MINOR.PATCH`, and gets generated based on the title:

1. if it includes `hotfix`, it will increment the patch version of the last tag
2. if it includes a version `vX.X` or `vX.X.X`, it will use that
3. else, it will increment the minor version

Once the tag is generated, the action will create a release with the tag and the pull request body.

<br/>

## Contributing

### Dependencies

All dependencies are managed in a central `package.json`. Each action will be bundled individually and only include what they use

### Scripts

#### `yarn test`

> Runs on all PR to `master`

Test all actions that have a `test.js` 

#### `yarn build`

> Runs on all PRs merged into `master`

Uses [ncc](https://www.npmjs.com/package/@zeit/ncc) to compile each javascript based action into its own `build/index.js` file

### Create an Action

> Official [actions](https://docs.github.com/en/actions/creating-actions) documentation

1. Create a new folder `<your action name>` in the project root
2. Create `action.yml`, `handler.js`, and `test.js` files in your new folder
3. Setup the action to run `build/index.js` and fill out the other relevant fields in `action.yml` 

``` yaml
# actions/<your action name>/action.yml
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
  uses: nionata/actions/<your action name>@vX.X
```



