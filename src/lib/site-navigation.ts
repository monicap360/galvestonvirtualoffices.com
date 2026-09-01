export const publicNavigation = {
  services: [
    { href: "/ai-assistant", label: "AI Assistant" },
    { href: "/ai-studio", label: "AI Studio" },
    { href: "/mailboxes", label: "Mailboxes" },
    { href: "/offices", label: "Offices" },
    { href: "/services/marketing", label: "AI Marketing" },
    { href: "/services/platforms", label: "Platforms" },
  ],
  primary: [
    { href: "/why-us", label: "Why Us" },
    { href: "/pricing", label: "Pricing" },
    { href: "/contact", label: "Contact" },
  ],
} as const;

export function getMobileNavigation() {
  return [...publicNavigation.services, ...publicNavigation.primary];
}
