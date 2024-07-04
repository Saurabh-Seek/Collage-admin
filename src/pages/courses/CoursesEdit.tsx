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
} from "antd";
import seekSolutionApi from "../../utils/seekSolutionApi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
const { Title } = Typography;

const CoursesEdit = () => {
  const { state } = useLocation();

  console.log("state=>", state);
  
  const initialValues = {
    name: state.name,
    amenities: state.amenities,
    category: state.category,
    topic: state.topic,
    prgm_lang: state.prgm_lang,
    lession: state.lession,
    duration: state.duration,
    ratings: state.ratings,
    createdBy: state.createdBy,
    createdAt: state.createdAt,
  };

  const navigate = useNavigate();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [courses, setCourses] = useState({
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

  const getCoursesData = async () => {
    try {
      let apiRes = await seekSolutionApi.Courses.list();
      if (apiRes) {
        console.log("apiRes get courses->", apiRes);
        const newState = {
          Count: apiRes.length,
          ScannedCount: apiRes.length,
          Items: apiRes.map((item:any) => ({
            id: item._id,
            name: item.name,
           
            createdAt: moment(item.createdAt).format("MMM, DD YYYY"),
          })),
        };
        setCourses(newState);
      }
    } catch (error) {
      console.error("Error fetching courses data", error);
    }
  };

  useEffect(() => {
    getCoursesData();
    getCoursesList();
    }, []);

  const initialise = async (values:any) => {
    console.log("init form value ==", values);
    const { name, amenities, category, topic, prgm_lang, lession, duration, ratings, createdBy, createdAt } = values;
    console.log("Name ->", name);
    console.log("Amenities ->", amenities);
    // console.log("Category ->", category);
    console.log("Topic ->", topic);
    console.log("prgm_lang ->", prgm_lang);
    console.log("Lession ->", lession);
    console.log("Duration ->", duration);
    console.log("Ratings ->", ratings);
    // console.log("CreatedBy ->", createdBy);
    // console.log("CreatedAt ->", createdAt);

    try {
      setLoading(true);
      console.log("state._id-------------->", state.id);

      let apiRes = await seekSolutionApi.Courses.update(state.slug, values);
      console.log("apiRes", apiRes);
      form.resetFields();

      if (apiRes) {
        console.log("apiRes Topic-->>", apiRes);
        navigate("/courses/page/1");
        window.alert("Successfully Updated");
      }
    } catch (error) {
      console.error("Error updating course", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values:any) => {
    await initialise(values);
  };

  
  const getCoursesList = () => {
    console.log("Function running");
    let list: any = [];
    courses.Items.map((item: any) => {
      console.log(item);
      list.push({ id: item.id, label: item.title });
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
              title: <Link to={`/courses/page/1`}>Courses</Link>,
            },
            {
              title: "Edit",
            },
          ]}
        />
        <Title level={2}>Edit Course</Title>
        <Divider />

        <Form
          onFinish={handleSubmit}
          form={form}
          initialValues={initialValues}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Name"
            required
            tooltip="Name is required"
          >
            <Input placeholder="Enter the course name" />
          </Form.Item>

          <Form.Item
            name="amenities"
            label="Amenities"
            required
            tooltip="Amenities are required"
          >
            <Input placeholder="Enter the amenities" />
          </Form.Item>

          {/* <Form.Item
            name="category"
            label="Category"
            required
            tooltip="Category is required"
          >
            <Input placeholder="Enter the category" />
          </Form.Item> */}

          <Form.Item
            name="topic"
            label="Topic"
            required
            tooltip="Topic is required"
          >
            <Input placeholder="Enter the topic" />
          </Form.Item>

          <Form.Item
            name="prgm_lang"
            label="Programming Language"
            required
            tooltip="Programming language is required"
          >
            <Input placeholder="Enter the programming language" />
          </Form.Item>

          <Form.Item
            name="lession"
            label="Lesson"
            required
            tooltip="Lesson is required"
          >
            <Input placeholder="Enter the lessons" />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Duration"
            required
            tooltip="Duration is required"
          >
            <Input placeholder="Enter the duration" />
          </Form.Item>

          <Form.Item
            name="ratings"
            label="Ratings"
            required
            tooltip="Ratings are required"
          >
            <Input placeholder="Enter the ratings" />
          </Form.Item>

          {/* <Form.Item
            name="createdBy"
            label="Created By"
            required
            tooltip="Created By is required"
          >
            <Input placeholder="Enter the creator's name" />
          </Form.Item> */}

          {/* <Form.Item
            name="createdAt"
            label="Created At"
            required
            tooltip="Creation date is required"
          >
            <Input placeholder="Enter the creation date" />
          </Form.Item> */}

          <Button type="primary" htmlType="submit" loading={loading}>
            Update
          </Button>
        </Form>
      </Space>
      <Drawer
        title="Filter"
        placement="right"
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
        <p>Some Courses...</p>
      </Drawer>
    </Fragment>
  );
};

export default CoursesEdit;
