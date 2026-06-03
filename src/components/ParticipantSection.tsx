import React, { useState } from 'react';
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Tag,
  Typography,
  Avatar,
  Row,
  Col,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Participant } from '../types';

const { Title, Text } = Typography;

interface Props {
  participants: Participant[];
  onAdd: (name: string) => void;
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
}

const AVATAR_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
];

const ParticipantSection: React.FC<Props> = ({ participants, onAdd, onUpdate, onDelete }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Participant | null>(null);
  const [form] = Form.useForm<{ name: string }>();

  const handleOpen = (p?: Participant) => {
    setEditing(p || null);
    form.setFieldsValue({ name: p?.name || '' });
    setModalOpen(true);
  };

  const handleSubmit = () => {
    form.validateFields().then(({ name }) => {
      if (editing) {
        onUpdate(editing.id, name.trim());
      } else {
        onAdd(name.trim());
      }
      setModalOpen(false);
    });
  };

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <Card
      className="glass-card section-card"
      title={
        <Space>
          <span style={{ fontSize: 18 }}>👥</span>
          <Title level={4} style={{ margin: 0, fontFamily: 'var(--font-display)' }}>
            Participants
          </Title>
          <Tag color="var(--accent)">{participants.length}</Tag>
        </Space>
      }
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="small"
          onClick={() => handleOpen()}
          className="btn-primary"
        >
          Add
        </Button>
      }
    >
      {participants.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>👤</div>
          <Text type="secondary">No participants yet. Add some!</Text>
        </div>
      ) : (
        <Row gutter={[12, 12]}>
          {participants.map((p, idx) => (
            <Col xs={24} sm={12} key={p.id}>
              <div className="participant-item">
                <Avatar
                  style={{
                    backgroundColor: AVATAR_COLORS[idx % AVATAR_COLORS.length],
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {getInitials(p.name)}
                </Avatar>
                <Text
                  strong
                  style={{ flex: 1, color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}
                >
                  {p.name}
                </Text>
                <Space size={4}>
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => handleOpen(p)}
                    style={{ color: 'var(--text-secondary)' }}
                  />
                  <Popconfirm
                    title="Remove this participant?"
                    description="Their expenses will also be removed."
                    onConfirm={() => onDelete(p.id)}
                    okText="Remove"
                    okType="danger"
                  >
                    <Button type="text" size="small" icon={<DeleteOutlined />} danger />
                  </Popconfirm>
                </Space>
              </div>
            </Col>
          ))}
        </Row>
      )}

      <Modal
        title={
          <span style={{ fontFamily: 'var(--font-display)' }}>
            {editing ? '✏️ Edit Participant' : '👤 Add Participant'}
          </span>
        }
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText={editing ? 'Save' : 'Add'}
        okButtonProps={{ className: 'btn-primary' }}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: 'Please enter a name' },
              { min: 1, message: 'Name cannot be empty' },
            ]}
          >
            <Input placeholder="e.g. Andi" size="large" onPressEnter={handleSubmit} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ParticipantSection;
