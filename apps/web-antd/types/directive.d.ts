import type { Directive } from 'vue';

declare module 'vue' {
  export interface ComponentCustomProperties {
    /**
     * 判断权限: v-access:code=""
     * 判断角色  v-access:role=""
     * TODO: 泛型第四个函数为code或role 不生效
     */
    vAccess: Directive<Element, string | string[]>;
  }
}
