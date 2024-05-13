import {
  LoginFormPage,
  ProFormCheckbox,
  ProFormText,
} from "@ant-design/pro-components";
import { message, Tabs } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, fetchWrap } from "@/utils/connection";

type LoginType = "phone" | "account";
type FormType = {
  username: string;
  password: string;
  autoLogin: boolean;
};

export function Component() {
  const [loginType, setLoginType] = useState<LoginType>("account");
  const navigate = useNavigate();
  useEffect(() => {
    const scriptElement = document.createElement("script");
    scriptElement.src = "/login-bg/Particles.js";
    document.body.appendChild(scriptElement);
  }, []);
  return (
    <div className="w-screen h-screen relative overflow-hidden">
      <canvas
        id="login-bg"
        className="w-full h-full absolute"
        style={{
          width: "calc(100vw + 20px)",
          height: "calc(100vh + 20px)",
          top: "-10px",
          left: "-10px",
          filter: "blur(4px)",
        }}
      />
      <LoginFormPage<FormType>
        className="relative z-10"
        title="医疗设备管理系统"
        onFinish={async (val) => {
          await fetchWrap(api.auth.loginByLocal)(val);
          message.success("登录成功");
          setTimeout(() => {
            location.replace("/");
          }, 1000);
        }}
      >
        <Tabs
          centered
          activeKey={loginType}
          onChange={(activeKey) => setLoginType(activeKey as LoginType)}
          items={[{ key: "account", label: "账号密码登录" }]}
        />
        {loginType === "account" && (
          <>
            <ProFormText
              name="username"
              fieldProps={{ size: "large", autoComplete: "username" }}
              placeholder={"用户名:"}
              rules={[{ required: true, message: "请输入用户名!" }]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{ size: "large", autoComplete: "current-password" }}
              placeholder={"密码:"}
              rules={[{ required: true, message: "请输入密码！" }]}
            />
          </>
        )}
        <div style={{ marginBlockEnd: 24 }}>
          <ProFormCheckbox noStyle name="autoLogin">
            自动登录
          </ProFormCheckbox>
        </div>
      </LoginFormPage>
    </div>
  );
}
