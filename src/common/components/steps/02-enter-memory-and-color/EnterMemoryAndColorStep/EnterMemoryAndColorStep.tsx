import { useLayoutEffect } from 'react'
import { ContentWithControls, TControlBtn } from '~/common/components/sp-custom'
import baseClasses from '~/App.module.scss'
import clsx from 'clsx'
// import { NSP } from '~/utils/httpClient/types'
import { Menu, TMenuProps } from '~/common/components/tailwind'

type TProps = {
  header: string;
  subheader: string | string[];
  skipStepSettings?: {
    doIt: boolean;
    cb: () => void;
  };
  nextBtn: TControlBtn;
  prevBtn: TControlBtn;
  menus: (TMenuProps & { isEnabled: boolean; })[];
}

export const EnterMemoryAndColorStep = ({
  header,
  subheader,
  skipStepSettings,
  nextBtn,
  prevBtn,
  menus,

}: TProps) => {
  useLayoutEffect(() => {
    if (skipStepSettings?.doIt) skipStepSettings.cb()
  }, [skipStepSettings])
  return (
    <ContentWithControls
      header={header}
      subheader={subheader}
      controls={[
        nextBtn,
        prevBtn,
      ]}
    >
      <div className={clsx(baseClasses.specialActionsGrid)}>
        {
          menus.map(({ isEnabled, ...menuProps }, i) => {
            if (!isEnabled) return null
            return <Menu {...menuProps} key={`${menuProps.label}-${i}`} />
          })
        }
        {/*
          !imeiResponse?.phone.memory && (
            <Menu
              selectedId={customSelectedMemoryValue}
              onItemSelect={onMemorySelect}
              sections={[
                {
                  id: 'mem',
                  items: state.context.memory.dynamicList.length > 0
                    ? state.context.memory.dynamicList
                    : state.context.imei.result.memoryList
                }
              ]}
              label={!state.context.memory.selectedItem ? 'Выберите Память' : state.context.memory.selectedItem.label}
              isDisabled={state.context.memory.dynamicList.length === 0 && state.context.imei.result.memoryList.length === 0}
              shoudHaveAttention={!state.context.memory.selectedItem}
            />
          )
        */}
        {/*
          !state.context.imei.response?.phone.color && (
            <Menu
              selectedId={state.context.color.selectedItem?.value}
              onItemSelect={({ item }) => send({ type: 'SET_COLOR', value: item })}
              sections={[
                {
                  id: 'col',
                  items: state.context.color.dynamicList,
                }
              ]}
              label={!state.context.color.selectedItem ? 'Выберите Цвет' : state.context.color.selectedItem.label}
              isDisabled={state.context.imei.response?.phone.memory ? state.context.color.dynamicList.length === 0 : !state.context.memory.selectedItem}
              shoudHaveAttention={!state.context.color.selectedItem}
            />
          )
        */}
      </div>
      {/* <pre className={baseClasses.preStyled}>{JSON.stringify(state.context.imei.response, null, 2)}</pre> */}
    </ContentWithControls>
  )
}
