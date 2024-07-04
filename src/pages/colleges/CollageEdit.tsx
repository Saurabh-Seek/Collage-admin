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

const CollageEdit = () => {
  const { state } = useLocation();

  console.log("state=>", state);
  
  const initialvalues = {
    name: state.name,
    code: state.code,
    state:state.state,
    address:state.address,
    city:state.city,
    pincode:state.pincode,
    lat:state.lat,
    lng:state.lng,

  };
  const navigate = useNavigate()


  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [collages, setCollages] = useState({
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

  const getCollageData = async () => {
    try {
      let apiRes = await seekSolutionApi.colleges.list();
      if (apiRes) {
        console.log("apiRes get collages->", apiRes);
        const newState = {
          Count: apiRes.length,
          ScannedCount: apiRes.length,
          Items: apiRes.map((item: any) => ({
            id: item._id,
            name: item.name,
            createdAt: moment(item.createdAt).format("MMM, DD YYYY"),
          })),
        };
        setCollages(newState);
      }
    } catch (error) { }
  };

  useEffect(() => {
    getCollageData();
    getCollageList();
  }, []);

  const initialise = async (values: any) => {
    console.log('init form value ==', values);
    const { name, code,address,city ,pincode,lat,lng} = values
    console.log('Title ->', name)
    console.log('code ->', code)
    console.log('address ->', address)
    console.log('city ->', city)
    console.log('pincode ->', pincode)
    console.log('lat ->', lat)
    console.log('lng ->', lng)

   
    

    try {
      setLoading(true);
      console.log("this id",state.id);
      
      let apiRes = await seekSolutionApi.colleges.update(state._id, values);
      console.log("apiRes", apiRes);
      form.resetFields();

      if (apiRes) {
        console.log('apiRes Topic-->>', apiRes);
        navigate("/collages/page/1")
        window.alert("Successfully Updated");
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
    await initialise(formData);
  };



  const getCollageList = () => {
    console.log("Function running");
    let list: any = [];
    collages.Items.map((item: any) => {
      console.log(item);
      list.push({ id: item.id, label: item.name });
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
              title: <Link to={`/colleges/page/1`}>Collage</Link>,
            },
            {
              title: "Edit",
            },
          ]}
        />
        <Title level={2}>Collage</Title>
        <Divider />

        <Form
          onFinish={handleSubmit}
          form={form}
          initialValues={initialvalues}
          layout="vertical"
        >
         

          <Form.Item
            name={"name"}
            label="name"
            required
            tooltip="Title name is required"
          >
            <Input placeholder="Enter you title name" />
          </Form.Item>
          
          <Form.Item
            name={"code"}
            label="code"
            required
            tooltip="code is required"
          >
            <Input placeholder="Enter you code" />
          </Form.Item>
          <Form.Item
            name={"address"}
            label="address"
            required
            tooltip=" address is required"
          >
            <Input placeholder="Enter you address" />
          </Form.Item>

          <Form.Item
            name={"city"}
            label="city"
            required
            tooltip=" city is required"
          >
            <Input placeholder="Enter you city" />
          </Form.Item>

          <Form.Item
            name={"pincode"}
            label="pincode"
            required
            tooltip=" pincode is required"
          >
            <Input placeholder="Enter you pincode" />
          </Form.Item>

          <Form.Item
            name={"lat"}
            label="lat"
            required
            tooltip=" lat is required"
          >
            <Input placeholder="Enter you lat" />
          </Form.Item>
          <Form.Item
            name={"lng"}
            label="lng"
            required
            tooltip=" lng is required"
          >
            <Input placeholder="Enter you lng" />
          </Form.Item>

          <Form.Item
            name={"state"}
            label="state"
            required
            tooltip="state is required"
          >
            <Input placeholder="Write your content here.." />
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
        <p>Some ...</p>
      </Drawer>
    </Fragment>
  );
};

export default CollageEdit;
