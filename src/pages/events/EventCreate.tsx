import React, { Fragment } from "react";
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
import { useContentContext } from "../../context/ContentContext";
const { Title } = Typography;

const EventCreate = () => {
  let { Toast } = useContentContext();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const initialise = async (values: any) => {
    try {
      setLoading(true);
      let apiRes = await seekSolutionApi.Events.create(values);
      // console.log("apiRes", apiRes);
      // localStorage.removeItem("event_draft");
      form.resetFields();

      if (apiRes) {
        Toast.openSuccessNotification("Successfully Created");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    let date = dayjs(values.date).toDate().getTime();
    const formData = {
      ...values,
      date,
      banner: values.banner.fileList[0].name,
    };

    // localStorage.setItem("event_draft", JSON.stringify(formData));

    console.log("Date", formData.date);

    await initialise(formData);
  };

  function onChange(info: any) {
    if (info.file.status !== "uploading") {
      // console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  }

  const initialvalues = {
    name: "",
    desc: "",
    date: "",
    time: "",
    link: "",
    banner: "",
  };

  return (
    <Fragment>
      <Space direction="vertical" style={{ display: "flex" }}>
        <Breadcrumb
          items={[
            {
              title: "Management",
            },
            {
              title: <Link to={`/events/page/1`}>Events</Link>,
            },
            {
              title: "Create",
            },
          ]}
        />
        <Title level={2}>Events</Title>
        <Divider />

        <Form
          onFinish={handleSubmit}
          form={form}
          initialValues={initialvalues}
          layout="vertical"
        >
          <Form.Item
            name={"title"}
            label="Title"
            required
            tooltip="Title is required"
          >
            <Input placeholder="React Webinar" />
          </Form.Item>

          <Form.Item
            name={"desc"}
            label="Event description"
            required
            tooltip="Event description is required"
          >
            <Input.TextArea placeholder="We are hosting React webinar... " />
          </Form.Item>

          <Form.Item
            name={"date"}
            label="Select event date & time"
            required
            tooltip="Date is required"
          >
            <DatePicker
              style={{ width: "100%" }}
              format={"YYYY-MM-DD hh:mm a"}
              showTime={{ format: "HH:mm" }}
              placeholder="Date & Time"
            />
          </Form.Item>

          <Form.Item
            name={"link"}
            label="Event Link"
            tooltip="https://meet.google.com/uey-ydmb-eaj"
          >
            <Input placeholder="https://meet.google.com/uey-ydmb-eaj" />
          </Form.Item>

          <Form.Item
            name={"banner"}
            label="Banner"
            rules={[
              {
                required: true,
                message: "Please upload image Banner",
              },
            ]}
            valuePropName=" fileList "
          >
            <Upload
              accept="image/*"
              beforeUpload={(file) => {
                return new Promise((resolve, reject) => {
                  if (file.size > 2) {
                    reject("File size Exceeded");
                  } else {
                    resolve("Success");
                  }
                });
              }}
              onChange={(info) => onChange(info)}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
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

export default EventCreate;
