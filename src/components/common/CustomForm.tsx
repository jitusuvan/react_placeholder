import React, { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  DatePicker,
  Checkbox,
  Button,
  Spin,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import moment from "moment";
import { notifySuccess, notifyError } from "../../utils/notification";
import TextInput from "./form/TextInput";
import EmailInput from "./form/EmailInput";
import PasswordInput from "./form/PasswordInput";

const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/im;

const CustomForm: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      notifySuccess("Form submitted successfully!");
      console.log("Form values:", values);
    }, 1500);
  };

  const onFinishFailed = (errorInfo: any) => {
    notifyError("Please correct the errors in the form.");
  };

  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      style={{ maxWidth: 400, margin: "auto" }}
    >
      <TextInput name="text" label="Text" required placeholder="Enter text" />

      <Form.Item
        label="Number"
        name="number"
        rules={[{ required: true, message: "Please enter a number" }]}
      >
        <InputNumber style={{ width: "100%" }} placeholder="Enter number" />
      </Form.Item>

      <Form.Item
        label="Amount"
        name="amount"
        rules={[{ required: true, message: "Please enter an amount" }]}
      >
        <InputNumber
          style={{ width: "100%" }}
          placeholder="Enter amount"
          formatter={(value) =>
            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
          }
          parser={(value: any) => value.replace(/\$\s?|(,*)/g, "")}
        />
      </Form.Item>

      <Form.Item
        label="Date"
        name="date"
        rules={[{ required: true, message: "Please select a date" }]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        name="checkbox"
        valuePropName="checked"
        rules={[
          {
            validator: (_, value) =>
              value ? Promise.resolve() : Promise.reject("Please check this box"),
          },
        ]}
      >
        <Checkbox>I agree to the terms and conditions</Checkbox>
      </Form.Item>

      <Form.Item
        label="Phone Number"
        name="phone"
        rules={[
          { required: true, message: "Please enter your phone number" },
          {
            pattern: phoneRegex,
            message: "Please enter a valid phone number",
          },
        ]}
      >
        <Input placeholder="Enter phone number" />
      </Form.Item>

      <EmailInput name="email" label="Email" required placeholder="Enter email" />

      <Form.Item>
        <Button type="primary" htmlType="submit" block disabled={loading}>
          {loading ? <Spin indicator={<LoadingOutlined spin />} /> : "Submit"}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CustomForm;
