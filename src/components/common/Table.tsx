import React, { useState, useMemo } from "react";
import { TableProps } from "../../types/table";
import Modal from "./Modal";
import { Table as AntdTable, Input, Button } from "antd";
import type { ColumnsType } from "antd/es/table";

const { Search } = Input;

const Table = <T extends object>({ columns, data }: TableProps<T>) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [modalTitle, setModalTitle] = useState<string | undefined>(undefined);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((item) =>
      columns.some((column) => {
        const value = item[column.accessor];
        return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [searchTerm, data, columns]);

  const openModal = (title: string, content: React.ReactNode) => {
    setModalTitle(title);
    setModalContent(content);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalContent(null);
    setModalTitle(undefined);
  };

  // Transform columns to antd columns format
  const antdColumns: ColumnsType<T> = [
    ...columns.map((col) => ({
      title: col.header,
      dataIndex: col.accessor as string,
      key: col.accessor as string,
      render: col.render
        ? (value: any, record: T) => col.render!(value, record)
        : undefined,
    })),
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: T) => (
        <Button
          type="link"
          onClick={() =>
            openModal(
              "Row Details",
              <pre className="whitespace-pre-wrap">{JSON.stringify(record, null, 2)}</pre>
            )
          }
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Search
        placeholder="Search..."
        onSearch={handleSearch}
        onChange={(e) => handleSearch(e.target.value)}
        value={searchTerm}
        enterButton
        className="mb-4 max-w-sm"
        allowClear
      />

      <AntdTable
        columns={antdColumns}
        dataSource={filteredData}
      rowKey={(record, index) => (index !== undefined ? index.toString() : '')}
        pagination={{ pageSize: 5 }}
      />

      <Modal visible={modalVisible} title={modalTitle} onClose={closeModal}>
        {modalContent}
      </Modal>
    </div>
  );
};

export default Table;
