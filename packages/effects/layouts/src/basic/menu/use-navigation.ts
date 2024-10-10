import { useRouter } from 'vue-router';

import { isHttpUrl, isObject, openWindow } from '@vben/utils';

function useNavigation() {
  const router = useRouter();
  const allRoutes = router.getRoutes();

  const navigation = async (path: string) => {
    if (isHttpUrl(path)) {
      openWindow(path, { target: '_blank' });
    } else {
      // 带路由参数
      const found = allRoutes.find((item) => item.path === path);
      if (found && isObject(found.meta.query)) {
        await router.push({ path, query: found.meta.query });
        return;
      }
      await router.push(path);
    }
  };

  return { navigation };
}

export { useNavigation };
