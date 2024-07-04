import React, { Fragment, useEffect } from 'react';
import { Breadcrumb, Typography, Divider, Input, Space, Button, Form, Row, Col } from 'antd';
import seekSolutionApi from "../../../utils/seekSolutionApi";
import { useParams } from "react-router-dom";

const { Title } = Typography;

function SectionTompreyCoode() {
    const { courses_id } = useParams();
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);
    const [sectionTitle, setSectionTitle] = React.useState(['default']);
    const [name, setName] = React.useState('');
    // const inputRef = React.useRef<InputRef>(null);

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    useEffect(() => {
        const initialiseSectionTitle = async () => {
            if (!courses_id) {
                console.error("Course ID is undefined");
                return;
            }

            try {
                let apiRes = await seekSolutionApi.Sections.list(courses_id);
                setSectionTitle(apiRes?.Items?.map((item: any) => item.name) || []);
            } catch (error) {
                console.error("Error fetching section titles", error);
            }
        };

        initialiseSectionTitle();
    }, [courses_id]);

    const handleSubmit = async (values: any) => {
        setLoading(true);
        console.log("values", values);

        try {
            if (!courses_id) {
                console.error("Course ID is undefined");
                return;
            }

            const body = {
                title: values.title
            }

            let apiRes = await seekSolutionApi.Sections.create(courses_id,body);
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

    const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        e.preventDefault();
        setSectionTitle([...sectionTitle, name]);
        setName('');
        setTimeout(() => {
            // inputRef.current?.focus();
        }, 0);
    };

    return (
        <Fragment>
            <Space direction="vertical" style={{ display: 'flex' }}>
                <Breadcrumb
                    items={[
                        { title: 'Management' },
                        { title: 'Courses' },
                        { title: courses_id },
                        { title: 'Section' },
                        { title: 'Create' },
                    ]}
                />
                <Title level={2}>Create Section</Title>
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
                            <Button type="primary" htmlType="submit" loading={loading}>Preview</Button>
                        </Col>
                        <Col span={8}></Col>
                    </Row>
                </Form>
            </Space>
        </Fragment>
    );
}

export default SectionTompreyCoode;
