export type ShowcaseProfile = {
  id: string;
  label: string;
  icon: string;
  company: string;
  knowledge: string;
  questions: string[];
};

export const SHOWCASE_PROFILES: ShowcaseProfile[] = [
  {
    id: "virtual-office",
    label: "Virtual office",
    icon: "🏢",
    company: "Galveston Virtual Offices",
    knowledge: "Services: professional Galveston business address, virtual mailbox with mail notifications, package receiving, meeting-room reservations, coworking, managed virtual assistants, AI receptionist, and local marketing support. Hours: staff support Monday–Friday, 9 AM–5 PM; AI support is available 24/7. Sample pricing: virtual mailbox $49/month; business-address plan $79/month; meeting room $35/hour; dedicated office from $399/month. Policies: plans are month-to-month; identity verification is required before mail service begins; meeting rooms require reservations; pricing shown in this showcase is illustrative and the team confirms the final quote. FAQs: a professional street address looks more credible than a PO box; customers receive mail alerts; packages can be received during staffed hours; tours and office visits are by appointment.",
    questions: ["Why is this better than a PO box?", "How much is a virtual mailbox?", "Can I book a meeting room tomorrow?"],
  },
  {
    id: "restaurant",
    label: "Restaurant",
    icon: "🍽️",
    company: "Harbor Table Kitchen",
    knowledge: "Services: waterfront dining, reservations, takeout, catering, birthday dinners, and private events. Hours: Tuesday–Thursday 11 AM–9 PM; Friday–Saturday 11 AM–10 PM; Sunday 10 AM–8 PM; closed Monday. Sample pricing: lunch entrées from $16; dinner entrées from $24; catering packages from $28 per guest; private-room minimum $750. Policies: reservations are held for 15 minutes; parties of eight or more require a card; allergy requests are reviewed by a manager; catering requires 72 hours notice. FAQs: outdoor seating is weather-dependent; vegetarian and gluten-aware choices are available; parking is complimentary for dining guests.",
    questions: ["Book dinner for six Friday", "Do you handle food allergies?", "What does catering cost?"],
  },
  {
    id: "law-office",
    label: "Law office",
    icon: "⚖️",
    company: "Gulf Coast Legal Group",
    knowledge: "Services: business formation, contracts, estate planning, probate consultations, and real-estate matters. Hours: Monday–Friday, 8:30 AM–5:30 PM; urgent intake is available after hours. Sample pricing: initial business consultation $150; LLC formation packages from $895 plus filing fees; simple wills from $650. Policies: contacting the office does not create an attorney-client relationship; conflicts must be checked before confidential details are accepted; no legal advice is given until engagement. FAQs: consultations may be virtual or in person; clients should bring relevant notices, contracts, and deadlines; the intake assistant can schedule but cannot predict outcomes.",
    questions: ["Can you help form my LLC?", "What should I bring to a consultation?", "I received a legal notice today"],
  },
  {
    id: "medical-office",
    label: "Medical office",
    icon: "🩺",
    company: "Island Family Clinic",
    knowledge: "Services: primary-care visits, annual wellness exams, same-day sick visits, vaccines, and chronic-care follow-up. Hours: Monday–Friday, 8 AM–6 PM; Saturday 9 AM–1 PM. Sample pricing: self-pay office visit from $125; wellness visit pricing depends on services; insurance benefits are verified before the appointment. Policies: emergencies must call 911; the assistant does not diagnose; cancellations require 24 hours notice; prescription questions go to clinical staff. FAQs: new patients should bring photo ID, insurance card, medication list, and prior records; telehealth is available for eligible visits; walk-ins depend on capacity.",
    questions: ["Do you have a same-day appointment?", "What should a new patient bring?", "Can Ava diagnose my symptoms?"],
  },
  {
    id: "tour-company",
    label: "Tour company",
    icon: "🛥️",
    company: "Galveston Harbor Adventures",
    knowledge: "Services: harbor history tours, dolphin cruises, sunset cruises, private charters, and small-group shore excursions. Hours: tours depart daily from 9 AM–7 PM, weather permitting. Sample pricing: harbor tour $39 adult and $24 child; sunset cruise $59 per guest; private charter from $495. Policies: guests should arrive 30 minutes early; weather cancellations may be rescheduled or refunded; children require an adult; private charters require a 25% deposit. FAQs: wildlife sightings are common but not guaranteed; accessible boarding requires advance notice; sunscreen, water, and a light jacket are recommended.",
    questions: ["Which tour is best for children?", "What happens if it rains?", "Book a sunset cruise for four"],
  },
  {
    id: "airbnb",
    label: "Airbnb & rentals",
    icon: "🏡",
    company: "Seabreeze Vacation Rentals",
    knowledge: "Services: short-term rental inquiries, direct-booking support, availability guidance, pre-arrival messages, check-in help, local recommendations, maintenance intake, and guest follow-up. Hours: automated guest help 24/7; local team Monday–Sunday, 8 AM–8 PM; urgent in-stay problems are escalated anytime. Sample pricing: one-bedroom stays from $149/night; cleaning from $95; pet fee $50 per stay; early check-in $35 when available. Policies: availability and rates must be confirmed in the booking system; check-in is 4 PM and checkout is 10 AM; quiet hours begin at 10 PM; maximum occupancy is enforced; no parties; pets require approval. FAQs: door codes are released after verification; parking instructions are property-specific; maintenance emergencies require the property name, guest name, and a description or photo.",
    questions: ["Is a pet-friendly home available Friday?", "My door code isn't working", "Can we check in early?"],
  },
  {
    id: "hotel",
    label: "Hotel",
    icon: "🏨",
    company: "The Tremont Harbor Hotel",
    knowledge: "Services: room inquiries, reservation requests, modifications, accessible-room needs, amenities, group blocks, meeting space, special occasions, and guest recovery. Hours: front desk and digital concierge 24/7; reservations team daily 7 AM–10 PM. Sample pricing: standard king from $179/night; double queen from $199/night; harbor-view suite from $329/night; breakfast package $24 per guest. Policies: live availability and final rates must be confirmed by the reservation system; standard cancellation is 48 hours before arrival; check-in is 3 PM and checkout is 11 AM; accessible features are confirmed before booking; incidentals require a card. FAQs: parking, breakfast, Wi-Fi, fitness room, cribs, and luggage storage are available; connecting rooms and early check-in are requests, not guarantees.",
    questions: ["Do you have an accessible king Friday?", "Plan a birthday hotel stay", "What is your cancellation policy?"],
  },
  {
    id: "website-sales",
    label: "Website sales",
    icon: "💻",
    company: "Island Web Studio",
    knowledge: "Services: business websites, booking websites, online stores, landing pages, website chat assistants, local SEO setup, copywriting, maintenance, and redesigns. Hours: consultations Monday–Friday, 9 AM–6 PM; website inquiry intake 24/7. Sample pricing: launch landing page from $699; five-page business website from $1,499; booking website from $2,499; online store from $3,499; care plans from $99/month. Policies: final scope and quote follow discovery; domains, paid software, photography, and complex integrations may cost extra; projects begin with an approved proposal and deposit; timelines depend on content and feedback. FAQs: Ava should qualify the business, primary website goal, required pages or features, deadline, existing domain, and budget range before recommending a package.",
    questions: ["Which website package fits a salon?", "Can you redesign my old website?", "I need online booking and payments"],
  },
  {
    id: "website-support",
    label: "Website support",
    icon: "🛠️",
    company: "Island Web Care",
    knowledge: "Services: website outage triage, broken forms, booking and checkout problems, content changes, domain and SSL guidance, email-delivery troubleshooting, performance review, security escalation, and maintenance requests. Hours: routine support Monday–Friday, 9 AM–6 PM; critical outage intake 24/7. Sample pricing: care plan from $99/month; one-time support from $125/hour; emergency response from $225. Policies: never request passwords in chat; collect the website URL, affected page, exact error, start time, device, browser, and screenshots; treat a fully down website, suspected compromise, or failed checkout across users as urgent; do not promise a restoration time before diagnosis. FAQs: clear cache only after recording evidence; billing, domain ownership, and third-party outages may require account-owner action.",
    questions: ["My entire website is down", "Customers cannot submit my form", "Update the hours on my homepage"],
  },
];
