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

const CategoryCreate = () => {
  let { Toast } = useContentContext();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState("");
  const [btnType, setBtnType] = React.useState("save");
  const [open, setOpen] = React.useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const initialise = async (values: any) => {
    console.log("valuedfghnm --->", values);

    if (values.name == "") {
      console.log("false");
      Toast.openErrorNotification("Category name is required");
    } else {
      console.log("true");

      try {
        setLoading(btnType);
        let apiRes = await seekSolutionApi.Category.create(values);
        // console.log("apiRes", apiRes);
        // localStorage.removeItem("event_draft");
        form.resetFields();

        if (apiRes) {
          Toast.openSuccessNotification("Successfully Created");
          console.log("ApiRes Categories -->", apiRes);
        }
        if (btnType == "saveExit") {
          console.log("Back");
          // history.back()
          window.history.back()
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading("");
      }
    }
  };

  const handleSubmit = async (values: any) => {
    const formData = {
      ...values,
    };

    // localStorage.setItem("event_draft", JSON.stringify(formData));

    await initialise(formData);
  };

  const initialvalues = {
    name: "",
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
              title: <Link to={`/category/page/1`}>Categories</Link>,
            },
            {
              title: "Create",
            },
          ]}
        />
        <Title level={2}>Categories</Title>
        <Divider />

        <Form
          onFinish={handleSubmit}
          form={form}
          initialValues={initialvalues}
          layout="vertical"
        >
          <Form.Item
            name={"name"}
            label="Name"
            required
            tooltip="Category name is required"
          >
            <Input placeholder="Development" />
          </Form.Item>

          <Space size="middle">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading == "save"}
              onMouseOver={() => setBtnType(() => "save")}
            >
              Create
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading == "saveExit"}
              onMouseOver={() => setBtnType(() => "saveExit")}
            >
              Create and Exit
            </Button>
          </Space>
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

export default CategoryCreate;
