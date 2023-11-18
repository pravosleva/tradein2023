import { NSP } from "~/utils/httpClient"
import { TSelectedItem } from '~/common/xstate/stepMachine'
import { getPriceTableHtml, NLegacy2017Props } from '~/utils/sp'
import { possibleConditionCodes as defaultPossibleConditionCodes } from './utils/getTranslatedConditionCode'

export type TPriceTableProps = {
  imeiResponse: NSP.TImeiResponse;
  checkPhoneResponse: NSP.TCheckPhoneResponse | null;
  // photoStatusResponse: NSP.TPhotoStatusResponse;
  byUser: {
    selectedColor: TSelectedItem | null;
    selectedMemory: TSelectedItem | null;
  }
  possibleConditionCodes?: { value: string; label: string; }[]; // 'C', 'D', 'NC'
  conditionCodeValidator: ({ value, label }: { value: string; label: string; }) => boolean;

  finalPriceTableProps?: {
    subsidiesStruct2: NLegacy2017Props.TSubsidiesStruct2;
    // subsidiesStruct3?: NLegacy2017Props.TSubsidiesStruct3;
  };
}

type TActualValuesResult = {
  color?: string;
  memory?: string;
  condition?: string;

  // phone: NSP.TPhone;
  model: string;
  deviceType: string;

  currency: string;
}

type TSynthProps = {
  imeiResponse: NSP.TImeiResponse;
  checkPhoneResponse: NSP.TCheckPhoneResponse | null;
  // photoStatusResponse: NSP.TPhotoStatusResponse;
  byUser: {
    selectedColor: TSelectedItem | null;
    selectedMemory: TSelectedItem | null;
  }
  possibleConditionCodes: { value: string; label: string; }[];
}
const getSynthesis = ({
  byUser,
  imeiResponse,
  checkPhoneResponse,
  // photoStatusResponse,
  possibleConditionCodes,
}: TSynthProps): TActualValuesResult => {
  const result: TActualValuesResult = {
    color: imeiResponse.phone.color || byUser.selectedColor?.value,
    memory: imeiResponse.phone.memory || byUser.selectedMemory?.value,
    condition: possibleConditionCodes.find(({ value }) => checkPhoneResponse?.condition === value)?.value, // TODO? || checkPhoneResponse?.condition,

    // phone: NSP.TPhone;
    model: imeiResponse.phone.model || '',
    deviceType: imeiResponse.phone.type || '',

    currency: imeiResponse.currency,
  }

  return result
}

export const PriceTable = ({
  byUser,
  imeiResponse,
  checkPhoneResponse,
  // photoStatusResponse,
  possibleConditionCodes = defaultPossibleConditionCodes,
  conditionCodeValidator,
  finalPriceTableProps,
}: TPriceTableProps) => {
  const values = getSynthesis({
    byUser,
    imeiResponse,
    checkPhoneResponse,
    // photoStatusResponse,
    possibleConditionCodes,
  })
  const html = getPriceTableHtml({
    cfg: {
      color: values.color,
      memory: values.memory,
      currency: values.currency,
      possibleConditionCodes,
      enabledConditionsCodes: possibleConditionCodes.filter(conditionCodeValidator).map(({ value }) => value),
    },
    dataCases: {
      possiblePricesStruct: {
        tableHeader: 'Сумма без учета дополнительной скидки',
        // prices: window.proxiedState.imeiStep?.__response?.possible_prices
        prices: imeiResponse.possible_prices || {},
      },
      subsidiesStruct: {
        // --- NOTE: One of two is required!
        prices: imeiResponse.possible_prices || {},
        price: 0, // NOTE: Optional; prices field has a higher priority
        // --
        tableHeader: 'Сумма с учетом дополнительной скидки при покупке следующих моделей',
        subsidies: imeiResponse.possible_subsidies || [],
        noAllZeroSubsidies: true,
        itemValidation: ({ prices }) => !!prices,
      },
      subsidiesStruct2: finalPriceTableProps?.subsidiesStruct2,

    },
  })
  return (
    <div
      style={{
        minWidth: '100%',
        overflowX: 'auto',
        boxSizing: 'border-box',
      }}
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  )
}
