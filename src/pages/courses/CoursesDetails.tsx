import React, { Fragment } from "react"
import { Breadcrumb, Typography, Divider, Input, Drawer, Space, Button, message, Tag, Row, Col, Form, Select, InputRef, InputNumber, Upload } from 'antd';
import seekSolutionApi from "../../utils/seekSolutionApi";
import { Link, useLocation, useMatch, useNavigate } from "react-router-dom";
import LanguageCode from '../../utils/ISO_639-2.json'
import CheckVerificationOfPayment from "../../components/stripe/CheckVerificationOfPayment";

const CoursesDetails = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const match = useMatch("/courses/:courses_id/view")
  const uRLSearchParams = new URLSearchParams(location.search)

  const [loading, setLoading] = React.useState(false)

  const [state, setState] = React.useState({
    icon: ""
  })

  const initialise = async () => {
    try {
      let apiRes = await seekSolutionApi.Courses.get(match?.params.courses_id as string)
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
            title: <Link to={`/courses/page/1`}>Courses</Link>,
          },
          {
            title: 'Create',
          },
        ]}
      />
      <Typography.Title level={2}>Courses</Typography.Title>
      <Divider />
      {/* <Row gutter={[2, 8]} justify={'space-between'}>
            </Row> */}
      <Form
        initialValues={{ ...JSON.parse(localStorage.getItem("courses_draft") as string) }}
        layout="vertical"
      >
        <Form.Item name={'banner'} label="" required tooltip="This is a required field">
          <Upload
            listType="picture-card"
            className="avatar-uploader"
            accept="image/*"
            action={"#"}
            showUploadList={false}
          >
            <img src={state.icon} alt="avatar" style={{ width: '100%' }} />
          </Upload>

        </Form.Item>

        <Form.Item name={'name'} label="Name" required tooltip="This is a required field">
          <Input placeholder="The Complete Python Bootcamp From Zero to Hero in Python" />
        </Form.Item>

        <Form.Item
          name={"price"}
          label="Price"
          required
          tooltip="Price is required"
        >
          <InputNumber
            prefix="₹ "
            style={{ width: "100%" }}
            placeholder="499"
          />
        </Form.Item>

        <Form.Item name={'sort_desc'} label="Sort description" required tooltip="This is a required field">
          <Input.TextArea placeholder="Learn Python like a Professional Start from the basics and go all the way to creating your own applications and games" />
        </Form.Item>
        <Form.Item name={'languages'} label="Select course languages" required tooltip="This is a required field">
          <Select
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="select one country"
            defaultValue={['china']}
            optionLabelProp="label"
          >
            {Object.keys(LanguageCode).map((key: string) =>
              <Select.Option value={key} label={LanguageCode[key as keyof typeof LanguageCode].english[0]}>
                <Space>
                  {LanguageCode[key as keyof typeof LanguageCode].native[0]}
                </Space>
              </Select.Option>)}
          </Select>
        </Form.Item>

        <Form.Item name={'amenities'} label="Amenities" required tooltip="This is a required field">
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Write amenities then click enter button"
          />
        </Form.Item>
        <Form.Item name={'requirements'} label="Requirements" required tooltip="This is a required field">
          <Select
            mode="tags"
            style={{ width: '100%' }}
            placeholder="Write requirements then click enter button"
          />
        </Form.Item>
        <Form.Item name={'category'} label="Category" required tooltip="This is a required field">
          <Select
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item name={'topic'} label="Topic" required tooltip="This is a required field">
          <Select
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item name={'technology'} label="Technology" required tooltip="This is a required field">
          <Select
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>Preview</Button>
      </Form>
    </Space>
    <CheckVerificationOfPayment />
  </Fragment>

}

export default CoursesDetails