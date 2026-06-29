"use client";

import { useEffect } from "react";

export default function PrintButton() {
  return (
    <button onClick={() => window.print()} className="btn-outline no-print">
      🖨️ Print / Save PDF
    </button>
  );
}

// Auto-opens the print dialog when the invoice is reached via "Print slip" (?print=1).
export function AutoPrint() {
  useEffect(() => {
    const t = setTimeout(() => window.print(), 450);
    return () => clearTimeout(t);
  }, []);
  return null;
}
