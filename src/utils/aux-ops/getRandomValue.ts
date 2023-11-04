/* eslint-disable @typescript-eslint/no-explicit-any */
export const getRandomValue = ({ items }: { items: any }) => {
  if (!Array.isArray(items)) return 'getRandomValue ERR: Incorrect arg'
  const randomIndex = Math.floor(Math.random() * items.length)

  return items[randomIndex]
}
