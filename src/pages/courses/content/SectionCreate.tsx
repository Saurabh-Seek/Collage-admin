import React, { Fragment } from "react"
import { Breadcrumb, Typography, Divider, Input, Drawer, Space, Button, Form, Select, InputRef, Row, Col, Upload, message, Switch } from 'antd';
import { PlusOutlined, InboxOutlined, LoadingOutlined } from '@ant-design/icons';
import seekSolutionApi from "../../../utils/seekSolutionApi";
import { useMatch } from "react-router-dom";
import LanguageCode from '../../../utils/ISO_639-2.json'
import { RcFile } from "antd/es/upload";
import { getBase64 } from "../../../utils/uiSettings";
import SeekSolutionS3Bucket from "../../../utils/SeekSolutionS3Bucket";
const { Title } = Typography;

let videoDuration = 0
const SectionCreate = () => {
    const match = useMatch("/courses/:courses_id/sections/create")
        const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false)
    const [open, setOpen] = React.useState(false);
    const [sectionTitle, setSectionTitle] = React.useState(['default']);
    const [name, setName] = React.useState('');
    const inputRef = React.useRef<InputRef>(null);
    const [iconUrl, setIconUrl] = React.useState<string>();
    const [bannerFile, setBannerFile] = React.useState(null as any);

    const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const onClose = () => {
        setOpen(false);
    };

    const initialise = async (values: any) => {
        try {
            setLoading(true)
            let apiRes = await seekSolutionApi.Sections.list(match?.params.courses_id as string, )
            console.log('apiRes', apiRes);
            // localStorage.removeItem("section_draft")
            form.resetFields()
            window.history.back()
        } catch (error) {
        } finally {
            setLoading(false)
        }
    }
    const initialiseSectonTitle = async (search: string) => {
        try {
            let apiRes = await seekSolutionApi.Sections.list(match?.params.courses_id as string)
            setSectionTitle(apiRes?.Items?.map((item: any) => item.name))
        } catch (error) {

        }
    }
    const handleSubmit = async (values: any) => {
        setLoading(true)
        console.log('values', values);
        let icon = await SeekSolutionS3Bucket.uploadImage(values?.icon?.file?.originFileObj, false)
        if (!icon) {
            console.log('bucketKey', icon);
            return
        }
        let banner = await SeekSolutionS3Bucket.uploadVideo(values?.banner?.file?.originFileObj)
        if (!banner) {
            console.log('bucketKey banner', banner);
            return
        }

        localStorage.setItem('section_draft', JSON.stringify(values))
        await initialise({ ...values, icon, banner, duration: videoDuration })
        setLoading(false)
    }

    const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        e.preventDefault();
        setSectionTitle([...sectionTitle, name]);
        setName('');
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    const checkFile = (file: RcFile) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;

    }
    const beforeIconUpload = (file: RcFile) => {
        let bool = checkFile(file)
        if (bool) {
            getBase64(file, (url) => {
                setLoading(false);
                setIconUrl(url);
            });
        }
        return bool
    };
    const beforeBannerUpload = (file: RcFile) => {
        setBannerFile(file);
    };

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
                        title: "Section",
                    },
                    {
                        title: 'Create',
                    },
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
                        <Form.Item name={'title'} label="Title" required tooltip="This is a required field">
                            <Select
                                placeholder="Select title or create new title"
                                dropdownRender={(menu) => (
                                    <>
                                        {menu}
                                        <Divider style={{ margin: '8px 0' }} />
                                        <Space style={{ padding: '0 8px 4px' }}>
                                            <Input
                                                placeholder="Please enter item"
                                                ref={inputRef}
                                                value={name}
                                                onChange={onNameChange}
                                            />
                                            <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                                                Add new title
                                            </Button>
                                        </Space>
                                    </>
                                )}
                                options={sectionTitle.map((item) => ({ label: item, value: item }))}
                                onSearch={(e) => initialiseSectonTitle(e)}
                            />
                        </Form.Item>
                        <Form.Item name={'name'} label="Name" required tooltip="This is a required field">
                            <Input placeholder="The Complete Python Bootcamp From Zero to Hero in Python" />
                        </Form.Item>

                        <Form.Item name={'sort_desc'} label="Sort description" required tooltip="This is a required field">
                            <Input.TextArea placeholder="Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games" />
                        </Form.Item>

                        <Form.Item name={'long_desc'} label="Extra description" tooltip="This is a required field">
                            <Input.TextArea placeholder="Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games" />
                        </Form.Item>

                        <Form.Item name={'paid'} label="Preview" tooltip="This is a required field">
                            <Switch checkedChildren="PAID" unCheckedChildren="FREE" />
                        </Form.Item>

                        <Button type="primary" htmlType="submit" loading={loading}>Preview</Button>
                    </Col>
                    <Col span={8}>
                        <Form.Item name={'icon'} label="Thumbnail" required tooltip="This is a required field">
                            <Upload
                                accept="image/*"
                                name="avatar"
                                listType="picture-card"
                                className="avatar-uploader"
                                showUploadList={false}
                                beforeUpload={beforeIconUpload}
                            >
                                {
                                    iconUrl ? <img src={iconUrl} alt="avatar" style={{ width: '100%' }} /> :
                                        <div>
                                            {loading ? <LoadingOutlined /> : <PlusOutlined />}
                                            <div style={{ marginTop: 8 }}>Upload</div>
                                        </div>}
                            </Upload>
                        </Form.Item>
                        <Form.Item name={'banner'} label="Upload section video" required tooltip="This is a required field">
                            <Upload.Dragger
                                accept="video/mp4"
                                showUploadList={false}
                                beforeUpload={beforeBannerUpload}
                            >
                                {bannerFile ? <video src={URL.createObjectURL(bannerFile)} poster={iconUrl} autoPlay muted style={{ width: '100%' }} onLoadedMetadata={(metadata: any) => {
                                    console.log('metadata', metadata.target);
                                    videoDuration = metadata.target.duration

                                }} /> :
                                    <div>
                                        <p className="ant-upload-drag-icon">
                                            <InboxOutlined />
                                        </p>
                                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                        <p className="ant-upload-hint">
                                            Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                                            banned files.
                                        </p>
                                    </div>}
                            </Upload.Dragger>
                        </Form.Item>

                    </Col>
                </Row>
            </Form>
        </Space>
        <Drawer
            title="Filter"
            placement={'right'}
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
            <p>Some Sections...</p>
        </Drawer>
    </Fragment>

}

export default SectionCreate