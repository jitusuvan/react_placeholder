import React from "react";
import { Form, Input } from "antd";

interface PasswordInputProps {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
}

const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

const PasswordInput: React.FC<PasswordInputProps> = ({
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
          pattern: passwordRegex,
          message:
            `${label} must be at least 8 characters, include an uppercase letter, a number, and a special character (!@#$%^&*)`,
        },
      ]}
      hasFeedback
    >
      <Input.Password placeholder={placeholder} />
    </Form.Item>
  );
};

export default PasswordInput;
