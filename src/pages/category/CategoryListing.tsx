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

const CategoryListing = () => {
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



  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const initialise = async () => {
    try {
      setLoading(true);
      let apiRes = await seekSolutionApi.Category.list();
      console.log("apiRes list", apiRes);
      const newState = {
        Count: apiRes.length,
        ScannedCount: apiRes.length,
        Items: apiRes.map((item: any) => ({
          // id: item._id,
          ...item,
          // name: item.name,
          createdAt: moment(item.createdAt).format("MMM, DD YYYY"),
        })),
      };
      setState(newState);
      setDefaultState(newState);
    } catch (error) { }
  };


  const columns: ColumnsType<any> = [
    {
      title: "name",
      dataIndex: "name",
      key: "name",
    },

    {
      title: " createdBy",
      dataIndex: "createdBy",
      key: "createdBy",
    },
    {
      title: "createdAt",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "updatedAt",
      dataIndex: "updatedAt",
      key: "updatedAt",
    },

    {
      title: "Action",
      key: "action",
      fixed: "right",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Link to={{ pathname: `/Category/${record._id}/edit` }} state={record}>
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



  const handleDelete = async (id: any) => {
    try {
      setLoading(true);
      setLoadingId(id);
      let apiRes = await seekSolutionApi.Category.deletd(id);
      if (apiRes) {
        console.log("deleted id", apiRes);
        initialise();
        Toast.openSuccessNotification("Item Deleted Successfully");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setLoading(false);
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
    const filteredItems = defaultState.Items.filter((item: any) =>
      item.name.toLowerCase().startsWith(value.toLowerCase())
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
              title: "Category",
            },
          ]}
        />
        <Title level={2}>Category</Title>
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
            <a href="/category/create">
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
        <p>Some Category...</p>
      </Drawer>
    </Fragment>
  );
};

export default CategoryListing;
