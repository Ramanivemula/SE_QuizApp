import { Link } from "react-router-dom";
import { FaChalkboardTeacher, FaUserGraduate, FaUserShield, FaCheckCircle } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="bg-white min-h-screen text-gray-900">
      <Navbar />

      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center h-[500px] flex items-center justify-center text-center"
        style={{
          backgroundImage:
            "url('https://source.unsplash.com/1600x900/?students,learning')",
        }}
      >
        <div className="bg-gray-900 bg-opacity-50 p-10 rounded-xl">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">
            Enhance Your Skills with Engaging Quizzes
          </h1>
          <p className="text-white mt-3">
            Learn, Compete, and Improve with Real-time Assessments.
          </p>
          <Link
            to="/signup"
            className="mt-5 inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition duration-300"
          >
            Get Started Now
          </Link>
        </div>
      </div>

      {/* Why Choose Our Quiz App */}
      <div className="container mx-auto text-center py-16 px-4">
        <h2 className="text-3xl font-bold mb-8 text-blue-700">
          Why Choose Our Quiz App?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white shadow-md rounded-xl hover:shadow-lg transition duration-300 border border-gray-200">
            <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
              <FaCheckCircle className="text-green-500" /> Performance Tracking
            </h3>
            <p className="text-gray-600 mt-2">
              Monitor progress with detailed reports and analytics.
            </p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-xl hover:shadow-lg transition duration-300 border border-gray-200">
            <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
              <FaCheckCircle className="text-green-500" /> Smart Quiz System
            </h3>
            <p className="text-gray-600 mt-2">
              Get quizzes tailored to your skills & levels.
            </p>
          </div>
          <div className="p-6 bg-white shadow-md rounded-xl hover:shadow-lg transition duration-300 border border-gray-200">
            <h3 className="text-xl font-semibold flex items-center justify-center gap-2">
              <FaCheckCircle className="text-green-500" /> Gamified Experience
            </h3>
            <p className="text-gray-600 mt-2">
              Earn badges & climb the leaderboards for motivation.
            </p>
          </div>
        </div>
      </div>

      {/* Choose Your Role */}
      <div className="container mx-auto text-center py-16 px-4">
        <h2 className="text-3xl font-bold mb-8 text-blue-700">
          Choose Your Role
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white shadow-lg rounded-xl hover:bg-blue-100 transition duration-300 cursor-pointer">
            <FaUserShield className="text-blue-700 text-5xl mx-auto" />
            <h3 className="text-xl font-semibold mt-4">Admin</h3>
            <p className="text-gray-600 mt-2">
              Manage users, quizzes, and platform analytics.
            </p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-xl hover:bg-blue-100 transition duration-300 cursor-pointer">
            <FaChalkboardTeacher className="text-blue-700 text-5xl mx-auto" />
            <h3 className="text-xl font-semibold mt-4">Teacher</h3>
            <p className="text-gray-600 mt-2">
              Create, schedule quizzes and track student progress.
            </p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-xl hover:bg-blue-100 transition duration-300 cursor-pointer">
            <FaUserGraduate className="text-blue-700 text-5xl mx-auto" />
            <h3 className="text-xl font-semibold mt-4">Student</h3>
            <p className="text-gray-600 mt-2">
              Attempt quizzes, track performance, and compete.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
