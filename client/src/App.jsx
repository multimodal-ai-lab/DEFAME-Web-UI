import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import FactCheckingPage from "./pages/FactCheckingPage";
import Sidebar from "./components/navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import LoadingAnimation from "./components/LoadingAnimation";

const useBackendStatus = () => {
  const [isOnline, setIsOnline] = useState(null); // Start with null to handle loading state

  useEffect(() => {
    const checkBackend = async () => {
      try {
        await axios.get("http://localhost:3000"); // Change to your actual health-check endpoint
        setIsOnline(true);
      } catch (error) {
        setIsOnline(false);
      }
    };

    checkBackend();
  }, []); // Runs only once when the component mounts

  return isOnline;
};

function App() {
  const [buttons, setButtons] = useState([]);
  // Load buttons from localStorage when the component mounts
  //  useEffect(() => {
  //   const storedButtons = JSON.parse(localStorage.getItem("buttons")) || [];
  //    setButtons(storedButtons);
  //  }, []);
  useEffect(() => {
    const newButtons = [{id:"-xUwJMubZTYukRa6o0Mscw",title:"Dogs are happy"}]
    setButtons(newButtons)
  }, []);

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
        <Sidebar buttons={buttons} setButtons={setButtons} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/checking/:id?" element={<FactCheckingPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
