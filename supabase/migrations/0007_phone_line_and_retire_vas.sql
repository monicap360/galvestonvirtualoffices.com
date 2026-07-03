-- Add the AI Phone Line & Auto-Attendant (and the missing Restaurant agent),
-- and retire the human Managed Virtual Assistants product.
-- Paste into the Supabase SQL editor for the Galveston project, then refresh.

insert into public.services (tenant_id, name, slug, category, tagline, description, base_price_cents, interval, features)
values
  ('00000000-0000-0000-0000-000000000001','AI Phone Line & Auto-Attendant','ai-phone-attendant','ai_product',
    'A 24/7 AI phone line that answers every call.',
    'Your own AI phone number and auto-attendant — it answers every call in your business''s voice, greets and routes callers, books appointments, takes orders and messages, and texts you summaries. Never miss a call, and never pay for a human answering service again.',
    19900,'month',
    '["Dedicated AI phone number","24/7 auto-attendant & smart call routing","Books appointments & takes orders by phone","Voicemail-to-text summaries texted to you","After-hours & overflow answering","Bilingual (English & Spanish)"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001','AI Restaurant Host & To-Go','ai-restaurant-host','ai_product',
    'Takes to-go orders and reservations, 24/7.',
    'A restaurant AI that answers the phone and web chat — takes to-go and takeout orders, books reservations and large parties, answers menu, hours, and location questions, and handles catering inquiries — so no order goes to voicemail during the rush.',
    19900,'month',
    '["Takes to-go & takeout orders","Answers menu, hours & location questions","Books reservations & large parties","Catering & event inquiries","Sends orders to your online ordering (Toast, etc.)","Never a busy signal during the rush"]'::jsonb)
on conflict (tenant_id, slug) do nothing;

-- Retire the human Managed Virtual Assistants (hidden, not deleted — reversible).
update public.services set active = false where category = 'virtual_assistant';
