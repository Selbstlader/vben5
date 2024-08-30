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
        component: '/_core/about/index',
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
   * 优化后的后台路由转 vben 路由
   *
   * @param menuList 后台菜单
   * @param parentPath 上级目录
   * @returns vben 路由
   */
  function backMenuToVbenMenu(
    menuList: Menu[],
    parentPath = '',
  ): RouteRecordStringComponent[] {
    const resultList: RouteRecordStringComponent[] = [];

    menuList.forEach((menu) => {
      // 根目录处理
      if (isRootMenu(menu)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        menu.meta = menu.children[0]!.meta;
        menu.component = 'RootMenu';
      }

      // 外链处理
      if (isExternalLink(menu)) {
        menu.component = 'Link';
      }

      // 内嵌 iframe 处理
      if (isIframe(menu)) {
        menu.component = 'IFrameView';
      }

      // 处理路径
      menu.path = formatPath(menu.path, parentPath);

      const vbenRoute: RouteRecordStringComponent = createVbenRoute(menu);

      // 处理组件类型
      handleComponentType(menu, vbenRoute);

      // 递归处理子路由
      if (menu.children && menu.children.length > 0) {
        vbenRoute.children = backMenuToVbenMenu(menu.children, menu.path);
      }

      resultList.push(vbenRoute);
    });

    return resultList;
  }

  /**
   * 根目录处理
   * @param menu
   */
  function isRootMenu(menu: Menu): boolean {
    return menu.path === '/' && menu.children && menu.children.length === 1;
  }

  /**
   * 外链判断
   * @param menu
   */
  function isExternalLink(menu: Menu): boolean {
    return (
      /^https?:\/\//.test(menu.path) &&
      (menu.component === 'Layout' || menu.component === 'ParentView')
    );
  }

  /**
   * 内嵌 iframe 判断
   * @param menu
   */
  function isIframe(menu: Menu): boolean {
    return !!menu.meta?.link && menu.component === 'InnerLink';
  }

  /**
   * 格式化路径
   * @param path
   * @param parentPath
   */
  function formatPath(path: string, parentPath: string): string {
    // 如果父路径是根目录且当前路径不是根目录，避免多余的斜杠
    if (parentPath === '/' && path !== '/') {
      return `/${path}`;
    }
    // 如果当前路径是根目录，直接返回
    if (path === '/') {
      return parentPath ? `${parentPath}` : path;
    }
    // 处理其他正常情况
    return parentPath ? `${parentPath}/${path}` : path;
  }

  /**
   * 创建 vben 路由
   * @param menu
   */
  function createVbenRoute(menu: Menu): RouteRecordStringComponent {
    return {
      component: menu.component,
      meta: {
        hideInMenu: menu.hidden,
        icon: menu.meta?.icon,
        keepAlive: !menu.meta?.noCache,
        title: menu.meta?.title,
      },
      name: menu.name,
      path: menu.path,
    };
  }

  /**
   * 处理不同组件类型
   * @param menu
   * @param vbenRoute
   */
  function handleComponentType(
    menu: Menu,
    vbenRoute: RouteRecordStringComponent,
  ) {
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
        handleIframePath(vbenRoute);
        break;
      }
      /**
       * 外链 新窗口打开
       */
      case 'Link': {
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
      }
    }
  }

  /**
   * 处理 iframe 路径中的特殊字符
   * @param vbenRoute
   */
  function handleIframePath(vbenRoute: RouteRecordStringComponent) {
    if (vbenRoute.meta) {
      vbenRoute.meta.iframeSrc = vbenRoute.meta.link;

      const specialChars = ['#', '?', '&'];
      specialChars.forEach((char) => {
        if (vbenRoute.path.includes(char)) {
          vbenRoute.path = vbenRoute.path.replace(char, '');
        }
      });
    }
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
