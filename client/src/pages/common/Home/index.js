import { Col, message, Row } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllExams } from "../../../apicalls/exams";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import PageTitle from "../../../components/PageTitle";
import { useNavigate } from "react-router-dom";
function Home() {
  const [exams, setExams] = React.useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const getExams = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams();
      if (response.success) {
        setExams(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getExams();
  }, []);

  return (
    user && (
      <div className="m-5 mb-5">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4 flex items-center gap-2 mb-6">
        {`Hi ${user.name}, Welcome to Quiz Application`}
      </h1>
        <div className="divider"></div>
        <Row gutter={[24, 24]}>
  {exams.map((exam) => (
    <Col span={8} key={exam._id}>
      <div className="w-full bg-white mt-6 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full group border border-gray-100 min-w-[280px]">
        {/* Gradient Header with Badge */}
        <div className="bg-gradient-to-r from-violet-500 to-indigo-500 h-28 p-3 flex items-start relative">
          <span className="absolute top-3 left-3 bg-white text-violet-600 text-xs font-semibold px-3 py-1 rounded-full shadow-md capitalize">
            {exam.category}
          </span>
        </div>

        {/* Body */}
        <div className="p-5 flex flex-col justify-between grow">
          <h2 className="text-xl font-bold text-gray-800 mb-2">{exam.name}</h2>

          <div className="text-sm text-gray-600 mb-1 flex items-center gap-2">
            <i className="ri-time-line text-violet-500"></i> Duration: {exam.duration} mins
          </div>
          <div className="text-sm text-gray-600 mb-1 flex items-center gap-2">
            <i className="ri-file-list-3-line text-violet-500"></i> Total Marks: {exam.totalMarks}
          </div>
          <div className="text-sm text-green-600 mb-4 flex items-center gap-2">
            <i className="ri-checkbox-circle-line text-green-500"></i> Passing Marks: {exam.passingMarks}
          </div>

          <button
            onClick={() => navigate(`/user/write-exam/${exam._id}`)}
            className="mt-auto bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-xl font-medium hover:opacity-90 transition"
          >
            Start Exam
          </button>
        </div>
      </div>
    </Col>
  ))}
</Row>



      </div>
    )
  );
}

export default Home;
