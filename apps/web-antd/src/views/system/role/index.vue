<script setup lang="ts">
import { CodeMirror, JsonPreview, Page } from '@vben/common-ui';

import packageJson from '#/../package.json';
import { Card } from 'ant-design-vue';

import code from '#/components/tinymce/src/editor.vue?raw';
</script>

<template>
  <Page content-class="flex lg:flex-row flex-col gap-[16px]">
    <Card class="flex-1" title="json预览">
      <div class="h-[600px] overflow-y-auto">
        <JsonPreview :data="packageJson" />
      </div>
    </Card>
    <Card class="flex-1" title="codeMirror预览">
      <div class="h-[600px] overflow-y-auto">
        <CodeMirror
          v-model="code"
          class="text-[16px]"
          language="vue"
          readonly
        />
      </div>
    </Card>
  </Page>
</template>
