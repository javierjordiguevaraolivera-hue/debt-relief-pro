export function getPhoneDisplay() {
  return process.env.NEXT_PUBLIC_PHONE_NUMBER || "(888) 555-0198";
}

export function getRingbaNumber() {
  return process.env.NEXT_PUBLIC_RINGBA_NUMBER || getPhoneDisplay();
}

export function getPhoneHref() {
  return `tel:${getRingbaNumber().replace(/[^\d+]/g, "")}`;
}

export function getSupportHours() {
  return process.env.NEXT_PUBLIC_SUPPORT_HOURS || "Mon-Fri, 9 AM-6 PM ET";
}
