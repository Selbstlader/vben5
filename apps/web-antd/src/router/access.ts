import type {
  ComponentRecordType,
  GenerateMenuAndRoutesOptions,
  RouteRecordStringComponent,
} from '@vben/types';

import { generateAccessible } from '@vben/access';
import { preferences } from '@vben/preferences';

import { message } from 'ant-design-vue';
import { cloneDeep } from 'lodash-es';

import { getAllMenusApi, type Menu } from '#/api';
import { BasicLayout, IFrameView } from '#/layouts';
import { $t } from '#/locales';

const forbiddenComponent = () => import('#/views/_core/fallback/forbidden.vue');
const NotFoundComponent = () => import('#/views/_core/fallback/not-found.vue');

/**
 * 这里放本地路由
 */
const localMenuList: RouteRecordStringComponent[] = [
  {
    component: 'BasicLayout',
    meta: {
      order: -1,
      title: 'page.dashboard.title',
    },
    name: 'Dashboard',
    path: '/',
    redirect: '/analytics',
    children: [
      {
        name: 'Analytics',
        path: '/analytics',
        component: '/dashboard/analytics/index',
        meta: {
          affixTab: true,
          title: 'page.dashboard.analytics',
        },
      },
      {
        name: 'Workspace',
        path: '/workspace',
        component: '/dashboard/workspace/index',
        meta: {
          title: 'page.dashboard.workspace',
        },
      },
      {
        name: 'VbenDocument',
        path: '/vben-admin/document',
        component: 'IFrameView',
        meta: {
          icon: 'lucide:book-open-text',
          iframeSrc: 'https://dapdap.top',
          keepAlive: true,
          title: $t('page.vben.document'),
        },
      },
    ],
  },
  {
    component: 'BasicLayout',
    meta: {
      hideChildrenInMenu: true,
      icon: 'lucide:copyright',
      order: 9999,
      title: $t('page.vben.about'),
    },
    name: 'About',
    path: '/about',
    children: [
      {
        component: '/_core/vben/about/index',
        meta: {
          title: $t('page.vben.about'),
        },
        name: 'VbenAbout',
        path: '/vben-admin/about',
      },
    ],
  },
];

async function generateAccess(options: GenerateMenuAndRoutesOptions) {
  const pageMap: ComponentRecordType = import.meta.glob('../views/**/*.vue');

  const layoutMap: ComponentRecordType = {
    BasicLayout,
    IFrameView,
    NotFoundComponent,
  };

  /**
   * 后台路由转vben路由
   *
   * todo 需要重构
   * @param menuList 后台菜单
   * @param parentPath 上级目录
   * @returns vben路由
   */
  function backMenuToVbenMenu(
    menuList: Menu[],
    parentPath = '',
  ): RouteRecordStringComponent[] {
    const resultList: RouteRecordStringComponent[] = [];
    menuList.forEach((menu) => {
      // 根目录为菜单形式
      // 固定有一个children  children为当前菜单
      if (menu.path === '/' && menu.children && menu.children.length === 1) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        menu.meta = menu.children[0]!.meta;
        /**
         * todo 先写死 后续再优化
         */
        menu.path = '/root_menu';
        menu.component = 'RootMenu';
      }
      // 外链: http开头 & 组件为Layout || ParentView
      // 正则判断是否为http://或者https://开头
      if (
        /^http(s)?:\/\//.test(menu.path) &&
        (menu.component === 'Layout' || menu.component === 'ParentView')
      ) {
        menu.component = 'Link';
      }
      // 内嵌iframe 组件为InnerLink
      if (menu.meta?.link && menu.component === 'InnerLink') {
        menu.component = 'IFrameView';
      }

      // path
      if (parentPath) {
        menu.path = `${parentPath}/${menu.path}`;
      }

      const vbenRoute: RouteRecordStringComponent = {
        component: menu.component,
        meta: {
          // 当前路由不在菜单显示 但是可以通过链接访问
          // 不可访问的路由由后端控制隐藏(不返回对应路由)
          hideInMenu: menu.hidden,
          icon: menu.meta?.icon,
          keepAlive: !menu.meta?.noCache,
          title: menu.meta?.title,
        },
        name: menu.name,
        path: menu.path,
      };

      /**
       * 处理不同组件
       */
      switch (menu.component) {
        case 'Layout': {
          vbenRoute.component = 'BasicLayout';
          break;
        }
        /**
         * iframe内嵌
         */
        case 'IFrameView': {
          vbenRoute.component = 'IFrameView';
          if (vbenRoute.meta) {
            vbenRoute.meta.iframeSrc = menu.meta.link;
          }
          /**
           * 需要判断特殊情况  比如vue的hash是带#的
           * 比如链接 aaa.com/#/bbb  path会转换为 aaa/com/#/bbb
           * 比如链接 aaa.com/?bbb=xxx
           * 需要去除#  否则无法被添加到路由
           */
          /**
           * todo 不优雅 考虑别的方案
           */
          if (vbenRoute.path.includes('/#/')) {
            vbenRoute.path = vbenRoute.path.replace('/#/', '');
          }
          if (vbenRoute.path.includes('#')) {
            vbenRoute.path = vbenRoute.path.replace('#', '');
          }
          if (vbenRoute.path.includes('?') || vbenRoute.path.includes('&')) {
            vbenRoute.path = vbenRoute.path.replace('?', '');
            vbenRoute.path = vbenRoute.path.replace('&', '');
          }
          break;
        }
        /**
         * 外链 新窗口打开
         */
        case 'Link': {
          if (vbenRoute.meta) {
            vbenRoute.meta.link = menu.meta.link;
          }
          vbenRoute.component = 'BasicLayout';
          break;
        }
        /**
         * 根目录菜单
         */
        case 'RootMenu': {
          if (vbenRoute.meta) {
            vbenRoute.meta.hideChildrenInMenu = true;
          }
          vbenRoute.component = 'BasicLayout';
          console.log('RootMenu', vbenRoute);
          break;
        }
        /**
         * 不能为layout 会套两层BasicLayout
         */
        case 'ParentView': {
          vbenRoute.component = '';
          break;
        }
        /**
         * 其他自定义组件 如system/user/index 拼接/
         */
        default: {
          vbenRoute.component = `/${menu.component}`;
          break;
        }
      }

      // children处理
      if (menu.children && menu.children.length > 0) {
        vbenRoute.children = backMenuToVbenMenu(menu.children, menu.path);
      }

      resultList.push(vbenRoute);
    });
    return resultList;
  }

  return await generateAccessible(preferences.app.accessMode, {
    ...options,
    fetchMenuListAsync: async () => {
      message.loading({
        content: `${$t('common.loadingMenu')}...`,
        duration: 1,
      });
      // 后台返回路由/菜单
      const backMenuList = await getAllMenusApi();
      // 转换为vben能用的路由
      const vbenMenuList = backMenuToVbenMenu(backMenuList);
      // 特别注意 这里要深拷贝
      const menuList = [...cloneDeep(localMenuList), ...vbenMenuList];
      console.log('menuList', menuList);
      return menuList;
    },
    // 可以指定没有权限跳转403页面
    forbiddenComponent,
    // 如果 route.meta.menuVisibleWithForbidden = true
    layoutMap,
    pageMap,
  });
}

export { generateAccess };
