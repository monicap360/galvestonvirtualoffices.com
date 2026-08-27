# AI Agent Customization Studio Design

## Product goal

Turn Galveston Virtual Offices AI Studio into a premium AI-agent marketplace where every listed service is already prebuilt, immediately understandable, demoable, purchasable, and customizable to the customer's business without creating a second commerce or order system.

The desired customer reaction is: this feels more advanced, more polished, and more operationally useful than a conventional website-builder or small-business SaaS marketplace. The customer should feel that they are activating a capable digital employee, not filling out a generic intake form.

## Existing foundation to preserve

The current platform already has the correct core primitives:

- `services` contains the AI products, names, pricing, descriptions, features, categories, and active state.
- AI Studio reads `services` where `category = 'ai_product'`.
- `service_orders` is the canonical customer purchase/subscription record.
- `service_orders.config` already stores free-form customer customization values.
- `orderService` is the canonical creation path for service orders.
- The customer dashboard already exposes service orders under `/dashboard/orders`.
- The current live-demo route is `/api/ai-demo` and already supports role-specific AI Studio demos.

No second product table, second subscription system, or duplicate customer-order model will be introduced.

## Experience principles

1. **Prebuilt first, customizable second.** Every agent ships with a useful default workflow and defaults that make sense for its vertical.
2. **High-tech without being confusing.** Visual polish should communicate capability and confidence; controls remain readable and task-oriented.
3. **Progressive disclosure.** Customers answer the small number of questions needed to get value first, then can refine advanced settings later.
4. **Live feedback.** The interface should visibly react as the customer configures an agent: readiness score, capability status, sample responses, and integration state update in real time.
5. **No fake connected behavior.** A connector, phone number, calendar, CRM, ordering platform, or channel must never be shown as connected unless it actually is. Unconnected features are labeled as setup items.
6. **Canonical commerce.** Purchases and subscriptions continue through `service_orders` and existing invoice/subscription behavior.
7. **Customer ownership.** Customers can return later and edit their agent configuration without creating a new service order.

## Primary customer journey

### 1. Discover

The AI Studio marketplace presents the ten active agent products as premium cards. Each card includes:

- agent name
- concise vertical-specific promise
- monthly price
- six capability bullets
- live status indicator for the demo
- `Try live demo`
- `Customize & Subscribe`

The card should feel like a product activation surface, not a brochure. Visual treatment may include subtle motion, glass panels, animated status pulses, compact capability chips, and strong spacing, but must remain fast and accessible.

### 2. Demo

`Try live demo` opens the existing role-play demo in a polished panel. The demo continues to use the canonical `/api/ai-demo` route.

The demo can use the prospect's entered business name when available, but it must not imply access to the prospect's real business systems, calendar, CRM, phone, ordering provider, or customer database unless those are actually connected later.

### 3. Customize

`Customize & Subscribe` opens a dedicated customization experience for the chosen service, conceptually an "Agent Studio".

The studio has four visible zones:

- **Agent identity:** agent name, business name, tone, languages, greeting, brand voice.
- **Capabilities:** vertical-specific settings and behavioral rules.
- **Connections:** calendar, email, phone, CRM, ordering, booking, ticketing, or other providers relevant to that agent. Initially these are setup requirements or links, not fabricated integrations.
- **Readiness:** a clear score from 0–100 with blocking and non-blocking setup items.

The studio should provide a persistent preview pane showing how the agent will answer or behave based on the current configuration.

### 4. Subscribe

The customer reviews:

- agent name
- monthly price
- included capabilities
- customized settings summary
- any unconnected required systems

Submitting uses the existing `orderService` flow and stores the normalized customization object in `service_orders.config`.

For recurring AI products, the order remains the canonical subscription/service record. The implementation must not silently claim billing is active if the existing billing path does not actually collect payment.

### 5. Operate

The dashboard is upgraded from a plain order list to **My AI Agents**.

Each subscribed AI product shows:

- agent/product name
- customer business name
- status: `Setup Needed`, `Ready`, `Active`, `Paused`, or existing compatible canonical status
- readiness percentage
- last updated time
- top uncompleted setup item, if any
- buttons: `Customize`, `Preview`, `Connections`

The canonical `service_orders` row remains the source of ownership and status.

## Canonical configuration model

The customization data remains in `service_orders.config`. To avoid arbitrary unstructured drift, AI-product configs use a versioned object:

```json
{
  "schema_version": 1,
  "business": {
    "name": "Example Business",
    "industry": "restaurant",
    "website": "https://example.com",
    "timezone": "America/Chicago"
  },
  "identity": {
    "display_name": "Ava",
    "tone": "warm-professional",
    "languages": ["en"],
    "greeting": "Thanks for calling Example Business. How can I help?"
  },
  "capabilities": {},
  "connections": {},
  "setup": {
    "readiness": 0,
    "blocking_items": [],
    "recommended_items": []
  }
}
```

The exact `capabilities` and `connections` keys vary by service slug. Unknown keys are ignored by the UI rather than interpreted as trusted configuration.

## Agent-specific customization

