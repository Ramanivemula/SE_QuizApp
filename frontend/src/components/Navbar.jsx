import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-blue-600 text-white shadow-md">
      <h1 className="text-2xl font-bold">Quiz App</h1>
      <div>
        <Link to="/login" className="px-4 py-2 bg-white text-blue-600 rounded-md mr-2">Login</Link>
        <Link to="/signup" className="px-4 py-2 border border-white rounded-md">Sign Up</Link>
      </div>
    </header>
  );
};

export default Navbar;
