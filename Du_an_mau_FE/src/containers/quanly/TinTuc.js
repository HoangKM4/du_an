'use client';

import React, { useState } from "react";
import { Button, Table, Space, Modal, Form, Input, notification } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useGetData } from "@/service/apiServive";
import ReactQuill from 'react-quill'; 
import 'react-quill/dist/quill.snow.css';  

const TinTuc = () => {
    const { data, error, isLoading, mutate } = useGetData("/tintuc");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editRecord, setEditRecord] = useState(null);
    const [form] = Form.useForm();
    const [addForm] = Form.useForm();
    const [editorContent, setEditorContent] = useState("");  

    const openNotification = (type, message) => {
        notification[type]({ message });
    };

    const handleEdit = (record) => {
        setEditRecord(record);
        setIsModalOpen(true);
        form.setFieldsValue(record);
        setEditorContent(record.MoTa);
    };

    const handleUpdate = async () => {
        try {
            const values = await form.validateFields();
            const updatedData = { ...values, MoTa: editorContent }; 
            await fetch(`http://localhost:8000/api/tintuc/${editRecord.TinTucId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });
            mutate();
            openNotification("success", "Cập nhật tin tức thành công!");
            setIsModalOpen(false);
        } catch (error) {
            openNotification("error", "Lỗi khi cập nhật tin tức!");
        }
    };

    const handleDelete = async (id) => {
        try {
            await fetch(`http://localhost:8000/api/tintuc/${id}`, { method: "DELETE" });
            mutate();
            openNotification("success", "Xóa tin tức thành công!");
        } catch (error) {
            openNotification("error", "Lỗi khi xóa tin tức!");
        }
    };

    const handleAdd = async () => {
        try {
            const values = await addForm.validateFields();
            const newData = { ...values, MoTa: editorContent };
            await fetch(`http://localhost:8000/api/tintuc`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newData),
            });
            mutate();
            openNotification("success", "Thêm tin tức thành công!");
            setIsAddModalOpen(false);
            addForm.resetFields();
        } catch (error) {
            openNotification("error", "Lỗi khi thêm tin tức!");
        }
    };

    const columns = [
        { title: "ID", dataIndex: "TinTucId", key: "TinTucId" },
        { title: "Tiêu Đề", dataIndex: "TieuDe", key: "TieuDe" },
        {
            title: "Hình Ảnh",
            dataIndex: "HinhAnh",
            key: "HinhAnh",
            render: (HinhAnh) => <img src={HinhAnh} alt="Hình ảnh" style={{ width: "100px" }} />,
        },
        {
            title: "Actions",
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Button
                        icon={<DeleteOutlined />}
                        danger
                        onClick={() => handleDelete(record.TinTucId)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <>
            <Space style={{ marginBottom: 16 }}>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsAddModalOpen(true)}
                >
                    Thêm Tin Tức
                </Button>
            </Space>

            <Table
                columns={columns}
                dataSource={data?.map((item) => ({ ...item, key: item.TinTucId }))}
                loading={isLoading}
                pagination={{ defaultPageSize: 5, showSizeChanger: true, pageSizeOptions: ['5', '10', '15'] }}
            />

            <Modal
                title="Chỉnh sửa tin tức"
                visible={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onOk={handleUpdate}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="TieuDe" label="Tiêu Đề" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="MoTa" label="Mô Tả" rules={[{ required: true }]}>
                        {/* Thêm ReactQuill ở đây */}
                        <ReactQuill
                            value={editorContent}
                            onChange={setEditorContent}
                            theme="snow"
                            modules={{
                                toolbar: [
                                    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                    ['bold', 'italic', 'underline'],
                                    ['link'],
                                    [{ 'align': [] }],
                                    ['image'],
                                ],
                            }}
                        />
                    </Form.Item>
                    <Form.Item name="HinhAnh" label="Link Hình Ảnh" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>

            <Modal
                title="Thêm Tin Tức Mới"
                visible={isAddModalOpen}
                onCancel={() => setIsAddModalOpen(false)}
                onOk={handleAdd}
            >
                <Form form={addForm} layout="vertical">
                    <Form.Item name="TieuDe" label="Tiêu Đề" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="MoTa" label="Mô Tả" rules={[{ required: true }]}>
                   
                        <ReactQuill
                            value={editorContent}
                            onChange={setEditorContent}
                            theme="snow"
                            modules={{
                                toolbar: [
                                    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                    ['bold', 'italic', 'underline'],
                                    ['link'],
                                    [{ 'align': [] }],
                                    ['image'],
                                ],
                            }}
                        />
                    </Form.Item>
                    <Form.Item name="Author" label="Tác Giả" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="HinhAnh" label="Link Hình Ảnh" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default TinTuc;
