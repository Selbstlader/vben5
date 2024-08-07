<script lang="ts">
import type { EChartsOption } from 'echarts';

import { defineComponent, onMounted, ref, watch } from 'vue';

import { EchartsUI, type EchartsUIType, useEcharts } from '@vben/chart-ui';

export default defineComponent({
  components: { EchartsUI },
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
  <EchartsUI ref="chartRef" height="400px" width="100%" />
</template>

<style scoped></style>
