import React, { Fragment, useState, useEffect } from "react";
import {
  Breadcrumb,
  Typography,
  Divider,
  Input,
  Drawer,
  Space,
  Button,
  Table,
  Row,
  Col,
  Popconfirm,
} from "antd";
import { Link } from "react-router-dom";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import seekSolutionApi from "../../utils/seekSolutionApi";
import { useContentContext } from "../../context/ContentContext";
import {
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";

const { Title } = Typography;
const { Search } = Input;

const ContentListing = () => {
  // const history = useHistory();
  const { Toast } = useContentContext();
  const [defaultState, setDefaultState] = useState({
    Count: 0,
    ScannedCount: 0,
    Items: [],
  });
  const [state, setState] = useState({ ...defaultState });
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingId, setLoadingId] = useState("");
  const [open, setOpen] = useState(false);
  // const history = use

  const columns: ColumnsType<any> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
    },
    {
      title: "Is Footer",
      dataIndex: "isFooter",
      key: "isFooter",
      render: (_: any, record: any) => {
        return <>{_?.toString()}</>
      }
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Link to={{ pathname: `/content/${record.id}/edit` }} state={record}>
            <Button danger size="small" >
              <EditOutlined />
            </Button>
          </Link>

          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => {
              handleDelete(record.id);
            }}
          >
            <Button danger size="small" loading={loadingId === record.id}>
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const initialise = async () => {
    try {
      setLoading(true);
      let apiRes = await seekSolutionApi.Content.list();
      console.log("apiRes list", apiRes);
      const newState = {
        Count: apiRes.length,
        ScannedCount: apiRes.length,
        Items: apiRes.map((item: any) => ({
          id: item._id,
          title: item.title,
          description: item.desc,
          slug: item.slug,
          isFooter: item.isFooter,
          createdAt: moment(item.createdAt).format("MMM, DD YYYY"),
        })),
      };
      setState(newState);
      setDefaultState(newState);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (_id: any) => {
    console.log("dlt id", _id);

    try {
      setLoadingId(_id);
      let apiRes = await seekSolutionApi.Content.delete(_id);
      console.log("deleted id", apiRes);
      if (apiRes) {
        console.log("deleted id", apiRes);
        initialise();
        Toast.openSuccessNotification("Item Deleted Successfully");
      }
    } catch (error: any) {
      console.error("Error deleting category:", error.message as any);
      const msg = JSON.parse(error.message)
      Toast.openErrorNotification(msg.message)
    } finally {
      setLoadingId("");
    }
  };

  const handleEdit = async (id: any) => {
    console.log("edit");
    return `/category/edit/${id}`;
  };

  useEffect(() => {
    initialise();
  }, []);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    console.log("search value", value);

    const filteredItems = defaultState.Items.filter((item: any) =>
      item?.name?.toLowerCase().startsWith(value?.toLowerCase())
    );
    setState((prevState) => ({ ...prevState, Items: filteredItems }));
  };

  const resetSearch = () => {
    setSearchValue("");
    setState({ ...defaultState });
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
              title: "Content",
            },
          ]}
        />
        <Title level={2}>Contents</Title>
        <Divider />
        <Row gutter={[2, 8]} justify={"space-between"}>
          <Col span={20}>
            <Search
              placeholder="input search text"
              enterButton="Search"
              value={searchValue}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Col>
          <Col
            span={4}
            style={{ display: "flex", gap: 10, alignItems: "center" }}
          >
            <Button type="primary" onClick={showDrawer}>
              Filter
            </Button>
            <Button onClick={resetSearch}>Reset</Button>
            <a href="/content/create">
              <PlusCircleOutlined style={{ fontSize: "28px" }} />
            </a>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={state.Items.map((res: any, index) => ({
            ...res,
            key: index + 1,
            name: res.name,
            createdAt: moment(res.createdAt).format("MMM, DD YYYY"),
          }))}
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

export default ContentListing;
