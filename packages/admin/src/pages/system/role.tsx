import {
  ModalForm,
  PageContainer,
  ProFormItem,
  ProFormText,
  ProTable,
} from "@ant-design/pro-components";
import { api, fetchWrap } from "@/utils/connection";
import { Button, message, Modal, TreeDataNode } from "antd";
import React from "react";
import { TreeTransfer } from "@/components/ui/tree-transfer/tree-transfer";

type ListItemType = Awaited<ReturnType<typeof api.role.getRoleList>>["list"][0];
const permissions: TreeDataNode[] = [
  {
    title: "账号管理",
    key: "sys:user",
  },
];
type FormType = {
  name: string;
  description: string;
  permissions: string[];
};
export default function RolePage() {
  const formContent = (
    <>
      <ProFormText
        name="name"
        label="名字"
        rules={[{ required: true, message: "请输入名字" }]}
      />
      <ProFormText
        name="description"
        label="描述"
        rules={[{ required: true, message: "请输入描述" }]}
      />
      <ProFormItem name="permissions" label="权限">
        <TreeTransfer dataSource={permissions} />
      </ProFormItem>
    </>
  );
  const [modal] = Modal.useModal();
  const [messageApi] = message.useMessage();
  return (
    <PageContainer>
      <ProTable<ListItemType>
        columns={[
          {
            title: "名字",
            dataIndex: "name",
          },
          {
            title: "描述",
            dataIndex: "description",
          },
          {
            title: "权限",
            dataIndex: "permissions",
            render: (text, record) => record.permissions.join(", "),
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
                  await fetchWrap(api.role.updateRole)({
                    ...val,
                    id: record.id,
                  });
                  action?.reload();
                  messageApi.success("更新成功");
                }}
              >
                {formContent}
              </ModalForm>,
              <a
                key="del"
                onClick={() => {
                  modal.confirm({
                    title: "删除角色",
                    content: "确定要删除该角色吗？",
                    onOk: async () => {
                      await fetchWrap(api.role.deleteRole)({ ids: [] });
                      action?.reload();
                      messageApi.success("删除成功");
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
            title="创建角色"
            trigger={<Button type="primary">创建</Button>}
            width={600}
            onFinish={async (val) => {
              await fetchWrap(api.role.createRole)(val);
              action?.reload();
              messageApi.success("创建成功");
              return true;
            }}
          >
            {formContent}
          </ModalForm>,
        ]}
        request={async (data) => {
          const res = await fetchWrap(api.role.getRoleList)({
            ...data,
            current: data.current,
            pageSize: data.pageSize,
          });
          return {
            data: res.list,
            total: res.total,
            success: true,
          };
        }}
        rowKey="id"
        search={false}
      ></ProTable>
    </PageContainer>
  );
}
