import React, { Fragment, useEffect, useState } from 'react';
import { Breadcrumb, Typography, Divider, Input, Space, Button, Form, Row, Col } from 'antd';
import seekSolutionApi from "../../../../utils/seekSolutionApi";
import { useParams } from "react-router-dom";

const { Title } = Typography;

function LecturesCreate() {
    const { courses_id, section_id } = useParams(); // Destructuring section_id from useParams
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [sectionTitle, setSectionTitle] = useState(['default']);
    const [name, setName] = useState('');

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    useEffect(() => {
        const initialiseSectionTitle = async () => {
            try {
                let apiRes = await seekSolutionApi.Lectures.list(section_id as string); // Corrected the API call to list sections
                setSectionTitle(apiRes?.Items?.map((item: any) => item.name) || []);
            } catch (error) {
                console.error("Error fetching section titles", error);
            }
        };

        initialiseSectionTitle();
    }, [section_id]); // Added section_id as a dependency

    const handleSubmit = async (values: any) => {
        setLoading(true);

        try {

            if (!section_id) {
                console.error("Course ID is undefined");
                return;
            }

            const body = {
                title: values.title,
                mediaURL:values.mediaURL,
                mediaType:values.mediaType
            }
            console.log("section_id,=>",section_id,);
            

            let apiRes = await seekSolutionApi.Lectures.create(section_id,body ); // Corrected the API call to create lectures
            setSectionTitle(apiRes?.Items?.map((item: any) => item.name) || []);
            if (!apiRes) {
                console.log('bucketKey', apiRes);
                return;
            }
        } catch (error) {
            console.error("Error in handleSubmit", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Fragment>
            <Space direction="vertical" style={{ display: 'flex' }}>
                <Breadcrumb
                    items={[
                        { title: 'Management' },
                        { title: 'Courses' },
                        { title: 'Section' },
                        { title: "Lectures" },
                        { title: section_id }, // Displaying the section_id in the breadcrumb
                        { title: 'Create' },
                    ]}
                />
                <Title level={2}>Create Lectures</Title>
                <Divider />
                <Form
                    onFinish={handleSubmit}
                    form={form}
                    initialValues={{ ...JSON.parse(localStorage.getItem("section_draft") as string) }}
                    layout="vertical"
                >
                    <Row gutter={[12, 8]} justify={'space-between'}>
                        <Col span={16}>
                            <Form.Item name="title" label="Title" required tooltip="This is a required field">
                                <Input type="text" placeholder='Write your title' />
                            </Form.Item>
                            <Form.Item name="mediaURL" label="Media URL" required tooltip="This is a required field">
                                <Input type="text" placeholder='Write your Media URL' />
                            </Form.Item>
                            <Form.Item name="mediaType" label="Media Type" required tooltip="This is a required field">
                                <Input type="text" placeholder='Write your MediaType' />
                            </Form.Item>
                            <Button type="primary" htmlType="submit" loading={loading}>Preview</Button>
                        </Col>
                        <Col span={8}></Col>
                    </Row>
                </Form>
            </Space>
        </Fragment>
    );
}

export default LecturesCreate;
