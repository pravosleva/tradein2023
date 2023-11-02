import { ContentWithControls, TControlBtn } from '~/common/components/sp-custom/ContentWithControls'
import baseClasses from '~/App.module.scss'

type TProps = {
  header: string;
  controls: TControlBtn[];
}

export const UploadPhotoProcessStep = ({
  header,
  controls,
}: TProps) => {
  return (
    <ContentWithControls
      header={header}
      controls={controls}
    >
      <h3 className='text-2xl font-bold'>TODO</h3>
      <ul className="max-w-md px-4 space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
        <li>UploadPhotoProcessStep</li>
        <li>Polling Component
          <ul className="max-w-md px-4 space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
            <li><code className={baseClasses.inlineCode}>onSuccess</code></li>
            <li><code className={baseClasses.inlineCode}>onError</code></li>
          </ul>
        </li>
      </ul>
    </ContentWithControls>
  )
}
