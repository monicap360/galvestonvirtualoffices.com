# AI Agent Customization Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a premium AI Agent Customization Studio where all ten AI products are prebuilt, customizable, previewable, readiness-scored, purchasable through the existing service-order flow, and manageable from a new My AI Agents dashboard.

**Architecture:** Keep `services` as the canonical product catalog and `service_orders` as the canonical customer ownership/subscription record. Add a typed template registry and Zod normalization layer keyed by service slug, then build shared studio UI and server actions that write only validated configuration into `service_orders.config`. Reuse `/api/ai-demo` for preview and keep all connection state truthful; Phase 1 does not create third-party integrations.

**Tech Stack:** Next.js 16, React 19, TypeScript, Supabase, Zod 4, Anthropic SDK, Tailwind CSS, Node 22 test scripts.

**Spec:** `docs/superpowers/specs/2026-08-26-ai-agent-customization-studio-design.md`

## Global Constraints

- Preserve the existing `services` catalog and `service_orders` ownership model; do not create a duplicate commerce system.
- Store AI customization only in versioned `service_orders.config` with server-controlled `schema_version = 1`.
- Never accept customer-submitted price, tenant, user, role, status, or trusted connection state.
- Never render a provider, phone number, calendar, CRM, ordering platform, ticketing system, or other integration as `connected` unless canonical backend state says it is connected.
- `Active` is an operational order status, not a readiness score.
- Keep the existing `/api/ai-demo` route as the preview engine.
- All ten intended AI products must have a customization template.
- No new database table in Phase 1 unless an implementation blocker proves it necessary.
- Follow TDD: each task begins with a failing regression test and ends with fresh passing verification.
- Maintain accessibility, mobile usability, and truthful billing language.

---

### Task 1: Typed AI Agent Template Registry

**Files:**
- Create: `src/lib/ai-studio/types.ts`
- Create: `src/lib/ai-studio/templates.ts`
- Test: `scripts/tests/ai-agent-template-coverage.test.mjs`

**Interfaces:**
- Produces `AgentTemplate`, `AgentField`, `AgentSection`, `ConnectionRequirement` types.
- Produces `AGENT_TEMPLATES`, `getAgentTemplate(slug)`, and `AI_AGENT_SLUGS` for all later tasks.

- [ ] **Step 1: Write the failing registry coverage test**

Create `scripts/tests/ai-agent-template-coverage.test.mjs` that imports or inspects the registry and asserts exact coverage for:

```js
const expected = [
  "ai-appointment-setter-email",
  "ai-phone-line",
  "ai-restaurant-host",
  "ai-tour-seller",
  "ai-airbnb-reservations",
  "ai-event-promoter",
  "ai-schedule-filler",
  "ai-marketing-manager",
  "ai-legal-intake",
  "ai-dental-front-desk",
];
```

Also assert each template has non-empty `sections`, `samplePrompts`, and at least one blocking field.

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
node scripts/tests/ai-agent-template-coverage.test.mjs
```

Expected: FAIL because the registry does not exist.

- [ ] **Step 3: Implement the shared types**

Create `src/lib/ai-studio/types.ts` with explicit unions for field types and connection state:

```ts
export type AgentFieldType = "text" | "textarea" | "url" | "number" | "select" | "multiselect" | "toggle" | "time";
export type ConnectionState = "not_connected" | "needs_setup" | "connected";

export type AgentField = {
  key: string;
  label: string;
  type: AgentFieldType;
  description?: string;
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  required?: boolean;
  readinessWeight?: number;
  maxLength?: number;
};

export type AgentSection = {
  id: string;
  title: string;
  description: string;
  fields: AgentField[];
};

export type ConnectionRequirement = {
  key: string;
  label: string;
  description: string;
  blocking: boolean;
};

