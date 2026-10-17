export function getProductEmoji(name: string): string {
  const productName = name.toLowerCase();

  if (productName.includes("চাল")) return "🍚";
  if (productName.includes("ডাল")) return "🫘";
  if (productName.includes("তেল")) return "🫙";
  if (productName.includes("আলু")) return "🥔";

  if (
    productName.includes("পেঁয়াজ") ||
    productName.includes("পেঁয়াজ")
  ) {
    return "🧅";
  }

  if (productName.includes("মরিচ")) return "🌶️";
  if (productName.includes("মাছ")) return "🐟";
  if (productName.includes("মুরগি")) return "🍗";
  if (productName.includes("ডিম")) return "🥚";
  if (productName.includes("আদা")) return "🫚";
  if (productName.includes("রসুন")) return "🧄";
  if (productName.includes("দুধ")) return "🥛";
  if (productName.includes("টমেটো")) return "🍅";
  if (productName.includes("বেগুন")) return "🍆";
  if (productName.includes("গরুর মাংস")) return "🥩";
  if (productName.includes("লবণ")) return "🧂";
  if (productName.includes("কলা")) return "🍌";
  if (productName.includes("গাজর")) return "🥕";
  if (productName.includes("শসা")) return "🥒";
  if (productName.includes("ফুলকপি")) return "🥦";

  return "🛒";
}