export const possibleConditionCodes = [
  { value: 'C', label: 'Отличное' },
  { value: 'D', label: 'Рабочее' },
  { value: 'NC', label: 'Плохое' },
  // { value: 'ND', label: 'Рабочее с разбитым экраном' }
]

export const getTranslatedConditionCode = (code: string): string => {
  const item = possibleConditionCodes.find(({ value }) => value === code)
  return item?.label || code
}
