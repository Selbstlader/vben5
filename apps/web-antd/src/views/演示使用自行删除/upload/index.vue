<script setup lang="ts">
import type { UploadFile } from 'ant-design-vue/es/upload/interface';

import { h, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Alert, Card, Modal, Switch } from 'ant-design-vue';

import { FileUpload, ImageUpload } from '#/components/upload';

const singleImageId = ref('1905537674682916865');
const singleFileId = ref('1905191167882518529');
const multipleImageId = ref<string[]>(['1905537674682916865']);
const multipleFileId = ref<string[]>(['1905191167882518529']);

function handlePreview(file: UploadFile) {
  Modal.info({
    content: h('div', { class: 'break-all' }, JSON.stringify(file, null, 2)),
    maskClosable: true,
  });
}

function customAccept(accept: string) {
  return accept
    .split(',')
    .map((str) => str.toUpperCase())
    .join(',');
}

const showComponent = ref(true);
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

      <Card title="多图片上传, maxCount参数控制(开启深度监听)" size="small">
        <ImageUpload
          v-model:value="multipleImageId"
          :max-count="3"
          :deep-watch="true"
        />
        当前绑定值: {{ multipleImageId }}
      </Card>

      <Card title="多文件上传, maxCount参数控制(开启深度监听)" size="small">
        <FileUpload
          v-model:value="multipleFileId"
          :max-count="3"
          :deep-watch="true"
        />
        当前绑定值: {{ multipleFileId }}
      </Card>

      <Card title="文件自定义预览逻辑" size="small">
        <Alert
          message="你可以自定义预览逻辑, 比如改为下载, 回调参数为文件信息"
          class="my-2"
        />
        <FileUpload
          v-model:value="multipleFileId"
          :max-count="3"
          :preview="handlePreview"
          :help-message="false"
        />
        <ImageUpload
          class="mt-3"
          v-model:value="multipleImageId"
          :max-count="3"
          :preview="handlePreview"
          :help-message="false"
        />
      </Card>

      <Card title="文件拖拽上传" size="small">
        <FileUpload
          v-model:value="multipleFileId"
          :max-count="3"
          :enable-drag-upload="true"
        />
        <ImageUpload
          class="mt-3"
          v-model:value="multipleImageId"
          :enable-drag-upload="true"
          :max-count="6"
        />
      </Card>

      <Card title="禁用上传" size="small">
        <ImageUpload :disabled="true" :max-count="3" :help-message="false" />
        <FileUpload
          class="mt-3"
          :disabled="true"
          :max-count="3"
          :help-message="false"
        />
      </Card>

      <Card title="文件夹上传/自定义helpMessage" size="small">
        <FileUpload
          v-model:value="multipleFileId"
          :max-count="3"
          :directory="true"
          accept="*"
        >
          <template #helpMessage="slotProps">
            <div>自定义helpMessage: {{ JSON.stringify(slotProps) }}</div>
          </template>
        </FileUpload>
      </Card>

      <Card title="自定义accept显示" size="small">
        <ImageUpload
          v-model:value="singleImageId"
          :accept-format="customAccept"
        />
        <ImageUpload
          v-model:value="singleImageId"
          accept-format="自定义显示允许的文件类型"
        />
      </Card>

      <Card title="默认在unMounted会取消上传" size="small">
        <div>将开发者工具调整网络为3G 切换挂载/卸载 可见请求在卸载被取消</div>
        挂载/卸载组件: <Switch v-model:checked="showComponent" />
        <FileUpload v-if="showComponent" v-model:value="singleFileId" />
      </Card>
    </div>
  </Page>
</template>
