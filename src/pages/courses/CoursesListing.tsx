import React, { Fragment } from "react";
import {
  Breadcrumb,
  Typography,
  Divider,
  Input,
  Drawer,
  Space,
  Button,
  Table,
  Tag,
  Row,
  Col,
  Avatar,
  Popconfirm,
  Flex,
} from "antd";
import { AudioOutlined, EditOutlined, UserAddOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import seekSolutionApi from "../../utils/seekSolutionApi";
import { Link } from "react-router-dom";
import uiSettings from "../../utils/uiSettings";
import { ICourse } from "../../context/interfaces";
const { Title } = Typography;
const { Search } = Input;

const suffix = (
  <AudioOutlined
    style={{
      fontSize: 16,
    }}
  />
);

const CoursesListing = () => {
  const [state, setState] = React.useState<{
    count: number;
    data: Array<ICourse>;
  }>({
    count: 0,
    data: [],
  });
  const [open, setOpen] = React.useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const initialise = async () => {
    try {
      let apiRes = await seekSolutionApi.Courses.list();
      console.log("apiRes", apiRes);

      setState(apiRes);
    } catch (error) {}
  };

  React.useEffect(() => {
    initialise();
  }, []);

  const columns: ColumnsType<any> = [
    {
      title: "name",
      dataIndex: "name",
      key: "name",
      width: 450,
      render: (text: string, record: any) => (
        <Link to={`/courses/${record?.information}/sections/page/1`}>
          <Space size="middle">
            <Avatar style={{ verticalAlign: "middle" }} size="large" gap={5}>
              {String(text || "").charAt(0)}
            </Avatar>
            {text}
          </Space>
        </Link>
      ),
    },
    {
      title: "Amenities",
      key: "amenities",
      dataIndex: "amenities",
      render: (amenities: any) =>
        Array.isArray(amenities) ? (
          amenities?.slice(2)?.map?.((tag: any) => {
            return <Tag key={tag}>{tag.toUpperCase()}</Tag>;
          })
        ) : (
          <Tag key={amenities}>{amenities?.toUpperCase()}</Tag>
        ),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Topic",
      dataIndex: "topic",
      key: "topic",
    },
    {
      title: "Language",
      dataIndex: "prgm_lang",
      key: "prgm_lang",
      width: 150,
    },
    {
      title: "Lessions",
      dataIndex: "lession",
      key: "lession",
      width: 50,
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      width: 50,
    },
    {
      title: "Rating",
      dataIndex: "ratings",
      key: "ratings",
      width: 40,
    },
    {
      title: "Created By",
      dataIndex: "createdBy",
      key: "createdBy",
      width: 40,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Link
            to={`/courses/${record?._id}/sections/page/1`}
          >
            <Button size="small">View</Button>
          </Link>




          <Link to={{ pathname: `/courses/${record._id}/edit` }} state={record}>
            <Button danger size="small" >
              <EditOutlined/>
            </Button>
          </Link>


          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            okText="Yes"
            cancelText="No"
            disabled
          >
            <Button danger size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Fragment>
      <Space direction="vertical" style={{ display: "flex" }}>
        <Breadcrumb
          items={[
            {
              title: "Management",
            },
            {
              title: "Courses",
            },
          ]}
        />
        <Flex justify="space-between" gap={"small"} align="center" >
          
        <Title level={2}>Courses</Title>
        <Link to={"/courses/create"}>
        <Button icon={<UserAddOutlined/>}></Button></Link>
        </Flex>
        <Divider />
        <Row gutter={[2, 8]} justify={"space-between"}>
          <Col span={20}>
            <Search
              placeholder="input search text"
              enterButton="Search"
              suffix={suffix}
            />
          </Col>
          <Col span={4}>
            <Button type="primary" onClick={showDrawer}>
              Filter
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={state?.data?.map((res, index) => {
            return {
              ...res,
              key: index + 1,
              name: res.title,
              category: uiSettings.capitalizeFirstLetter(
                res?.category?.name || ""
              ),
              // topic: uiSettings.capitalizeFirstLetter(res?.topic||""),
              // prgm_lang: uiSettings.capitalizeFirstLetter(res?.prgm_lang||""),
              // lession: res.lession,
              // duration: res.duration,
              ratings: res.rate,
              createdBy:
                `${res?.createdBy?.firstName || ""} ${
                  res?.createdBy?.lastName || ""
                }`.trim() || "Not available",
              createdAt: moment(res.createdAt).format("MMM, DD YYYY"),
              // amenities: res.amenities,
            };
          })}
          pagination={{ hideOnSinglePage: true }}
        />
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

export default CoursesListing;
