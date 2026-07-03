-- Refocus the AI Studio lineup on high-intent verticals.
-- Retires the generic agents (keeps Dental Front Desk) and adds tailored ones:
-- Attorney intake, Airbnb reservations, Appointment Setter (email), Schedule Filler, Marketing.
-- Paste into the Supabase SQL editor for the Galveston project, then refresh /ai-studio.

-- 1. Hide the generic agents (kept in the DB, just inactive — reversible).
update public.services set active = false
where category = 'ai_product'
  and slug in ('ai-receptionist','ai-speed-to-lead','ai-review-manager',
               'ai-social-manager','ai-content-seo','ai-knowledge','ai-full-employee');

-- 2. Add the tailored agents.
insert into public.services (tenant_id, name, slug, category, tagline, description, base_price_cents, interval, features)
values
  ('00000000-0000-0000-0000-000000000001','AI Legal Intake & Reception','ai-legal-intake','ai_product',
    'A 24/7 intake specialist for law firms.',
    'A legal-trained AI that answers every call and web inquiry day or night, screens and intakes new clients, books consultations, flags urgent matters, and routes them to the right attorney — so your firm never misses a case.',
    29900,'month',
    '["24/7 call & website answering","New-client intake & screening","Books consultations to your calendar","Conflict-check pre-screening questions","Urgent matter alerts & routing","Bilingual intake (English & Spanish)"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001','AI Airbnb Reservation Manager','ai-airbnb-reservations','ai_product',
    'Answers guests and books stays, 24/7.',
    'A short-term-rental AI that replies to guest questions instantly, shares availability and pricing, takes reservations, and sends check-in details across all your listings — around the clock.',
    19900,'month',
    '["24/7 guest messaging","Availability & pricing answers","Takes & confirms reservations","Automated check-in info & house rules","Upsells early check-in & extra nights","Review requests after checkout"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001','AI Appointment Setter (Email)','ai-appointment-setter-email','ai_product',
    'Books meetings from your inbox, automatically.',
    'An email AI that reaches out to your leads and contacts, handles the entire back-and-forth, and books qualified meetings straight onto your calendar — written in your voice.',
    19900,'month',
    '["Personalized email outreach","Handles scheduling back-and-forth","Books meetings to your calendar","Follows up until they reply","Qualifies leads before booking","CRM-ready activity log"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001','AI Schedule Filler','ai-schedule-filler','ai_product',
    'Fills your calendar from leads you already have.',
    'Turns your existing list — past customers, no-shows, and cold leads — into booked appointments. The AI reaches out by text and email, reactivates them, and fills your open and cancelled slots on autopilot.',
    24900,'month',
    '["Reactivates past & lapsed customers","Fills cancellations & open slots","Text + email outreach campaigns","Recall & follow-up sequences","Books directly to your calendar","Monthly bookings report"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001','AI Marketing Manager','ai-marketing-manager','ai_product',
    'Your always-on marketing team.',
    'An AI marketing agent that plans and runs your content — social posts, blogs, local SEO, and review requests — on brand and on schedule, so your marketing never goes quiet.',
    29900,'month',
    '["On-brand social & blog content","Local SEO landing pages","Automated review requests","Content calendar & scheduling","Email & promo campaigns","Monthly performance report"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001','AI Event Promoter','ai-event-promoter','ai_product',
    'Promotes your events and drives ticket sales, 24/7.',
    'Made for promoters and venues — it hypes your events across social, email, and text, answers every "when / where / how much / is it 21+" instantly, manages RSVPs and guest lists, and drives fans straight to your ticket link. Then it follows up to fill the room.',
    24900,'month',
    '["Promotes events on social, email & SMS","Answers event questions 24/7","RSVP & guest-list management","Drives buyers to your ticket link (Eventbrite, DICE, etc.)","VIP & table upsells","Reminder blasts + post-event follow-up"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001','AI Tour & Excursion Seller','ai-tour-seller','ai_product',
    'Books tours and sells excursions, day and night.',
    'Built for tour operators and attractions — it answers questions about your tours, checks availability, recommends the right excursion, and books guests around the clock. Perfect for the cruise crowd browsing at 11pm.',
    19900,'month',
    '["24/7 tour Q&A and recommendations","Real-time availability & pricing","Books & confirms reservations","Drives to your booking link (FareHarbor, Viator, etc.)","Upsells add-ons & group rates","Multilingual for tourists & cruise guests"]'::jsonb),
  ('00000000-0000-0000-0000-000000000001','AI Restaurant Host & To-Go','ai-restaurant-host','ai_product',
    'Takes to-go orders and reservations, 24/7.',
    'A restaurant AI that answers the phone and web chat — takes to-go and takeout orders, books reservations and large parties, answers menu, hours, and location questions, and handles catering inquiries — so no order goes to voicemail during the rush.',
    19900,'month',
    '["Takes to-go & takeout orders","Answers menu, hours & location questions","Books reservations & large parties","Catering & event inquiries","Sends orders to your online ordering (Toast, etc.)","Never a busy signal during the rush"]'::jsonb)
on conflict (tenant_id, slug) do nothing;
