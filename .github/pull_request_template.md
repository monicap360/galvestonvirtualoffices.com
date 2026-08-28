## Purpose

Describe the customer or operational problem and the exact scope of this change.

## Security and tenant impact

- Customer projects, tenant data, staff, AI agents, uploads, or billing touched: <!-- none / describe -->
- Authorization or tenant boundary changed: <!-- no / describe -->
- External actions, webhooks, secrets, or deployment changed: <!-- no / describe -->
- Database or RLS changed: <!-- no / migration and non-production evidence -->

## Verification evidence

- [ ] Tests added or updated for the changed behavior
- [ ] Negative authorization tests cover anonymous, wrong-user, wrong-role, and wrong-tenant access where applicable
- [ ] Lint, type-check, and production Next.js build pass
- [ ] No real customer data, prompts, documents, or production secrets were used in tests
- [ ] Logs and errors do not expose credentials or tenant information

## Rollout and rollback

State the deployment order, required configuration, monitoring signal, and exact rollback procedure.

- [ ] No direct push, production SQL, secret rotation, workflow activation, or deployment is included without explicit approval
- [ ] Public-repository exposure was considered for every added file
- [ ] CODEOWNER review is required for sensitive paths
