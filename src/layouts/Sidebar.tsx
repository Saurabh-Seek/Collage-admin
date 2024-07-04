import React, { useEffect } from "react";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import {
  AppstoreOutlined,
  UserOutlined,
  SettingOutlined,
  UnorderedListOutlined,
  AppstoreAddOutlined,
  CalendarOutlined,
  ContactsOutlined,
} from "@ant-design/icons";
import { LogoL } from "../assets";
import { Link } from "react-router-dom";

type MenuItem = Required<MenuProps>["items"][number];

const Sidebar = () => {
  let path = window.location.pathname;

  useEffect(() => {}, []);

  const selectedKey = () => {
    if (path === "/") {
      return "1";
    } else if (path === "/map") {
      return "2";
    } else {
      return "1";
    }
  };

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: "group"
  ): MenuItem {
    return {
      key,
      icon,
      children,
      label,
      type,
    } as MenuItem;
  }

  return (
    <>
      <div className="flex flex-col w-full justify-center items-center py-4 bg-[#EBEBEB]">
        <img src={LogoL} alt="logo" className="w-16" />
      </div>
      <Menu
        mode="inline"
        defaultSelectedKeys={[selectedKey()]}
        className="text-base font-normal text-black bg-[#EBEBEB]"
        items={[
          {
            key: "1",
            icon: <AppstoreOutlined />,
            label: <Link to="/">Dashboard</Link>,
          },
          getItem(
            <Link to="/courses/page/1">Courses</Link>,
            "courses",
            <UnorderedListOutlined />
          ),
          getItem(
            "Management",
            "management",
            null,
            [
              getItem(
                <Link to="/contact-us/page/1">Contact-us</Link>,
                "contact-us",
                <UnorderedListOutlined />
              ),
              getItem(
                <Link to="/colleges/page/1">colleges</Link>,
                "colleges",
                <UnorderedListOutlined />
              ),
              
              getItem(
                <Link to="/content/page/1">Content</Link>,
                "contents",
                <UnorderedListOutlined />
              ),
              getItem(
                <Link to="/category/page/1">Category</Link>,
                "category",
                <UnorderedListOutlined />
              ),



              // Category
              getItem("Category", "category", <SettingOutlined />, [
                getItem(
                  <Link to="/category/create">Create</Link>,
                  "13",
                  <AppstoreAddOutlined />
                ),
                getItem(
                  <Link to="/category/page/1">Listing</Link>,
                  "14",
                  <UnorderedListOutlined />
                ),
              ]),
              // Topic
              getItem("Topic", "topic", <SettingOutlined />, [
                getItem(
                  <Link to="/topic/create">Create</Link>,
                  "15",
                  <AppstoreAddOutlined />
                ),
                getItem(
                  <Link to="/topic/page/1">Listing</Link>,
                  "16",
                  <UnorderedListOutlined />
                ),
              ]),


                 // Technology
                 getItem("Technology", "technology", <SettingOutlined />, [
                  getItem(
                    <Link to="/technology/create">Create</Link>,
                    "13",
                    <AppstoreAddOutlined />
                  ),
                  getItem(
                    <Link to="/technology/page/1">Listing</Link>,
                    "14",
                    <UnorderedListOutlined />
                  ),
                ]),


                 // Content
                 getItem("Content", "content", <SettingOutlined />, [
                  getItem(
                    <Link to="/content/create">Create</Link>,
                    "13",
                    <AppstoreAddOutlined />
                  ),
                  getItem(
                    <Link to="/content/update">Update</Link>,
                    "14",
                    <AppstoreAddOutlined />
                  ),
                  getItem(
                    <Link to="/content/page/1">Listing</Link>,
                    "15",
                    <UnorderedListOutlined />
                  ),
                ]),


            ],
            "group"
          ),
          {
            key: "2",
            icon: <UserOutlined />,
            label: <Link to="/map">Map</Link>,
          },
        ]}
      />
    </>
  );
};

export default Sidebar;
