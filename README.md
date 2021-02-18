# GitHub Action: Process maven surefire reports

This action processes maven surefire or failsafe XML reports on pull requests and shows the result as a PR check with summary and annotations.

This action is a modified fork of [ScaCap/action-surefire-report](https://github.com/ScaCap/action-surefire-report)

## Inputs

### `report_paths`

Optional. [Glob](https://github.com/actions/toolkit/tree/master/packages/glob) expression to surefire or failsafe report paths. The default is `**/surefire-reports/TEST-*.xml`.

### `commit`

Optional. The commit sha to update the status. This is useful when you run it with `workflow_run`.

### `fail_on_test_failures`

Optional. Check will fail if there are test failures. The default is `false`.

### `fail_if_no_tests`

Optional. Check will fail if no tests were found. The default is `true`.

## Outputs

### `result`

The result of the maven test, it is either `success` or `failure`.

### `count`

The number of tests tested.

### `skipped`

The number of skipped tests.

### `failed`

The number of failed tests.

### `errorMessage`

The error messages for failed tests.

## Example usage

```yml
name: Build and Test

on:
  pull_request:
    branches: [ main ]
    
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v2
      - name: Build and Run Tests
        run: mvn test --batch-mode --fail-at-end
      - name: Gather Test Result
        if: always()
        uses: turing-pinhao/action-surefire-report@master
        id: test-result
      - name: Send result via Webhook
        if: always()
        uses: distributhor/workflow-webhook@v1
        env:
          webhook_url: ${{ secrets.WEBHOOK_URL }}
          webhook_secret: ${{ secrets.WEBHOOK_SECRET }}
          data: '{ "result": "${{ steps.test-result.outputs.result }}", "count": "${{ steps.test-result.outputs.count }}", "skipped": "${{ steps.test-result.outputs.skipped }}", "failed": "${{ steps.test-result.outputs.failed }}", "errorMessage": "${{ steps.test-result.outputs.errorMessage }}" }'
```
