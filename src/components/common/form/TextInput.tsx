
import React, { useState } from "react";
import { Form, Input } from "antd";

interface TextInputProps {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
}

const textRegex = /^[A-Za-z,.\-_\s]{0,255}$/;

const TextInput: React.FC<TextInputProps> = ({
  name,
  label,
  required = false,
  placeholder,
}) => {
  const [value, setValue] = useState("");

  const capitalizeFirstLetter = (string: string) => {
    if (!string) return string;
    return string
      .split(" ")  // Split string by space
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))  // Capitalize first letter of each word
      .join(" ");  // Join the words back into a single string
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;
    inputValue = capitalizeFirstLetter(inputValue);
    setValue(inputValue);
  };

  return (
    <Form.Item
      name={name}
      label={label}
      rules={[
        { required, message: `${label} is required` },
        {
          pattern: textRegex,
          message: `${label} must only contain letters, commas, dots, hyphens, or underscores (max 255 chars)`,
        },
      ]}
    >
      <Input placeholder={placeholder} value={value} onChange={handleChange} />
    </Form.Item>
  );
};

export default TextInput;
