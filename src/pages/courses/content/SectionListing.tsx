import React, { Fragment } from "react"
import { Breadcrumb, Typography, Divider, Input, Drawer, Space, Button, Table, Tag, Row, Col, Avatar, Popconfirm, Flex } from 'antd';
import { AudioOutlined, DeleteFilled, EditFilled, EyeFilled, UserAddOutlined } from '@ant-design/icons';
import { ColumnsType } from "antd/es/table";
import moment from 'moment'
import seekSolutionApi from "../../../utils/seekSolutionApi";
import { Link, useLocation, useMatch } from "react-router-dom";
import uiSettings from "../../../utils/uiSettings";
import { BucketBaseUrl } from "../../../utils/SeekSolutionS3Bucket";
const { Title } = Typography;
const { Search } = Input;

const suffix = (
    <AudioOutlined
        style={{
            fontSize: 16,
        }}
    />
);

const columns: ColumnsType<any> = [
    // {
    //     title: 'title',
    //     dataIndex: 'title',
    //     key: 'title',
    //     width: 450,
    //     render: (text: string, record: any) => <Link to={`/events/${record?.information}`}>
    //         <Space size="middle">
    //             <Avatar style={{ verticalAlign: 'middle' }} src={BucketBaseUrl(record.icon)} size="large" gap={5} >
    //                 {String(text).charAt(0)}
    //             </Avatar>
    //             {text}
    //         </Space>
    //     </Link>,
    // },
    {
        title: 'Title',
        key: 'title',
        dataIndex: 'title',
    },
    {
        title: 'Duration',
        dataIndex: 'duration',
        key: 'duration',
        render: (text) => (
            text
        ),
    },
    {
        title: 'Created At',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 150
    },
    {
        title: 'Action',
        key: 'action',
        fixed: 'right',
        render: (_: any, record: any) => (
            <Flex gap={"small"}>
                <Link to={`/lectures/${record._id}/page/1`}>
                    <Button icon={<EyeFilled/>}></Button>
                </Link>
                <Link to={`/lecture/${record._id}/edit`}>
                    <Button  icon={<EditFilled/>}></Button>
                </Link>
                    <Button danger icon={<DeleteFilled/>}></Button>
            </Flex>
        ),
    },
];

const SectionListing = () => {
    const match = useMatch("/courses/:courses_id/sections/page/:pagination")
    const location = useLocation()
    const uRLSearchParams = new URLSearchParams(location.search)
    const [state, setState] = React.useState([])
    const [open, setOpen] = React.useState(false);

    const showDrawer = () => {
        setOpen(true);
    };


    const onClose = () => {
        setOpen(false);
    };

    const initialise = async () => {
        try {
            let apiRes = await seekSolutionApi.Sections.list(match?.params.courses_id as string)
            console.log('apiRes', apiRes);

            setState(apiRes)
        } catch (error) {

        }
    }

    React.useEffect(() => {
        initialise()
    }, [])

    return <Fragment>
        <Space direction="vertical" style={{ display: 'flex' }}>
            <Breadcrumb
                items={[
                    {
                        title: 'Management',
                    },
                    {
                        title: 'Courses',
                    },
                    {
                        title: match?.params.courses_id,
                    },
                    {
                        title: "Sections",
                    },
                ]}
            />
            <Flex justify="space-between" gap={"small"} align="center" >
            <Title level={2}>Sections</Title>
          
          <Link to={`/courses/${match?.params.courses_id}/sections/create`}>
          <Button icon={<UserAddOutlined/>}></Button></Link>
          </Flex>

            <Divider />
            <Row gutter={[2, 8]} justify={'space-between'}>
                <Col span={20} >
                    <Search
                        placeholder="input search text"
                        enterButton="Search"
                        suffix={suffix}
                    />
                </Col>
                <Col span={4} >
                <Link to={`/courses/${match?.params.courses_id}/sections/create`}>
                        <Button type="primary">
                            Add Section
                        </Button>
                    </Link>
                </Col>
            </Row>

            <Table columns={columns} dataSource={state} pagination={{ hideOnSinglePage: true }} />
        </Space>

    </Fragment>

}

export default SectionListing