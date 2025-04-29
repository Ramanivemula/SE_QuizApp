import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { message, Tooltip } from "antd";
import {
  FiHome,
  FiBarChart2,
  FiLogOut,
  FiFileText,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { getUserInfo } from "../apicalls/users";
import { SetUser } from "../redux/usersSlice";
import { HideLoading, ShowLoading } from "../redux/loaderSlice";

function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [menu, setMenu] = useState([]);

  const adminMenu = [
    {
      title: "Dashboard",
      paths: ["/dashboard"],
      icon: <FiHome />,
      onClick: () => navigate("/dashboard"),
    },
    {
      title: "Exams",
      paths: ["/admin/exams"],
      icon: <FiFileText />,
      onClick: () => navigate("/admin/exams"),
    },
    {
      title: "Reports",
      paths: ["/admin/reports"],
      icon: <FiBarChart2 />,
      onClick: () => navigate("/admin/reports"),
    },
    {
      title: "Logout",
      paths: ["/logout"],
      icon: <FiLogOut />,
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/login");
      },
    },
  ];

  const userMenu = [
    {
      title: "Home",
      paths: ["/"],
      icon: <FiHome />,
      onClick: () => navigate("/"),
    },
    {
      title: "Reports",
      paths: ["/user/reports"],
      icon: <FiBarChart2 />,
      onClick: () => navigate("/user/reports"),
    },
    {
      title: "Logout",
      paths: ["/logout"],
      icon: <FiLogOut />,
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/login");
      },
    },
  ];

  const getUserData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getUserInfo();
      dispatch(HideLoading());
      if (response.success) {
        dispatch(SetUser(response.data));
        setMenu(response.data.isAdmin ? adminMenu : userMenu);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
      navigate("/login");
    }
  };

  const activeRoute = window.location.pathname;
  const isActive = (paths) =>
    paths.includes(activeRoute) ||
    (activeRoute.includes("/admin/exams/edit") &&
      paths.includes("/admin/exams")) ||
    (activeRoute.includes("/user/write-exam") &&
      paths.includes("/user/write-exam"));

  useEffect(() => {
    if (localStorage.getItem("token")) getUserData();
    else navigate("/login");
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      {/* Sidebar */}
      <aside className={`transition-all duration-300 bg-white border-r shadow-lg ${collapsed ? "w-20" : "w-64"} flex flex-col`}>
        <div className="flex items-center justify-between px-4 py-4 border-b">
          {!collapsed && <h1 className="text-xl font-semibold text-blue-600">QUIZ</h1>}
          <button onClick={() => setCollapsed(!collapsed)} className="text-gray-500 hover:text-gray-800">
            {collapsed ? <FiMenu size={22} /> : <FiX size={22} />}
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          {menu.map((item, index) => {
            const active = isActive(item.paths);
            const content = (
              <div
                key={index}
                onClick={item.onClick}
                className={`flex items-center gap-3 px-4 py-3 mx-2 my-1 rounded-xl cursor-pointer transition-all
                  ${active ? "bg-blue-100 text-blue-600 font-medium" : "hover:bg-gray-100"}
                `}
              >
                <span className="text-lg">{item.icon}</span>
                {!collapsed && <span className="text-sm">{item.title}</span>}
              </div>
            );
            return collapsed ? (
              <Tooltip title={item.title} placement="right" key={index}>
                {content}
              </Tooltip>
            ) : (
              content
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        <header className="bg-white shadow px-6 py-4 flex justify-between items-center">
          <div className="text-lg font-semibold text-blue-600">
            Welcome, {user?.isAdmin ? "Admin" : "User"}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Role:</span>
            <span className="text-sm font-medium text-gray-800">{user?.isAdmin ? "Admin" : "User"}</span>
          </div>
        </header>
        <section className="flex-1 p-6">{children}</section>
      </main>
    </div>
  );
}

export default ProtectedRoute;
