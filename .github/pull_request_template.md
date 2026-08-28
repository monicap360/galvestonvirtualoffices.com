## Outcome

Describe the user or operational outcome. Do not describe only the code change.

## Scope and protected behavior

- Files and systems intentionally changed:
- Existing customer, AI-agent, billing, and staff workflows that must remain unchanged:
- Out-of-scope systems:

## Security review

- [ ] No secret, token, private key, credential, customer document, or production data is committed.
- [ ] New or changed GitHub Actions use explicit least-privilege permissions.
- [ ] Third-party actions are pinned to immutable full commit SHAs.
- [ ] Pull-request jobs do not receive production secrets or write access.
- [ ] Authentication, authorization, ownership, tenant, billing, and staff-role boundaries were reviewed.
- [ ] Database/RPC/RLS changes include negative authorization tests and non-production replay evidence.
- [ ] Public inputs and AI-provider inputs are validated, bounded, and rate-limited where appropriate.
- [ ] Logs and errors do not expose secrets, prompts containing private data, or sensitive customer information.
- [ ] No production SQL, deployment, cron activation, external communication, charge, or irreversible action occurred unless explicitly listed below.

## Verification evidence

List exact commands, tests, workflow runs, route checks, and observed results. A missing or startup-failed CI run is unverified, not passing.

## Deployment and data impact

- Production deployment performed: No / Yes — details:
- Production database change performed: No / Yes — details:
- Secret or environment change performed: No / Yes — details:
- Customer/staff communication or charge performed: No / Yes — details:

## Rollback

State the exact revert, migration rollback, feature flag, or configuration restoration procedure.

## Remaining gates and unverified items

List every item that still prevents merge or production release.
