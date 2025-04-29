import React, { useEffect, useState } from "react";
import { message, Input, Button } from "antd";
import { useDispatch } from "react-redux";
import { getAllReports } from "../../../apicalls/reports";
import { getUserInfo } from "../../../apicalls/users";
import { ShowLoading, HideLoading } from "../../../redux/loaderSlice";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import PageTitle from "../../../components/PageTitle";

const COLORS = ["#00C49F", "#FF4D4F"];

function Dashboard() {
  const [reportsData, setReportsData] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [filters, setFilters] = useState({
    examName: "",
    userName: "",
  });
  const dispatch = useDispatch();

  const fetchReports = async () => {
    try {
      dispatch(ShowLoading());

      const userResponse = await getUserInfo();
      if (!userResponse.success || !userResponse.data.isAdmin) {
        message.error("Unauthorized access. Redirecting...");
        window.location.href = "/";
        return;
      }

      setIsAuthorized(true);

      const reportsResponse = await getAllReports(filters);
      if (reportsResponse.success) {
        setReportsData(reportsResponse.data);
      } else {
        message.error(reportsResponse.message);
      }
    } catch (error) {
      message.error("Something went wrong: " + error.message);
    } finally {
      dispatch(HideLoading());
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filters]);

  if (!isAuthorized) return null; // or show a spinner/loading screen

  const verdictStats = [
    {
      name: "Pass",
      value: reportsData.filter((r) => r.result.verdict === "Pass").length,
    },
    {
      name: "Fail",
      value: reportsData.filter((r) => r.result.verdict === "Fail").length,
    },
  ];

  const examStats = Object.values(
    reportsData.reduce((acc, report) => {
      const examName = report.exam.name;
      if (!acc[examName]) {
        acc[examName] = { name: examName, participants: 0 };
      }
      acc[examName].participants += 1;
      return acc;
    }, {})
  );

  const examAvgMarks = Object.values(
    reportsData.reduce((acc, report) => {
      const examName = report.exam.name;
      const obtained = report.result.correctAnswers.length;
      if (!acc[examName]) {
        acc[examName] = { name: examName, totalMarks: 0, count: 0 };
      }
      acc[examName].totalMarks += obtained;
      acc[examName].count += 1;
      return acc;
    }, {})
  ).map((exam) => ({
    name: exam.name,
    averageMarks: (exam.totalMarks / exam.count).toFixed(2),
  }));

  const topUsers = [...reportsData]
    .sort(
      (a, b) =>
        b.result.correctAnswers.length - a.result.correctAnswers.length
    )
    .slice(0, 5)
    .map((report) => ({
      name: report.user.name,
      obtainedMarks: report.result.correctAnswers.length,
    }));

  return (
    <div className="mb-6">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-4 tracking-tight flex items-center gap-2">
        <span>📊</span> Reports
      </h1>

      <div className="flex gap-3 items-center mb-6 mt-6">
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
            fetchReports();
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
          onClick={() => fetchReports()}
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow text-center">
          <h3 className="text-lg font-medium">Total Reports</h3>
          <p className="text-2xl font-bold">{reportsData.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow text-center">
          <h3 className="text-lg font-medium">Total Pass</h3>
          <p className="text-2xl font-bold">{verdictStats[0].value}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow text-center">
          <h3 className="text-lg font-medium">Total Fail</h3>
          <p className="text-2xl font-bold">{verdictStats[1].value}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pass vs Fail Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Pass vs Fail</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={verdictStats}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {verdictStats.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Exam Participation */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Exam Participation</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={examStats}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="participants" fill="#1890ff" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Avg Marks per Exam */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Avg Marks per Exam</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={examAvgMarks}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="averageMarks" fill="#52c41a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Users */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Top Scoring Users</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topUsers}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="obtainedMarks" fill="#fa541c" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
