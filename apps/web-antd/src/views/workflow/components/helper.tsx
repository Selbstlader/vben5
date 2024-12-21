import { defineComponent, h, ref } from 'vue';

import { Modal } from 'ant-design-vue';

import ApprovalContent from './approval-content.vue';

export interface ApproveWithReasonModalProps {
  title: string;
  description: string;
  onOk: (reason: string) => void;
}

/**
 * 带审批意见的confirm
 * @param props props
 */
export function approveWithReasonModal(props: ApproveWithReasonModalProps) {
  const { onOk, title, description } = props;
  const content = ref('');
  Modal.confirm({
    title,
    content: h(
      defineComponent({
        setup() {
          return () =>
            h(ApprovalContent, {
              description,
              value: content.value,
              'onUpdate:value': (v) => (content.value = v),
            });
        },
      }),
    ),
    centered: true,
    okButtonProps: { danger: true },
    onOk: () => onOk(content.value),
  });
}
