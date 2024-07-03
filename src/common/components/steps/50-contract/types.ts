/* eslint-disable @typescript-eslint/no-explicit-any */
import { ECountryCode } from '~/common/xstate/stepMachine'

export type TContractFormProps = {
  defaultCountryCode: ECountryCode;
  onFormReady: ({ formState }: { formState: any; }) => void;
  onFormNotReady: ({ formState }: { formState: any; }) => void;
}
export type TContractFormValiateResult = { ok: boolean; reason?: string; }
