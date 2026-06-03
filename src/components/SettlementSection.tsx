import React from 'react';
import { Card, Space, Table, Tag, Typography, Alert } from 'antd';
import { ArrowRightOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { Expense, Participant } from '../types';
import { calculateSettlement, formatCurrency } from '../utils/settlement';

const { Title, Text } = Typography;

interface Props {
  participants: Participant[];
  expenses: Expense[];
}

const SettlementSection: React.FC<Props> = ({ participants, expenses }) => {
  const settlements = calculateSettlement(participants, expenses);

  const columns = [
    {
      title: 'From',
      dataIndex: 'from',
      key: 'from',
      render: (v: string) => (
        <Tag color="error" style={{ fontWeight: 600, fontSize: 13, padding: '2px 10px' }}>
          {v}
        </Tag>
      ),
    },
    {
      title: '',
      key: 'arrow',
      width: 40,
      render: () => (
        <ArrowRightOutlined style={{ color: 'var(--text-secondary)', fontSize: 16 }} />
      ),
    },
    {
      title: 'To',
      dataIndex: 'to',
      key: 'to',
      render: (v: string) => (
        <Tag color="success" style={{ fontWeight: 600, fontSize: 13, padding: '2px 10px' }}>
          {v}
        </Tag>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right' as const,
      render: (v: number) => (
        <Text style={{ color: 'var(--accent)', fontWeight: 700, fontSize: 15 }}>
          {formatCurrency(v)}
        </Text>
      ),
    },
  ];

  return (
    <Card
      className="glass-card section-card"
      title={
        <Space>
          <span style={{ fontSize: 18 }}>🤝</span>
          <Title level={4} style={{ margin: 0, fontFamily: 'var(--font-display)' }}>
            Settlement
          </Title>
          {settlements.length > 0 && (
            <Tag color="warning">{settlements.length} transfer{settlements.length > 1 ? 's' : ''}</Tag>
          )}
        </Space>
      }
    >
      {participants.length < 2 || expenses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🧾</div>
          <Text type="secondary">Add at least 2 participants and some expenses to calculate settlements.</Text>
        </div>
      ) : settlements.length === 0 ? (
        <Alert
          type="success"
          icon={<CheckCircleOutlined />}
          showIcon
          message={
            <Text strong style={{ color: '#52c41a' }}>
              🎉 All settled! Everyone paid their fair share.
            </Text>
          }
          style={{ borderRadius: 8 }}
        />
      ) : (
        <>
          <Alert
            type="info"
            showIcon
            message={
              <Text style={{ fontSize: 13 }}>
                Minimum transfers needed: <strong>{settlements.length}</strong>. Each person pays exactly once.
              </Text>
            }
            style={{ marginBottom: 16, borderRadius: 8 }}
          />
          <Table
            dataSource={settlements}
            columns={columns}
            rowKey={(r) => `${r.from}-${r.to}`}
            pagination={false}
            size="small"
            className="expense-table settlement-table"
          />
        </>
      )}
    </Card>
  );
};

export default SettlementSection;
