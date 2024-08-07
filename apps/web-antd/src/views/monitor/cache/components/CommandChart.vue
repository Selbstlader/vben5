<script lang="ts">
import type { EChartsOption } from 'echarts';

import { defineComponent, onMounted, ref, watch } from 'vue';

import { EchartsUI, type EchartsUIType, useEcharts } from '@vben/chart-ui';
import { preferences } from '@vben/preferences';

export default defineComponent({
  components: { EchartsUI },
  name: 'CommandChart',
  props: {
    data: {
      default: () => [],
      type: Array,
    },
  },
  setup(props, { expose }) {
    expose({});

    const chartRef = ref<EchartsUIType>();
    const { renderEcharts } = useEcharts(chartRef);

    watch(
      () => props.data,
      () => {
        if (!chartRef.value) return;
        setEchartsOption(props.data);
      },
      { immediate: true },
    );

    onMounted(() => {
      setEchartsOption(props.data);
    });

    watch(
      () => preferences.theme.mode,
      () => {
        setEchartsOption(props.data);
      },
    );

    function setEchartsOption(data: any[]) {
      const option: EChartsOption = {
        series: [
          {
            animationDuration: 1000,
            animationEasing: 'cubicInOut',
            center: ['50%', '50%'],
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
      renderEcharts(option);
    }

    return {
      chartRef,
    };
  },
});
</script>

<template>
  <div class="flex h-[400px] w-full items-center justify-center">
    <EchartsUI ref="chartRef" />
  </div>
</template>

<style scoped></style>