export type AgentTemplate = {
  slug: string;
  vertical: string;
  defaultDisplayName: string;
  sections: AgentSection[];
  connections: ConnectionRequirement[];
  samplePrompts: string[];
  complianceNote?: string;
};
```

- [ ] **Step 4: Implement all ten templates**

Create `src/lib/ai-studio/templates.ts` and define vertical-specific sections exactly from the approved spec. Use these canonical slugs:

```ts
export const AI_AGENT_SLUGS = [
  "ai-appointment-setter-email",
  "ai-phone-line",
  "ai-restaurant-host",
  "ai-tour-seller",
  "ai-airbnb-reservations",
  "ai-event-promoter",
  "ai-schedule-filler",
  "ai-marketing-manager",
  "ai-legal-intake",
  "ai-dental-front-desk",
] as const;
```

`getAgentTemplate(slug)` must return `null` for unsupported slugs.

- [ ] **Step 5: Run the coverage test and verify GREEN**

```bash
node scripts/tests/ai-agent-template-coverage.test.mjs
```

Expected: `ai-agent-template-coverage: ok`.

- [ ] **Step 6: Commit**

```bash
git add src/lib/ai-studio/types.ts src/lib/ai-studio/templates.ts scripts/tests/ai-agent-template-coverage.test.mjs
git commit -m "feat: add AI agent template registry"
```

---

### Task 2: Versioned Config Normalization and Readiness Engine

**Files:**
- Create: `src/lib/ai-studio/config.ts`
- Test: `scripts/tests/ai-agent-config.test.mjs`

**Interfaces:**
- Consumes `getAgentTemplate(slug)` from Task 1.
- Produces `normalizeAgentConfig(slug, raw)`, `computeAgentReadiness(slug, config)`, `buildPreviewSummary(slug, config)`, and `AgentConfigV1`.

- [ ] **Step 1: Write failing config tests**

The regression must prove:

```js
// valid fields survive
// unknown keys are stripped
// schema_version is always 1
// protected keys like price/status/user_id are dropped
// invalid URLs reject
// connection values cannot self-promote to connected
// readiness is deterministic for the same config
```

- [ ] **Step 2: Run and verify RED**

```bash
node scripts/tests/ai-agent-config.test.mjs
```

Expected: FAIL because the config module does not exist.

- [ ] **Step 3: Implement the canonical config shape**

Use:

```ts
export type AgentConfigV1 = {
  schema_version: 1;
  business: {
    name: string;
    industry: string;
    website?: string;
    timezone: string;
  };
  identity: {
    display_name: string;
    tone: "warm-professional" | "friendly" | "direct" | "luxury";
    languages: string[];
    greeting?: string;
  };
  capabilities: Record<string, string | number | boolean | string[]>;
  connections: Record<string, { state: "not_connected" | "needs_setup" | "connected" }>;
  setup: {
    readiness: number;
    blocking_items: string[];
    recommended_items: string[];
  };
};
```

`connected` must only survive normalization when supplied from a trusted server-side existing config merge; public form input is always downgraded to `needs_setup` or `not_connected`.

- [ ] **Step 4: Implement Zod validation keyed by template fields**

Validate URL fields with `z.string().url()`, clamp text using each field's `maxLength`, enforce enum/select options, and strip unknown keys.

- [ ] **Step 5: Implement deterministic readiness**

Required blocking fields contribute 80% of the score and recommended fields/connections contribute 20%. Return:

```ts
{
  score,
  label: score < 40 ? "Setup Needed" : score < 80 ? "Almost Ready" : score < 100 ? "Ready to Review" : "Ready",
  blockingItems,
  recommendedItems,
}
```

- [ ] **Step 6: Implement preview summary**

`buildPreviewSummary` returns a short sanitized text block containing only customer-entered business identity, tone, greeting, and configured capability rules. It must append a sentence that unconnected systems are not live.

- [ ] **Step 7: Run tests and verify GREEN**

```bash
node scripts/tests/ai-agent-config.test.mjs
```

Expected: `ai-agent-config: ok`.

- [ ] **Step 8: Commit**

```bash
git add src/lib/ai-studio/config.ts scripts/tests/ai-agent-config.test.mjs
git commit -m "feat: validate AI agent configuration"
```

---

### Task 3: Canonical Create and Update Server Actions

**Files:**
- Create: `src/app/ai-studio/actions.ts`
- Modify: `src/app/orders/actions.ts`
- Test: `scripts/tests/ai-agent-actions.test.mjs`

**Interfaces:**
- Consumes `normalizeAgentConfig` and `computeAgentReadiness`.
- Produces `createAiAgentOrder(formData)` and `updateAiAgentConfig(formData)`.

- [ ] **Step 1: Write failing server-action contract tests**

Assert the source contains ownership enforcement and refuses client-controlled protected fields. The test must prove the create action:

```text
1. requires an authenticated profile
2. loads the service by slug/id and category ai_product
3. normalizes config server-side
4. inserts one service_orders row
5. never trusts price/status/tenant/user from FormData
```

The update action must require `.eq("user_id", profile.id)` or equivalent ownership verification before update.

- [ ] **Step 2: Run and verify RED**

```bash
node scripts/tests/ai-agent-actions.test.mjs
```

- [ ] **Step 3: Implement `createAiAgentOrder`**

Expected input fields:

```text
service_id
service_slug
config_json
```

Server loads `services(id, slug, category, base_price_cents, interval)` and rejects non-`ai_product` services. Insert config from `normalizeAgentConfig`; do not allow service ID mismatch between submitted slug and loaded row.

Use truthful status semantics: if the current order flow cannot auto-activate billing, store the existing safe canonical status and redirect to the owned agent page rather than claiming payment is active.

- [ ] **Step 4: Implement `updateAiAgentConfig`**

Load order with service slug and ownership, merge the trusted existing connection states with normalized editable values, recompute readiness, then update only `config` and a safe `updated_at` field if present.

- [ ] **Step 5: Keep non-AI `orderService` behavior unchanged**

Do not fork unrelated service ordering. If useful, add a narrow guard so `ai_product` cards use the new action while existing marketing/web service flows continue through `orderService`.

- [ ] **Step 6: Run tests and verify GREEN**

```bash
node scripts/tests/ai-agent-actions.test.mjs
```

Expected: `ai-agent-actions: ok`.

- [ ] **Step 7: Commit**

```bash
git add src/app/ai-studio/actions.ts src/app/orders/actions.ts scripts/tests/ai-agent-actions.test.mjs
git commit -m "feat: add canonical AI agent actions"
```

---

### Task 4: Premium Marketplace Upgrade

**Files:**
- Modify: `src/app/ai-studio/page.tsx`
- Create: `src/app/ai-studio/agent-card.tsx`
- Modify: `src/app/ai-studio/agent-try.tsx`
- Test: `scripts/tests/ai-studio-marketplace.test.mjs`

**Interfaces:**
- Consumes canonical service rows and `getAgentTemplate`.
- Produces premium marketplace cards linking to `/ai-studio/[slug]/customize`.

- [ ] **Step 1: Write failing marketplace test**

Assert:

```text
Customize & Subscribe
Try live demo
/ai-studio/${slug}/customize
no direct one-field business-name subscribe form remains on the marketplace card
```

- [ ] **Step 2: Run and verify RED**

```bash
node scripts/tests/ai-studio-marketplace.test.mjs
```

- [ ] **Step 3: Extract `AgentCard`**

Use a dark premium glass panel with restrained glow, status pulse for demo availability, price, six capability bullets, and two clear actions. Preserve keyboard/focus states.

- [ ] **Step 4: Update marketplace hero copy**

Use concise product language:

```text
Choose a prebuilt AI employee. Customize how it works for your business. Preview it before you activate.
```

Avoid claims that unbuilt integrations are already connected.

- [ ] **Step 5: Run test and verify GREEN**

```bash
node scripts/tests/ai-studio-marketplace.test.mjs
```

- [ ] **Step 6: Commit**

```bash
git add src/app/ai-studio/page.tsx src/app/ai-studio/agent-card.tsx src/app/ai-studio/agent-try.tsx scripts/tests/ai-studio-marketplace.test.mjs
git commit -m "feat: upgrade AI Studio marketplace"
```

---

### Task 5: Shared Cinematic Customization Studio

**Files:**
- Create: `src/app/ai-studio/[slug]/customize/page.tsx`
- Create: `src/app/ai-studio/studio/agent-studio.tsx`
- Create: `src/app/ai-studio/studio/readiness-meter.tsx`
- Create: `src/app/ai-studio/studio/connection-tile.tsx`
- Create: `src/app/ai-studio/studio/field-renderer.tsx`
- Test: `scripts/tests/ai-agent-studio-ui.test.mjs`

**Interfaces:**
- Consumes `AgentTemplate`, `normalizeAgentConfig`, and create/update actions.
- Produces one shared client studio usable before purchase and for owned-agent editing.

- [ ] **Step 1: Write failing UI contract test**

Assert the customization route includes:

```text
Agent Identity
Capabilities
Connections
Readiness
Preview
Customize & Continue
```

Assert unknown slugs use `notFound()`.

- [ ] **Step 2: Run and verify RED**

```bash
node scripts/tests/ai-agent-studio-ui.test.mjs
```

- [ ] **Step 3: Implement the server route**

Load service by slug, require category `ai_product`, load template, and pass service + template + initial config into the client studio. Do not require purchase merely to customize; require authentication when persisting/subscribing.

- [ ] **Step 4: Implement the studio shell**

Use a responsive two-column desktop layout:

```text
left: section navigation + editable controls
right: sticky agent identity, readiness ring, connection summary, preview
```

On mobile, stack sections and use a sticky bottom primary action.

- [ ] **Step 5: Implement dynamic field rendering**

Map registry field types to existing `.input`/button styles. Keep labels, descriptions, max lengths, and option constraints visible.

- [ ] **Step 6: Implement readiness meter and connection tiles**

Connection tiles can show only `Not connected`, `Needs setup`, or `Connected`. No provider logo or success styling implies connection unless canonical state is `connected`.

- [ ] **Step 7: Implement live local readiness recalculation**

Every field change updates readiness immediately in the client using the same deterministic rules as the server implementation.

- [ ] **Step 8: Run test and verify GREEN**

```bash
node scripts/tests/ai-agent-studio-ui.test.mjs
```

- [ ] **Step 9: Commit**

```bash
git add src/app/ai-studio/[slug]/customize/page.tsx src/app/ai-studio/studio scripts/tests/ai-agent-studio-ui.test.mjs
git commit -m "feat: build AI agent customization studio"
```

---

### Task 6: Configured Live Preview

**Files:**
- Modify: `src/app/api/ai-demo/route.ts`
- Modify: `src/app/ai-studio/studio/agent-studio.tsx`
- Create: `src/app/ai-studio/studio/preview-panel.tsx`
- Test: `scripts/tests/ai-agent-preview.test.mjs`

**Interfaces:**
- Consumes sanitized preview summary from Task 2.
- Produces a `Preview` panel using the existing Anthropic-backed `/api/ai-demo` route.

- [ ] **Step 1: Write failing preview regression**

Assert the route accepts an optional `configurationSummary` field that is length-clamped and appended to the system context with a warning that unconnected systems are not live.

- [ ] **Step 2: Run and verify RED**

```bash
node scripts/tests/ai-agent-preview.test.mjs
```

- [ ] **Step 3: Extend the API request body safely**

Add:

```ts
configurationSummary?: string;
```

Clamp to a fixed maximum such as 3000 characters before adding it to the system prompt.

- [ ] **Step 4: Build `PreviewPanel`**

The panel must label itself `Preview`, display three sample prompts from the template, and call `/api/ai-demo` with the current agent metadata and sanitized configuration summary.

- [ ] **Step 5: Preserve missing-key and auth errors**

Do not weaken existing Anthropic key checks. Keep the current 503/429/502 behavior truthful.

- [ ] **Step 6: Run test and verify GREEN**

```bash
node scripts/tests/ai-agent-preview.test.mjs
```

- [ ] **Step 7: Commit**

```bash
git add src/app/api/ai-demo/route.ts src/app/ai-studio/studio/agent-studio.tsx src/app/ai-studio/studio/preview-panel.tsx scripts/tests/ai-agent-preview.test.mjs
git commit -m "feat: preview configured AI agents"
```

---

### Task 7: My AI Agents Dashboard

**Files:**
- Create: `src/app/dashboard/agents/page.tsx`
- Create: `src/app/dashboard/agents/[orderId]/page.tsx`
- Create: `src/app/dashboard/agents/agent-status-card.tsx`
- Modify: `src/components/site-nav.tsx` or dashboard navigation component actually used by the authenticated shell
- Test: `scripts/tests/my-ai-agents-dashboard.test.mjs`

**Interfaces:**
- Consumes `service_orders`, `services`, and config/readiness helpers.
- Produces owned-agent overview and owned-mode customization entry points.

- [ ] **Step 1: Write failing dashboard test**

Assert the dashboard query filters owned `service_orders` joined to `services(category = ai_product)` and exposes:

```text
My AI Agents
Customize
Preview
Connections
Setup Needed / Almost Ready / Ready to Review / Ready
```

- [ ] **Step 2: Run and verify RED**

```bash
node scripts/tests/my-ai-agents-dashboard.test.mjs
```

- [ ] **Step 3: Implement overview query**

Require profile, query only the current customer's AI-product orders, compute readiness from stored config, and render one `AgentStatusCard` per order.

- [ ] **Step 4: Implement owned-agent route**

Require ownership by both `orderId` and `profile.id`; load service/template/config; render the shared Agent Studio in owned/edit mode using `updateAiAgentConfig`.

- [ ] **Step 5: Add navigation entry**

Expose `My AI Agents` in the authenticated dashboard navigation without removing `/dashboard/orders` for non-AI services.

- [ ] **Step 6: Run test and verify GREEN**

```bash
node scripts/tests/my-ai-agents-dashboard.test.mjs
```

- [ ] **Step 7: Commit**

```bash
git add src/app/dashboard/agents src/components/site-nav.tsx scripts/tests/my-ai-agents-dashboard.test.mjs
git commit -m "feat: add My AI Agents dashboard"
```

---

### Task 8: Product-Slug Alignment and Data Integrity

**Files:**
- Modify: `supabase/migrations/0006_focused_ai_agents.sql` only if current canonical slugs differ from the registry
- Modify: `supabase/migrations/0007_phone_line_and_retire_vas.sql` only if needed for canonical phone-line slug
- Create: `supabase/migrations/0010_ai_agent_slug_alignment.sql` if live canonical slugs require additive correction
- Test: `scripts/tests/ai-agent-slug-integrity.test.mjs`

**Interfaces:**
- Ensures live `services.slug` values align exactly with the template registry.

- [ ] **Step 1: Query live GVO AI-product slugs read-only**

Use Supabase SQL:

```sql
select slug, name, active
from public.services
where category = 'ai_product'
order by slug;
```

- [ ] **Step 2: Write failing integrity test for any mismatch**

The expected active set must equal the registry set, with no duplicate active AI products for the same intended agent.

- [ ] **Step 3: Apply the smallest additive migration if required**

Prefer updating the slug/name of the existing service row rather than inserting a duplicate service. Preserve IDs so existing `service_orders.service_id` references remain valid.

- [ ] **Step 4: Verify live slugs after migration**

Re-run the SQL and confirm exact set equality.

- [ ] **Step 5: Run integrity test and verify GREEN**

```bash
node scripts/tests/ai-agent-slug-integrity.test.mjs
```

- [ ] **Step 6: Commit**

```bash
git add supabase/migrations scripts/tests/ai-agent-slug-integrity.test.mjs
git commit -m "fix: align AI agent service slugs"
```

---

### Task 9: End-to-End Regression and Build Verification

**Files:**
- Modify: `package.json`
- Test: all `scripts/tests/ai-agent-*.test.mjs` and `scripts/tests/my-ai-agents-dashboard.test.mjs`

**Interfaces:**
- Produces one repeatable `test:ai-studio` command and final build evidence.

- [ ] **Step 1: Add a focused test script**

Add to `package.json`:

```json
"test:ai-studio": "node scripts/tests/ai-agent-template-coverage.test.mjs && node scripts/tests/ai-agent-config.test.mjs && node scripts/tests/ai-agent-actions.test.mjs && node scripts/tests/ai-studio-marketplace.test.mjs && node scripts/tests/ai-agent-studio-ui.test.mjs && node scripts/tests/ai-agent-preview.test.mjs && node scripts/tests/my-ai-agents-dashboard.test.mjs && node scripts/tests/ai-agent-slug-integrity.test.mjs"
```

- [ ] **Step 2: Run focused regressions**

```bash
npm run test:ai-studio
```

Expected: all scripts print `: ok` and exit 0.

- [ ] **Step 3: Run lint**

```bash
npm run lint
```

Expected: exit 0 with no errors.

- [ ] **Step 4: Run production build**

```bash
npm run build
```

Expected: Next.js production build exits 0.

- [ ] **Step 5: Verify git scope**

```bash
git diff --stat main...HEAD
git status --short
```

Confirm no unrelated reservation, office-photo, desk-pricing, or non-AI product changes entered the branch.

- [ ] **Step 6: Commit**

```bash
git add package.json
git commit -m "test: add AI Studio regression suite"
```

---

### Task 10: Pull Request and Deployment Verification

**Files:**
- No source changes unless verification finds a defect.

**Interfaces:**
- Produces a reviewable PR and accurate deployment status.

- [ ] **Step 1: Compare branch to current main**

Confirm `behind_by = 0` or update safely before PR.

- [ ] **Step 2: Open a focused PR**

PR body must list:

```text
- 10-agent typed template registry
- canonical config validation and readiness scoring
- cinematic customization studio
- configured AI preview
- canonical create/update ownership actions
- My AI Agents dashboard
- truthful connection-state handling
- live slug alignment if needed
- focused test/lint/build evidence
```

- [ ] **Step 3: Inspect GitHub Actions honestly**

If Actions jobs fail before executing steps, report them as zero-step infrastructure failures rather than code failures or passes.

- [ ] **Step 4: Merge only after final scope and build review**

Use expected-head-SHA protection when merging.

- [ ] **Step 5: Verify deployed behavior**

After Render deploys `main`, verify:

```text
/ai-studio shows premium cards and Customize & Subscribe
customization route loads all ten templates
readiness changes when required fields are completed
Preview uses the configured business context
owned AI order appears in /dashboard/agents
unconnected providers never render as connected
```

