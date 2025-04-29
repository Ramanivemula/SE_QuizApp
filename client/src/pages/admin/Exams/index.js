import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { message, Tooltip } from "antd";
import { getAllExams, deleteExamById } from "../../../apicalls/exams";
import { ShowLoading, HideLoading } from "../../../redux/loaderSlice";
import { FiPlus } from "react-icons/fi";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function Exams() {
  const [exams, setExams] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getExamsData = useCallback(async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams();
      dispatch(HideLoading());
      if (response.success) {
        setExams(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  }, [dispatch]);

  const deleteExam = async (examId) => {
    try {
      dispatch(ShowLoading());
      const response = await deleteExamById({ examId });
      dispatch(HideLoading());
      if (response.success) {
        message.success(response.message);
        getExamsData();
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getExamsData();
  }, [getExamsData]);

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 via-white to-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900">📚 Exams Dashboard</h2>
          <p className="text-gray-500 text-sm mt-1">Overview and quick actions for all exams</p>
        </div>
        <button
          onClick={() => navigate("/admin/exams/add")}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-full hover:scale-105 transition-transform shadow-lg"
        >
          <FiPlus className="text-xl" /> Create New Exam
        </button>
      </div>

      {/* Exams Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
        {exams.map((exam) => (
          <div
            key={exam._id}
            className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl shadow-2xl border border-gray-200 hover:shadow-3xl hover:scale-[1.015] transition-all duration-300 flex flex-col justify-between"
          >
            {/* Exam Info */}
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{exam.name}</h3>
              <span className="inline-block mt-1 px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full">
                {exam.category}
              </span>
              <div className="space-y-2 text-gray-600 text-sm mt-4">
                <p>⏱ <span className="font-medium">Duration:</span> {exam.duration} minutes</p>
                <p>📝 <span className="font-medium">Total Marks:</span> {exam.totalMarks}</p>
                <p>✅ <span className="font-medium">Passing Marks:</span> {exam.passingMarks}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-6">
              <Tooltip title="Edit">
                <button
                  onClick={() => navigate(`/admin/exams/edit/${exam._id}`)}
                  className="flex items-center justify-center bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 hover:scale-110 transition-all shadow"
                >
                  <FaRegEdit className="text-lg" />
                </button>
              </Tooltip>
              <Tooltip title="Delete">
                <button
                  onClick={() =>
                    window.confirm("Are you sure you want to delete this exam?") &&
                    deleteExam(exam._id)
                  }
                  className="flex items-center justify-center bg-red-100 text-red-500 rounded-full hover:bg-red-200 hover:scale-110 transition-all shadow"
                >
                  <MdDelete className="text-lg" />
                </button>
              </Tooltip>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Exams;
