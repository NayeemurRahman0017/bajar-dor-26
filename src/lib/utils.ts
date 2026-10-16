export function toBengaliNumber(value: number | string): string {
  const digits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

  return String(value).replace(/[0-9]/g, (digit) => {
    return digits[Number(digit)];
  });
}

export function formatPrice(price: number): string {
  return toBengaliNumber(
    price.toLocaleString("en-IN")
  );
}

const units: Record<string, string> = {
  kg: "প্রতি কেজি",
  gram: "প্রতি গ্রাম",
  litre: "প্রতি লিটার",
  piece: "প্রতি পিস",
  dozen: "প্রতি ডজন",
  maund: "প্রতি মণ",
};

export function getUnitBn(unit: string): string {
  return units[unit.toLowerCase()] ?? `প্রতি ${unit}`;
}

const banglaDays = [
  "রবিবার",
  "সোমবার",
  "মঙ্গলবার",
  "বুধবার",
  "বৃহস্পতিবার",
  "শুক্রবার",
  "শনিবার",
];

const banglaMonths = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

export function getBanglaDate(): string {
  const date = new Date();

  return `${banglaDays[date.getDay()]}, ${toBengaliNumber(
    date.getDate()
  )} ${banglaMonths[date.getMonth()]}, ${toBengaliNumber(
    date.getFullYear()
  )}`;
}

