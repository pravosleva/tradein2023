## Usage

```tsx
const VITE_PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL
const PUBLIC_URL = VITE_PUBLIC_URL || ''

<ButtonWithImageGallery
  label='Как отключить?'
  items={[
    {
      title: 'Шаг 1.',
      caption: 'Перейдите в приложение [Настройки]',
      src: `${PUBLIC_URL}/static3/img/hints/apple/unlock_hint_1.jpg`,
    },
    {
      title: 'Шаг 2.',
      caption: 'Выберите раздел учётной записи',
      src: `${PUBLIC_URL}/static3/img/hints/apple/unlock_hint_2.jpg`,
    },
    {
      title: 'Шаг 3.',
      caption: 'Прокрутите вниз и нажмите кнопку [Выйти]',
      src: `${PUBLIC_URL}/static3/img/hints/apple/unlock_hint_3.jpg`,
    },
    {
      title: 'Шаг 4.',
      caption: 'Введите пароль от учётной записи iCloud и нажмите [Выкл.]',
      src: `${PUBLIC_URL}/static3/img/hints/apple/unlock_hint_4.jpg`,
    },
  ]}
  btnUI={{
    color: 'mtsRed',
    variant: 'outlined',
  }}
  EnabledStartIcon={<FaGear />}
/>
```
