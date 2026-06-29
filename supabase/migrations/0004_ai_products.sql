-- AI Studio: à-la-carte AI agents businesses subscribe to monthly.
-- Paste into the Supabase SQL editor for the Galveston project, then refresh.

alter table public.services drop constraint if exists services_category_check;
alter table public.services add constraint services_category_check
  check (category in ('marketing_assistant','web_platform','bundle','virtual_assistant','ai_assistant','ai_product'));

insert into public.services (tenant_id, name, slug, category, tagline, description, base_price_cents, interval, features)
values
  ('00000000-0000-0000-0000-000000000001','AI Receptionist','ai-receptionist','ai_product',
    'Answers your phone 24/7 — never miss a call.',
    'A natural-sounding AI receptionist that answers every call day or night, books appointments, takes messages, and texts you a summary.',
    19900,'month',
    '["24/7 AI phone answering","Books appointments to your calendar","Takes & transcribes messages","Instant text summaries to you","Custom greeting & call routing"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001','AI Speed-to-Lead','ai-speed-to-lead','ai_product',
    'Texts every new lead in seconds.',
    'The first to respond wins. This agent instantly texts and emails every new lead, qualifies them, and books the call before your competitor even sees it.',
    17900,'month',
    '["Instant SMS + email to new leads","Qualifies & scores each lead","Books the call automatically","Follows up until they reply","Works with your web forms"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001','AI Review Manager','ai-review-manager','ai_product',
    'More 5-star reviews, on autopilot.',
    'Monitors Google and Yelp, drafts on-brand responses for your approval, and automatically asks happy customers for reviews.',
    14900,'month',
    '["Monitors Google & Yelp","AI-drafted review responses","Auto review requests to customers","Sentiment & rating alerts","Monthly reputation report"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001','AI Social Manager','ai-social-manager','ai_product',
    'On-brand social posts, scheduled for you.',
    'Generates on-brand posts, schedules them across your platforms, and replies to comments and DMs in your voice.',
    24900,'month',
    '["On-brand post generation","Auto-scheduling across platforms","Comment & DM replies","Content calendar","Monthly performance report"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001','AI Content & SEO Engine','ai-content-seo','ai_product',
    'Blog & local SEO pages, written and published.',
    'A content engine that researches, writes, and publishes blog posts and local SEO pages every month to grow your search traffic.',
    29900,'month',
    '["Researched, on-brand articles","Local SEO landing pages","Published to your site","Keyword & topic strategy","Monthly traffic report"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001','AI Knowledge Assistant','ai-knowledge','ai_product',
    'A private AI trained on your business.',
    'Upload your docs, SOPs, and policies — your team gets instant, accurate answers from a private AI that knows your business.',
    14900,'month',
    '["Private AI trained on your docs","Instant answers for your team","Always up to date","Secure & access-controlled","Slack / web access"]'::jsonb)
on conflict (tenant_id, slug) do nothing;
