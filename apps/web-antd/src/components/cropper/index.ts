import { withInstall } from '#/utils';

import cropperImage from './src/cropper.vue';
import avatarCropper from './src/cropper-avatar.vue';

export type { Cropper } from './src/typing';
export const CropperImage = withInstall(cropperImage);
export const CropperAvatar = withInstall(avatarCropper);
