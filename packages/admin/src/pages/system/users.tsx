import {
  ModalForm,
  PageContainer,
  ProFormDependency,
  ProFormSelect,
  ProFormText,
  ProTable,
} from "@ant-design/pro-components";
import { api, fetchWrap } from "@/utils/connection";
import { Button, message, Modal } from "antd";
import React from "react";
import _ from "lodash";

type ListItemType = api.user.getUserList.Output["list"][number];

type FormType = api.user.createUser.Input & {
  confirmPassword: string;
  roles: {
    id: string;
    name: string;
    label: string;
    value: string;
  }[];
};
export default function UsersPage() {
  const formContent = <></>;
  return (
    <PageContainer>
      <ProTable<ListItemType>
        columns={[
          {
            title: "名字",
            dataIndex: "nickname",
          },
          {
            title: "描述",
            dataIndex: ["account", "username"],
          },
          {
            title: "角色",
            dataIndex: "roles",
            render: (text, record) =>
              record.roles.map((role) => role.name).join(", "),
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
                initialValues={{
                  nickname: record.nickname,
                  username: record.account.username,
                  roles: record.roles.map((it) => ({
                    ...it,
                    value: it.id,
                    label: it.name,
                  })),
                }}
                onFinish={async (val) => {
                  await fetchWrap(api.user.updateUser)({
                    ...val,
                    id: record.id,
                  });
                  action?.reload();
                  message.success("更新成功");
                  return true;
                }}
              >
                <ProFormText
                  name="nickname"
                  label="名字"
                  rules={[{ required: true, message: "请输入名字" }]}
                />
                <ProFormText
                  name="username"
                  label="用户名"
                  rules={[{ required: true, message: "请输入用户名" }]}
                />
                <ProFormSelect
                  request={async () => {
                    const res = await fetchWrap(api.role.getRoleList)({
                      current: 1,
                      pageSize: 99,
                    });
                    return res.list.map((it) => ({
                      ...it,
                      value: it.id,
                      label: it.name,
                    }));
                  }}
                  fieldProps={{ labelInValue: true, mode: "multiple" }}
                  name="roles"
                  label="角色"
                ></ProFormSelect>
                <ProFormText.Password name="password" label="密码" />
                <ProFormDependency name={["password"]}>
                  {(values) => (
                    <ProFormText.Password
                      name="confirmPassword"
                      label="确认密码"
                      rules={[
                        {
                          validator: (_, value) => {
                            if (value !== values.password)
                              return Promise.reject("两次输入的密码不一致");
                            return Promise.resolve();
                          },
                        },
                      ]}
                    />
                  )}
                </ProFormDependency>
              </ModalForm>,
              <a
                key="del"
                onClick={() => {
                  Modal.confirm({
                    title: "删除用户",
                    content: "确定要删除该用户吗？",
                    onOk: async () => {
                      await fetchWrap(api.user.deleteUser)({ ids: [] });
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
            title="创建用户"
            trigger={<Button type="primary">创建</Button>}
            width={600}
            onFinish={async (val) => {
              await fetchWrap(api.user.createUser)({
                ...val,
                roles: val.roles.map((it) => _.pick(it, "id")),
              });
              action?.reload();
              message.success("创建成功");
              return true;
            }}
          >
            <ProFormText
              name="nickname"
              label="名字"
              rules={[{ required: true, message: "请输入名字" }]}
            />
            <ProFormText
              name="username"
              label="用户名"
              rules={[{ required: true, message: "请输入用户名" }]}
            />
            <ProFormSelect
              request={async () => {
                const res = await fetchWrap(api.role.getRoleList)({
                  current: 1,
                  pageSize: 99,
                });
                return res.list.map((it) => ({
                  ...it,
                  value: it.id,
                  label: it.name,
                }));
              }}
              fieldProps={{ labelInValue: true, mode: "multiple" }}
              name="roles"
              label="角色"
            ></ProFormSelect>
            <ProFormText.Password
              name="password"
              label="密码"
              rules={[{ required: true, message: "请输入密码" }]}
            />
            <ProFormDependency name={["password"]}>
              {(values) => (
                <ProFormText.Password
                  name="confirmPassword"
                  label="确认密码"
                  rules={[
                    { required: true, message: "请输入确认密码" },
                    {
                      validator: (_, value) => {
                        if (value !== values.password)
                          return Promise.reject("两次输入的密码不一致");
                        return Promise.resolve();
                      },
                    },
                  ]}
                />
              )}
            </ProFormDependency>
          </ModalForm>,
        ]}
        request={async (data) => {
          const res = await fetchWrap(api.user.getUserList)({
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
