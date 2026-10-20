# Security Policy

## Supported version

Security fixes are developed against the current default branch unless a repository owner explicitly designates another supported release.

## Reporting a vulnerability

Do not open a public issue containing a vulnerability, credential, access token, customer record, payment information, AI-provider data, private document, or reproducible exploit.

Use GitHub's private **Report a vulnerability** option when it is available for this repository. If private vulnerability reporting is not available, contact the repository owner through the established private business channel and include only the minimum information needed to begin a secure review.

A useful report contains:

- the affected repository, route, workflow, function, integration, or component;
- the security impact;
- safe reproduction steps using non-production or synthetic data;
- required preconditions;
- whether credentials, customer data, billing, or connected systems may have been exposed; and
- a private method for follow-up.

## Testing boundaries

Do not access, alter, export, delete, or disclose production customer, staff, financial, AI-agent configuration, prompt, integration, or document data. Do not send communications, trigger charges, connect external systems, rotate credentials, run production SQL, change DNS, or test denial-of-service behavior without explicit written authorization from the repository owner.

## Response process

The owner will validate the report privately, contain any active exposure, prepare a reviewed fix and rollback procedure, verify it outside production when feasible, and coordinate release and credential rotation when required. Public disclosure must wait until remediation and customer-protection actions are complete.
