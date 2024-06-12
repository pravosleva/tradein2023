const legacyDefectInfo: {
  [key: string]: {
    [key: string]: string;
  };
} = {
  mobile_phone: {
    no_defects: 'нет',
    scratched_screen: 'экран с царапинами или потертостями',
    broken_strap: 'ремешок поврежден',
    case_defects: 'корпус имеет видимые повреждения',
    broken_screen: 'экран разбит или есть отслоения',
    burnouts: 'есть выгорания, битые пиксели, полосы, пятна',
  },
  smartwatch: {
    scratched_screen: 'экран с дефектами',
    case_defects: 'корпус/ремешок с дефектами',
  },
}

export const getTranslatedDefectReasonCode = ({
  deviceType,
  defectCode,
}: {
  deviceType: string;
  defectCode: string;
}): string => {
  return legacyDefectInfo[deviceType]?.[defectCode] || `getTranslatedDefectReasonCode:${deviceType}.${defectCode}`
}
