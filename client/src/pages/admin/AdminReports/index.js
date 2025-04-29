import React, { useEffect } from "react";
import PageTitle from "../../../components/PageTitle";
import { message, Table, Input, Button, Tooltip } from "antd";
import { useDispatch } from "react-redux";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import { getAllReports } from "../../../apicalls/reports";
import moment from "moment";

// Helper function for verdict style
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

function AdminReports() {
  const [reportsData, setReportsData] = React.useState([]);
  const dispatch = useDispatch();
  const [filters, setFilters] = React.useState({
    examName: "",
    userName: "",
  });

  const columns = [
    {
      title: "Exam Name",
      dataIndex: "examName",
      render: (text, record) => <>{record.exam.name}</>,
    },
    {
      title: "User Name",
      dataIndex: "userName",
      render: (text, record) => <>{record.user.name}</>,
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (text, record) => (
        <>{moment(record.createdAt).format("DD-MM-YYYY hh:mm:ss")}</>
      ),
    },
    {
      title: "Total Marks",
      dataIndex: "totalMarks",
      render: (text, record) => <>{record.exam.totalMarks}</>,
    },
    {
      title: "Passing Marks",
      dataIndex: "passingMarks",
      render: (text, record) => <>{record.exam.passingMarks}</>,
    },
    {
      title: "Obtained Marks",
      dataIndex: "correctAnswers",
      render: (text, record) => (
        <span
          style={{
            // color: record.result.correctAnswers.length >= record.exam.passingMarks ? "green" : "red",
            fontWeight: "bold",
          }}
        >
          {record.result.correctAnswers.length}
        </span>
      ),
    },
    {
      title: "Verdict",
      dataIndex: "verdict",
      render: (text, record) => getVerdictTag(record.result.verdict),  // Using the helper function for verdict styling
    },
  ];

  const getData = async (tempFilters) => {
    try {
      dispatch(ShowLoading());
      const response = await getAllReports(tempFilters);
      if (response.success) {
        setReportsData(response.data);
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
    getData(filters);
  }, [filters]);

  return (
    <div style={{ padding: "20px" }}>
      <h1 className="text-3xl font-extrabold text-gray-800 mb-4 tracking-tight flex items-center gap-2">
        <span>📊</span> Reports
      </h1>
      <div className="divider" style={{ margin: "20px 0", borderBottom: "1px solid #dcdcdc" }} />

      {/* Filters Section */}
      <div className="flex gap-3 items-center mb-4">
        <Input
          placeholder="Search by Exam"
          value={filters.examName}
          onChange={(e) => setFilters({ ...filters, examName: e.target.value })}
          style={{
            borderRadius: "8px",
            padding: "12px",
            border: "1px solid #dcdcdc",
            width: "250px",
            fontSize: "16px",
          }}
        />
        <Input
          placeholder="Search by User"
          value={filters.userName}
          onChange={(e) => setFilters({ ...filters, userName: e.target.value })}
          style={{
            borderRadius: "8px",
            padding: "12px",
            border: "1px solid #dcdcdc",
            width: "250px",
            fontSize: "16px",
          }}
        />
        <Button
          onClick={() => {
            setFilters({ examName: "", userName: "" });
            getData({ examName: "", userName: "" });
          }}
          style={{
            borderRadius: "8px",
            border: "1px solid #dcdcdc",
            padding: "10px 20px",
            backgroundColor: "#f0f0f0",
            fontSize: "16px",
          }}
        >
          Clear Filters
        </Button>
        <Button
          onClick={() => getData(filters)}
          style={{
            backgroundColor: "#1890ff",
            color: "#fff",
            borderRadius: "8px",
            padding: "10px 20px",
            fontSize: "16px",
          }}
        >
          Search
        </Button>
      </div>

      <div className="rounded-lg border mt-5 border-gray-200 shadow-sm bg-white overflow-x-auto">
        <Table
          columns={columns}
          dataSource={reportsData}
          pagination={{
            pageSize: 6,
          }}
          rowKey={(record) => record._id}
          bordered={false}
        />
      </div>
    </div>
  );
}

export default AdminReports;
