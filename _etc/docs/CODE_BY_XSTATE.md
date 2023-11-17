```js
import { createMachine } from "xstate";

export const machine = createMachine(
  {
    context: {
      imei: "",
      color: "",
      memory: "",
    },
    id: "tradein-2023",
    initial: "AppInit",
    states: {
      AppInit: {
        invoke: {
          src: "getUserDataMachine",
          id: "/_tmp/me",
          onDone: [
            {
              target: "EnterImei",
            },
          ],
          onError: [
            {
              target: "AppInitErr",
            },
          ],
        },
      },
      EnterImei: {
        on: {
          goNext: {
            target: "SendImei",
          },
        },
      },
      AppInitErr: {},
      SendImei: {
        invoke: {
          src: "fetchIMEIMachine",
          id: "/partner_api/tradein/imei",
          onDone: [
            {
              target: "EnterMemoryAndColor",
            },
          ],
          onError: [
            {
              target: "SendImeiErr",
            },
          ],
        },
      },
      EnterMemoryAndColor: {
        on: {
          goPrev: {
            target: "EnterImei",
          },
          goNext: {
            target: "PrePriceTable",
          },
        },
      },
      SendImeiErr: {
        on: {
          goPrev: {
            target: "EnterImei",
          },
        },
      },
      PrePriceTable: {
        on: {
          goPrev: {
            target: "EnterMemoryAndColor",
          },
          goNext: {
            target: "CheckPhone",
          },
        },
      },
      CheckPhone: {
        invoke: {
          src: "checkPhoneMachine",
          id: "/partner_api/tradein/phone/check",
          onDone: [
            {
              target: "GetPhotoLink",
            },
          ],
          onError: [
            {
              target: "CheckPhoneErr",
            },
          ],
        },
      },
      GetPhotoLink: {
        invoke: {
          src: "getPhotoLinkMachine",
          id: "/partner_api/photo/link",
          onDone: [
            {
              target: "UploadPhotoInProgress",
            },
          ],
          onError: [
            {
              target: "GetPhotoLinkErr",
            },
          ],
        },
      },
      CheckPhoneErr: {},
      UploadPhotoInProgress: {
        on: {
          goNext: {
            target: "FinalPriceTable",
          },
          goPrev: {
            target: "PrePriceTable",
          },
          goErr: {
            target: "UploadPhotoResultIsFuckup",
          },
        },
      },
      GetPhotoLinkErr: {},
      FinalPriceTable: {
        on: {
          goNext: {
            target: "Contract",
          },
        },
      },
      UploadPhotoResultIsFuckup: {
        on: {
          goPrev: {
            target: "PrePriceTable",
          },
        },
      },
      Contract: {
        on: {
          goPrev: {
            target: "FinalPriceTable",
          },
          goNext: {
            target: "ContractSending",
          },
        },
      },
      ContractSending: {
        invoke: {
          src: "sendContractMachine",
          id: "/partner_api/tradein/client/data",
          onDone: [
            {
              target: "Final",
            },
          ],
          onError: [
            {
              target: "ContractError",
            },
          ],
        },
      },
      Final: {
        on: {
          goContract: {
            target: "Contract",
          },
          goStart: {
            target: "AppInit",
          },
        },
      },
      ContractError: {
        on: {
          goPrev: {
            target: "FinalPriceTable",
          },
        },
      },
    },
    schema: {
      events: {} as
        | { type: "goNext" }
        | { type: "goPrev" }
        | { type: "goStart" }
        | { type: "goContract" }
        | { type: "goErr" },
      context: {} as { imei: string; color: string; memory: string },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {},
    services: {
      getUserDataMachine: createMachine({
        /* ... */
      }),
      fetchIMEIMachine: createMachine({
        /* ... */
      }),
      checkPhoneMachine: createMachine({
        /* ... */
      }),
      getPhotoLinkMachine: createMachine({
        /* ... */
      }),
      sendContractMachine: createMachine({
        /* ... */
      }),
    },
    guards: {},
    delays: {},
  },
);
```
