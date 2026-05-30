import UploadForm from "./components/UploadForm";
import DocumentTable from "./components/DocumentTable";
import NotificationPanel from "./components/NotificationPanel";

function App() {
  return (
    <div>
      <h1>Document Management Dashboard</h1>

      <UploadForm />

      <DocumentTable />
      <NotificationPanel />
    </div>
  );
}

export default App;
