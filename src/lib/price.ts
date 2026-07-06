export function leadingPrice(priceRange: string): number {
  const match = priceRange.replace(/,/g, "").match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
}

/** Singular unit noun extracted from a MOQ string like "10 Units" / "1 Piece" / "5 Sets". */
function unitNoun(moq: string): string {
  const match = moq.match(/\d+\s*(\w+)/);
  const word = match?.[1] ?? "Unit";
  return word.endsWith("s") && word.length > 1 ? word.slice(0, -1) : word;
}

/** B2B catalogs price per unit, not a one-off retail price — "₹9,500 / Unit" rather than a
    bare number, so it reads as bulk/wholesale pricing rather than a single-item price tag. */
export function priceLabel(priceRange: string, moq: string): string {
  return `${priceRange.split(" - ")[0]} / ${unitNoun(moq)}`;
}
