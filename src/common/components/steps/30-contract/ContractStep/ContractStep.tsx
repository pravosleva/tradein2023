/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Form } from '~/common/components/sp-custom'
import baseClasses from '~/App.module.scss'

type TProps = {
  onFormReady: ({ formState }: { formState: any; }) => void;
  onFormNotReady: ({ formState }: { formState: any; }) => void;
}

export const ContractStep = ({
  onFormReady,
  onFormNotReady,
}: TProps) => {
  return (
    <div className={baseClasses.stack}>
      {/* <div>[ ContractStep ]</div> */}
      <Form
        getValues={(vals) => {
          console.log(vals)
        }}
        // onSubmit={(data) => {
        //   console.log(data)
        // }}
        onFormReady={({ state }) => {
          // console.log(state)
          onFormReady({ formState: state })
        }} 
        onFormNotReady={({ state }) => {
          // console.log(state)
          onFormNotReady({ formState: state })
        }} 
        schema={{
          lastName: {
            type: 'text',
            label: 'Фамилия',
            validate: (val: string) => val.length >= 3,
            isRequired: true,
          },
          name: {
            type: 'text',
            label: 'Имя',
            validate: (val: string) => val.length >= 3,
            isRequired: true,
          },
          middleName: {
            type: 'text',
            label: 'Отчество',
            validate: (val: string) => val.length >= 3,
            isRequired: true,
          },
          phone: {
            type: 'tel',
            label: 'Телефон',

            // TODO: Other countries
            validate: (val: string) => val.length === 11,
            // NOTE: For example 79163385212
            
            isRequired: true,
          },
        }}
      />
    </div>
  )
}
