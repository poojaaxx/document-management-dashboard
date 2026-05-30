import { useEffect, useState } from "react";
import api from "../services/api";

function DocumentTable() {

  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {

      const response =
        await api.get("/api/files");

      setDocuments(response.data);

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Uploaded Documents</h2>

      <table border="1">
        <thead>
          <tr>
  <th>File Name</th>
  <th>Type</th>
  <th>Size</th>
  <th>Download</th>
</tr>
        </thead>

        <tbody>
  {documents.map((doc) => (
    <tr key={doc.id}>
      <td>{doc.fileName}</td>
      <td>{doc.fileType}</td>
      <td>{doc.fileSize}</td>

      <td>
        <button
          onClick={() =>
            window.open(
              `http://localhost:8080/api/files/download/${doc.id}`,
              "_blank"
            )
          }
        >
          Download
        </button>
      </td>
    </tr>
  ))}
</tbody>
      </table>
    </div>
  );
}

export default DocumentTable;