# Security Policy

## Private vulnerability reports

Do not publish vulnerabilities, credentials, customer project details, business documents, prompts containing confidential information, payment data, access tokens, or working exploits in a public issue or pull request. This repository is public, so anything committed or posted may be copied immediately.

Use GitHub private vulnerability reporting when available. Otherwise contact `info@cruisesfromgalveston.net` with the subject `PRIVATE SECURITY REPORT — GVO`.

Include the affected component, impact, required access, safe reproduction steps using test data, and the relevant commit. Do not access, alter, download, or retain real customer or tenant data.

## Prohibited testing

Do not submit real customer forms, trigger AI-agent actions, send messages, create paid resources, alter tenant projects, initiate payments, rotate credentials, or test production availability.

## Required change controls

Changes to authentication, authorization, tenant isolation, AI-agent execution, billing, uploads, webhooks, API routes, deployment workflows, or secrets require a pull request, passing checks, CODEOWNER approval, rollback instructions, and tests showing that one customer cannot access or modify another customer's data.

## Credential exposure

Treat any credential committed to Git, pasted into an issue, printed in CI, or placed in a URL as compromised. Remove the exposure path and rotate the credential at its issuing service. Never place the replacement value in repository history.
