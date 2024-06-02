export function* Counter(initValue = 0) {
  let count = initValue
  while (true) yield count++
}
