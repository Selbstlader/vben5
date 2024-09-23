<script setup lang="ts">
import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useVbenForm } from '#/adapter';
import { configAdd, configInfo, configUpdate } from '#/api/system/config';

import { modalSchema } from './data';

const emit = defineEmits<{ reload: [] }>();

interface ModalProps {
  update: boolean;
  id: number | string;
}

const isUpdate = ref(false);
const title = computed(() => {
  return isUpdate.value ? $t('pages.common.edit') : $t('pages.common.add');
});

const [BasicForm, formApi] = useVbenForm({
  commonConfig: {
    labelWidth: 80,
  },
  schema: modalSchema(),
  showDefaultActions: false,
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
      const record = await configInfo(id);
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
    await (isUpdate.value ? configUpdate(data) : configAdd(data));
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
  <BasicModal :close-on-click-modal="false" :title="title" class="w-[550px]">
    <BasicForm />
  </BasicModal>
</template>
