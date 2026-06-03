import React from 'react';
import { Card, Col, Row, Space, Statistic, Table, Tag, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, MinusOutlined } from '@ant-design/icons';
import type { Expense, Participant } from '../types';
import { calculateSummary, formatCurrency } from '../utils/settlement';

const { Title, Text } = Typography;

interface Props {
  participants: Participant[];
  expenses: Expense[];
}

const SummarySection: React.FC<Props> = ({ participants, expenses }) => {
  const summary = calculateSummary(participants, expenses);
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const perPerson = participants.length > 0 ? total / participants.length : 0;

  const columns = [
    {
      title: 'Participant',
      dataIndex: 'name',
      key: 'name',
      render: (v: string) => (
        <Text strong style={{ color: 'var(--text-primary)' }}>
          {v}
        </Text>
      ),
    },
    {
      title: 'Paid',
      dataIndex: 'paid',
      key: 'paid',
      align: 'right' as const,
      render: (v: number) => (
        <Text style={{ color: '#52c41a', fontWeight: 600 }}>{formatCurrency(v)}</Text>
      ),
    },
    {
      title: 'Share',
      dataIndex: 'share',
      key: 'share',
      align: 'right' as const,
      render: (v: number) => <Text style={{ color: 'var(--text-secondary)' }}>{formatCurrency(v)}</Text>,
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
      align: 'right' as const,
      render: (v: number) => {
        if (Math.abs(v) < 1) {
          return (
            <Tag icon={<MinusOutlined />} color="default">
              Settled
            </Tag>
          );
        }
        if (v > 0) {
          return (
            <Tag icon={<ArrowUpOutlined />} color="success">
              +{formatCurrency(v)}
            </Tag>
          );
        }
        return (
          <Tag icon={<ArrowDownOutlined />} color="error">
            {formatCurrency(Math.abs(v))}
          </Tag>
        );
      },
    },
  ];

  return (
    <Card
      className="glass-card section-card"
      title={
        <Space>
          <span style={{ fontSize: 18 }}>📊</span>
          <Title level={4} style={{ margin: 0, fontFamily: 'var(--font-display)' }}>
            Summary
          </Title>
        </Space>
      }
    >
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={8}>
          <div className="stat-card">
            <Statistic
              title={<span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Total Expenses</span>}
              value={total}
              formatter={(v) => formatCurrency(Number(v))}
              valueStyle={{ color: 'var(--accent)', fontSize: 20, fontWeight: 700 }}
            />
          </div>
        </Col>
        <Col xs={12} sm={8}>
          <div className="stat-card">
            <Statistic
              title={<span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Per Person</span>}
              value={perPerson}
              formatter={(v) => formatCurrency(Number(v))}
              valueStyle={{ color: '#52c41a', fontSize: 20, fontWeight: 700 }}
            />
          </div>
        </Col>
        <Col xs={24} sm={8}>
          <div className="stat-card">
            <Statistic
              title={<span style={{ color: 'var(--text-secondary)', fontSize: 12 }}>Participants</span>}
              value={participants.length}
              valueStyle={{ color: '#1677ff', fontSize: 20, fontWeight: 700 }}
              suffix={<span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>people</span>}
            />
          </div>
        </Col>
      </Row>

      <Table
        dataSource={summary}
        columns={columns}
        rowKey="id"
        size="small"
        pagination={false}
        locale={{
          emptyText: (
            <div style={{ padding: '24px 0', color: 'var(--text-secondary)' }}>
              Add participants and expenses to see summary
            </div>
          ),
        }}
        className="expense-table"
        summary={(data) => {
          if (data.length === 0) return null;
          const totalPaid = data.reduce((s, d) => s + d.paid, 0);
          return (
            <Table.Summary.Row style={{ background: 'var(--bg-card-hover)' }}>
              <Table.Summary.Cell index={0}>
                <Text strong style={{ color: 'var(--text-primary)' }}>Total</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} align="right">
                <Text strong style={{ color: '#52c41a' }}>{formatCurrency(totalPaid)}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2} align="right">
                <Text strong style={{ color: 'var(--text-secondary)' }}>{formatCurrency(total)}</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={3} />
            </Table.Summary.Row>
          );
        }}
      />
    </Card>
  );
};

export default SummarySection;
