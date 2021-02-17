const core = require('@actions/core');
const github = require('@actions/github');
const { parseTestReports } = require('./utils.js');

const action = async () => {
    const reportPaths = core.getInput('report_paths').split(',').join('\n');
    core.info(`Going to parse result form ${reportPaths}`);
    const githubToken = core.getInput('github_token');
    const name = core.getInput('check_name');
    const commit = core.getInput('commit');
    const failOnFailedTests = core.getInput('fail_on_test_failures') === 'true';
    const failIfNoTests = core.getInput('fail_if_no_tests') === 'true';

    let { count, skipped, annotations } = await parseTestReports(reportPaths);
	
    const foundResults = count > 0 || skipped > 0;
    const title = foundResults
        ? `${count} tests run, ${skipped} skipped, ${annotations.length} failed.`
        : 'No test result found!';
    core.info(`Result: ${title}`);

    const pullRequest = github.context.payload.pull_request;
    const link = (pullRequest && pullRequest.html_url) || github.context.ref;
    const testResult =
        (foundResults && annotations.length === 0) || (!foundResults && !failIfNoTests)
            ? 'success'
            : 'failure';
    const status = 'completed';
    const head_sha = commit || (pullRequest && pullRequest.head.sha) || github.context.sha;
    core.info(
        `Posting status '${status}' with result '${testResult}' to ${link} (sha: ${head_sha})`
    );

    const errorMessages = [];
    for(const annotation of annotations){
        errorMessages.push(`${annotation.path}:${annotation.start_line} -> ${annotation.message.replace(/\n/g, ' ')}`);
    }


    // outputs
    core.setOutput('result', testResult);
    core.setOutput('count', count);
    core.setOutput('skipped', skipped);
    core.setOutput('failed', errorMessages.length);
    if(errorMessages.length === 0)
    {
        core.setOutput('errorMessage', 'All test passed, not error message');
    }
    else
    {
        core.setOutput('errorMessage', errorMessages.join(' | '));
    }    

    // optionally fail the action if tests fail
    if (failOnFailedTests && testResult !== 'success') {
        core.setFailed(`Check FailOnFailedTests is enabled, there were ${errorMessages.length} failed tests`);
    }
};

module.exports = action;
