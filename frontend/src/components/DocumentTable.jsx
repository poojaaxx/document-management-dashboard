import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

function DocumentTable() {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const documentsPerPage = 5;

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

  const deleteDocument = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await api.delete(`/api/files/${id}`);

      setDocuments((prevDocs) =>
        prevDocs.filter((doc) => doc.id !== id)
      );

      toast.success("Document deleted successfully");

    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.fileName.toLowerCase().includes(search.toLowerCase())
  );

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const indexOfLast =
    currentPage * documentsPerPage;

  const indexOfFirst =
    indexOfLast - documentsPerPage;

  const currentDocuments =
    filteredDocuments.slice(
      indexOfFirst,
      indexOfLast
    );

  const totalPages = Math.ceil(
    filteredDocuments.length /
      documentsPerPage
  );

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">

      <div className="flex justify-between items-center mb-5">

        <h2 className="text-2xl font-bold text-gray-800">
          Uploaded Documents
        </h2>

        <input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border border-gray-300 rounded-lg px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

      </div>

      <div className="overflow-x-auto">

        <table className="min-w-full border border-gray-200">

          <thead className="bg-blue-600 text-white">

            <tr>

              <th className="px-4 py-3 text-left">
                File Name
              </th>

              <th className="px-4 py-3 text-left">
                Type
              </th>

              <th className="px-4 py-3 text-left">
                Size
              </th>

              <th className="px-4 py-3 text-left">
                Upload Date
              </th>

              <th className="px-4 py-3 text-left">
                Status
              </th>

              <th className="px-4 py-3 text-center">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {currentDocuments.length > 0 ? (

              currentDocuments.map((doc) => (

                <tr
                  key={doc.id}
                  className="border-b hover:bg-gray-100"
                >

                  <td className="px-4 py-3">
                    {doc.fileName}
                  </td>

                  <td className="px-4 py-3">
                    {doc.fileType}
                  </td>

                  <td className="px-4 py-3">
                    {formatFileSize(doc.fileSize)}
                  </td>

                  <td className="px-4 py-3">
                    {formatDate(doc.uploadDate)}
                  </td>

                  <td className="px-4 py-3">

                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      {doc.status}
                    </span>

                  </td>

                  <td className="px-4 py-3 text-center">

                    <div className="flex justify-center gap-2">

                      <button
                        onClick={() =>
                          window.open(
                            `http://localhost:8080/api/files/download/${doc.id}`,
                            "_blank"
                          )
                        }
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg"
                      >
                        Download
                      </button>

                      <button
                        onClick={() =>
                          deleteDocument(doc.id)
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
                      >
                        Delete
                      </button>

                    </div>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500"
                >
                  No documents found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* Pagination */}

      <div className="flex justify-center items-center gap-2 mt-6">

        <button
          disabled={currentPage === 1}
          onClick={() =>
            setCurrentPage(currentPage - 1)
          }
          className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
        >
          Prev
        </button>

        {[...Array(totalPages)].map(
          (_, index) => (
            <button
              key={index}
              onClick={() =>
                setCurrentPage(index + 1)
              }
              className={`px-4 py-2 rounded ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          )
        )}

        <button
          disabled={
            currentPage === totalPages ||
            totalPages === 0
          }
          onClick={() =>
            setCurrentPage(currentPage + 1)
          }
          className="bg-gray-200 px-4 py-2 rounded disabled:opacity-50"
        >
          Next
        </button>

      </div>

    </div>
  );
}

export default DocumentTable;