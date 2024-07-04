import React, { useEffect } from "react";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { LogoL } from "../assets";
import { useContentContext } from "../context/ContentContext";
import { useGlobalProvider } from "../context/Provider";
import loginSuccess from "../context/actions/auth/loginSuccess";
import { useNavigate } from "react-router";
import UserPool from "../utils/UserPool";
import seekSolutionApi from "../utils/seekSolutionApi";

const Login = () => {
  const navigate = useNavigate();
  let { Toast } = useContentContext();
  const { authState, authDispatch, setLoading, loading } = useGlobalProvider();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const items={
        "email": values.email,
        "password": values.password
      }

      
      let result: any = await seekSolutionApi.Auth.login(items)
      // return 
      loginSuccess(result)(authDispatch);
      Toast.openSuccessNotification("Login Sucess!", "Successfully Logged In");
      navigate(`/`);
      // console.log("login success", result.idToken.payload);
    } catch (error: any) {
      console.log("error", error);

      // let err = error.toString().split(":")[1].trim();
      // console.log("login error", err);
      Toast.openErrorNotification("Login error", `${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen justify-center items-center bg-[#ececec]">
      <div className="flex flex-col justify-center items-center">
        <img src={LogoL} alt="Logo" className="w-16" />
        <div className="text-2xl font-semibold mt-2">Postmortem-Shala</div>
      </div>
      <div className="flex flex-col justify-center items-center mt-4 bg-white p-6 sm:px-8 px-4 max-sm:mx-2 rounded-2xl shadow-xl">
        <div className="text-lg font-medium">Log In</div>
        <Form
          name="normal_login"
          className="flex flex-col sm:w-[300px] w-[250px] mt-4"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Please enter your Email!",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please enter your Password!",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>
          {/* <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <a className="float-right text-blue-400" href="/">
              Forgot password
            </a>
          </Form.Item> */}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-500 mt-4"
              loading={loading}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
