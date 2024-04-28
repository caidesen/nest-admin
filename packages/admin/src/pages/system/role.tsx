import { PageContainer, ProTable } from "@ant-design/pro-components";
import { api, fetchWrap } from "@/utils/connection";
type ListItemType = Awaited<ReturnType<typeof api.role.getRoleList>>["list"][0];
export default function RolePage() {
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
        ]}
        toolBarRender={(action) => []}
        request={(data) => {
          return fetchWrap(api.role.getRoleList)({
            ...data,
            current: data.current,
            pageSize: data.pageSize,
          });
        }}
        rowKey="id"
        search={false}
      ></ProTable>
    </PageContainer>
  );
}
