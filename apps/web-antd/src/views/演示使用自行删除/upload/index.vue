<script setup lang="ts">
import type { UploadFile } from 'ant-design-vue/es/upload/interface';

import { h, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Alert, Card, Modal } from 'ant-design-vue';

import { FileUpload, ImageUpload } from '#/components/upload';

const singleImageId = ref('1905537674682916865');
const singleFileId = ref('1905191167882518529');
const multipleImageId = ref<string[]>(['1905537674682916865']);
const multipleFileId = ref<string[]>(['1905191167882518529']);

function handlePreview(file: UploadFile) {
  Modal.info({
    content: h('div', { class: 'break-all' }, JSON.stringify(file, null, 2)),
  });
}
</script>

<template>
  <Page>
    <div class="grid grid-cols-2 gap-4">
      <Card title="单图片上传, 会绑定为string" size="small">
        <ImageUpload v-model:value="singleImageId" />
        当前绑定值: {{ singleImageId }}
      </Card>

      <Card title="单文件上传, 会绑定为string" size="small">
        <FileUpload v-model:value="singleFileId" />
        当前绑定值: {{ singleFileId }}
      </Card>

      <Card title="多图片上传, maxCount参数控制" size="small">
        <ImageUpload v-model:value="multipleImageId" :max-count="3" />
        当前绑定值: {{ multipleImageId }}
      </Card>

      <Card title="多文件上传, maxCount参数控制" size="small">
        <FileUpload v-model:value="multipleFileId" :max-count="3" />
        当前绑定值: {{ multipleFileId }}
      </Card>

      <Card title="文件自定义预览逻辑" size="small">
        <Alert
          message="你可以自定义预览逻辑, 比如改为下载, 回调参数为文件信息(图片有默认预览逻辑 不支持自定义)"
          class="my-2"
        />
        <FileUpload
          v-model:value="multipleFileId"
          :max-count="3"
          :preview="handlePreview"
          :help-message="false"
        />
        当前绑定值: {{ multipleFileId }}
      </Card>

      <Card title="图片禁用上传" size="small">
        <ImageUpload :disabled="true" :max-count="3" :help-message="false" />
      </Card>

      <Card title="文件禁用上传" size="small">
        <FileUpload :disabled="true" :max-count="3" :help-message="false" />
      </Card>
    </div>
  </Page>
</template>