### AI Appointment Setter (Email)

Defaults and editable fields:

- business name
- services/products being sold
- ideal lead/customer
- sender tone and style
- qualification questions
- meeting length
- calendar destination
- business hours
- follow-up cadence
- maximum follow-up attempts
- stop conditions
- CRM destination/setup status

Readiness blockers: business identity, scheduling destination, qualification rules.

### AI Phone Line & Auto-Attendant

- business name
- greeting
- business hours
- after-hours response
- departments/routing labels
- appointment or order behavior
- escalation contact
- FAQ knowledge
- English/Spanish toggle
- phone-number provisioning status

Readiness blockers: greeting, routing/escalation rule, phone setup.

### AI Restaurant Host & To-Go

- restaurant name
- hours
- location
- menu/order URL
- reservation URL/provider
- large-party threshold
- catering contact
- sold-out/unavailable-item handling
- order handoff instructions
- FAQ answers

Readiness blockers: hours, ordering or handoff method, reservation behavior.

### AI Tour & Excursion Seller

- operator name
- tours/products
- operating dates/hours
- booking URL/provider
- meeting/pickup points
- age/minor policies
- cancellation policy
- group-rate rules
- upsell options
- tourist/cruise-guest FAQ
- supported languages

Readiness blockers: tour catalog summary, booking destination, pickup/meeting instructions.

### AI Airbnb Reservation Manager

- business/host name
- property list
- listing/booking URLs
- check-in/check-out times
- house rules
- pre-arrival instructions
- early check-in/late checkout rules
- extra-night upsell
- emergency/escalation contact
- review-request timing

Readiness blockers: property identity, booking destination, check-in rules, escalation contact.

### AI Event Promoter

- organization/venue name
- active event(s)
- ticket URL/provider
- venue/location
- event FAQ
- age/access rules
- VIP/table offerings
- campaign channels
- reminder timing
- post-event follow-up

Readiness blockers: event identity, ticket destination, event date/location.

### AI Schedule Filler

- business name
- appointment types
- calendar destination
- source list description
- cancellation/open-slot rules
- outreach channels
- allowed outreach hours
- recall cadence
- stop/unsubscribe handling
- monthly report recipient

Readiness blockers: calendar destination, eligible audience/source definition, outreach rules.

### AI Marketing Manager

- business name
- website
- service area
- target customers
- products/services
- brand voice
- offer/promotion rules
- content categories
- posting frequency
- social-account setup status
- email campaign setup status
- review-request setup status

Readiness blockers: business identity, target customer, brand voice, content priorities.

### AI Legal Intake & Reception

- firm name
- practice areas
- office hours
- consultation rules
- intake questions
- disqualification rules
- conflict-precheck questions
- urgent-matter triggers
- attorney/team routing
- calendar destination
- English/Spanish toggle

The UI must clearly state that the system provides intake/reception workflows and does not provide legal advice.

Readiness blockers: practice areas, routing/escalation, consultation rule.

### AI Dental Front Desk

- practice name
- locations
- office hours
- services
- scheduling destination
- new-patient rules
- insurance/eligibility workflow instructions
- recall cadence
- reminder cadence
- no-show handling
- FAQ answers
- escalation contact

The UI must not claim insurance verification is active unless a real verification workflow/integration exists. Until then it is displayed as a configurable workflow/setup item.

Readiness blockers: location/hours, scheduling destination, escalation contact.

## Agent template registry

The application should introduce one canonical code registry keyed by `services.slug`. It defines:

- form sections
- field keys and labels
- input type
- default values
- required/readiness status
- preview mapping
- relevant connection types

This registry is presentation and validation metadata only. It does not duplicate service pricing, product names, product descriptions, or canonical service IDs from the database.

Recommended file boundary:

`src/lib/ai-studio/templates.ts`

The registry should be typed and validated so every active AI product has a customization template.

## Readiness scoring

Readiness is deterministic, not AI-guessed.

- Required/blocking fields account for the majority of readiness.
- Recommended fields improve readiness but do not prevent saving.
- Connection requirements report `not_connected`, `needs_setup`, or `connected` only from explicit stored state.
- The score is computed from configuration completeness and known connection state.
- The stored readiness snapshot may be persisted in `config.setup`, but the UI should be able to recompute it from canonical config.

Suggested customer-facing states:

- 0–39: `Setup Needed`
- 40–79: `Almost Ready`
- 80–99: `Ready to Review`
- 100: `Ready`

`Active` remains an operational/order status and is not inferred from readiness alone.

## Preview behavior

The studio preview should use the existing AI demo endpoint with a sanitized summary of the customer's current configuration.

The preview must:

- show the selected agent acting for the customer's stated business
- respect entered tone, greeting, hours, and vertical rules where practical
- never represent unconnected external data as live
- label the panel `Preview` until the agent is operational
- provide sample customer prompts tailored to the chosen agent

The preview is a sales and configuration validation surface, not proof of production integration.

## Visual system

The visual direction is "AI operations console" rather than conventional SaaS forms.

Key elements:

