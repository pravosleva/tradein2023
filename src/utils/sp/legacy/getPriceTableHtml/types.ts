/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NSP } from '~/utils/httpClient/types'

export namespace NLegacy2017Props {
  export type TSubsidiesStruct = {
    // --- NOTE: One of two is required!
    prices: NSP.TSubcidyPricesObject;
    price: number; // NOTE: Optional; prices field has a higher priority
    // --
    tableHeader: string;
    subsidies: NSP.TSubcidy[];
    noAllZeroSubsidies: boolean;
    itemValidation: ({ prices }: { prices: NSP.TSubcidyPricesObject }) => boolean;
  };
  export type TSubsidiesStruct2 = {
    tableHeader: string;
    subsidies?: any;
    price?: number;
    itemValidation?: (item: any) => boolean;
    noAllZeroSubsidies?: boolean;
  };
  export type TSubsidiesStruct3 = {
    tableHeader: string;
    price?: number;
    modelTitle: string;
  };
}


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
  subsidiesStruct: NLegacy2017Props.TSubsidiesStruct;
  subsidiesStruct2?: NLegacy2017Props.TSubsidiesStruct2;

  // NOTE: Not used
  subsidiesStruct3?: NLegacy2017Props.TSubsidiesStruct3;
};
