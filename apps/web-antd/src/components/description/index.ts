import { withInstall } from '#/utils';

import description from './src/description.vue';

export * from './src/typing';
export { useDescription } from './src/useDescription';
export const Description = withInstall(description);
