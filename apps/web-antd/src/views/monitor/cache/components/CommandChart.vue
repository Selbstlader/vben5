<script lang="ts">
import type { EChartsOption } from 'echarts';

import { defineComponent, onMounted, ref, shallowRef, watch } from 'vue';

import { preferences } from '@vben/preferences';

import * as echarts from 'echarts';

export default defineComponent({
  name: 'CommandChart',
  props: {
    data: {
      default: () => [],
      type: Array,
    },
  },
  setup(props, { expose }) {
    expose({});

    const commandHtmlRef = ref<HTMLDivElement>();
    const echartsInstance = shallowRef<echarts.ECharts | null>(null);

    watch(
      () => props.data,
      () => {
        if (!commandHtmlRef.value) return;
        setEchartsOption(props.data);
      },
      { immediate: true },
    );

    onMounted(() => {
      echartsInstance.value = echarts.init(
        commandHtmlRef.value,
        preferences.theme.mode,
      );
      setEchartsOption(props.data);
    });

    watch(
      () => preferences.theme.mode,
      (mode) => {
        echartsInstance.value?.dispose();
        echartsInstance.value = echarts.init(commandHtmlRef.value, mode);
        setEchartsOption(props.data);
      },
    );

    function setEchartsOption(data: any[]) {
      const option: EChartsOption = {
        series: [
          {
            animationDuration: 1000,
            animationEasing: 'cubicInOut',
            center: ['50%', '38%'],
            data,
            name: '命令',
            radius: [15, 95],
            roseType: 'radius',
            type: 'pie',
          },
        ],
        tooltip: {
          formatter: '{a} <br/>{b} : {c} ({d}%)',
          trigger: 'item',
        },
      };
      echartsInstance.value?.setOption(option);
    }

    return {
      commandHtmlRef,
    };
  },
});
</script>

<template>
  <div ref="commandHtmlRef" class="h-[400px] w-full"></div>
</template>

<style scoped></style>
