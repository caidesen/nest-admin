import {
  ModalForm,
  PageContainer,
  ProFormDatePicker,
  ProFormDateTimePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProTable,
} from "@ant-design/pro-components";
import { api, fetchWrap } from "@/utils/connection";
import { Button, message, Modal } from "antd";
import React from "react";

type ListItemType = api.work_order.list.Output[number];
type FormType = api.work_order.create.Input;
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
      <ProFormDateTimePicker name="testingDate" label="检测时间" />
      <ProFormText name="faultDescription" label="故障描述" />
    </>
  );
  return (
    <PageContainer>
      <ProTable<ListItemType>
        columns={[
          {
            title: "采购设备",
            dataIndex: ["device", "name"],
          },
          {
            title: "检测日期",
            dataIndex: "testingDate",
            valueType: "date",
          },
          {
            title: "故障描述",
            dataIndex: ["faultDescription"],
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
                  await fetchWrap(api.work_order.update)({
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
                      await fetchWrap(api.work_order.$delete)({
                        ids: [record.id],
                      });
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
              await fetchWrap(api.work_order.create)(val);
              action?.reload();
              message.success("创建成功");
              return true;
            }}
          >
            {formContent}
          </ModalForm>,
        ]}
        request={async () => {
          const res = await fetchWrap(api.work_order.list)();
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
