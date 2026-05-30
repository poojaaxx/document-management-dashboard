import { useState } from "react";
import api from "../services/api";

function UploadForm() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      setProgress(0);
      setMessage("");

      await api.post(
        "/api/files/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (event) => {
            if (event.total) {
              const percent = Math.round(
                (event.loaded * 100) / event.total
              );
              setProgress(percent);
            }
          },
        }
      );

      setProgress(100);
      setMessage("File uploaded successfully");

      setTimeout(() => {
        window.location.reload();
      }, 1200);

    } catch (error) {
      console.error(error);

      if (error.response) {
        setMessage(
          typeof error.response.data === "string"
            ? error.response.data
            : "Upload failed"
        );
      } else {
        setMessage("Upload failed");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">

      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Upload PDF Document
      </h2>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-blue-400 rounded-xl p-8 text-center bg-blue-50">

        <div className="text-5xl mb-3">
          📄
        </div>

        <h3 className="text-lg font-semibold text-gray-700">
          Select a PDF File
        </h3>

        <p className="text-sm text-gray-500 mt-1">
          Supported format: PDF
        </p>

        <label className="inline-block mt-5 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition">
          Browse Files

          <input
            type="file"
            accept=".pdf"
            onChange={(e) =>
              setFile(e.target.files[0])
            }
            className="hidden"
          />
        </label>

        {file && (
          <div className="mt-4 bg-white border rounded-lg p-3 text-gray-700">
            Selected File:
            <span className="font-semibold ml-2">
              {file.name}
            </span>
          </div>
        )}

      </div>

      {/* Upload Button */}

      <div className="mt-6 flex justify-center">

        <button
          onClick={handleUpload}
          disabled={uploading || !file}
          className={`px-8 py-3 rounded-lg text-white font-medium transition ${
            uploading || !file
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {uploading
            ? "Uploading..."
            : "Upload Document"}
        </button>

      </div>

      {/* Progress Bar */}

      {uploading && (

        <div className="mt-6">

          <div className="flex justify-between mb-2">

            <span className="text-sm text-gray-600">
              Upload Progress
            </span>

            <span className="text-sm font-semibold text-blue-600">
              {progress}%
            </span>

          </div>

          <div className="w-full bg-gray-200 rounded-full h-4">

            <div
              className="bg-green-500 h-4 rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            ></div>

          </div>

        </div>

      )}

      {/* Message */}

      {message && (

        <div
          className={`mt-5 p-3 rounded-lg text-center ${
            message.includes("success")
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message}
        </div>

      )}

    </div>
  );
}

export default UploadForm;