import {
  ModalForm,
  PageContainer,
  ProFormDatePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProTable,
} from "@ant-design/pro-components";
import { api, fetchWrap } from "@/utils/connection";
import { Button, message, Modal } from "antd";
import React from "react";

type ListItemType = api.purchase.list.Output[number];
type FormType = api.purchase.create.Input;
export default function PurchaseOrderPage() {
  const formContent = (
    <>
      <ProFormSelect
        name={["device", "id"]}
        label="采购设备"
        request={() =>
          fetchWrap(api.device.list)().then((res) =>
            res.map((item) => ({
              label: item.name,
              value: item.id,
            }))
          )
        }
        rules={[{ required: true, message: "请选择采购设备" }]}
      />
      <ProFormDatePicker
        name="date"
        label="采购日期"
        rules={[{ required: true, message: "请选择采购日期" }]}
      />
      <ProFormSelect
        name={["purchaseUser", "id"]}
        label="采购人"
        rules={[{ required: true, message: "请选择采购人" }]}
        request={() =>
          fetchWrap(api.user.getUserList)({}).then((res) =>
            res.list.map((item) => ({ label: item.nickname, value: item.id }))
          )
        }
      />
      <ProFormDigit
        label="采购数量"
        name="quantity"
        rules={[{ required: true, message: "请输入采购数量" }]}
      ></ProFormDigit>
      <ProFormText
        name="contractNumber"
        label="合同编号"
        rules={[{ required: true, message: "请输入合同编号" }]}
      />
    </>
  );
  return (
    <PageContainer>
      <ProTable<ListItemType>
        columns={[
          {
            title: "采购单编号",
            dataIndex: "code",
          },
          {
            title: "采购设备",
            dataIndex: ["device", "name"],
          },
          {
            title: "采购日期",
            dataIndex: "date",
            valueType: "date",
          },
          {
            title: "采购人",
            dataIndex: ["purchaseUser", "nickname"],
          },
          {
            title: "采购数量",
            dataIndex: "quantity",
          },
          {
            title: "合同编号",
            dataIndex: "contractNumber",
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
                  await fetchWrap(api.purchase.update)({
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
                    title: "删除采购单",
                    content: "确定要删除该采购单吗？",
                    onOk: async () => {
                      await fetchWrap(api.purchase.$delete)({
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
            title="创建采购单"
            trigger={<Button type="primary">创建</Button>}
            width={600}
            onFinish={async (val) => {
              await fetchWrap(api.purchase.create)(val);
              action?.reload();
              message.success("创建成功");
              return true;
            }}
          >
            {formContent}
          </ModalForm>,
        ]}
        request={async () => {
          const res = await fetchWrap(api.purchase.list)();
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
