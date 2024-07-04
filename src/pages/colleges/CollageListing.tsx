import React, { Fragment, useState } from "react";
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
  PopconfirmProps,
  message,
  Popconfirm,
} from "antd";
import { Link } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import seekSolutionApi from "../../utils/seekSolutionApi";
import uiSettings from "../../utils/uiSettings";
import {
  
  EditOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";
const { Title } = Typography;
const { Search } = Input;

const CollageListing = () => {
  //const [state, setState] =useState([]);
 
  const [defaultState, setDefaultState] = React.useState({
    Count: 0,
    ScannedCount: 0,
    Items: [],
  });
  const [state, setState] = React.useState({ ...defaultState });
  const [searchValue, setSearchValue] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [loadingId, setLoadingId] = React.useState("");

  //------------------

  const confirm: PopconfirmProps["onConfirm"] = (e) => {
    console.log(e);
    message.success("Click on Yes");
  };

  const cancel: PopconfirmProps["onCancel"] = (e) => {
    console.log(e);
    message.error("Click on No");
  };
  //-------------------
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const initialise = async () => {
    try {
      let apiRes = await seekSolutionApi.colleges.list();
      console.log("apiRes", apiRes);

      const newState = {
        Count: apiRes.length,
        ScannedCount: apiRes.length,
        Items: apiRes.map((item: any) => ({
          ...item,
          createdAt: moment(item.createdAt).format("MMM, DD YYYY"),
        })),
      };
      setState(newState);
      setDefaultState(newState);
    } catch (error) {}
  };

  //--------------------------------
  const columns: ColumnsType<any> = [
    {
      title: "name",
      dataIndex: "name",
      key: "name",
    },
   
    {
      title: "code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "city",
      dataIndex: "city",
      key: "city",
     
    },
    {
      title: "pincode",
      dataIndex: "pincode",
      key: "pincode",
     
    },
    {
      title: "lat",
      dataIndex: "lat",
      key: "lat",
     
    },
    {
      title: "lng",
      dataIndex: "lng",
      key: "lng",
     
    },
    {
      title: "state",
      dataIndex: "state",
      key: "state",
     
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",

      render: (_: any, record: any) => (
        <Space size="middle">
          <Link to={{ pathname: `/collage/${record._id}/edit` }} state={record}>
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
              handleDelete(record._id);
            }}
          >
            <Button danger size="small" loading={loadingId === record._id}>
              <DeleteOutlined />
            </Button>
          </Popconfirm>

         
        </Space>
      ),
    },
  ];

  //---------------------------------------
  const handleDelete = async (id: any) => {
    console.log("dlt id", id);

    try {
      setLoading(true);
      setLoadingId(id);
      let apiRes = await seekSolutionApi.colleges.delete(id);
      console.log("deleted id", apiRes);
      if (apiRes) {
        console.log("deleted id", apiRes);
        initialise();
        window.alert("Item Deleted Successfully");
      }
    } catch (error) {
      console.error("Error deleting Collages:", error);
    } finally {
      setLoading(false);
    }
  };

  // const Update = async (id: string, data:any) => {
  //   console.log("update id", id);

  //   try {
  //     // setLoading(true);
  //     // setLoadingId(id);
  //     let apiRes = await seekSolutionApi.colleges.update(id, data);
  //     console.log("update id", apiRes);
  //     if (apiRes) {
  //       console.log("update id", apiRes);
  //       initialise();
  //       window.alert("Item Update Successfully");
  //     }
  //   } catch (error) {
  //     console.error("Error update Collages:", error);
  //   } finally {
  //     // setLoading(false);
  //   }
  // };

  const handleEdit = async (id: any) => {
    console.log("edit");
    return `/colleges/edit/${id}`;
  };

  React.useEffect(() => {
    initialise();
  }, []);
  const handleSearch = (value: string) => {
    setSearchValue(value);

    console.log("search value=>", value);

    const filteredItems = defaultState.Items.filter(
      (item: any) =>
        item?.firstName?.toLowerCase().startsWith(value?.toLowerCase()) ||
        item?.email?.toLowerCase().startsWith(value?.toLowerCase())
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
              title: "colleges",
            },
          ]}
        />
        <Title level={2}>colleges</Title>
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
          <Col span={4}>
            <Button type="primary" onClick={showDrawer}>
              Filter
            </Button>

            {/* <button onClick={resetSearch}>Reset</button> */}
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={state.Items.map((res: any, index) => ({
            ...res,
            key: index + 1,
            name: res.name,
            // email: res.email,
            desc: uiSettings.capitalizeFirstLetter(res.desc),
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
        <p>Some Collages...</p>
      </Drawer>
    </Fragment>
  );
};

export default CollageListing;
