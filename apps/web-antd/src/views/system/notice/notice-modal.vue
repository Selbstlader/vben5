<script setup lang="ts">
import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useVbenForm } from '#/adapter';
import { noticeAdd, noticeInfo, noticeUpdate } from '#/api/system/notice';
import { Tinymce } from '#/components/tinymce';

import { modalSchema } from './data';

const emit = defineEmits<{ reload: [] }>();

interface ModalProps {
  update: boolean;
  id?: number | string;
}

const isUpdate = ref(false);
const title = computed(() => {
  return isUpdate.value ? $t('pages.common.edit') : $t('pages.common.add');
});

const [BasicForm, formApi] = useVbenForm({
  layout: 'vertical',
  schema: modalSchema(),
  showDefaultActions: false,
  wrapperClass: 'grid-cols-2',
});

const [BasicModal, modalApi] = useVbenModal({
  fullscreenButton: false,
  onCancel: handleCancel,
  onConfirm: handleConfirm,
  onOpenChange: async (isOpen) => {
    if (!isOpen) {
      return null;
    }
    modalApi.modalLoading(true);
    const { id, update } = modalApi.getData() as ModalProps;
    isUpdate.value = update;
    if (update && id) {
      const record = await noticeInfo(id);
      for (const key in record) {
        await formApi.setFieldValue(key, record[key as keyof typeof record]);
      }
    }
    modalApi.modalLoading(false);
  },
});

async function handleConfirm() {
  try {
    modalApi.modalLoading(true);
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    const data = await formApi.getValues();
    console.log(data);
    await (isUpdate.value ? noticeUpdate(data) : noticeAdd(data));
    emit('reload');
    await handleCancel();
  } catch (error) {
    console.error(error);
  } finally {
    modalApi.modalLoading(false);
  }
}

async function handleCancel() {
  modalApi.close();
  await formApi.resetForm();
}
</script>

<template>
  <BasicModal :fullscreen-button="true" :title="title" class="w-[800px]">
    <BasicForm>
      <template #noticeContent="slotProps">
        <Tinymce v-bind="slotProps" width="100%" />
      </template>
    </BasicForm>
  </BasicModal>
</template>
