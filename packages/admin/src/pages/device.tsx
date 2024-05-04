import {
  ModalForm,
  PageContainer,
  ProFormText,
  ProTable,
} from "@ant-design/pro-components";
import { api, fetchWrap } from "@/utils/connection";
import { Button, message, Modal } from "antd";
import React from "react";

type ListItemType = api.device.list.Output[number];
type FormType = api.device.create.Input;
export default function DevicePage() {
  const formContent = (
    <>
      <ProFormText
        name="name"
        label="设备名"
        rules={[{ required: true, message: "请输入设备名" }]}
      />
      <ProFormText
        name="code"
        label="设备编号"
        rules={[{ required: true, message: "请输入设备编号" }]}
      />
    </>
  );
  return (
    <PageContainer>
      <ProTable<ListItemType>
        columns={[
          {
            title: "设备名称",
            dataIndex: "name",
          },
          {
            title: "设备编号",
            dataIndex: "code",
          },
          {
            title: "操作",
            key: "option",
            valueType: "option",
            render: (text, record, index, action) => [
              <ModalForm<FormType>
                key="edit"
                trigger={<a>编辑</a>}
                title="编辑"
                width={600}
                initialValues={{ ...record }}
                onFinish={async (val) => {
                  await fetchWrap(api.device.update)({
                    ...val,
                    id: record.id,
                  });
                  action?.reload();
                  message.success("更新成功");
                }}
              >
                {formContent}
              </ModalForm>,
              <a
                key="del"
                onClick={() => {
                  Modal.confirm({
                    title: "删除设备",
                    content: "确定要删除该设备吗？",
                    onOk: async () => {
                      await fetchWrap(api.device.$delete)({ ids: [] });
                      action?.reload();
                      message.success("删除成功");
                    },
                  });
                }}
              >
                删除
              </a>,
            ],
          },
        ]}
        toolBarRender={(action) => [
          <ModalForm<FormType>
            key="create"
            title="创建设备"
            trigger={<Button type="primary">创建</Button>}
            width={600}
            onFinish={async (val) => {
              await fetchWrap(api.device.create)(val);
              action?.reload();
              message.success("创建成功");
              return true;
            }}
          >
            {formContent}
          </ModalForm>,
        ]}
        request={async () => {
          const res = await fetchWrap(api.device.list)();
          return {
            data: res,
            total: res.length,
            success: true,
          };
        }}
        rowKey="id"
        search={false}
      ></ProTable>
    </PageContainer>
  );
}
