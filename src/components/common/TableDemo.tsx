import React, { useState } from "react";
import { Table, Tag, Button, Space, message } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Modal from "./Modal";

interface DataType {
  key: string;
  guest: string | null;
  type: string;
  amount: string;
  date: string;
}

const TableDemo: React.FC = () => {
  const [data, setData] = useState<DataType[]>([
    {
      key: "1",
      guest: "N/A",
      type: "mukel",
      amount: "₹223",
      date: "25/7/2025",
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DataType | null>(null);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteKey, setDeleteKey] = useState<string | null>(null);

  const openEditModal = (record: DataType) => {
    setEditingRecord(record);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingRecord(null);
  };

  const openDeleteModal = (key: string) => {
    setDeleteKey(key);
    setDeleteModalVisible(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalVisible(false);
    setDeleteKey(null);
  };

  const confirmDelete = () => {
    if (deleteKey) {
      setData((prev) => prev.filter((item) => item.key !== deleteKey));
      message.success("Record deleted");
    }
    closeDeleteModal();
  };

  const columns = [
    {
      title: "Guest",
      dataIndex: "guest",
      key: "guest",
      render: (text: string | null) => (text ? text : "N/A"),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (text: string) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: DataType) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
            type="link"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => openDeleteModal(record.key)}
            type="link"
            danger
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={data} />

      <Modal
        visible={modalVisible}
        title="Edit Record"
        onClose={closeModal}
        footer={[
          <Button key="close" onClick={closeModal}>
            Close
          </Button>,
        ]}
      >
        {editingRecord && (
          <pre>{JSON.stringify(editingRecord, null, 2)}</pre>
        )}
      </Modal>

      <Modal
        visible={deleteModalVisible}
        title="Confirm Delete"
        onClose={closeDeleteModal}
        footer={[
          <Button key="cancel" onClick={closeDeleteModal}>
            Cancel
          </Button>,
          <Button key="confirm" type="primary" danger onClick={confirmDelete}>
            Delete
          </Button>,
        ]}
      >
        <p>Are you sure you want to delete this record?</p>
      </Modal>
    </>
  );
};

export default TableDemo;
