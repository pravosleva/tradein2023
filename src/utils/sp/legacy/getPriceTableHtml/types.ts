/* eslint-disable @typescript-eslint/no-explicit-any */
import { NSP } from '~/utils/httpClient/types'


export type TCfg = {
  // tableClassName: ['nw-2022-small-table-text'],
  color?: string;
  memory?: string;
  currency: string;
  enabledConditionsCodes: string[];
  possibleConditionCodes: {
    value: string;
    label: string;
  }[];
};
export type TDataCases = {
  possiblePricesStruct: {
    tableHeader: string;
    prices: NSP.TSubcidyPricesObject;
  };
  subsidiesStruct: {
    // --- NOTE: One of two is required!
    prices: NSP.TSubcidyPricesObject;
    price: number; // NOTE: Optional; prices field has a higher priority
    // --
    tableHeader: string;
    subsidies: NSP.TSubcidy[];
    noAllZeroSubsidies: boolean;
    itemValidation: ({ prices }: { prices: NSP.TSubcidyPricesObject }) => boolean;
  };
  subsidiesStruct2?: {
    tableHeader: string;
    subsidies?: any;
    price?: number;
    itemValidation?: (item: any) => boolean;
    noAllZeroSubsidies?: boolean;
  };
  subsidiesStruct3?: {
    tableHeader: string;
    price?: number;
    modelTitle: string;

  };
}