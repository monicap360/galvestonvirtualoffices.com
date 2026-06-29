-- New product line: AI Assistant (24/7 AI chatbot / receptionist), separate from human Managed VAs.
-- Paste this into the Supabase SQL editor for the Galveston project, then refresh the site.

-- Allow the new service category
alter table public.services drop constraint if exists services_category_check;
alter table public.services add constraint services_category_check
  check (category in ('marketing_assistant','web_platform','bundle','virtual_assistant','ai_assistant'));

-- AI Assistant plans
insert into public.services (tenant_id, name, slug, category, tagline, description, base_price_cents, interval, features)
values
  ('00000000-0000-0000-0000-000000000001','AI Assistant — Starter','ai-assistant-starter','ai_assistant',
    'A 24/7 AI assistant for your website.',
    'An always-on AI assistant trained on your business — answers customer questions, captures leads, and never sleeps.',
    14900,'month',
    '["24/7 website chat assistant","Trained on your business & FAQs","Lead capture with instant email alerts","Monthly tuning & updates"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001','AI Assistant — Pro','ai-assistant-pro','ai_assistant',
    'AI that books, qualifies, and follows up.',
    'Everything in Starter plus appointment booking, SMS & email replies, lead qualification, and hand-off to your human team.',
    29900,'month',
    '["Everything in Starter","Appointment booking","SMS + email auto-replies","Lead qualification & routing","Hand-off to your human VA","Conversation analytics"]'::jsonb)
on conflict (tenant_id, slug) do nothing;
