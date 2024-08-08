import type { ColumnsType } from 'ant-design-vue/es/table';

import { defineComponent, ref } from 'vue';

import {
  Button,
  message,
  Modal,
  Popconfirm,
  Space,
  Table,
} from 'ant-design-vue';

export default defineComponent({
  name: 'TableTest',
  setup() {
    const dataSource = [
      { age: 20, id: 1, name: '张三' },
      { age: 21, id: 2, name: '李四' },
      { age: 22, id: 3, name: '王五' },
    ];

    const columns: ColumnsType = [
      {
        align: 'center',
        dataIndex: 'id',
        title: 'id',
      },
      {
        align: 'center',
        dataIndex: 'name',
        title: '姓名',
      },
      {
        align: 'center',
        dataIndex: 'age',
        title: '年龄',
      },
      {
        align: 'center',
        key: 'action',
        title: '操作',
      },
    ];

    const open = ref(false);

    return () => (
      <div>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey={'id'}
          rowSelection={{ type: 'radio' }}
          size={'middle'}
        >
          {{
            bodyCell: ({ column }: { column: any }) => {
              if (column.key === 'action') {
                return (
                  <Space>
                    <Button
                      onClick={() => {
                        open.value = true;
                      }}
                      size="small"
                      type="primary"
                    >
                      编辑
                    </Button>
                    <Popconfirm
                      onConfirm={() => {
                        message.success('删除成功');
                      }}
                      placement="left"
                      title={'确认删除该条记录？'}
                    >
                      <Button danger size="small" type="primary">
                        删除
                      </Button>
                    </Popconfirm>
                  </Space>
                );
              }
            },
          }}
        </Table>
        <Modal
          footer={null}
          onCancel={() => (open.value = false)}
          open={open.value}
          title={'modal'}
        >
          <p>弹窗内容</p>
        </Modal>
      </div>
    );
  },
});
