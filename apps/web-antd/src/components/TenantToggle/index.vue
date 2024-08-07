<script setup lang="ts">
import { computed, onMounted, ref, unref } from 'vue';
import { useRouter } from 'vue-router';

import { useAccess } from '@vben/access';
import { DEFAULT_HOME_PATH } from '@vben/constants';
import { useTabs } from '@vben/hooks';

import { message, Select } from 'ant-design-vue';
import { storeToRefs } from 'pinia';

import { tenantDynamicClear, tenantDynamicToggle } from '#/api/system/tenant';
import { useTenantStore } from '#/store/tenant';

const { hasAccessByRoles } = useAccess();

// 上一次选择的租户
const lastSelected = ref<string>();
// 当前选择租户的id
const selected = ref<string>();

const tenantStore = useTenantStore();
const { initTenant, setChecked } = tenantStore;
const { tenantEnable, tenantList } = storeToRefs(tenantStore);

const showToggle = computed<boolean>(() => {
  // 超级管理员 && 启用租户
  return hasAccessByRoles(['superadmin']) && unref(tenantEnable);
});

onMounted(async () => {
  if (!hasAccessByRoles(['superadmin'])) {
    return;
  }
  await initTenant();
});

const { closeAllTabs } = useTabs();
const router = useRouter();
function close(checked: boolean) {
  // store设置状态
  setChecked(checked);
  // 需要关闭全部标签页
  closeAllTabs();
  // 切换完加载首页
  router.push(DEFAULT_HOME_PATH);
}

/**
 * 为什么要用any ide报错😅 实际类型为string
 */
async function onSelected(tenantId: any, option: any) {
  if (unref(lastSelected) === tenantId) {
    // createMessage.info('选择一致');
    return;
  }
  await tenantDynamicToggle(tenantId);
  lastSelected.value = tenantId;
  message.success(`切换当前租户为: ${option.title}`);
  close(true);
}

async function onDeselect() {
  await tenantDynamicClear();
  message.success('还原为默认租户');
  lastSelected.value = '';
  close(false);
}
</script>

<template>
  <div v-if="showToggle" class="mr-[8px] hidden md:block">
    <Select
      v-model:value="selected"
      :field-names="{ label: 'companyName', value: 'tenantId' }"
      :options="tenantList"
      allow-clear
      class="w-60"
      placeholder="选择租户"
      @deselect="onDeselect"
      @select="onSelected"
    >
      <template #suffixIcon>
        <span class="icon-mdi--company"></span>
      </template>
    </Select>
  </div>
</template>
