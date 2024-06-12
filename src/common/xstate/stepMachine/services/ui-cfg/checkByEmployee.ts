// const VITE_PUBLIC_URL = import.meta.env.VITE_PUBLIC_URL
// const PUBLIC_URL = VITE_PUBLIC_URL || ''

export type TGalleryImage = {
  src: string;
  title?: string;
  caption?: string;
}
export type TDescr = {
  howDoesItWorks: {
    link?: {
      label: string;
      galleryImages: TGalleryImage[];
    };
    btn?: {
      label: string;
      galleryImages: TGalleryImage[];
    };
  };
};
type TQuizByVendorFormat = {
  [key: string]: {
    label: string;
    options: {
      label: string;
      value: string;
    }[];
    descr?: TDescr;
  };
};
export const checkByEmployeeCfg: {
  [key: string]: TQuizByVendorFormat; // NOTE: Vendor
  DEFAULT: TQuizByVendorFormat;
} = {
  Apple: {
    diag_model: {
      label: 'Описание совпадает по модели, объему памяти и цвету',
      options: [
        {
          label: 'Да',
          value: '1',
        },
        {
          label: 'Нет',
          value: '0',
        },
      ],
      descr: {
        howDoesItWorks: {
          // link: {
          //   label: 'Как проверить?',
          //   galleryImages: [],
          // },
          btn: {
            label: 'Как проверить?',
            galleryImages: [],
          },
        },
      },
    },
    diag_akb: {
      label: 'Укажите % емкости аккумуляторной батареи',
      options: [
        {
          label: 'Более 85 %',
          value: '1',
        },
        {
          label: 'Менее 85 %',
          value: '0',
        },
      ],
      descr: {
        howDoesItWorks: {
          // link: {
          //   label: 'Как проверить?',
          //   galleryImages: [],
          // },
          btn: {
            label: 'Как проверить?',
            galleryImages: [],
          },
        },
      },
    },
    diag_touch: {
      label: 'Проверьте сенсорную панель (TouchScreen)',
      options: [
        {
          label: 'Работает',
          value: '1',
        },
        {
          label: 'Работает частично / Не работает',
          value: '0',
        },
      ],
      descr: {
        howDoesItWorks: {
          // link: {
          //   label: 'Как проверить?',
          //   galleryImages: [],
          // },
          btn: {
            label: 'Как проверить?',
            galleryImages: [],
          },
        },
      },
    },
    diag_camera: {
      label: 'Проверьте основную фото-камеру',
      options: [
        {
          label: 'Работает',
          value: '1',
        },
        {
          label: 'Не работает',
          value: '0',
        },
      ],
      descr: {
        howDoesItWorks: {
          // link: {
          //   label: 'Как проверить?',
          //   galleryImages: [],
          // },
          btn: {
            label: 'Как проверить?',
            galleryImages: [],
          },
        },
      },
    },
  },
  DEFAULT: {
    diag_model: {
      label: 'Описание совпадает по модели, объему памяти и цвету',
      options: [
        {
          label: 'Да',
          value: '1',
        },
        {
          label: 'Нет',
          value: '0',
        },
      ],
      descr: {
        howDoesItWorks: {
          // link: {
          //   label: 'Как проверить?',
          //   galleryImages: [],
          // },
          btn: {
            label: 'Как проверить?',
            galleryImages: [
              // {
              //   title: 'Шаг 1.',
              //   caption: 'Перейдите в приложение [Настройки]',
              //   src: `${PUBLIC_URL}/static3/img/hints/apple/unlock_hint_1.jpg`,
              // },
              // {
              //   title: 'Шаг 2.',
              //   caption: 'Выберите раздел учётной записи',
              //   src: `${PUBLIC_URL}/static3/img/hints/apple/unlock_hint_2.jpg`,
              // },
              // {
              //   title: 'Шаг 3.',
              //   caption: 'Прокрутите вниз и нажмите кнопку [Выйти]',
              //   src: `${PUBLIC_URL}/static3/img/hints/apple/unlock_hint_3.jpg`,
              // },
              // {
              //   title: 'Шаг 4.',
              //   caption: 'Введите пароль от учётной записи iCloud и нажмите [Выкл.]',
              //   src: `${PUBLIC_URL}/static3/img/hints/apple/unlock_hint_4.jpg`,
              // },
            ],
          },
        },
      },
    },
    diag_touch: {
      label: 'Проверьте сенсорную панель (TouchScreen)',
      options: [
        {
          label: 'Работает',
          value: '1',
        },
        {
          label: 'Работает частично / Не работает',
          value: '0',
        },
      ],
      descr: {
        howDoesItWorks: {
          // link: {
          //   label: 'Как проверить?',
          //   galleryImages: [],
          // },
          btn: {
            label: 'Как проверить?',
            galleryImages: [
              // {
              //   title: 'Dev exp img 1.',
              //   caption: 'Делай раз',
              //   src: `${PUBLIC_URL}/static3/img/hints/exp-danger.jpg`,
              // },
              // {
              //   title: 'Dev exp img 2.',
              //   caption: 'Делай два',
              //   src: `${PUBLIC_URL}/static3/img/hints/exp-development.jpg`,
              // },
            ],
          },
        },
      },
    },
    diag_camera: {
      label: 'Проверьте основную фото-камеру',
      options: [
        {
          label: 'Работает',
          value: '1',
        },
        {
          label: 'Не работает',
          value: '0',
        },
      ],
      descr: {
        howDoesItWorks: {
          // link: {
          //   label: 'Как проверить?',
          //   galleryImages: [],
          // },
          btn: {
            label: 'Как проверить?',
            galleryImages: [],
          },
        },
      },
    },
  },
}
