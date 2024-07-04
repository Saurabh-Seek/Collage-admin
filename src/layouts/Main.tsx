import React, { useEffect, useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  PoweroffOutlined,
} from "@ant-design/icons";
import { Layout, Button, Dropdown } from "antd";
import { Content, Footer, Header } from "antd/es/layout/layout";
import Sider from "antd/es/layout/Sider";

import { Outlet, Route, Routes } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useContentContext } from "../context/ContentContext";
import { useGlobalProvider } from "../context/Provider";

const Main = () => {
  const { authState } = useGlobalProvider();
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState("");
  let { Toast } = useContentContext();

  useEffect(() => {
    if (window.innerWidth < 426) {
      setCollapsed(true);
    }

    let user_name = authState?.firstName?.split(" ")[0];
    setUser(user_name);
  }, []);

  // Navigation Menu Options
  const items = [
    {
      label: "Logout",
      key: "1",
      icon: <PoweroffOutlined />,
    },
  ];

  const handleMenuClick = (e: any) => {
    if (e.key === "1") {
      //Logout
      Toast.openSuccessNotification("Logged Out!", "Logout Success!");
      window.location.replace("/login");
    }
  };

  const menuProps = {
    items,
    onClick: handleMenuClick,
  };

  return (
    <Layout className="h-screen w-full flex flex-row">
      <Sider
        className={
          collapsed
            ? "max-md:hidden bg-[#EBEBEB]"
            : "visible sider bg-[#EBEBEB]"
        }
        theme="light"
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ background: "#EBEBEB" }}
      >
        <Sidebar />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: "white" }}>
          <div className="flex flex-row ">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => {
                setCollapsed(!collapsed);
              }}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
                zIndex: 999,
              }}
            />
            <Dropdown.Button
              menu={menuProps}
              icon={<UserOutlined />}
              className="flex justify-end m-4"
            >
              {/* Hellofghjk, {user && user} */}
              {authState?.email}
            </Dropdown.Button>
          </div>
        </Header>

        <Content className="m-[24px] p-[24px] bg-white rounded-md h-full overflow-scroll">
          <Outlet />
        </Content>
        <Footer className="text-center pt-0">
          Copyright 2023 © ALL RIGHTS RESERVED. Design by{" "}
          <a href="https://seeksolution.in/" target="_blank" rel="noreferrer">
            Seek Solution LLP
          </a>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Main;
