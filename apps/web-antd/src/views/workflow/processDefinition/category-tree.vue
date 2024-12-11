<script setup lang="ts">
import type { CategoryVO } from '#/api/workflow/category/model';

import { onMounted, type PropType, ref } from 'vue';

import { listToTree } from '@vben/utils';

import { SyncOutlined } from '@ant-design/icons-vue';
import { InputSearch, Skeleton, Tree } from 'ant-design-vue';

import { categoryList } from '#/api/workflow/category';

defineOptions({ inheritAttrs: false });

const emit = defineEmits<{
  /**
   * 点击刷新按钮的事件
   */
  reload: [];
  /**
   * 点击节点的事件
   */
  select: [];
}>();

const selectCode = defineModel('selectCode', {
  required: true,
  type: Array as PropType<string[]>,
});

const searchValue = defineModel('searchValue', {
  type: String,
  default: '',
});

const categoryTreeArray = ref<CategoryVO[]>([]);
/** 骨架屏加载 */
const showTreeSkeleton = ref<boolean>(true);

async function loadTree() {
  showTreeSkeleton.value = true;
  searchValue.value = '';
  selectCode.value = [];

  const ret = await categoryList();
  let treeData = listToTree(ret, {
    id: 'id',
    pid: 'parentId',
  });
  treeData = [
    {
      categoryName: '根目录',
      id: 0,
      children: treeData,
    },
  ];

  categoryTreeArray.value = treeData;
  showTreeSkeleton.value = false;
}

async function handleReload() {
  await loadTree();
  emit('reload');
}

onMounted(loadTree);
</script>

<template>
  <div :class="$attrs.class">
    <Skeleton
      :loading="showTreeSkeleton"
      :paragraph="{ rows: 8 }"
      active
      class="p-[8px]"
    >
      <div
        class="bg-background flex h-full flex-col overflow-y-auto rounded-lg"
      >
        <!-- 固定在顶部 必须加上bg-background背景色 否则会产生'穿透'效果 -->
        <div class="bg-background z-100 sticky left-0 top-0 p-[8px]">
          <InputSearch
            v-model:value="searchValue"
            :placeholder="$t('pages.common.search')"
            size="small"
          >
            <template #enterButton>
              <a-button @click="handleReload">
                <SyncOutlined class="text-primary" />
              </a-button>
            </template>
          </InputSearch>
        </div>
        <div class="h-full overflow-x-hidden px-[8px]">
          <Tree
            v-bind="$attrs"
            v-if="categoryTreeArray.length > 0"
            v-model:selected-keys="selectCode"
            :class="$attrs.class"
            :field-names="{ title: 'categoryName', key: 'categoryCode' }"
            :show-line="{ showLeafIcon: false }"
            :tree-data="categoryTreeArray"
            :virtual="false"
            default-expand-all
            @select="$emit('select')"
          >
            <template #title="{ categoryName: label }">
              <span v-if="label.indexOf(searchValue) > -1">
                {{ label.substring(0, label.indexOf(searchValue)) }}
                <span style="color: #f50">{{ searchValue }}</span>
                {{
                  label.substring(
                    label.indexOf(searchValue) + searchValue.length,
                  )
                }}
              </span>
              <span v-else>{{ label }}</span>
            </template>
          </Tree>
        </div>
      </div>
    </Skeleton>
  </div>
</template>
