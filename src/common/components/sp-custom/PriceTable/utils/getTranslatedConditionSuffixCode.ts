const possibleConditionSuffixCodes: {
  [key: string]: string;
} = {
  broken_screen: 'Разбитое',
  burnouts: 'Выгоревшее',
  no_defects: '',
}

export const getTranslatedConditionSuffixCode = ({
  suffixCode,
}: {
  suffixCode: string;
}): string => {
  return (
    typeof possibleConditionSuffixCodes[suffixCode] === 'string'
    ? possibleConditionSuffixCodes[suffixCode]
    : `suffixCode:${suffixCode} (${typeof suffixCode})`
  )
}
