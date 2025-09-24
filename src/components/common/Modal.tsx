import React from "react";
import { Modal as AntdModal } from "antd";

interface ModalProps {
  visible: boolean;
  title?: React.ReactNode;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode | null;
  width?: number | string;
}

const Modal: React.FC<ModalProps> = ({
  visible,
  title,
  onClose,
  children,
  footer = null,
  width = 520,
}) => {
  return (
    <AntdModal
      visible={visible}
      title={title}
      onCancel={onClose}
      footer={footer}
      width={width}
      destroyOnClose
    >
      {children}
    </AntdModal>
  );
};

export default Modal;
