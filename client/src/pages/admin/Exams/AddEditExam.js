import {
  Col,
  Form,
  message,
  Row,
  Select,
  Table,
  Input,
  Button,
  Tabs,
  Card,
  Divider,
} from "antd";
import React, { useEffect } from "react";
import {
  addExam,
  deleteQuestionById,
  editExamById,
  getExamById,
} from "../../../apicalls/exams";
import PageTitle from "../../../components/PageTitle";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import AddEditQuestion from "./AddEditQuestion";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SaveOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const { TabPane } = Tabs;
const { Option } = Select;

function AddEditExam() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [examData, setExamData] = React.useState(null);
  const [showAddEditQuestionModal, setShowAddEditQuestionModal] = React.useState(false);
  const [selectedQuestion, setSelectedQuestion] = React.useState(null);
  const params = useParams();

  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      let response;
      if (params.id) {
        response = await editExamById({ ...values, examId: params.id });
      } else {
        response = await addExam(values);
      }
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        navigate("/admin/exams");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const getExamData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getExamById({ examId: params.id });
      dispatch(HideLoading());
      if (response.success) {
        setExamData(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (params.id) getExamData();
  }, []);

  const deleteQuestion = async (questionId) => {
    try {
      dispatch(ShowLoading());
      const response = await deleteQuestionById({ questionId, examId: params.id });
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        getExamData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const questionsColumns = [
    {
      title: "Question",
      dataIndex: "name",
    },
    {
      title: "Options",
      dataIndex: "options",
      render: (text, record) =>
        Object.keys(record.options).map((key) => (
          <div key={key} className="text-gray-600">
            <strong>{key}:</strong> {record.options[key]}
          </div>
        )),
    },
    {
      title: "Correct Option",
      dataIndex: "correctOption",
      render: (text, record) => (
        <span className="text-green-600 font-semibold">
          {record.correctOption}: {record.options[record.correctOption]}
        </span>
      ),
    },
    {
      title: "Actions",
      render: (text, record) => (
        <div className="flex gap-2">
          <Button
            shape="circle"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedQuestion(record);
              setShowAddEditQuestionModal(true);
            }}
            style={{
              backgroundColor: "#1890ff",
              color: "white",
              borderRadius: "8px",
            }}
          />
          <Button
            shape="circle"
            danger
            icon={<DeleteOutlined />}
            onClick={() => deleteQuestion(record._id)}
            style={{
              backgroundColor: "#f5222d",
              color: "white",
              borderRadius: "8px",
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 rounded-xl">
      <PageTitle title={params.id ? "Edit Exam" : "Create New Exam"} />
      <Card
        className="rounded-xl shadow-xl border border-gray-200"
        bodyStyle={{ padding: "24px", backgroundColor: "#fff" }}
      >
        {(examData || !params.id) && (
          <Form layout="vertical" onFinish={onFinish} initialValues={examData}>
            <Tabs defaultActiveKey="1" size="large" tabBarGutter={20}>
              <TabPane
                tab={<span><EditOutlined /> Exam Details</span>}
                key="1"
                style={{ paddingBottom: "20px" }}
              >
                <Row gutter={[24, 24]}>
                  <Col span={8}>
                    <Form.Item label="Exam Name" name="name" rules={[{ required: true }]}>
                      <Input
                        size="large"
                        placeholder="Enter exam name"
                        style={{ borderRadius: "8px" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Duration (minutes)" name="duration" rules={[{ required: true }]}>
                      <Input
                        type="number"
                        size="large"
                        placeholder="Duration"
                        style={{ borderRadius: "8px" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Category" name="category" rules={[{ required: true }]}>
                      <Select
                        placeholder="Select Category"
                        size="large"
                        style={{ borderRadius: "8px" }}
                      >
                        <Option value="Javascript">Javascript</Option>
                        <Option value="React">React</Option>
                        <Option value="Node">Node</Option>
                        <Option value="MongoDB">MongoDB</Option>
                        <Option value="GK">General Knowledge</Option>
                        <Option value="ML">Machine Learning</Option>
                        <Option value="ebusiness">E-business</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Total Marks" name="totalMarks" rules={[{ required: true }]}>
                      <Input
                        type="number"
                        size="large"
                        placeholder="Total Marks"
                        style={{ borderRadius: "8px" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="Passing Marks" name="passingMarks" rules={[{ required: true }]}>
                      <Input
                        type="number"
                        size="large"
                        placeholder="Passing Marks"
                        style={{ borderRadius: "8px" }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Divider />

                <div className="flex justify-end gap-3 mt-4">
                  <Button
                    size="large"
                    icon={<CloseCircleOutlined />}
                    onClick={() => navigate("/admin/exams")}
                    style={{ borderRadius: "8px" }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    icon={<SaveOutlined />}
                    style={{ borderRadius: "8px" }}
                  >
                    Save Exam
                  </Button>
                </div>
              </TabPane>

              {params.id && (
                <TabPane tab={<span><PlusOutlined /> Questions</span>} key="2">
                  <div className="flex justify-end mb-4">
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      size="large"
                      onClick={() => setShowAddEditQuestionModal(true)}
                      style={{ borderRadius: "8px" }}
                    >
                      Add Question
                    </Button>
                  </div>
                  <Table
                    columns={questionsColumns}
                    dataSource={examData?.questions || []}
                    rowKey="_id"
                    pagination={{ pageSize: 5 }}
                    bordered
                    style={{ borderRadius: "8px" }}
                    className="rounded-lg"
                    rowClassName="hover:bg-gray-100"
                  />
                </TabPane>
              )}
            </Tabs>
          </Form>
        )}

        {showAddEditQuestionModal && (
          <AddEditQuestion
            setShowAddEditQuestionModal={setShowAddEditQuestionModal}
            showAddEditQuestionModal={showAddEditQuestionModal}
            examId={params.id}
            refreshData={getExamData}
            selectedQuestion={selectedQuestion}
            setSelectedQuestion={setSelectedQuestion}
          />
        )}
      </Card>
    </div>
  );
}

export default AddEditExam;
