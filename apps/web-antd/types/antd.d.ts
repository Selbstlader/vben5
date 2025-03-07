import type { RuleObject } from 'ant-design-vue/es/form';

declare global {
  type AntdFormRules<T> = {
    [key: string]: RuleObject[];
  } & {
    [K in keyof T]?: RuleObject[];
  };
}

export {};
