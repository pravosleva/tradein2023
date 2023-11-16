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
          id: "getUserData",
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
          id: "sendImei",
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
          id: "checkPhone",
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
          id: "getPhotoLink",
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
          goUploadPhotoResultInNotOk: {
            target: "UploadPhotoResultInNotOk",
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
      UploadPhotoResultInNotOk: {
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
          id: "sendContract",
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
        | { type: "goUploadPhotoResultInNotOk" }
        | { type: "goContract" }
        | { type: "goStart" },
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
