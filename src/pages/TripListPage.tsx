import React, { useState, useRef } from "react";
import {
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  Modal,
  Popconfirm,
  Row,
  Space,
  Tag,
  Typography,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowRightOutlined,
  EnvironmentOutlined,
  DownloadOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import type { Trip, AppState } from "../types";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;

interface Props {
  trips: Trip[];
  onSelectTrip: (id: string) => void;
  onCreateTrip: (name: string, description: string) => void;
  onUpdateTrip: (id: string, name: string, description: string) => void;
  onDeleteTrip: (id: string) => void;
  onExportData: () => void;
  onImportData: (data: AppState) => void;
}

interface TripFormValues {
  name: string;
  description: string;
}

const TripListPage: React.FC<Props> = ({
  trips,
  onSelectTrip,
  onCreateTrip,
  onUpdateTrip,
  onDeleteTrip,
  onExportData,
  onImportData,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [form] = Form.useForm<TripFormValues>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpen = (trip?: Trip) => {
    setEditingTrip(trip || null);
    form.setFieldsValue(
      trip
        ? { name: trip.name, description: trip.description }
        : { name: "", description: "" },
    );
    setModalOpen(true);
  };

  const handleExport = () => {
    onExportData();
    message.success("Data exported successfully!");
  };

  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as AppState;

        // Validate the data structure
        if (!data.trips || !Array.isArray(data.trips)) {
          message.error("Invalid file format: missing trips array");
          return;
        }

        // Basic validation for each trip
        for (const trip of data.trips) {
          if (!trip.id || !trip.name || !Array.isArray(trip.participants) || !Array.isArray(trip.expenses)) {
            message.error("Invalid file format: trip structure is incorrect");
            return;
          }
        }

        onImportData(data);
        message.success(`Successfully imported ${data.trips.length} trip(s)!`);
        setImportModalOpen(false);
      } catch (error) {
        message.error("Failed to parse file. Please ensure it's a valid JSON file.");
        console.error("Import error:", error);
      }
    };
    reader.readAsText(file);

    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOpenImport = () => {
    setImportModalOpen(true);
  };

  const handleSubmit = () => {
    form.validateFields().then(({ name, description }) => {
      if (editingTrip) {
        onUpdateTrip(editingTrip.id, name, description);
      } else {
        onCreateTrip(name, description);
      }
      setModalOpen(false);
      form.resetFields();
    });
  };

  const getTotalExpenses = (trip: Trip) =>
    trip.expenses.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-base)",
        padding: "0 0 60px",
      }}
    >
      {/* Hero Header */}
      <div className="hero-header">
        <div className="hero-inner">
          <div className="hero-icon">✈</div>
          <Title
            level={1}
            style={{
              color: "#fff",
              margin: 0,
              fontFamily: "var(--font-display)",
            }}
          >
            TripSplit
          </Title>
          <Paragraph
            style={{
              color: "rgba(255,255,255,0.8)",
              margin: "8px 0 0",
              fontSize: 16,
            }}
          >
            Smart expense sharing for unforgettable adventures
          </Paragraph>
        </div>
      </div>

      {/* Content */}
      <div className="page-container" style={{ marginTop: -24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <Title
            level={3}
            style={{
              margin: 0,
              color: "var(--text-primary)",
              fontFamily: "var(--font-display)",
            }}
          >
            Your Trips
            <Tag color="var(--accent)" style={{ marginLeft: 12, fontSize: 12 }}>
              {trips.length}
            </Tag>
          </Title>
          <Space wrap>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleExport}
              size="large"
            >
              Export
            </Button>
            <Button
              icon={<UploadOutlined />}
              onClick={handleOpenImport}
              size="large"
            >
              Import
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleOpen()}
              size="large"
              className="btn-primary"
            >
              New Trip
            </Button>
          </Space>
        </div>

        {trips.length === 0 ? (
          <Card
            className="glass-card"
            style={{ textAlign: "center", padding: "60px 0" }}
          >
            <Empty
              image={<span style={{ fontSize: 64 }}>🗺️</span>}
              description={
                <Text style={{ color: "var(--text-secondary)", fontSize: 16 }}>
                  No trips yet. Create your first adventure!
                </Text>
              }
            >
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleOpen()}
                className="btn-primary"
                style={{ marginRight: 8 }}
              >
                Create Trip
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => handleOpenImport()}
                className="btn-primary"
              >
                Import Trip
              </Button>
            </Empty>
          </Card>
        ) : (
          <Row gutter={[20, 20]}>
            {trips.map((trip) => {
              const total = getTotalExpenses(trip);
              return (
                <Col xs={24} sm={12} lg={8} key={trip.id}>
                  <Card
                    className="trip-card glass-card"
                    hoverable
                    onClick={() => onSelectTrip(trip.id)}
                    actions={[
                      <Button
                        key="edit"
                        type="text"
                        icon={<EditOutlined />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpen(trip);
                        }}
                        style={{ color: "var(--text-secondary)" }}
                      >
                        Edit
                      </Button>,
                      <Popconfirm
                        key="delete"
                        title="Delete this trip?"
                        description="All expenses and participants will be removed."
                        onConfirm={(e) => {
                          e?.stopPropagation();
                          onDeleteTrip(trip.id);
                        }}
                        onCancel={(e) => e?.stopPropagation()}
                        okText="Delete"
                        okType="danger"
                      >
                        <Button
                          type="text"
                          icon={<DeleteOutlined />}
                          danger
                          onClick={(e) => e.stopPropagation()}
                        >
                          Delete
                        </Button>
                      </Popconfirm>,
                    ]}
                  >
                    <div className="trip-card-emoji">
                      {
                        ["🌴", "🏔️", "🏕️", "🚗", "🏖️", "🗻"][
                          Math.abs(trip.id.charCodeAt(5) || 0) % 6
                        ]
                      }
                    </div>
                    <Title
                      level={4}
                      style={{
                        margin: "8px 0 4px",
                        color: "var(--text-primary)",
                        fontFamily: "var(--font-display)",
                      }}
                    >
                      {trip.name}
                    </Title>
                    {trip.description && (
                      <Paragraph
                        ellipsis={{ rows: 2 }}
                        style={{
                          color: "var(--text-secondary)",
                          margin: "0 0 12px",
                          fontSize: 13,
                        }}
                      >
                        {trip.description}
                      </Paragraph>
                    )}
                    <Space
                      direction="vertical"
                      size={6}
                      style={{ width: "100%" }}
                    >
                      <div className="trip-stat">
                        <span>👥 {trip.participants.length} participants</span>
                        <span>💸 {trip.expenses.length} expenses</span>
                      </div>
                      <div className="trip-total">
                        Total:{" "}
                        <strong style={{ color: "var(--accent)" }}>
                          {new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                            minimumFractionDigits: 0,
                          }).format(total)}
                        </strong>
                      </div>
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        <EnvironmentOutlined /> Created{" "}
                        {dayjs(trip.createdAt).format("DD MMM YYYY")}
                      </Text>
                    </Space>
                    <div className="trip-card-cta">
                      View Details <ArrowRightOutlined />
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </div>

      <Modal
        title={
          <span style={{ fontFamily: "var(--font-display)", fontSize: 18 }}>
            {editingTrip ? "✏️ Edit Trip" : "✈️ New Trip"}
          </span>
        }
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText={editingTrip ? "Save Changes" : "Create Trip"}
        okButtonProps={{ className: "btn-primary" }}
        destroyOnClose
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="name"
            label="Trip Name"
            rules={[{ required: true, message: "Please enter a trip name" }]}
          >
            <Input placeholder="e.g. Bali Trip 2026" size="large" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea
              placeholder="A short description of this trip..."
              rows={3}
              style={{ resize: "none" }}
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={
          <span style={{ fontFamily: "var(--font-display)", fontSize: 18 }}>
            📥 Import Data
          </span>
        }
        open={importModalOpen}
        onCancel={() => setImportModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setImportModalOpen(false)}>
            Cancel
          </Button>,
        ]}
      >
        <div style={{ marginTop: 16 }}>
          <Paragraph style={{ color: "var(--text-secondary)", marginBottom: 16 }}>
            Select a backup JSON file to import your trip data. This will replace all existing trips.
          </Paragraph>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportFile}
            style={{ display: "none" }}
          />
          <Button
            type="primary"
            icon={<UploadOutlined />}
            onClick={() => fileInputRef.current?.click()}
            size="large"
            block
            className="btn-primary"
          >
            Choose File
          </Button>
          <div style={{
            marginTop: 16,
            padding: 12,
            background: "rgba(255, 193, 7, 0.1)",
            borderRadius: 8,
            border: "1px solid rgba(255, 193, 7, 0.3)"
          }}>
            <Text style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              ⚠️ <strong>Warning:</strong> Importing will replace all current data. Make sure to export your current data first if you want to keep it.
            </Text>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TripListPage;
