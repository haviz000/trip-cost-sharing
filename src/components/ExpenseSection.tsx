import React, { useState } from 'react';
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import type { Expense, Participant } from '../types';
import dayjs from 'dayjs';
import { formatCurrency } from '../utils/settlement';

const { Title, Text } = Typography;

interface Props {
  expenses: Expense[];
  participants: Participant[];
  onAdd: (data: Omit<Expense, 'id' | 'createdAt'>) => void;
  onUpdate: (id: string, data: Omit<Expense, 'id' | 'createdAt'>) => void;
  onDelete: (id: string) => void;
}

interface FormValues {
  title: string;
  amount: number;
  paidBy: string;
  date: dayjs.Dayjs;
}

const ExpenseSection: React.FC<Props> = ({ expenses, participants, onAdd, onUpdate, onDelete }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);
  const [form] = Form.useForm<FormValues>();

  const handleOpen = (expense?: Expense) => {
    setEditing(expense || null);
    if (expense) {
      form.setFieldsValue({
        title: expense.title,
        amount: expense.amount,
        paidBy: expense.paidBy,
        date: dayjs(expense.createdAt),
      });
    } else {
      form.setFieldsValue({ title: '', amount: undefined, paidBy: undefined, date: dayjs() });
    }
    setModalOpen(true);
  };

  const handleSubmit = () => {
    form.validateFields().then(({ title, amount, paidBy, date }) => {
      const data = {
        title: title.trim(),
        amount,
        paidBy,
        createdAt: date.toISOString(),
      };
      if (editing) {
        onUpdate(editing.id, data);
      } else {
        onAdd(data);
      }
      setModalOpen(false);
    });
  };

  const participantName = (id: string) =>
    participants.find((p) => p.id === id)?.name || 'Unknown';

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      render: (v: string) => (
        <Text strong style={{ color: 'var(--text-primary)' }}>
          {v}
        </Text>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right' as const,
      render: (v: number) => (
        <Text style={{ color: 'var(--accent)', fontWeight: 600 }}>{formatCurrency(v)}</Text>
      ),
    },
    {
      title: 'Paid By',
      dataIndex: 'paidBy',
      key: 'paidBy',
      render: (v: string) => (
        <Tag color="blue" style={{ fontWeight: 500 }}>
          {participantName(v)}
        </Tag>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (v: string) => (
        <Text type="secondary" style={{ fontSize: 12 }}>
          {dayjs(v).format('DD MMM YYYY')}
        </Text>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'center' as const,
      render: (_: unknown, record: Expense) => (
        <Space size={4}>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleOpen(record)}
            style={{ color: 'var(--text-secondary)' }}
          />
          <Popconfirm
            title="Delete this expense?"
            onConfirm={() => onDelete(record.id)}
            okText="Delete"
            okType="danger"
          >
            <Button type="text" size="small" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      className="glass-card section-card"
      title={
        <Space>
          <span style={{ fontSize: 18 }}>💸</span>
          <Title level={4} style={{ margin: 0, fontFamily: 'var(--font-display)' }}>
            Expenses
          </Title>
          <Tag color="var(--accent)">{expenses.length}</Tag>
        </Space>
      }
      extra={
        <Space>
          <Text type="secondary" style={{ fontSize: 13 }}>
            Total: <strong style={{ color: 'var(--accent)' }}>{formatCurrency(total)}</strong>
          </Text>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="small"
            onClick={() => handleOpen()}
            className="btn-primary"
            disabled={participants.length === 0}
          >
            Add
          </Button>
        </Space>
      }
    >
      {participants.length === 0 && (
        <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-secondary)' }}>
          <Text type="secondary">Add participants first before adding expenses.</Text>
        </div>
      )}
      <Table
        dataSource={expenses}
        columns={columns}
        rowKey="id"
        size="small"
        pagination={{ pageSize: 8, hideOnSinglePage: true, size: 'small' }}
        locale={{ emptyText: <div style={{ padding: '24px 0', color: 'var(--text-secondary)' }}>No expenses yet</div> }}
        className="expense-table"
      />

      <Modal
        title={
          <span style={{ fontFamily: 'var(--font-display)' }}>
            {editing ? '✏️ Edit Expense' : '💸 Add Expense'}
          </span>
        }
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText={editing ? 'Save' : 'Add'}
        okButtonProps={{ className: 'btn-primary' }}
        destroyOnClose
        width={480}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="title"
            label="Expense Title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input placeholder="e.g. Hotel, Fuel, Dinner" size="large" />
          </Form.Item>
          <Form.Item
            name="amount"
            label="Amount (IDR)"
            rules={[
              { required: true, message: 'Please enter an amount' },
              { type: 'number', min: 1, message: 'Amount must be positive' },
            ]}
          >
            <InputNumber
              placeholder="e.g. 500000"
              size="large"
              style={{ width: '100%' }}
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(v) => Number(v?.replace(/,/g, '') || 0)}
              prefix={<DollarOutlined />}
            />
          </Form.Item>
          <Form.Item
            name="paidBy"
            label="Paid By"
            rules={[{ required: true, message: 'Please select who paid' }]}
          >
            <Select placeholder="Select participant" size="large">
              {participants.map((p) => (
                <Select.Option key={p.id} value={p.id}>
                  {p.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="date" label="Date">
            <DatePicker size="large" style={{ width: '100%' }} format="DD MMM YYYY" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ExpenseSection;
