import React from 'react';
import { Button, Col, Row, Space, Typography, Tag, Breadcrumb } from 'antd';
import { ArrowLeftOutlined, HomeOutlined, CalendarOutlined } from '@ant-design/icons';
import type { Trip, Expense } from '../types';
import ParticipantSection from '../components/ParticipantSection';
import ExpenseSection from '../components/ExpenseSection';
import SummarySection from '../components/SummarySection';
import SettlementSection from '../components/SettlementSection';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface Props {
  trip: Trip;
  onBack: () => void;
  onAddParticipant: (name: string) => void;
  onUpdateParticipant: (id: string, name: string) => void;
  onDeleteParticipant: (id: string) => void;
  onAddExpense: (data: Omit<Expense, 'id' | 'createdAt'>) => void;
  onUpdateExpense: (id: string, data: Omit<Expense, 'id' | 'createdAt'>) => void;
  onDeleteExpense: (id: string) => void;
}

const TripDetailPage: React.FC<Props> = ({
  trip,
  onBack,
  onAddParticipant,
  onUpdateParticipant,
  onDeleteParticipant,
  onAddExpense,
  onUpdateExpense,
  onDeleteExpense,
}) => {
  const total = trip.expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', paddingBottom: 60 }}>
      {/* Detail Hero */}
      <div className="detail-hero">
        <div className="page-container">
          <Breadcrumb
            items={[
              {
                title: (
                  <span
                    onClick={onBack}
                    style={{ color: 'rgba(255,255,255,0.7)', cursor: 'pointer' }}
                  >
                    <HomeOutlined /> Trips
                  </span>
                ),
              },
              { title: <span style={{ color: '#fff' }}>{trip.name}</span> },
            ]}
            style={{ marginBottom: 16 }}
          />
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={onBack}
              ghost
              style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}
            >
              Back
            </Button>
            <div style={{ flex: 1 }}>
              <Title
                level={2}
                style={{ color: '#fff', margin: '0 0 8px', fontFamily: 'var(--font-display)' }}
              >
                {trip.name}
              </Title>
              {trip.description && (
                <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 14 }}>
                  {trip.description}
                </Text>
              )}
              <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                <Tag
                  icon={<CalendarOutlined />}
                  style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff' }}
                >
                  {dayjs(trip.createdAt).format('DD MMM YYYY')}
                </Tag>
                <Tag style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff' }}>
                  👥 {trip.participants.length} participants
                </Tag>
                <Tag style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff' }}>
                  💸 {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(total)}
                </Tag>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="page-container" style={{ marginTop: -16 }}>
        <Row gutter={[20, 20]}>
          <Col xs={24} lg={10}>
            <ParticipantSection
              participants={trip.participants}
              onAdd={onAddParticipant}
              onUpdate={onUpdateParticipant}
              onDelete={onDeleteParticipant}
            />
          </Col>
          <Col xs={24} lg={14}>
            <Space direction="vertical" size={20} style={{ width: '100%' }}>
              <ExpenseSection
                expenses={trip.expenses}
                participants={trip.participants}
                onAdd={onAddExpense}
                onUpdate={onUpdateExpense}
                onDelete={onDeleteExpense}
              />
              <SummarySection participants={trip.participants} expenses={trip.expenses} />
              <SettlementSection participants={trip.participants} expenses={trip.expenses} />
            </Space>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default TripDetailPage;
