import { useLayoutEffect } from 'react'
import { ContentWithControls, TControlBtn } from '~/common/components/sp-custom'
import baseClasses from '~/App.module.scss'
import clsx from 'clsx'
import { Listbox, TListboxProps } from '~/common/components/tailwind'

type TProps = {
  header: string;
  subheader: string | string[];
  skipStepSettings?: {
    doIt: boolean;
    cb: () => void;
  };
  nextBtn: TControlBtn;
  prevBtn: TControlBtn;
  listboxes: (TListboxProps & { isEnabled: boolean; id: string; })[];
  defaultAutofocusId?: string;
}

export const EnterMemoryAndColorStep = ({
  header,
  subheader,
  skipStepSettings,
  nextBtn,
  prevBtn,
  listboxes,
  defaultAutofocusId,
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
          listboxes.map(({ isEnabled, id, ...menuProps }, i) => {
            if (!isEnabled) return null
            return <Listbox makeAutofocus={defaultAutofocusId ? defaultAutofocusId === id : false} {...menuProps} key={`${menuProps.placeholder}-${i}`} />
          })
        }
      </div>
      {/* <pre className={baseClasses.preStyled}>{JSON.stringify(state.context.imei.response, null, 2)}</pre> */}
    </ContentWithControls>
  )
}
