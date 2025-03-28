import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import FactCheckingPage from "./pages/FactCheckingPage";
import Sidebar from "./components/navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import LoadingAnimation from "./components/LoadingAnimation";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import { deleteResults } from "./services/apiCalls";

const useBackendStatus = () => {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        await axios.get("http://backend:3000"); // Your API health-check endpoint
        setIsOnline(true);
      } catch (error) {
        setIsOnline(false);
      }
    };

    checkBackend();
  }, []);

  return isOnline;
};

function App() {
  const [buttons, setButtons] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const loadButtons = () => {
      const storedButtons = JSON.parse(localStorage.getItem("buttons")) || [];
      setButtons(storedButtons);
    };

    loadButtons();
    window.addEventListener("storage", loadButtons);
    
    return () => {
      window.removeEventListener("storage", loadButtons);
    };
  }, []);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteId !== null) {
      await deleteResults(deleteId);
      const updatedButtons = buttons.filter((button) => button.id !== deleteId);
      setButtons(updatedButtons);
      localStorage.setItem("buttons", JSON.stringify(updatedButtons));
    }
    setIsModalOpen(false);
  };

  const isBackendOnline = useBackendStatus();

  if (isBackendOnline === null) {
    return (
      <div className="center">
        <LoadingAnimation isLandingPage={true} />
      </div>
    );
  }

  if (!isBackendOnline) {
    return (
      <div className="center">
        <h2 style={{ textAlign: "center", color: "red" }}>
          Server is down. Please try again later.
        </h2>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <Router>
        <Sidebar buttons={buttons} setButtons={setButtons} handleDeleteClick={handleDeleteClick} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/checking/:id?" element={<FactCheckingPage />} />
        </Routes>
      </Router>

      {/* Delete Confirmation Modal in the center of the page */}
      <DeleteConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

export default App;
