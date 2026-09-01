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
];
