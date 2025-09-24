import React, { useState } from "react";
import { Form, Input, Button, Checkbox, Typography, Space, Alert } from "antd";
import {
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
  AppleOutlined,
  FacebookOutlined,
} from "@ant-design/icons";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { loginUser } from "../../store/authSlice";

const { Title, Text, Link } = Typography;

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    setError("");
    const { email, password } = values;
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      navigate("/custom-form");
    } catch {
      setError("Invalid email or password.");
    }
  };

  return (
    <div
      style={{
        maxWidth: 360,
        margin: "auto",
        marginTop: 50,
        padding: 24,
        borderRadius: 8,
        background: "linear-gradient(180deg, #f3e8ff 0%, #f9f5ff 100%)",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <img
          src="https://cdn.worldvectorlogo.com/logos/flutter.svg"
          alt="Logo"
          style={{ width: 64, marginBottom: 16 }}
        />
        <Title level={3}>Welcome Back</Title>
        <Text type="secondary">Please sign in to continue</Text>
      </div>

      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

      <Form
        name="login_form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Please enter a valid email" }
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Password"
            size="large"
            allowClear
          />
        </Form.Item>

        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Link style={{ float: "right" }} href="#">
            Forgot Password?
          </Link>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={loading}
            style={{
              background: "linear-gradient(90deg, #7e22ce 0%, #a855f7 100%)",
              border: "none",
            }}
          >
            Sign In
          </Button>
        </Form.Item>
      </Form>

      <Text>
        Don&apos;t have an account? <Link><RouterLink to="/signup">Sign Up</RouterLink></Link>
      </Text>

      <Space size="middle" style={{ marginTop: 24 }}>
        <Button shape="circle" icon={<GoogleOutlined />} />
        <Button shape="circle" icon={<AppleOutlined />} />
        <Button shape="circle" icon={<FacebookOutlined />} />
      </Space>
    </div>
  );
};

export default Login;
