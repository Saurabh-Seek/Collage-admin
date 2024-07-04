import React, { Fragment, useEffect, useState } from "react";
import { Breadcrumb, Typography, Divider, Input, Space, Button, Table, Row, Col, Flex } from 'antd';
import { AudioOutlined, EditFilled, UserAddOutlined } from '@ant-design/icons';
import { ColumnsType } from "antd/es/table";
import seekSolutionApi from "../../../../utils/seekSolutionApi";
import { Link, useLocation, useMatch } from "react-router-dom";

const { Title } = Typography;
const { Search } = Input;

const suffix = (
    <AudioOutlined
        style={{
            fontSize: 16,
        }}
    />
);

const LecturesListing = () => {
    
    const match = useMatch("/lectures/:section_id/page/:pagination");
    const location = useLocation();
   
    const [state, setState] = useState([]);

    const initialise = async () => {
        try {
            console.log("match?.params.section_id=>", match?.params.section_id);
            let apiRes = await seekSolutionApi.Lectures.list(match?.params.section_id as string);
            console.log('apiRes=>', apiRes);
            setState(apiRes);
        } catch (error) {
            console.error('Error fetching lectures:', error);
        }
    };

    useEffect(() => {
        initialise();
    }, [match?.params.section_id]); // Ensure this hook runs when the section_id changes

    const columns: ColumnsType<any> = [
        {
            title: 'Title',
            key: 'title',
            dataIndex: 'title',
        },
        {
            title: 'Media URL',
            dataIndex: 'mediaUrl',
            key: 'mediaUrl',
            render: (text) => text,
        },
        {
            title: 'Media Type',
            dataIndex: 'mediaType',
            key: 'mediaType',
            width: 150,
        },
        {
            title: 'Action',
            key: 'action',
            fixed: 'right',
            render: (_: any, record: any) => (
                <Space>
                    <Link to={`/lectures/${record._id}/edit`}>
                        <Button icon={<EditFilled />}></Button>
                    </Link>
                </Space>
            ),
        },
    ];

    return (
        <Fragment>
            <Space direction="vertical" style={{ display: 'flex' }}>
                <Breadcrumb
                    items={[
                        { title: 'Management' },
                        { title: 'Courses' },
                        { title: "Sections" },
                        { title: match?.params.section_id },
                        { title: "Lectures" },
                    ]}
                />
            <Title level={2}>Lecture</Title>
                 
                <Divider />
                <Row gutter={[2, 8]} justify={'space-between'}>
                    <Col span={20}>
                        <Search
                            placeholder="input search text"
                            enterButton="Search"
                            suffix={suffix}
                        />
                    </Col>
                    <Col span={4}>
                        <Space>
                        <Link to={`/lectures/${match?.params.section_id}/create`}>
                            <Button type="primary" >Add Lecture</Button>
                        </Link>
                            
                            
                        </Space>
                    </Col>
                </Row>
                <Table columns={columns} dataSource={state} pagination={{ hideOnSinglePage: true }} />
            </Space>
        </Fragment>
    );
};

export default LecturesListing;
