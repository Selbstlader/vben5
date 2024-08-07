import type { NotificationItem } from '@vben/layouts';

import { computed, ref, watch } from 'vue';

import { useAppConfig } from '@vben/hooks';
import { useAccessStore } from '@vben/stores';

import { useEventSource } from '@vueuse/core';
import { notification } from 'ant-design-vue';
import dayjs from 'dayjs';
import { random } from 'lodash-es';
import { defineStore } from 'pinia';

const { apiURL, clientId } = useAppConfig(
  import.meta.env,
  import.meta.env.PROD,
);

export const useNotifyStore = defineStore(
  'app-notify',
  () => {
    const notificationList = ref<NotificationItem[]>([]);

    /**
     * 开始监听sse消息
     */
    function startListeningMessage() {
      const accessStore = useAccessStore();
      const token = accessStore.accessToken;

      const sseAddr = `${apiURL}/resource/sse?clientid=${clientId}&Authorization=Bearer ${token}`;

      const { data } = useEventSource(sseAddr, [], {
        autoReconnect: {
          delay: 1000,
          onFailed() {
            console.log('sse重连失败.');
          },
          retries: 3,
        },
      });

      watch(data, (message) => {
        if (!message) return;
        console.log(`接收到消息: ${message}`);

        notification.success({
          description: message,
          duration: 3,
          message: '收到新消息',
        });

        notificationList.value.unshift({
          // 随机头像
          avatar: `https://api.multiavatar.com/${random(0, 10_000)}.png`,
          date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          isRead: false,
          message,
          title: '消息',
        });

        data.value = null;
      });
    }

    /**
     * 设置全部已读
     */
    function setAllRead() {
      notificationList.value.forEach((item) => {
        item.isRead = true;
      });
    }

    /**
     * 设置单条消息已读
     * @param item 通知
     */
    function setRead(item: NotificationItem) {
      !item.isRead && (item.isRead = true);
    }

    /**
     * 清空全部消息
     */
    function clearAllMessage() {
      notificationList.value = [];
    }

    /**
     * 只需要空实现即可
     * 否则会在退出登录清空所有
     */
    function $reset() {
      // notificationList.value = [];
    }
    /**
     * 显示小圆点
     */
    const showDot = computed(() =>
      notificationList.value.some((item) => !item.isRead),
    );

    return {
      $reset,
      clearAllMessage,
      notificationList,
      setAllRead,
      setRead,
      showDot,
      startListeningMessage,
    };
  },
  {
    persist: {
      paths: ['notificationList'],
    },
  },
);