- dark premium base consistent with the current site
- layered translucent panels
- soft depth and restrained glow
- animated status pulse where useful
- large agent identity header
- vertical capability rail or segmented navigation
- prominent readiness ring/meter
- live preview panel
- compact connection tiles
- smooth transitions between setup sections
- strong typography and whitespace
- polished mobile layout with sticky primary action

Avoid:

- novelty neon everywhere
- fake holographic controls
- unreadable tiny labels
- excessive animation
- gradients that impair contrast
- decorative UI that looks connected when it is not

The result should feel sophisticated and expensive, while still being obvious to a small-business owner on first use.

## Routes and navigation

Recommended routes:

- `/ai-studio` — marketplace
- `/ai-studio/[slug]/customize` — customization studio before subscription or for an existing owned agent
- `/dashboard/agents` — My AI Agents overview
- `/dashboard/agents/[orderId]` — owned-agent detail/customization surface, or redirect to the same shared studio component in owned mode

The existing `/dashboard/orders` can remain for non-AI services. AI products should surface prominently in `/dashboard/agents`.

## Server actions and ownership rules

Introduce focused server actions rather than overloading `orderService` with all editing behavior:

- `createAiAgentOrder(formData)` — creates the canonical `service_orders` row using validated config and existing order/invoice rules.
- `updateAiAgentConfig(formData)` — updates only the current customer's owned AI-product order after ownership verification.

If reusing `orderService` is cleaner during implementation, it must delegate to the same validation/config-normalization utilities. There must be one canonical normalization path.

All edit operations must verify the authenticated profile owns the `service_orders` row, unless the existing staff authorization path is explicitly used.

## Data validation

Introduce Zod schemas keyed by agent slug.

Validation requirements:

- reject unsupported service slugs for AI customization
- clamp text lengths
- validate URLs when present
- validate arrays and enums
- reject attempts to alter price, service ID, tenant ID, user ID, role, order status, or connection trust state via `config`
- preserve only allowed per-agent fields
- set `schema_version` server-side

Customer-submitted connection labels do not become `connected=true` merely because a user enters a provider name or URL.

## Subscription and billing truthfulness

The UI may say `Subscribe` only where the current application genuinely creates the intended recurring service/order and billing path. If current billing still requires later administrative completion, the final call-to-action must use truthful copy such as `Customize & Continue` or `Start Setup` until billing is actually automatic.

No screen should state `Active`, `Paid`, or `Connected` unless canonical backend state supports that claim.

## Migration strategy

Prefer no new database table for Phase 1 of this feature.

Use the existing `service_orders.config` JSON field and add database changes only if needed for safe querying or status semantics. If a migration becomes necessary, it must be additive and preserve all existing service orders.

No existing `services` rows should be duplicated merely to attach customization metadata; the code registry handles template metadata by slug.

## Testing requirements

### Registry coverage

A regression test must prove every active AI service slug in the intended lineup has a template definition, including:

- ai-appointment-setter-email
- AI Phone Line canonical slug
- ai-restaurant-host
- ai-tour-seller
- ai-airbnb-reservations
- ai-event-promoter
- ai-schedule-filler
- ai-marketing-manager
- ai-legal-intake
- AI Dental Front Desk canonical slug

### Config validation

Tests must prove:

- valid vertical config survives normalization
- unknown keys are stripped
- system-owned keys cannot be overridden
- invalid URLs/enums are rejected
- schema version is server-controlled
- readiness is deterministic

### Ownership

Tests must prove one customer cannot edit another customer's `service_orders` config.

### Truthfulness

Tests must prove unconfigured/unconnected providers are never rendered as `connected` or `active` by default.

### UI flow

At minimum, test:

- marketplace renders `Customize & Subscribe` or the truthful equivalent
- studio loads the correct template by slug
- required fields affect readiness
- configuration save persists to the owned order
- My AI Agents shows the owned agent and correct readiness/status

## Phase 1 implementation boundary

This design's first implementation slice includes:

1. template registry for all ten agents
2. premium marketplace CTA and product-card refinement
3. shared customization studio UI
4. versioned config normalization/validation
5. create/update actions using canonical service orders
6. deterministic readiness scoring
7. preview integration using existing AI demo route
8. My AI Agents dashboard
9. tests for coverage, validation, ownership, readiness, and truthful connection state

Phase 1 does **not** build real telephony, Gmail outreach, CRM, Toast, FareHarbor, Airbnb, Eventbrite, insurance eligibility, social publishing, or calendar-provider integrations from scratch. It provides accurate setup surfaces and connection states so those integrations can be added safely in later slices.

## Success criteria

The feature is successful when:

- all ten listed AI agents are prebuilt and visible as purchasable/customizable products
- a customer can enter the studio and understand what the agent does within seconds
- each agent has vertical-specific defaults and configuration fields
- the customer can preview the configured behavior before activation
- the configuration persists on the canonical service order
- the customer can return later and edit the same owned agent
- the dashboard clearly shows readiness and setup state
- the UI never fabricates a connection, payment, or operational status
- the visual presentation feels premium, modern, and differentiated without sacrificing clarity or accessibility
