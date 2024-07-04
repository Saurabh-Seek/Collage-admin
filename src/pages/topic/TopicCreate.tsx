import React, { Fragment, useEffect, useState } from "react";
import {
  Breadcrumb,
  Typography,
  Divider,
  Input,
  Drawer,
  Space,
  Button,
  Form,
  Select,
  DatePicker,
  TimePicker,
  UploadProps,
  message,
  Upload,
} from "antd";
import seekSolutionApi from "../../utils/seekSolutionApi";
import { Link } from "react-router-dom";
import LanguageCode from "../../utils/ISO_639-2.json";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import moment from "moment";
import { useContentContext } from "../../context/ContentContext";
const { Title } = Typography;

const TopicCreate = () => {
  let { Toast } = useContentContext();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [categories, setCategories] = useState({
    Count: 0,
    ScannedCount: 0,
    Items: [],
  });
  const [dropdownlist, setDropdownList]: any = useState([]);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const getCategoriesData = async () => {
    try {
      let apiRes = await seekSolutionApi.Category.list();
      if (apiRes) {
        console.log("apiRes get categories->", apiRes);
        const newState = {
          Count: apiRes.length,
          ScannedCount: apiRes.length,
          Items: apiRes.map((item: any) => ({
            id: item._id,
            name: item.name,
            createdAt: moment(item.createdAt).format("MMM, DD YYYY"),
          })),
        };
        setCategories(newState);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getCategoriesData();
    getCategoriesList();
  }, []);

  const initialise = async (values: any) => {
    console.log('init form value ==', values);
    
    try {
      setLoading(true);
      let apiRes = await seekSolutionApi.Topic.create(values);
      // console.log("apiRes", apiRes);
      // localStorage.removeItem("event_draft");
      form.resetFields();

      if (apiRes) {
        console.log('apiRes Topic-->>', apiRes);
        
        Toast.openSuccessNotification("Successfully Created");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {

    // const apiRes = await seekSolutionApi.Topic.create(values);
    // console.log('Topic res', apiRes)


    // console.log('Fvalues', values);
    
    const formData = {
      ...values,
    };


    await initialise(formData);
  };

  const initialvalues = {
    name: "",
  };

  const getCategoriesList = () => {
    console.log("Function running");
    let list: any = [];
    categories.Items.map((item: any) => {
      console.log(item);
      list.push({ id: item.id, label: item.name });
    });
    console.log("list", list);
    setDropdownList(list);
  };

 

  console.log("Dropdownlist", dropdownlist);

  return (
    <Fragment>
      <Space direction="vertical" style={{ display: "flex" }}>
        <Breadcrumb
          items={[
            {
              title: "Management",
            },
            {
              title: <Link to={`/topic/page/1`}>Topic</Link>,
            },
            {
              title: "Create",
            },
          ]}
        />
        <Title level={2}>Topic</Title>
        <Divider />

        <Form
          onFinish={handleSubmit}
          form={form}
          initialValues={initialvalues}
          layout="vertical"
        >
          <Form.Item
            name={"category"}
            label="Category"
            required
            tooltip="Category name is required"
          >
            <Select
              style={{ width: 120 }}
              defaultValue="Select"
            >
              {categories.Items.map((item: any) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name={"name"}
            label="Name"
            required
            tooltip="Category name is required"
          >
            <Input placeholder="Development" />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading}>
            Create
          </Button>
        </Form>
      </Space>
      <Drawer
        title="Filter"
        placement={"right"}
        width={500}
        onClose={onClose}
        open={open}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="primary" onClick={onClose}>
              Apply
            </Button>
          </Space>
        }
      >
        <p>Some contents...</p>
      </Drawer>
    </Fragment>
  );
};

export default TopicCreate;
