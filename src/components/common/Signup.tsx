import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/authService";
import {
  Form,
  Input,
  Button,
  Checkbox,
  Typography,
  Alert,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Text } = Typography;

interface SignupFormValues {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  agreement: boolean;
}

const Signup: React.FC = () => {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const onFinish = async (values: SignupFormValues) => {
    setError("");
    const {
      firstName,
      lastName,
      phoneNumber,
      password,
      confirmPassword,
    } = values;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    try {
      await register({
        phone_number: phoneNumber,
        first_name: firstName,
        last_name: lastName,
        password,
      });
      setIsLoading(false);
      navigate("/login");
    } catch (error: any) {
      setIsLoading(false);
      if (error.message) {
        setError(error.message);
      } else {
        setError("Failed to create account.");
      }
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
        <Title level={3}>Create Account</Title>
        <Text type="secondary">Join us today!</Text>
      </div>

      {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

      <Form<SignupFormValues> name="signup_form" onFinish={onFinish} layout="vertical">
        <Form.Item
          name="firstName"
          rules={[{ required: true, message: "Please input your first name!" }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="First Name"
            size="large"
            allowClear
          />
        </Form.Item>

        <Form.Item
          name="lastName"
          rules={[{ required: true, message: "Please input your last name!" }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Last Name"
            size="large"
            allowClear
          />
        </Form.Item>

        <Form.Item
          name="phoneNumber"
          rules={[
            { required: true, message: "Please input your phone number!" },
            { pattern: /^\d{10}$/, message: "Enter a valid 10-digit number" },
          ]}
        >
          <Input
            prefix={<PhoneOutlined />}
            placeholder="Phone Number"
            size="large"
            allowClear
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
          hasFeedback
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Create Password"
            size="large"
            allowClear
          />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Please confirm your Password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("The two passwords do not match!"));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm Password"
            size="large"
            allowClear
          />
        </Form.Item>

        <Form.Item
          name="agreement"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error("You must accept the terms and conditions")),
            },
          ]}
        >
          <Checkbox>I agree to the Terms & Conditions</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            block
            loading={isLoading}
            style={{
              background: "linear-gradient(90deg, #7e22ce 0%, #a855f7 100%)",
              border: "none",
            }}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </Form.Item>
      </Form>

      <Text>
        Already have an account? <Link to="/login">Sign In</Link>
      </Text>
    </div>
  );
};

export default Signup;
