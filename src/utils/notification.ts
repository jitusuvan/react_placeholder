import { message } from "antd";

export const notifySuccess = (content: string) => {
  message.success(content);
};

export const notifyError = (content: string) => {
  message.error(content);
};

export const notifyWarning = (content: string) => {
  message.warning(content);
};
