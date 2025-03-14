import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import LoadingAnimation from "../components/LoadingAnimation";
import AccordionFact from "../components/AccordionFact";
import "./FactCheckingPage.css";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import { handleSave, getResults } from "../services/apiCalls";
import { showContent } from "../utils/helperFunctions";
import FactCheckInput from "../components/FactCheckInput";

// Make sure the server supports Socket.IO

const FactCheckingPage = () => {
  const wsStates = {
    connected: "connected",
    extractingClaims: "extractingClaims",
    extreactedClaims: "extreactedClaims",
    disconnected: "disconnected",
    error: "error",
  };
  const navigate = useNavigate();
  const [isAllDone, setAllDone] = useState(false);
  const [buttons, setButtons] = useState([]);
  const [firstResponse, setFirstResponse] = useState(false);
  const [secondResponse, setSecondResponse] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [finished, setFinished] = useState(false);
  const location = useLocation();
  const { id } = useParams();
  //this id is used only if a button is
  const [jobId, setJobId] = useState("");
  const [content, setContent] = useState([]);
  console.log(content);

  const [claims, setClaims] = useState([]);
  var state = "disconnected";
  useEffect(() => {
    console.log(buttons); // Logs updated state
  }, [buttons]);
  useEffect(() => {
    const newContent = location.state?.data?.content || [];
    setContent(newContent);
    const newJobId = location.state?.jobId || "";
    setJobId(newJobId);
    console.log();
  }, []);
  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const data = await getResults(id);
        console.log(data);
        if (data) {
          setJobId(data.jobId);
          setContent(data.content);
          setClaims(data.claims);
          setFirstResponse(true);
          setSecondResponse(true);
          setAllDone(true);
        }
      };
      fetchData();
    } else {
      if (!jobId) return;
      const socketUrl = `ws://thot.mai.informatik.tu-darmstadt.de:3003/status/${jobId}`;
      const socket = new WebSocket(socketUrl);

      socket.onopen = () => {
        state = "connected";
      };
      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          console.log("Socket data:", data);
          if (data?.job_info?.status_message) {
            const status_message = data.job_info.status_message;
            const status = data.job_info.status;
            if (status_message === "Extracting claims.") {
              state = "extractingClaims";
            }
            if (status === "DONE" && Object.keys(data).length > 2) {
              // Convert object to array

              const claimsArray = Object.values(data.claims);
              console.log("Claims array done:", Object.keys(data).length);
              setClaims(() => [...claimsArray]);
              setFirstResponse(true);
              setSecondResponse(true);
            }
            if (
              (status === "RUNNING" && data?.claims) ||
              (status === "PENDING" && state != "extractingClaims")
            ) {
              const claimsArray = Object.values(data.claims);
              console.log("salut");
              setClaims(() => [...claimsArray]);
              state === "extreactedClaims";
              console.log("Claims array running:", Object.keys(data).length);
              setFirstResponse(true);
            }
            if (status === "DONE") {
              setFinished(true);
              setAllDone(true);
            }
          }

          if (data?.claims && state === "extractingClaims") {
            // Convert object to array
            const claimsArray = Object.values(data.claims);

            state = "extreactedClaims";

            // Update state with new claims
            setClaims((prevClaims) => [...prevClaims, ...claimsArray]);
            setFirstResponse(true);
          }

          // If claims are received, update state
          if (data?.claims && state === "extreactedClaims") {
            updateClaims(data.claims);
          }
        } catch (error) {
          state = "error";
        }
      };

      socket.onclose = () => {
        console.log(jobId);
        state = "disconnected";
      };

      socket.onerror = (error) => {
        console.error("WebSocket Error:", error);
        state = "error";
      };

      return () => {
        socket.close();
      };
    }
  }, [jobId, id]);
  useEffect(() => {
    const saveResults = async () => {
      if (finished) {
        await handleSave(jobId, content, claims);

        const storedButtons =
          JSON.parse(sessionStorage.getItem("buttons")) || [];
        const exists = storedButtons.some((button) => button.id === jobId);
        if (!exists) {
          const newButton = { id: jobId, title: claims[0].data[0][1] };
          const updatedButtons = [...storedButtons, newButton];
          sessionStorage.setItem("buttons", JSON.stringify(updatedButtons));
          window.dispatchEvent(new Event("storage"));
          setButtons(updatedButtons);
        } else {
          console.log("Button with this ID already exists!");
        }
      }
    };
    saveResults();
    navigate(`/checking/${jobId}`);
  }, [finished]);

  const updateClaims = (claim) => {
    setClaims((prevClaims) => {
      const newClaims = [...prevClaims];
      const claimArray = Object.values(claim);
      console.log("Claim array:", claimArray);
      Object.entries(claim).forEach(([key, value]) => {
        const i = parseInt(key, 10);
        newClaims[i].verdict = claimArray[0].verdict;
        newClaims[i].justification = claimArray[0].justification;
      });
      return newClaims;
    });
  };

  return (
    <div className="parent">
      <div className="container">
        <div className="contentbox">
          <h1>Content to check</h1>
          {/*<div className="content-wrapper">*/}
          <div className="content">
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button disabled={!isAllDone} startIcon={<EditIcon/>} onClick={() => setEditMode(!isEditMode)}>
              Edit
            </Button>
            </div>
            {!isEditMode?
            showContent(content): <FactCheckInput isEdited={true} content={showContent(content)}/>
          }
          </div>
          {/*</div>*/}
        </div>
        {!firstResponse && <LoadingAnimation isLandingPage={false} />}
        {firstResponse && (
          <div className="checkbox">
            <h1 style={{ textAlign: "center" }}>
              {finished ? "Fact-Check Results" : "Fact-Check in Progress..."}
            </h1>
            <div
              className="content"
              style={{
                gap: "15px",
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              {claims.map((item, index) => (
                <AccordionFact
                  key={item.claim_id}
                  item={item}
                  firstResponse={firstResponse}
                  secondResponse={item.verdict != null}
                  isAllDone={isAllDone}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default FactCheckingPage;
