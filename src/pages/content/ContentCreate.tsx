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
  Switch,
} from "antd";
import seekSolutionApi from "../../utils/seekSolutionApi";
import { Link } from "react-router-dom";
import LanguageCode from "../../utils/ISO_639-2.json";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import moment from "moment";
import { useContentContext } from "../../context/ContentContext";
import ReactQuill from "react-quill";
const { Title } = Typography;

const ContentCreate = () => {
  let { Toast } = useContentContext();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [topics, setTopics] = useState({
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

  const getTopicsData = async () => {
    try {
      let apiRes = await seekSolutionApi.Topic.getList();
      if (apiRes) {
        console.log("apiRes get technology->", apiRes);
        const newState = {
          Count: apiRes.length,
          ScannedCount: apiRes.length,
          Items: apiRes.map((item: any) => ({
            id: item._id,
            name: item.name,
            createdAt: moment(item.createdAt).format("MMM, DD YYYY"),
          })),
        };
        setTopics(newState);
      }
    } catch (error) { }
  };

  useEffect(() => {
    getTopicsData();
    getTopicsList();
  }, []);

  const initialise = async (values: any) => {
    console.log('init form value ==', values);
    const { title, desc } = values
    console.log('Title ->', title)
    console.log('Description ->', desc)

    try {
      setLoading(true);
      let apiRes = await seekSolutionApi.Content.create(values);
      console.log("apiRes", apiRes);
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
    const formData = {
      ...values,
    };

    console.log('Fvalues', formData);

    await initialise(formData);
  };

  const initialvalues = {
    name: "",
    isFooter: false
  };

  const getTopicsList = () => {
    console.log("Function running");
    let list: any = [];
    topics.Items.map((item: any) => {
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
              title: <Link to={`/content/page/1`}>Content</Link>,
            },
            {
              title: "Create",
            },
          ]}
        />
        <Title level={2}>Content</Title>
        <Divider />

        <Form
          onFinish={handleSubmit}
          form={form}
          initialValues={initialvalues}
          layout="vertical"
        >
          {/* <Form.Item
            name={"topic"}
            label="Topic"
            required
            tooltip="Topic name is required"
          >
            <Select
              style={{ width: 120 }}
              defaultValue="Select"
            >
              {topics.Items.map((item: any) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item> */}

          <Form.Item
            name={"title"}
            label="Title"
            required
            tooltip="Title name is required"
          >
            <Input placeholder="Enter you title name" />
          </Form.Item>

          <Form.Item
            name={"desc"}
            label="Description"
            required
            tooltip="Description is required"
          >
            <ReactQuill theme="snow" />
            {/* <Input placeholder="Write your content here.." /> */}
          </Form.Item>

          {/* <Form.Item
            name={"isFooter"}
            label="Is Footer"
            valuePropName="checked"
          >
            <Switch checkedChildren="Yes" unCheckedChildren="No" defaultChecked={false} />
          </Form.Item> */}

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

export default ContentCreate;
