<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Transfer } from 'ant-design-vue';

import { userList } from '#/api/system/user';

defineOptions({
  name: 'UserSelectModal',
  inheritAttrs: false,
});

const [BasicModal] = useVbenModal({
  title: '选择',
  class: 'w-[800px]',
});

const targetKeys = ref<string[]>([]);

const dataSource = ref<Awaited<ReturnType<typeof userList>>['rows']>([]);
onMounted(async () => {
  const resp = await userList({ pageNum: 1, pageSize: 10 });
  dataSource.value = resp.rows.map((item) => ({
    ...item,
    userId: String(item.userId),
  }));
});
</script>

<template>
  <BasicModal>
    <div class="min-h-[350px]">
      <Transfer
        v-model:target-keys="targetKeys"
        :data-source="dataSource"
        :pagination="true"
        :render="(item) => item.nickName"
        :row-key="(record) => record.userId"
        class="h-full"
      />
    </div>
  </BasicModal>
</template>
