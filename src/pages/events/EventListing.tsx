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
} from "antd";
import { AudioOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import seekSolutionApi from "../../utils/seekSolutionApi";
import { Link } from "react-router-dom";
import uiSettings from "../../utils/uiSettings";
const { Title } = Typography;
const { Search } = Input;

const columns: ColumnsType<any> = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    // width: 450,
    render: (text: string, record: any) => (
      <Space size="middle">
        <Avatar style={{ verticalAlign: "middle" }} size="large" gap={5}>
          {String(text).charAt(0).toUpperCase()}
        </Avatar>
        {text}
      </Space>
      //   <Link to={`/events/${record?.information}`}>
      //     <Space size="middle">
      //       <Avatar style={{ verticalAlign: "middle" }} size="large" gap={5}>
      //         {String(text).charAt(0)}
      //       </Avatar>
      //       {text}
      //     </Space>
      //   </Link>
    ),
  },
  {
    title: "Description",
    key: "desc",
    dataIndex: "desc",
    width: 250,
    // render: (amenities: any) =>
    //   Array.isArray(amenities) ? (
    //     amenities?.slice(2)?.map?.((tag: any) => {
    //       return <Tag key={tag}>{tag.toUpperCase()}</Tag>;
    //     })
    //   ) : (
    //     <Tag key={amenities}>{amenities?.toUpperCase()}</Tag>
    //   ),
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Time",
    dataIndex: "time",
    key: "time",
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
        <Popconfirm
          title="Delete the task"
          description="Are you sure to delete this task?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => {
            onConfirmYes(record);
          }}
        >
          <Button danger size="small">
            Delete
          </Button>
        </Popconfirm>
      </Space>
    ),
  },
];

const onConfirmYes = async (record: any) => {
  //   console.log("records", record);
};

const EventListing = () => {
  const [state, setState] = React.useState({
    Count: 0,
    ScannedCount: 0,
    Items: [],
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
      let apiRes = await seekSolutionApi.Events.list();
      console.log("apiRes", apiRes);

      setState(apiRes);
    } catch (error) {}
  };

  React.useEffect(() => {
    initialise();
  }, []);

  return (
    <Fragment>
      <Space direction="vertical" style={{ display: "flex" }}>
        <Breadcrumb
          items={[
            {
              title: "Management",
            },
            {
              title: "Events",
            },
          ]}
        />
        <Title level={2}>Events</Title>
        <Divider />
        <Row gutter={[2, 8]} justify={"space-between"}>
          <Col span={20}>
            <Search placeholder="input search text" enterButton="Search" />
          </Col>
          <Col span={4}>
            <Button type="primary" onClick={showDrawer}>
              Filter
            </Button>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={state.Items.map((res: any, index) => {
            return {
              ...res,
              key: index + 1,
              title: res.title,
              desc: uiSettings.capitalizeFirstLetter(res.desc),
              date: moment(res.date).format("MMM, DD YYYY"),
              time: moment(res.date).format("h:mm a"),
              createdAt: moment(res.createdAt).format("MMM, DD YYYY"),
              link: res.link,
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

export default EventListing;
