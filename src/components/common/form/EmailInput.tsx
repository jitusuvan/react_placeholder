import React from "react";
import { Form, Input } from "antd";

interface EmailInputProps {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
}

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const EmailInput: React.FC<EmailInputProps> = ({
  name,
  label,
  required = false,
  placeholder,
}) => {
  return (
    <Form.Item
      name={name}
      label={label}
      rules={[
        { required, message: `${label} is required` },
        {
          pattern: emailRegex,
          message: "Please enter a valid email address",
        },
      ]}
    >
      <Input placeholder={placeholder} />
    </Form.Item>
  );
};

export default EmailInput;
