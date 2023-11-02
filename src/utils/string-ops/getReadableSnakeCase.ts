export function getReadableSnakeCase(str: string): string {
  let output = ''
  const len = str.length
  let char

  for (let i = 0; i < len; i++) {
    char = str.charAt(i)

    if (i == 0) {
      output += char.toUpperCase()
    } else if (char !== char.toLowerCase() && char === char.toUpperCase()) {
      output += ' ' + char.toUpperCase()
    } else if (char == '_') {
      output += ' '
    } else if (str[i - 1] === '_') {
      output += char.toUpperCase()
    } else {
      output += char
    }
  }

  return output
}
