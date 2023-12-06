// import * as fetch from "node-fetch";
import { RequestInfo, RequestInit } from "node-fetch";
const fetch = (url: RequestInfo, init?: RequestInit) => import("node-fetch").then(({ default: fetch }) => fetch(url, init));
import { logger } from './logger';

// Function to trigger GitHub Actions workflow
export async function triggerWorkflow() {
    const repoOwner = 'manafasif';
    const repoName = 'hans-wehr-cloud-logger';
    const workflowName = 'build_push_docker.yml';  // Replace with the actual name of your workflow

    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/actions/workflows/${workflowName}/dispatches`;

    const githubToken = 'your-github-token';  // Replace with a valid GitHub token with workflow scope

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${githubToken}`,
    };

    const requestBody = {
        ref: 'main',  // Replace with the branch where your workflow is defined
        inputs: {
            // Add any additional inputs that your workflow might need
        },
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers,
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            logger.info('Workflow triggered successfully.');
        } else {
            logger.error('Failed to trigger workflow:', await response.text());
        }
    } catch (error: any) {
        logger.error('Error triggering workflow:', error.message);
    }
}

// // Call the function to trigger the workflow
// triggerWorkflow();
