<script lang="ts">
import type { EChartsOption } from 'echarts';

import { defineComponent, onMounted, ref, shallowRef, watch } from 'vue';

import { preferences } from '@vben/preferences';

import * as echarts from 'echarts';

export default defineComponent({
  name: 'MemoryChart',
  props: {
    data: {
      default: '0',
      type: String,
    },
  },
  setup(props, { expose }) {
    expose({});

    const memoryHtmlRef = ref<HTMLDivElement>();
    const echartsInstance = shallowRef<echarts.ECharts | null>(null);

    watch(
      () => props.data,
      () => {
        if (!memoryHtmlRef.value) return;
        setEchartsOption(props.data);
      },
      { immediate: true },
    );

    onMounted(() => {
      echartsInstance.value = echarts.init(
        memoryHtmlRef.value,
        preferences.theme.mode,
      );
      setEchartsOption(props.data);
    });

    watch(
      () => preferences.theme.mode,
      (mode) => {
        echartsInstance.value?.dispose();
        echartsInstance.value = echarts.init(memoryHtmlRef.value, mode);
        setEchartsOption(props.data);
      },
    );

    function getNearestPowerOfTen(num: number) {
      let power = 10;
      while (power <= num) {
        power *= 10;
      }
      return power;
    }

    function setEchartsOption(value: string) {
      // x10
      const formattedValue = Math.floor(Number.parseFloat(value));
      // 最大值 10以内取10  100以内取100 以此类推
      const max = getNearestPowerOfTen(formattedValue);
      const options: EChartsOption = {
        series: [
          {
            animation: true,
            animationDuration: 1000,
            data: [
              {
                name: '内存消耗',
                value: Number.parseFloat(value),
              },
            ],
            detail: {
              formatter: `${value}M`,
              valueAnimation: true,
            },
            max,
            min: 0,
            name: '峰值',
            type: 'gauge',
          },
        ],
        tooltip: {
          formatter: `{b} <br/>{a} : ${value}M`,
        },
      };
      echartsInstance.value?.setOption(options);
    }

    return {
      memoryHtmlRef,
    };
  },
});
</script>

<template>
  <div ref="memoryHtmlRef" class="h-[400px] w-full"></div>
</template>

<style scoped></style>
