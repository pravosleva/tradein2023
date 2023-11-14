/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const getFormattedPrice = (
  price: any,
  length: number,
  decimalDelimiter?: string,
  sectionDelimiter?: string,
) => {
  let _price = price
  let j: any, i: any
  const c = isNaN(length = Math.abs(length)) ? 2 : length;
  const d = decimalDelimiter === undefined ? "," : decimalDelimiter;
  const t = sectionDelimiter === undefined ? "." : sectionDelimiter;
  const s = _price < 0 ? "-" : "";
  i = parseInt(_price = Math.abs(+_price || 0).toFixed(c)) + "";
  j = (j = i.length) > 3 ? j % 3 : 0;
  return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(_price - i).toFixed(c).slice(2) : "");
}
