import imageMixin from "@/mixins/imageMixin";

interface ImageRecord {
  images?: string[] | null;
  [key: string]: unknown;
}

interface DetailViewImage extends ImageRecord {
  thumbnailImage: string;
  originalImage: string;
  imageWidth?: number | null;
  imageHeight?: number | null;
  altText: string;
}

interface HelperMixinThis {
  detailViewImages: DetailViewImage[];
  imageExists: boolean;
  item: ImageRecord;
  responseResultsCount: number;
  responseResults: ImageRecord[];
  getDetailViewImages(images: string[]): Promise<void>;
  getImageUrl(url: string | null | undefined): string;
  getImageAltText(imageObject: ImageRecord): string;
}

const helperMixin = {
  mixins: [imageMixin],

  data: (): { detailViewImages: DetailViewImage[] } => ({
    detailViewImages: [],
  }),

  watch: {
    "item.images": {
      handler: async function (
        this: HelperMixinThis,
        newVal: string[],
      ): Promise<void> {
        await this.getDetailViewImages(newVal);
      },
    },
  },

  methods: {
    async getDetailViewImages(
      this: HelperMixinThis,
      images: string[],
    ): Promise<void> {
      if (this.imageExists) {
        const asyncRes = await Promise.all(
          images.map(async (image) => {
            const img = await getMeta(this.getImageUrl(image));

            return {
              ...this.item,
              thumbnailImage: this.getImageUrl(image),
              originalImage: image,
              imageWidth: img.width ? img.width : null,
              imageHeight: img.height ? img.height : null,
              altText: this.getImageAltText(this.item),
            };
          }),
        );
        if (asyncRes) this.detailViewImages = asyncRes;
        else this.detailViewImages = [];
      } else this.detailViewImages = [];
    },
  },

  computed: {
    searchResultImages(this: HelperMixinThis): DetailViewImage[] {
      if (this.responseResultsCount > 0) {
        const responsesWithImages = this.responseResults.filter(
          (image): image is ImageRecord & { images: string[] } =>
            !!image.images,
        );
        const allImages: DetailViewImage[] = [];

        responsesWithImages.forEach((item) =>
          item.images.forEach((image) => {
            allImages.push({
              ...item,
              thumbnailImage: this.getImageUrl(image),
              originalImage: image,
              altText: this.getImageAltText(item),
            });
          }),
        );

        return allImages;
      } else return [];
    },
  },
};

function getMeta(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

export default helperMixin;
