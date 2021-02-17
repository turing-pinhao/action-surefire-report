# GitHub Action: Process maven surefire reports

This action processes maven surefire or failsafe XML reports on pull requests and shows the result as a PR check with summary and annotations.

This action is a modified fork of [ScaCap/action-surefire-report](https://github.com/ScaCap/action-surefire-report)

## Inputs

### `github_token`

**Required**. Usually in form of `github_token: ${{ secrets.GITHUB_TOKEN }}`.

### `report_paths`

Optional. [Glob](https://github.com/actions/toolkit/tree/master/packages/glob) expression to surefire or failsafe report paths. The default is `**/surefire-reports/TEST-*.xml`.

### `check_name`

Optional. Check name to use when creating a check run. The default is `Test Report`.

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

The number of tests included in the test.

### `skipped`

The number of skipped tests.

### `failed`

The number of failed tests.

### `annotation`

The error messages for failed tests.

## Example usage

```yml
name: build
on:
  pull_request:

jobs:
  build:
    name: Build and Run Tests
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v1
      - name: Build and Run Tests
        run: mvn test --batch-mode --fail-at-end
      - name: Publish Test Report
        if: always()
        uses: turing-pinhao/action-surefire-report@v1
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```
