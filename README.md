# auto
GitHub actions that enable an automated CI/CD pipeline

![](https://github.com/STEM-C/auto/workflows/Test%20and%20build%20actions/badge.svg)
<br/>

## Review
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

