<script setup lang="ts">
import { computed, reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { DictEnum } from '@vben/constants';
import { $t } from '@vben/locales';
import { cloneDeep } from '@vben/utils';

import { Form, FormItem, Input, RadioGroup } from 'ant-design-vue';
import { pick } from 'lodash-es';

import { noticeAdd, noticeInfo, noticeUpdate } from '#/api/system/notice';
import { Tinymce } from '#/components/tinymce';
import { getDictOptions } from '#/utils/dict';

const emit = defineEmits<{ reload: [] }>();

const isUpdate = ref(false);
const title = computed(() => {
  return isUpdate.value ? $t('pages.common.edit') : $t('pages.common.add');
});

interface FormData {
  noticeId?: number;
  noticeTitle?: string;
  status?: string;
  noticeType?: string;
  noticeContent?: string;
}

const defaultValues: FormData = {
  noticeId: undefined,
  noticeTitle: '',
  status: '0',
  noticeType: '1',
  noticeContent: '',
};

const formData = ref(defaultValues);

const formRules = reactive<AntdFormRules<FormData>>({
  status: [{ required: true, message: $t('ui.formRules.selectRequired') }],
  noticeContent: [{ required: true, message: $t('ui.formRules.required') }],
  noticeType: [{ required: true, message: $t('ui.formRules.selectRequired') }],
  noticeTitle: [{ required: true, message: $t('ui.formRules.required') }],
});

const { validate, validateInfos, resetFields } = Form.useForm(
  formData,
  formRules,
);

const [BasicModal, modalApi] = useVbenModal({
  class: 'w-[800px]',
  fullscreenButton: false,
  closeOnClickModal: false,
  onClosed: handleCancel,
  onConfirm: handleConfirm,
  onOpenChange: async (isOpen) => {
    if (!isOpen) {
      return null;
    }
    modalApi.modalLoading(true);
    const { id } = modalApi.getData() as { id?: number | string };
    isUpdate.value = !!id;
    if (isUpdate.value && id) {
      const record = await noticeInfo(id);
      const filterRecord = pick(record, Object.keys(defaultValues));
      formData.value = filterRecord;
    }
    modalApi.modalLoading(false);
  },
});

async function handleConfirm() {
  try {
    modalApi.modalLoading(true);
    const test = await validate();
    console.log(test);
    const data = cloneDeep(formData.value);
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
  formData.value = defaultValues;
  resetFields();
}
</script>

<template>
  <BasicModal :title="title">
    <Form layout="vertical">
      <FormItem label="公告标题" v-bind="validateInfos.noticeTitle">
        <Input
          :placeholder="$t('ui.formRules.required')"
          v-model:value="formData.noticeTitle"
        />
      </FormItem>
      <div class="grid sm:grid-cols-1 lg:grid-cols-2">
        <FormItem label="公告状态" v-bind="validateInfos.status">
          <RadioGroup
            button-style="solid"
            option-type="button"
            v-model:value="formData.status"
            :options="getDictOptions(DictEnum.SYS_NOTICE_STATUS)"
          />
        </FormItem>
        <FormItem label="公告类型" v-bind="validateInfos.noticeType">
          <RadioGroup
            button-style="solid"
            option-type="button"
            v-model:value="formData.noticeType"
            :options="getDictOptions(DictEnum.SYS_NOTICE_TYPE)"
          />
        </FormItem>
      </div>
      <FormItem label="公告内容" v-bind="validateInfos.noticeContent">
        <Tinymce v-model="formData.noticeContent" />
      </FormItem>
    </Form>
  </BasicModal>
</template>
