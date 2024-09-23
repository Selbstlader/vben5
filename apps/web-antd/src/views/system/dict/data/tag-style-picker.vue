<script setup lang="ts">
import { computed, type PropType } from 'vue';

import {
  Input,
  type RadioChangeEvent,
  RadioGroup,
  Select,
} from 'ant-design-vue';

import { tagSelectOptions } from '#/components/dict';

defineEmits<{ deselect: [] }>();

const options = [
  { label: '默认颜色', value: 'default' },
  { label: '自定义颜色', value: 'custom' },
] as const;

/**
 * 主要是加了const报错
 */
const computedOptions = computed(
  () => options as unknown as { label: string; value: string }[],
);

type SelectType = (typeof options)[number]['value'];

const selectType = defineModel('selectType', {
  default: 'default',
  type: String as PropType<SelectType>,
});

const color = defineModel('value', {
  default: '',
  type: String,
});

function handleSelectTypeChange(e: RadioChangeEvent) {
  // 必须给默认hex颜色  不能为空字符串
  if (e.target.value === 'custom') {
    color.value = '#FFFFFF';
  }
}
</script>

<template>
  <div class="flex items-center gap-[6px]">
    <RadioGroup
      v-model:value="selectType"
      :options="computedOptions"
      button-style="solid"
      option-type="button"
      @change="handleSelectTypeChange"
    />
    <Select
      v-if="selectType === 'default'"
      :allow-clear="true"
      :options="tagSelectOptions()"
      class="flex-1"
      placeholder="请选择标签样式"
      @deselect="$emit('deselect')"
    />
    <Input
      v-if="selectType === 'custom'"
      v-model:value="color"
      class="flex-1"
      disabled
    >
      <template #addonAfter>
        <input v-model="color" class="rounded-lg" type="color" />
      </template>
    </Input>
  </div>
</template>
