import { Navigate } from "react-router-dom";
import { MenuDataItem } from "@ant-design/pro-components";
import _ from "lodash";
import React, { useMemo } from "react";
import { PageLazyContainer } from "@/components/PageRouteWrapper";
import AdminLayout from "@/layout/AdminLayout";
import { api, fetchWrap } from "@/utils/connection";
import { useQuery } from "@tanstack/react-query";

export function wrapper(
  factory: () => Promise<{ default: React.ComponentType<any> }>
) {
  const LazyComponent = React.lazy(factory);
  return () => (
    <PageLazyContainer>
      <LazyComponent />
    </PageLazyContainer>
  );
}

type RouteType = MenuDataItem & {
  needPermissions?: string[];
  children?: RouteType[];
};

const bizPageRoutes: RouteType[] = [
  {
    path: "",
    name: "首页",
    element: <div>欢迎</div>,
  },
  {
    path: "/system",
    name: "系统设置",
    needPermissions: ["system"],
    children: [
      {
        path: "/system/role",
        name: "角色设置",
        needPermissions: ["system"],
        Component: wrapper(() => import("@/pages/system/role")),
      },
      {
        path: "/system/user",
        name: "用户设置",
        needPermissions: ["system"],
        Component: wrapper(() => import("@/pages/system/users")),
      },
    ],
  },
  {
    path: "/purchase",
    name: "采购",
    needPermissions: ["purchase"],
    children: [
      {
        path: "/purchase/device",
        name: "设备管理",
        needPermissions: ["purchase"],
        Component: wrapper(() => import("@/pages/device")),
      },
      {
        path: "/purchase/purchase-order",
        name: "采购单管理",
        needPermissions: ["purchase"],
        Component: wrapper(() => import("@/pages/purchase-order")),
      },
    ],
  },
  {
    path: "/work-order",
    name: "质量",
    needPermissions: ["work-order"],
    children: [
      {
        path: "/work-order/fault",
        name: "检测管理",
        needPermissions: ["work-order"],
        Component: wrapper(() => import("@/pages/ffff")),
      },
      {
        path: "/work-order/work-order",
        name: "维修管理",
        needPermissions: ["work-order"],
        Component: wrapper(() => import("@/pages/work-order")),
      },
    ],
  },
  {
    path: "/stock",
    name: "库存",
    needPermissions: ["stock"],
    children: [
      {
        path: "/stock/inbound",
        name: "入库管理",
        needPermissions: ["stock"],
        Component: wrapper(() => import("@/pages/inbound")),
      },
      {
        path: "/stock/outbound",
        name: "出库管理",
        needPermissions: ["stock"],
        Component: wrapper(() => import("@/pages/outbound")),
      },
    ],
  },
  {
    path: "/fund-movement",
    name: "资金",
    needPermissions: ["finance"],
    children: [
      {
        path: "/fund-movement/fund-movement",
        name: "资金流水",
        needPermissions: ["finance"],
        Component: wrapper(() => import("@/pages/fund-movement")),
      },
    ],
  },
  {
    path: "/statistics",
    name: "统计",
    children: [
      {
        path: "/statistics/index",
        name: "可视化分析",
        Component: wrapper(() => import("@/pages/statistics")),
      },
    ],
  },
];

export function routesFilterWithPermissions(
  routes: RouteType[],
  permissions: string[]
) {
  const result: RouteType[] = [];
  for (const route of routes) {
    if (route.children?.length) {
      route.children = routesFilterWithPermissions(route.children, permissions);
    }
    if (route.children?.length) result.push(route);
    else if (!route.needPermissions) result.push(route);
    else if (
      permissions.includes("*") ||
      route.needPermissions.some(
        (permission) => permissions?.includes(permission)
      )
    )
      result.push(route);
    if (route.children?.length) {
      route.children.unshift({
        path: route.path,
        element: <Navigate to={route.children[0].path!} />,
      });
    }
  }
  return result;
}

export function useFilteredRoutes() {
  const { data } = useQuery({
    queryKey: ["myUserInfo"],
    queryFn: () => {
      if (location.pathname !== "/login")
        return fetchWrap(api.auth.getMyUserInfo)();
      return Promise.resolve({
        roles: [],
        nickname: "",
        id: "",
      } as api.auth.getMyUserInfo.Output);
    },
  });
  const filteredRoutes = useMemo(
    () =>
      routesFilterWithPermissions(
        _.cloneDeep(bizPageRoutes),
        data?.roles?.flatMap((role) => role.permissions) || []
      ),
    [data]
  );
  return [
    {
      id: "root",
      path: "/",
      element: <AdminLayout />,
      children: filteredRoutes,
    },
    {
      path: "/login",
      name: "登录",
      lazy: () => import("@/pages/login"),
    },
    {
      path: "*",
      element: <Navigate to="/login" />,
    },
  ];
}
