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

      const response = await api.post(
        "/api/files/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (event) => {
            if (event.total) {
              const percent =
                Math.round(
                  (event.loaded * 100) /
                  event.total
                );

              setProgress(percent);
            }
          }
        }
      );

      console.log("Upload Success:", response.data);

      setProgress(100);
      setMessage("File uploaded successfully");

      // Refresh page after successful upload
      setTimeout(() => {
        window.location.reload();
      }, 1000);

    } catch (error) {

      console.error("Upload Error:", error);

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
    <div>

      <h2>Upload PDF</h2>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) =>
          setFile(e.target.files[0])
        }
      />

      <button onClick={handleUpload}>
        Upload
      </button>

      {uploading && (

        <div>

          <p>
            Uploading... {progress}%
          </p>

          <progress
            value={progress}
            max="100"
          />

        </div>
      )}

      <p>{message}</p>

    </div>
  );
}

export default UploadForm;