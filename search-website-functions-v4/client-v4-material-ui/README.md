# Client readme for running GitHub actions

This example front-end app is part of the [Add search to static web apps](https://learn.microsoft.com/azure/search/tutorial-javascript-overview) tutorial. This readme describes the YML files that run as GitHub actions when you deploy the client to Azure Static Web Apps.

## Azure Static Web Apps

When you create your static web app, it is deployed from _your fork_ of the GitHub repository. To deploy the app, the GitHub workflow file is created for you when you create your Azure Static Web App resource. Because the code is part of a repo with other apps, you need to configure the workflow file to understand where _just_ the front-end and back-end source code is within this repository. To help with that configuration, the following example GitHub action workflow file is provided. The properties related to the static web app deployment include:

* `app_location`: the location from the root of the repository to your front-end application code.
* `api_location`: the location from the root of the repository to your back-end application code.
* `build`: the location from the `app_location` to your generated front-end code.

```yaml
name: v4-swa-api-material-ui

on:
  workflow_dispatch:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
      - name: Build And Deploy
        id: builddeploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_GRAY_DESERT }}
          repo_token: ${{ secrets.GITHUB_TOKEN }} # Used for Github integrations (i.e. PR comments)
          action: "upload"
          ###### Repository/Build Configurations - These values can be configured to match your app requirements. ######
          # For more information regarding Static Web App workflow configurations, please visit: https://aka.ms/swaworkflowconfig
          app_location: "search-website-functions-v4/client-v4-material-ui" # App source code path
          api_location: "search-website-functions-v4/api-v4" # Api source code path - optional
          output_location: "build" # Built app content directory - optional
          ###### End of Repository/Build Configurations ######
        env:
          NPM_CONFIG_LEGACY_PEER_DEPS: true
      - name: Upload artifact
        uses: actions/upload-artifact@v3
        with:
          name: client-v4-no-bootstrap-${{ github.run_id }}-${{ github.run_number }}.zip
          path: search-website-functions-v4/client-v4-material-ui/build


  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Job
    steps:
      - name: Close Pull Request
        id: closepullrequest
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN_GRAY_DESERT }}
          action: "close"
```

## Front-end tests with Playwright

A few Playwright tests are provided with the front-end React application. You can run these manually with the scripts provided in the **package.json** file. When you want to include pipeline testing of the front-end application, the following sample GitHub workflow file is provided for you. 

```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]
jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: 18
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npx playwright test
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30

```