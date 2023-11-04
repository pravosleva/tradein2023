/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-explicit-any */
// export type TStandartData = {
//   ok: boolean;
//   message?: string;
//   [key: string]: any;
// }

export namespace NSP {
  export type TPhone = {
    vendor?: string;
    type?: string;
    model?: string;
    memory?: string;
    memory_choices: string[];
    color?: string;
    color_choices: {
      [key: string]: string[];
    };
    // find_my_iphone: any;
  }
  export type TSubcidyPricesObject = {
    [key: string]: {
      [key: string]: {
        [key: string]: number;
      };
    };
  };
  export type TSubcidy = {
    prices: TSubcidyPricesObject;
    vendor: string;
    model: string;
    title: string;
    default_variant_id?: number;
  }

  export type TImeiResponse = {
    ok: boolean;
    phone: TPhone;
    imei: string;
    currency: string;
    possible_prices: {
      [key: string]: {
        [key: string]: {
          [key: string]: number;
        }
      }
    };
    possible_subsidies: TSubcidy[];
    photo?: string | null;
    id: number;
    show_warning: boolean;
    raw_data:string;
    analytics_session_id: number;
    seconds_since_analytics_session_started: string; // "2022-09-15T13:06+03:00",
  };
  export type TCheckPhoneResponse = {
    ok: boolean;
    currency: string; // 'RUB'
    price: number;
    id: number;
    condition: string; // 'NC'
    sp_condition: string; // 'n_grade_best'
    nine_photos_mode: string; // 'lite'
    subsidies: any[]; // TODO
    sim_check_enabled: boolean;
  };
  export type TPhotoLinkResponse = {
    ok: boolean;
    qr: string;
    short_url: string;
    qr_url: string;
  };
  export type TPhotoStatusResponse = {
    ok: boolean;
    started: boolean;
    // TODO: Declare all statuses here
    status: 'ok' | 'not_checked' | 'fake' | 'bad_quality'; // NOTE: Чтоб крутилка исчезла и флоу пошел дальше
    photo_states: {
      // TODO: Declare all statuses here
      [key: string]: 'not_checked';
    };
    loop: boolean;
    // TODO: Declare all condition vals here
    condition: 'C' | 'D' | 'NC';
    // TODO: Wtf is this?
    condition_limit: null | any;
    // TODO: Declare all condition_limit_reason vals here
    condition_limit_reason: null | 'no_defects';
    is_condition_limit_violated: boolean;
  };
}
