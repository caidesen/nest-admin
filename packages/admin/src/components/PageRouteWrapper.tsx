import { PageContainer } from "@ant-design/pro-components";
import { Spin } from "antd";
import React from "react";
export function PageLazyContainer(props: { children: React.ReactNode }) {
  return (
    <PageContainer>
      <React.Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <Spin></Spin>
          </div>
        }
      >
        {props.children}
      </React.Suspense>
    </PageContainer>
  );
}
