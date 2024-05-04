import { Navigate } from "react-router-dom";
import { MenuDataItem } from "@ant-design/pro-components";
import _ from "lodash";
import React, { useMemo } from "react";
import { PageLazyContainer } from "@/components/PageRouteWrapper";
import AdminLayout from "@/layout/AdminLayout";

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
    children: [
      {
        path: "/system/role",
        name: "角色设置",
        Component: wrapper(() => import("@/pages/system/role")),
      },
      {
        path: "/system/user",
        name: "用户设置",
        Component: wrapper(() => import("@/pages/system/users")),
      },
    ],
  },
  {
    path: "/purchase",
    name: "采购",
    children: [
      {
        path: "/purchase/device",
        name: "设备管理",
        Component: wrapper(() => import("@/pages/device")),
      },
      {
        path: "/purchase/purchase-order",
        name: "采购单管理",
        Component: wrapper(() => import("@/pages/purchase-order")),
      },
    ],
  },
  {
    path: "/work-order",
    name: "质量",
    children: [
      {
        path: "/work-order/work-order",
        name: "检修管理",
        Component: wrapper(() => import("@/pages/work-order")),
      },
    ],
  },
  {
    path: "/stock",
    name: "库存",
    children: [
      {
        path: "/stock/inbound",
        name: "入库管理",
        Component: wrapper(() => import("@/pages/inbound")),
      },
      {
        path: "/stock/outbound",
        name: "出库管理",
        Component: wrapper(() => import("@/pages/outbound")),
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
    if (!route.children || route.children.length) result.push(route);
    else if (
      route.needPermissions &&
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

export function useFilteredRoutes(permissions: string[]) {
  const filteredRoutes = useMemo(
    () =>
      routesFilterWithPermissions(
        _.cloneDeep(bizPageRoutes),
        permissions || []
      ),
    [permissions]
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
