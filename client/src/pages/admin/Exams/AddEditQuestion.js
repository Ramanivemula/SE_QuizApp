import { Form, message, Modal } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { addQuestionToExam, editQuestionById } from "../../../apicalls/exams";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";

function AddEditQuestion({
  showAddEditQuestionModal,
  setShowAddEditQuestionModal,
  refreshData,
  examId,
  selectedQuestion,
  setSelectedQuestion
}) {
  const dispatch = useDispatch();
  
  const onFinish = async (values) => {
    try {
      dispatch(ShowLoading());
      const requiredPayload = {
        name: values.name,
        correctOption: values.correctOption,
        options: {
          A: values.A,
          B: values.B,
          C: values.C,
          D: values.D,
        },
        exam: examId,
      };

      let response;
      if (selectedQuestion) {
        response = await editQuestionById({
          ...requiredPayload,
          questionId: selectedQuestion._id
        });
      } else {
        response = await addQuestionToExam(requiredPayload);
      }

      if (response.success) {
        message.success(response.message);
        refreshData();
        setShowAddEditQuestionModal(false);
      } else {
        message.error(response.message);
      }

      setSelectedQuestion(null);
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  return (
    <Modal
      title={selectedQuestion ? "Edit Question" : "Add Question"}
      visible={showAddEditQuestionModal}
      footer={null}
      onCancel={() => {
        setShowAddEditQuestionModal(false);
        setSelectedQuestion(null);
      }}
      bodyStyle={{
        padding: "20px 30px",
        borderRadius: "12px",
        backgroundColor: "#f9f9f9", // Light background color
      }}
      style={{
        borderRadius: "12px", // Rounded modal corners
        boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)", // Soft shadow effect for the modal
      }}
    >
      <Form
        onFinish={onFinish}
        layout="vertical"
        initialValues={{
          name: selectedQuestion?.name,
          A: selectedQuestion?.options?.A,
          B: selectedQuestion?.options?.B,
          C: selectedQuestion?.options?.C,
          D: selectedQuestion?.options?.D,
          correctOption: selectedQuestion?.correctOption,
        }}
      >
        <Form.Item
          name="name"
          label="Question"
          rules={[{ required: true, message: "Please enter the question" }]}
        >
          <input
            type="text"
            style={{
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid #dcdcdc',
              width: '100%',
              fontSize: '16px',
              outline: 'none',
              transition: 'border 0.3s',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
            onFocus={(e) => e.target.style.border = '1px solid #1890ff'} // Highlight on focus
            onBlur={(e) => e.target.style.border = '1px solid #dcdcdc'}
          />
        </Form.Item>

        <Form.Item
          name="correctOption"
          label="Correct Option"
          rules={[{ required: true, message: "Please select the correct option" }]}
        >
          <input
            type="text"
            style={{
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid #dcdcdc',
              width: '100%',
              fontSize: '16px',
              outline: 'none',
              transition: 'border 0.3s',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            }}
            onFocus={(e) => e.target.style.border = '1px solid #1890ff'}
            onBlur={(e) => e.target.style.border = '1px solid #dcdcdc'}
          />
        </Form.Item>

        <div className="flex gap-3">
          <Form.Item
            name="A"
            label="Option A"
            rules={[{ required: true, message: "Please enter option A" }]}
          >
            <input
              type="text"
              style={{
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #dcdcdc',
                width: '100%',
                fontSize: '16px',
                outline: 'none',
                transition: 'border 0.3s',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
              onFocus={(e) => e.target.style.border = '1px solid #1890ff'}
              onBlur={(e) => e.target.style.border = '1px solid #dcdcdc'}
            />
          </Form.Item>
          <Form.Item
            name="B"
            label="Option B"
            rules={[{ required: true, message: "Please enter option B" }]}
          >
            <input
              type="text"
              style={{
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #dcdcdc',
                width: '100%',
                fontSize: '16px',
                outline: 'none',
                transition: 'border 0.3s',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
              onFocus={(e) => e.target.style.border = '1px solid #1890ff'}
              onBlur={(e) => e.target.style.border = '1px solid #dcdcdc'}
            />
          </Form.Item>
        </div>

        <div className="flex gap-3">
          <Form.Item
            name="C"
            label="Option C"
            rules={[{ required: true, message: "Please enter option C" }]}
          >
            <input
              type="text"
              style={{
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #dcdcdc',
                width: '100%',
                fontSize: '16px',
                outline: 'none',
                transition: 'border 0.3s',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
              onFocus={(e) => e.target.style.border = '1px solid #1890ff'}
              onBlur={(e) => e.target.style.border = '1px solid #dcdcdc'}
            />
          </Form.Item>
          <Form.Item
            name="D"
            label="Option D"
            rules={[{ required: true, message: "Please enter option D" }]}
          >
            <input
              type="text"
              style={{
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid #dcdcdc',
                width: '100%',
                fontSize: '16px',
                outline: 'none',
                transition: 'border 0.3s',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              }}
              onFocus={(e) => e.target.style.border = '1px solid #1890ff'}
              onBlur={(e) => e.target.style.border = '1px solid #dcdcdc'}
            />
          </Form.Item>
        </div>

        <div className="flex justify-end mt-4 gap-3">
          <button
            className="primary-outlined-btn"
            type="button"
            onClick={() => setShowAddEditQuestionModal(false)}
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              backgroundColor: '#f1f1f1',
              border: '1px solid #ddd',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background-color 0.3s, border-color 0.3s',
            }}
            onMouseEnter={(e) => e.target.style.borderColor = '#1890ff'}
            onMouseLeave={(e) => e.target.style.borderColor = '#ddd'}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="primary-contained-btn"
            style={{
              padding: '12px 24px',
              borderRadius: '8px',
              backgroundColor: '#1890ff',
              color: '#fff',
              fontSize: '16px',
              cursor: 'pointer',
              border: 'none',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#40a9ff'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#1890ff'}
          >
            Save
          </button>
        </div>
      </Form>
    </Modal>
  );
}

export default AddEditQuestion;
