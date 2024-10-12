import type { Directive } from 'vue';

declare module 'vue' {
  export interface ComponentCustomProperties {
    /**
     * 判断权限: v-access:code=""
     * 判断角色  v-access:role=""
     * VueOfficial插件暂时不支持判断modifer/arg
     * @see https://github.com/vuejs/language-tools/issues/4810
     */
    vAccess: Directive<Element, string | string[]>;
  }
}
