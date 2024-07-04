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
import { Link, useParams } from "react-router-dom";
import LanguageCode from "../../utils/ISO_639-2.json";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useContentContext } from "../../context/ContentContext";
const { Title } = Typography;

const CategoryEdit = () => {
  const params= useParams()
    const categ_id = params.id;
    console.log('id-->', categ_id);
    
  let { Toast } = useContentContext();
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [value, setValue]= useState('')
  console.log('Value -->', value);
  

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const getData = async (categ_id:any) => {
    try {
      let apiRes = await seekSolutionApi.Category.get(categ_id);
      console.log('Get data --> ', apiRes);
      if(apiRes){
        const name = apiRes.name
        console.log('data name --> ', name);
        // setValue(name)
        form.setFieldValue('name',name)


      }
      
    } catch (error) {
      console.log(error);
  }};

  const handleUpdate = async ( categ_id:any, values: any) => {
    console.log('New Data --> ', categ_id, values.name);
    
    try {
      setLoading(true);
      let apiRes = await seekSolutionApi.Category.update(categ_id, values);
      console.log('Updated data-->', apiRes);
      
      // form.resetFields();

      if (apiRes) {
        Toast.openSuccessNotification("Successfully Update");
        // console.log('ApiRes Categories -->', apiRes);
        console.log('Updated data-->', apiRes);
        
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

    // localStorage.setItem("event_draft", JSON.stringify(formData));

    await handleUpdate(categ_id, formData);
  };

  useEffect(() => {
    getData(categ_id);
  }, []); 

  // const initialvalues = {
  //   name: "",
  // };

  return (
    <Fragment>
      <Space direction="vertical" style={{ display: "flex" }}>
        <Breadcrumb
          items={[
            {
              title: "Management",
            },
            {
              title: <Link to={`/category/page/1`}>Category</Link>,
            },
            {
              title: "Edit",
            },
          ]}
        />
        <Title level={2}>Category Edit</Title>
        <Divider />

        <Form
          onFinish={handleSubmit}
          form={form}
          // initialValues={initialvalues}
          layout="vertical"
        >
          <Form.Item
            name={"name"}
            label="Name"
            required
            tooltip="Category name is required" 
          >
            <Input placeholder="Development"  defaultValue={value} />
          </Form.Item>

          <Button type="primary" htmlType="submit" loading={loading}>
            Update
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

export default CategoryEdit
