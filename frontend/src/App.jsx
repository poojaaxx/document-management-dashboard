import UploadForm from "./components/UploadForm";
import DocumentTable from "./components/DocumentTable";
import NotificationPanel from "./components/NotificationPanel";
import DashboardStats from "./components/DashboardStats";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  FaTachometerAlt,
  FaFilePdf,
  FaBell,
  FaCog
} from "react-icons/fa";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">

        <h1 className="text-2xl font-bold text-gray-800">
          Document Management Dashboard
        </h1>

        <div className="flex items-center gap-4">

          <span className="text-gray-600">
            Welcome Admin
          </span>

          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            A
          </div>

        </div>

      </header>

      <div className="flex">

        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-md min-h-screen p-5">

          <div className="mb-8 border-b pb-4">
            <h2 className="text-xl font-bold text-blue-600">
              DMS Portal
            </h2>
          </div>

          <nav>

            <ul className="space-y-3">

              <li className="flex items-center gap-3 bg-blue-100 text-blue-700 px-4 py-3 rounded-lg font-medium cursor-pointer">
                <FaTachometerAlt />
                Dashboard
              </li>

              <li className="flex items-center gap-3 hover:bg-gray-100 px-4 py-3 rounded-lg cursor-pointer transition">
                <FaFilePdf />
                Documents
              </li>

              <li className="flex items-center gap-3 hover:bg-gray-100 px-4 py-3 rounded-lg cursor-pointer transition">
                <FaBell />
                Notifications
              </li>

              <li className="flex items-center gap-3 hover:bg-gray-100 px-4 py-3 rounded-lg cursor-pointer transition">
                <FaCog />
                Settings
              </li>

            </ul>

          </nav>

        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">

          <DashboardStats />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            <div className="lg:col-span-2">
              <UploadForm />
            </div>

            <div>
              <NotificationPanel />
            </div>

          </div>

          <div className="mt-6">
            <DocumentTable />
          </div>

        </main>

      </div>

      <ToastContainer position="top-right" />

    </div>
  );
}

export default App;