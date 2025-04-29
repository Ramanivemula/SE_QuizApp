import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getExamById } from "../../../apicalls/exams";
import { addReport } from "../../../apicalls/reports";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import Instructions from "./Instructions";
import { FaFilePdf } from "react-icons/fa";

function WriteExam() {
  const [examData, setExamData] = React.useState(null);
  const [questions = [], setQuestions] = React.useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = React.useState(0);
  const [selectedOptions, setSelectedOptions] = React.useState({});
  const [result = {}, setResult] = React.useState({});
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [view, setView] = useState("instructions");
  const [secondsLeft = 0, setSecondsLeft] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const { user } = useSelector((state) => state.users);

  const getExamData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getExamById({ examId: params.id });
      dispatch(HideLoading());
      if (response.success) {
        setQuestions(response.data.questions);
        setExamData(response.data);
        setSecondsLeft(response.data.duration);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const calculateResult = async () => {
    try {
      let correctAnswers = [];
      let wrongAnswers = [];

      questions.forEach((question, index) => {
        if (question.correctOption === selectedOptions[index]) {
          correctAnswers.push(question);
        } else {
          wrongAnswers.push(question);
        }
      });

      let verdict = "Pass";
      if (correctAnswers.length < examData.passingMarks) {
        verdict = "Fail";
      }

      const tempResult = {
        correctAnswers,
        wrongAnswers,
        verdict,
      };
      setResult(tempResult);

      dispatch(ShowLoading());
      const response = await addReport({
        exam: params.id,
        result: tempResult,
        user: user._id,
      });
      dispatch(HideLoading());
      if (response.success) {
        setView("result");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const startTimer = () => {
    let totalSeconds = examData.duration * 60;
    const intervalId = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds = totalSeconds - 1;
        setSecondsLeft(totalSeconds);
      } else {
        setTimeUp(true);
        clearInterval(intervalId); // Optional: stop the timer when time's up
      }
    }, 1000);
    setIntervalId(intervalId);
  };
  

  useEffect(() => {
    if (timeUp && view === "questions") {
      clearInterval(intervalId);
      calculateResult();
    }
  }, [timeUp]);

  useEffect(() => {
    if (params.id) {
      getExamData();
    }
  }, []);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };
  

  return (
    examData && (
      <div className="mt-2">
        <div className="divider"></div>
        <h1 className="text-center font-semibold">{examData.name}</h1>
        <div className="divider"></div>

        {view === "instructions" && (
          <Instructions
            examData={examData}
            setView={setView}
            startTimer={startTimer } 
          />
        )}

        {view === "questions" && (
          <div className="flex flex-col gap-0 bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold">
                {selectedQuestionIndex + 1} :{" "}
                {questions[selectedQuestionIndex].name}
              </h1>

              <div className="bg-gray-800 px-4 py-2 rounded-xl shadow">
                <span className="text-2xl text-white font-bold">
                  {formatTime(secondsLeft)}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-4">
              {Object.keys(questions[selectedQuestionIndex].options).map(
                (option, index) => (
                  <div
                    className={`cursor-pointer py-2 px-4 mt-0 mb-0 rounded-lg border-2 shadow-sm transition-all duration-200 text-sm ${
                      selectedOptions[selectedQuestionIndex] === option
                        ? "bg-blue-500 text-white border-blue-700"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                    key={index}
                    onClick={() => {
                      setSelectedOptions({
                        ...selectedOptions,
                        [selectedQuestionIndex]: option,
                      });
                    }}
                  >
                    <h1 className="font-medium">
                      {option} :{" "}
                      {questions[selectedQuestionIndex].options[option]}
                    </h1>
                  </div>
                )
              )}
            </div>

            <div className="flex justify-between mt-4">
              {selectedQuestionIndex > 0 && (
                <button
                  className="primary-outlined-btn"
                  onClick={() =>
                    setSelectedQuestionIndex(selectedQuestionIndex - 1)
                  }
                >
                  Previous
                </button>
              )}

              {selectedQuestionIndex < questions.length - 1 && (
                <button
                  className="primary-contained-btn"
                  onClick={() =>
                    setSelectedQuestionIndex(selectedQuestionIndex + 1)
                  }
                >
                  Next
                </button>
              )}

              {selectedQuestionIndex === questions.length - 1 && (
                <button
                  className="primary-contained-btn"
                  onClick={() => {
                    clearInterval(intervalId);
                    setTimeUp(true);
                  }}
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        )}

        {view === "result" && (
          <div className="flex items-center mt-2 justify-center result">
            <div className="flex flex-col gap-4 bg-white p-6 rounded-xl shadow-md items-start w-full max-w-md">
              <h1 className="text-2xl font-bold">RESULT</h1>
              <div className="divider"></div>
              <div className="marks text-md space-y-1">
                <h1>Total Marks : {examData.totalMarks}</h1>
                <h1>Obtained Marks : {result.correctAnswers.length}</h1>
                <h1>Wrong Answers : {result.wrongAnswers.length}</h1>
                <h1>Passing Marks : {examData.passingMarks}</h1>
                <h1>
                  VERDICT :{" "}
                  <span
                    className={`font-bold ${
                      result.verdict === "Pass"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {result.verdict}
                  </span>
                </h1>
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  className="primary-outlined-btn"
                  onClick={() => {
                    setView("instructions");
                    setSelectedQuestionIndex(0);
                    setSelectedOptions({});
                    setSecondsLeft(examData.duration);
                  }}
                >
                  Retake Exam
                </button>
                <button
                  className="primary-contained-btn"
                  onClick={() => setView("review")}
                >
                  Review Answers
                </button>
              </div>
            </div>

            <div className="lottie-animation max-w-sm">
              {result.verdict === "Pass" && (
                <lottie-player
                  src="https://assets2.lottiefiles.com/packages/lf20_ya4ycrti.json"
                  background="transparent"
                  speed="1"
                  loop
                  autoplay
                ></lottie-player>
              )}
              {result.verdict === "Fail" && (
                <lottie-player
                  src="https://assets4.lottiefiles.com/packages/lf20_qp1spzqv.json"
                  background="transparent"
                  speed="1"
                  loop
                  autoplay
                ></lottie-player>
              )}
            </div>
          </div>
        )}

        {view === "review" && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Review Answers</h2>
              <button
                className="primary-outlined-btn flex items-center gap-2"
                onClick={() => {
                  const element = document.getElementById("review-section");
                  import("html2pdf.js").then((html2pdf) => {
                    html2pdf.default().from(element).save("exam-review.pdf");
                  });
                }}
              >
                <FaFilePdf />
                Export as PDF
              </button>
            </div>

            <div id="review-section" className="flex flex-col gap-4 mt-2">
              {questions.map((question, index) => {
                const isCorrect =
                  question.correctOption === selectedOptions[index];
                return (
                  <div
                    key={index}
                    className={`rounded-lg border p-4 shadow ${
                      isCorrect
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg">
                        {index + 1}. {question.name}
                      </h3>
                      <span
                        className={`text-sm font-semibold px-2 py-1 rounded ${
                          isCorrect
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {isCorrect ? "Correct" : "Incorrect"}
                      </span>
                    </div>

                    <div className="mt-2 text-sm">
                      <p>
                        <strong>Your Answer:</strong>{" "}
                        {selectedOptions[index]} -{" "}
                        {question.options[selectedOptions[index]]}
                      </p>
                      <p>
                        <strong>Correct Answer:</strong>{" "}
                        {question.correctOption} -{" "}
                        {question.options[question.correctOption]}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center gap-4 mt-4">
              <button className="primary-outlined-btn" onClick={() => navigate("/")}>
                Close
              </button>
              <button
                className="primary-contained-btn"
                onClick={() => {
                  setView("instructions");
                  setSelectedQuestionIndex(0);
                  setSelectedOptions({});
                  setSecondsLeft(examData.duration);
                }}
              >
                Retake Exam
              </button>
            </div>
          </div>
        )}
      </div>
    )
  );
}

export default WriteExam;
