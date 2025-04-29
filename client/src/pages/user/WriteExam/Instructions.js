import React from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineClock, HiOutlineExclamationCircle, HiOutlineArrowRight } from "react-icons/hi";

function Instructions({ examData, setView, startTimer }) {
  const navigate = useNavigate();

  return (
    <div className=" flex items-center justify-center bg-gray-100 px-4 py-2">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl p-6 transition-all duration-300 m-2">
        {/* Title */}
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">📘 Exam Instructions</h2>

        {/* Instructions */}
        <div className="space-y-4 text-gray-700 text-base leading-relaxed">
          <div className="flex items-start gap-3 text-sm">
            <HiOutlineClock className="text-blue-500 text-xl mt-1" />
            <span>
              Time: <span className="font-semibold text-blue-600">{examData.duration} min</span>
            </span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <HiOutlineExclamationCircle className="text-red-500 text-xl mt-1" />
            <span>
              Auto-submit in <span className="font-semibold text-red-600">{examData.duration} min</span>.
            </span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <HiOutlineExclamationCircle className="text-yellow-500 text-xl mt-1" />
            <span>No refreshing or closing the browser.</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <HiOutlineExclamationCircle className="text-green-600 text-xl mt-1" />
            <span>Use <strong>"Previous"</strong> and <strong>"Next"</strong> to navigate.</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <HiOutlineExclamationCircle className="text-gray-600 text-xl mt-1" />
            <span>Answers are final once submitted.</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <HiOutlineExclamationCircle className="text-purple-600 text-xl mt-1" />
            <span>
              Marks: <span className="font-semibold">{examData.totalMarks}</span> | Passing: <span className="font-semibold">{examData.passingMarks}</span>
            </span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate("/")}
            className="px-5 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              startTimer();
              setView("questions");
            }}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Start Exam <HiOutlineArrowRight className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Instructions;
