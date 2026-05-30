import { useEffect, useState } from "react";
import api from "../services/api";

import {
  FaFilePdf,
  FaDatabase,
  FaCheckCircle,
  FaUpload
} from "react-icons/fa";

function DashboardStats() {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await api.get("/api/files");
      setDocuments(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const totalFiles = documents.length;

  const totalStorage = (
    documents.reduce(
      (total, doc) => total + doc.fileSize,
      0
    ) /
    (1024 * 1024)
  ).toFixed(2);

  const completedFiles = documents.filter(
    (doc) => doc.status === "COMPLETE"
  ).length;

  const today = new Date().toISOString().split("T")[0];

  const uploadsToday = documents.filter(
    (doc) =>
      doc.uploadDate &&
      doc.uploadDate.startsWith(today)
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">

      {/* Total Files */}

      <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition duration-300 border-l-4 border-blue-500">

        <div className="flex justify-between items-center">

          <div>
            <p className="text-gray-500 text-sm">
              Total Files
            </p>

            <h2 className="text-3xl font-bold text-blue-600 mt-2">
              {totalFiles}
            </h2>
          </div>

          <FaFilePdf
            size={35}
            className="text-blue-500"
          />

        </div>

      </div>

      {/* Storage */}

      <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition duration-300 border-l-4 border-green-500">

        <div className="flex justify-between items-center">

          <div>
            <p className="text-gray-500 text-sm">
              Storage Used
            </p>

            <h2 className="text-3xl font-bold text-green-600 mt-2">
              {totalStorage} MB
            </h2>
          </div>

          <FaDatabase
            size={35}
            className="text-green-500"
          />

        </div>

      </div>

      {/* Completed */}

      <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition duration-300 border-l-4 border-purple-500">

        <div className="flex justify-between items-center">

          <div>
            <p className="text-gray-500 text-sm">
              Completed Uploads
            </p>

            <h2 className="text-3xl font-bold text-purple-600 mt-2">
              {completedFiles}
            </h2>
          </div>

          <FaCheckCircle
            size={35}
            className="text-purple-500"
          />

        </div>

      </div>

      {/* Today */}

      <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition duration-300 border-l-4 border-orange-500">

        <div className="flex justify-between items-center">

          <div>
            <p className="text-gray-500 text-sm">
              Uploads Today
            </p>

            <h2 className="text-3xl font-bold text-orange-500 mt-2">
              {uploadsToday}
            </h2>
          </div>

          <FaUpload
            size={35}
            className="text-orange-500"
          />

        </div>

      </div>

    </div>
  );
}

export default DashboardStats;