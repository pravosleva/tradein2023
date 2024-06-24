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
export type TQuizByVendorFormat = {
  [key: string]: {
    label: string;
    options: {
      label: string;
      value: string;
    }[];
    descr?: TDescr;
  };
};
