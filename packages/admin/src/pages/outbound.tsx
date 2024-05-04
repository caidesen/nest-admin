import {
  ModalForm,
  PageContainer,
  ProFormDatePicker,
  ProFormSelect,
  ProTable,
} from "@ant-design/pro-components";
import { api, fetchWrap } from "@/utils/connection";
import { Button, message, Modal } from "antd";
import React from "react";

type ListItemType = api.outbound.list.Output[number];
type FormType = api.outbound.create.Input;
export default function PurchaseOrderPage() {
  const formContent = (
    <>
      <ProFormSelect
        name={["device", "id"]}
        label="设备"
        request={() =>
          fetchWrap(api.device.list)().then((res) =>
            res.map((item) => ({
              label: item.name,
              value: item.id,
            }))
          )
        }
        rules={[{ required: true, message: "请选择" }]}
      />
      <ProFormDatePicker
        name="date"
        label="出库时间"
        rules={[{ required: true, message: "请选择出库时间" }]}
      />
      <ProFormSelect
        name={["agentUser", "id"]}
        label="经办人"
        rules={[{ required: true, message: "请选择经办人" }]}
        request={() =>
          fetchWrap(api.user.getUserList)({}).then((res) =>
            res.list.map((item) => ({ label: item.nickname, value: item.id }))
          )
        }
      />
    </>
  );
  return (
    <PageContainer>
      <ProTable<ListItemType>
        columns={[
          {
            title: "设备编码",
            dataIndex: ["device", "code"],
          },
          {
            title: "设备",
            dataIndex: ["device", "name"],
          },
          {
            title: "出库日期",
            dataIndex: "date",
            valueType: "date",
          },
          {
            title: "经办人",
            dataIndex: ["agentUser", "nickname"],
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
                  await fetchWrap(api.outbound.update)({
                    ...val,
                    id: record.id,
                  });
                  action?.reload();
                  message.success("更新成功");
                  return true;
                }}
              >
                {formContent}
              </ModalForm>,
              <a
                key="del"
                onClick={() => {
                  Modal.confirm({
                    title: "删除",
                    content: "确定要删除吗？",
                    onOk: async () => {
                      await fetchWrap(api.outbound.$delete)({ ids: [] });
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
            title="创建"
            trigger={<Button type="primary">创建</Button>}
            width={600}
            initialValues={{
              device: undefined,
              faultDescription: "",
              maintenanceResult: "",
            }}
            onFinish={async (val) => {
              await fetchWrap(api.outbound.create)(val);
              action?.reload();
              message.success("创建成功");
              return true;
            }}
          >
            {formContent}
          </ModalForm>,
        ]}
        request={async () => {
          const res = await fetchWrap(api.outbound.list)();
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
