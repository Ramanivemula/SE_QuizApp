import React, { useEffect, useState } from "react";
import { Table, message } from "antd";
import { useDispatch } from "react-redux";
import moment from "moment";
import { getAllReportsByUser } from "../../../apicalls/reports";
import { ShowLoading, HideLoading } from "../../../redux/loaderSlice";

function UserReports() {
  const dispatch = useDispatch();
  const [reportsData, setReportsData] = useState([]);

  const getData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllReportsByUser();
      if (response.success) {
        setReportsData(response.data);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      dispatch(HideLoading());
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const getVerdictTag = (verdict) => {
    const base = "px-3 py-1 text-sm font-medium rounded-full";
    return (
      <span
        className={`${base} ${
          verdict === "Pass"
            ? "bg-green-100 text-green-600"
            : "bg-red-100 text-red-600"
        }`}
      >
        {verdict}
      </span>
    );
  };

  const columns = [
    {
      title: <span className="text-sm font-bold text-gray-600">Exam Name</span>,
      dataIndex: "examName",
      render: (_, record) => (
        <span className="font-medium text-gray-800">{record.exam.name}</span>
      ),
    },
    {
      title: <span className="text-sm font-bold text-gray-600">Date</span>,
      dataIndex: "date",
      render: (_, record) => (
        <span className="text-gray-500 text-sm">
          {moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss")}
        </span>
      ),
    },
    {
      title: <span className="text-sm font-bold text-gray-600">Total Marks</span>,
      dataIndex: "totalMarks",
      render: (_, record) => (
        <span className="text-gray-700">{record.exam.totalMarks}</span>
      ),
    },
    {
      title: (
        <span className="text-sm font-bold text-gray-600">Passing Marks</span>
      ),
      dataIndex: "passingMarks",
      render: (_, record) => (
        <span className="text-gray-700">{record.exam.passingMarks}</span>
      ),
    },
    {
      title: (
        <span className="text-sm font-bold text-gray-600">Obtained Marks</span>
      ),
      dataIndex: "obtainedMarks",
      render: (_, record) => (
        <span className="text-gray-700">
          {record.result.correctAnswers.length}
        </span>
      ),
    },
    {
      title: <span className="text-sm font-bold text-gray-600">Verdict</span>,
      dataIndex: "verdict",
      render: (_, record) => getVerdictTag(record.result.verdict),
    },
  ];

  return (
    <div className="p-6 ">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-4  tracking-tight flex items-center gap-2">
        <span>📊</span> Reports
      </h1>

      <div className="rounded-lg border mt-5 border-gray-200 shadow-sm bg-white overflow-x-auto">
        <Table
          className="custom-table"
          columns={columns}
          dataSource={reportsData}
          pagination={{ pageSize: 6 }}
          rowKey={(record) => record._id}
        />
      </div>
    </div>
  );
}

export default UserReports;
