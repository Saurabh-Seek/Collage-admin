import React, { Fragment } from "react";
import {
  Breadcrumb,
  Typography,
  Divider,
  Input,
  Drawer,
  Space,
  Button,
  message,
  Tag,
  Row,
  Col,
  Form,
  Select,
  InputRef,
  InputNumber,
  Upload,
} from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import seekSolutionApi from "../../utils/seekSolutionApi";
import { Link, useNavigate } from "react-router-dom";
import LanguageCode from "./../../utils/ISO_639-2.json";
import {
  RcFile,
  UploadChangeParam,
  UploadFile,
  UploadProps,
} from "antd/es/upload";
import SeekSolutionS3Bucket from "../../utils/SeekSolutionS3Bucket";
import { getBase64 } from "../../utils/uiSettings";
import { ICategory } from "../../context/interfaces";
const { Title } = Typography;

const CoursesCreate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const categoryInputRef = React.useRef<InputRef>(null);
  const topicInputRef = React.useRef<InputRef>(null);
  const technologyInputRef = React.useRef<InputRef>(null);
  const [imageUrl, setImageUrl] = React.useState<string>();

  const [category, setCategory] = React.useState<{count:number,data:Array<ICategory>,text:string}>({
    count: 0,
    data: [],
    text: "",
  });
  const [topic, setTopic] = React.useState({
    Count: 0,
    ScannedCount: 0,
    Items: [],
    text: "",
  });
  const [technology, setTechnology] = React.useState({
    Count: 0,
    ScannedCount: 0,
    Items: [],
    text: "",
  });

  const addCategory = async (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    try {
      setLoading(true);
      let apiRes = await seekSolutionApi.Category.create({
        name: category.text,
      });
      setCategory({
        ...category,
        data: [...category.data, apiRes] as any,
        text: "",
      });
      setTimeout(() => {
        categoryInputRef.current?.focus();
      }, 0);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const addTopic = async (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    try {
      setLoading(true);
      let apiRes = await seekSolutionApi.Topic.create(
        form.getFieldValue("category"),
        // { name: topic.text }
      );
      setTopic({
        ...topic,
        Items: [...topic.Items, apiRes] as any,
        text: "",
      });
      setTimeout(() => {
        topicInputRef.current?.focus();
      }, 0);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const addTechnology = async (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>
  ) => {
    e.preventDefault();
    try {
      setLoading(true);
      let apiRes = await seekSolutionApi.Technology.create(
        form.getFieldValue("topic"),
        { name: technology.text }
      );
      setTechnology({
        ...technology,
        Items: [...technology.Items, apiRes] as any,
        text: "",
      });
      setTimeout(() => {
        technologyInputRef.current?.focus();
      }, 0);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const onClose = () => {
    setOpen(false);
  };

  const initialise = async (values: any) => {
    // let bucketKey = await SeekSolutionS3Bucket.uploadImage(
    //   values.banner.file.originFileObj,
    //   true
    // );
    // if (!bucketKey) {
    //   console.log("bucketKey", bucketKey);
    //   return;
    // }
    try {
      setLoading(true);
      let apiRes = await seekSolutionApi.Courses.create({
        ...values,
        // banner: bucketKey,
      });
      console.log("apiRes", apiRes);
      localStorage.removeItem("courses_draft");
      form.resetFields();
      navigate(`/courses/${apiRes._id}/sections/page/1`, {
        replace: true,
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    console.log("handle submit running");
    setLoading(true);
    localStorage.setItem("courses_draft", JSON.stringify(values));
    await initialise(values);
    setLoading(false);
  };

  const initialiseCategory = async () => {
    try {
      let apiRes = await seekSolutionApi.Category.list();
      debugger
      setCategory({...apiRes,text:""});
    } catch (error) {}
  };
  const initialiseTopic = async (category_id: string) => {
    if (!category_id) {
      return;
    }
    try {
      let apiRes = await seekSolutionApi.Topic.list(category_id);
      setTopic(apiRes);
    } catch (error) {}
  };
  const initialiseTechnology = async (topic_id: string) => {
    if (!topic_id) {
      return;
    }
    try {
      let apiRes = await seekSolutionApi.Technology.list(topic_id);
      setTechnology(apiRes);
    } catch (error) {}
  };

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    if (isJpgOrPng && isLt2M) {
      getBase64(file, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }
    return isJpgOrPng && isLt2M;
  };

  React.useEffect(() => {
    initialiseCategory();
  }, []);

  // React.useEffect(() => {
  //     initialiseTopic(form.getFieldValue("category"))
  // }, [form.getFieldValue("category")])

  return (
    <Fragment>
      <Space direction="vertical" style={{ display: "flex" }}>
        <Breadcrumb
          items={[
            {
              title: "Management",
            },
            {
              title: <Link to={`/courses/page/1`}>Courses</Link>,
            },
            {
              title: "Create",
            },
          ]}
        />
        <Title level={2}>Courses</Title>
        <Divider />
        {/* <Row gutter={[2, 8]} justify={'space-between'}>
            </Row> */}
        <Form
          onFinish={handleSubmit}
          form={form}
          initialValues={{
            ...JSON.parse(localStorage.getItem("courses_draft") as string),
          }}
          layout="vertical"
        >
          {/* <Form.Item
            name={"banner"}
            label=""
            required
            tooltip="This is a required field"
          >
            <Upload
              listType="picture-card"
              className="avatar-uploader"
              accept="image/*"
              action={"#"}
              showUploadList={false}
              beforeUpload={beforeUpload}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
              ) : (
                <div>
                  {loading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item> */}

          <Form.Item
            name={"title"}
            label="title"
            required
            tooltip="This is a required field"
          >
            <Input placeholder="The Complete Python Bootcamp From Zero to Hero in Python" />
          </Form.Item>

          <Form.Item
            name={"price"}
            label="Price"
            required
            tooltip="Price is required"
          >
            <InputNumber
              prefix="₹ "
              style={{ width: "100%" }}
              placeholder="499"
            />
          </Form.Item>

          <Form.Item
            name={"desc"}
            label="Sort description"
            required
            tooltip="This is a required field"
          >
            <Input.TextArea placeholder="Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games" />
          </Form.Item>
          <Form.Item
            name={"languages"}
            label="Select course languages"
            required
            tooltip="This is a required field"
          >
            <Select
              mode="multiple"
              style={{ width: "100%" }}
              placeholder="select one country"
              optionLabelProp="label"
            >
              {Object.keys(LanguageCode).map((key: string) => (
                <Select.Option
                  value={key}
                  label={
                    LanguageCode[key as keyof typeof LanguageCode].english[0]
                  }
                >
                  <Space>
                    {LanguageCode[key as keyof typeof LanguageCode].native[0]}
                  </Space>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name={"amenities"}
            label="Amenities"
            required
            tooltip="This is a required field"
          >
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Write amenities then click enter button"
            />
          </Form.Item>
          <Form.Item
            name={"requirements"}
            label="Requirements"
            required
            tooltip="This is a required field"
          >
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Write requirements then click enter button"
            />
          </Form.Item>
          <Form.Item
            name={"category"}
            label="Category"
            required
            tooltip="This is a required field"
          >
            <Select
              style={{ width: "100%" }}
              onChange={(e) => initialiseTopic(e)}
              options={category?.data?.map((res) => {
                return { value: res._id, label: res.name };
              })}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider style={{ margin: "8px 0" }} />
                  <Space style={{ padding: "0 8px 4px" }}>
                    <Input
                      placeholder="Please enter item"
                      ref={categoryInputRef}
                      value={category.text}
                      disabled={loading}
                      onChange={(e) =>
                        setCategory({
                          ...category,
                          text: e.target.value,
                        })
                      }
                    />
                    <Button
                      type="text"
                      icon={<PlusOutlined />}
                      onClick={addCategory}
                      loading={loading}
                    >
                      Add new category
                    </Button>
                  </Space>
                </>
              )}
            />
          </Form.Item>
          {/* <Form.Item
            name={"topic"}
            label="Topic"
            required
            tooltip="This is a required field"
          >
            <Select
              style={{ width: "100%" }}
              onChange={(e) => initialiseTechnology(e)}
              options={topic?.Items?.map((res: any) => {
                return { value: res.information, label: res.name };
              })}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider style={{ margin: "8px 0" }} />
                  <Space style={{ padding: "0 8px 4px" }}>
                    <Input
                      placeholder="Please enter item"
                      ref={topicInputRef}
                      value={topic.text}
                      disabled={loading}
                      onChange={(e) =>
                        setTopic({
                          ...topic,
                          text: e.target.value,
                        })
                      }
                    />
                    <Button
                      type="text"
                      icon={<PlusOutlined />}
                      onClick={addTopic}
                      loading={loading}
                    >
                      Add new topic
                    </Button>
                  </Space>
                </>
              )}
            />
          </Form.Item> */}
          {/* <Form.Item
            name={"technology"}
            label="Technology"
            required
            tooltip="This is a required field"
          >
            <Select
              style={{ width: "100%" }}
              options={technology?.Items?.map((res: any) => {
                return { value: res.information, label: res.name };
              })}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <Divider style={{ margin: "8px 0" }} />
                  <Space style={{ padding: "0 8px 4px" }}>
                    <Input
                      placeholder="Please enter item"
                      ref={technologyInputRef}
                      value={technology.text}
                      disabled={loading}
                      onChange={(e) =>
                        setTechnology({
                          ...technology,
                          text: e.target.value,
                        })
                      }
                    />
                    <Button
                      type="text"
                      icon={<PlusOutlined />}
                      onClick={addTechnology}
                      loading={loading}
                    >
                      Add new technology
                    </Button>
                  </Space>
                </>
              )}
            />
          </Form.Item> */}
          <Button type="primary" htmlType="submit" loading={loading}>
            Preview
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

export default CoursesCreate;
