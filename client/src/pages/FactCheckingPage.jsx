import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.css";
import {
  useAsyncError,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import LoadingAnimation from "../components/LoadingAnimation";
import AccordionFact from "../components/AccordionFact";
import "./FactCheckingPage.css";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import { handleSave, getResults } from "../services/apiCalls";
import { showContent, updateClaimsHelper } from "../utils/helperFunctions";
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
  const [isHovered, setIsHovered] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [isAllDone, setAllDone] = useState(false);
  const [buttons, setButtons] = useState([]);
  const [firstResponse, setFirstResponse] = useState(false);
  const [secondResponse, setSecondResponse] = useState(false);
  const [finished, setFinished] = useState(false);
  const location = useLocation();
  const { id } = useParams();
  //this id is used only if a button is
  const [jobId, setJobId] = useState(location.state?.jobId || "");
  const [content, setContent] = useState(location.state?.data?.content || []);
  console.log(content);
  const [claims, setClaims] = useState([]);
  const [status, setStatus] = useState("");
  const [state, setState] = useState("disconnected");
  console.log(`these are the claims : ${JSON.stringify(claims, null, 2)}`);
  useEffect(() => {
    if (
      claims.length > 0 &&
      claims.every(
        (claim) => claim.data && claim.data.length > 0 && claim.data[0] !== null
      )
    ) {
      setFirstResponse(true);
    }
  }, [claims]);
  useEffect(() => {
    if (status === "DONE") {
      setFinished(true);
      setAllDone(true);
    }
  }, [status]);
  // useEffect(() => {
  //   if (jobId) {
  //     sessionStorage.setItem("jobId", jobId);
  //   }
  //   if (content.length > 0) {
  //     sessionStorage.setItem("content", JSON.stringify(content));
  //   }
  //   if (claims.length > 0) {
  //     sessionStorage.setItem("claims", JSON.stringify(claims));
  //   }
  // }, [jobId, content, claims]);
  // useEffect(() => {
  //   const storedJobId = sessionStorage.getItem("jobId");
  //   const storedContent = sessionStorage.getItem("content");
  //   const storedClaims = sessionStorage.getItem("claims");
  //   if (!jobId && storedJobId) {
  //     setJobId(storedJobId);
  //   }
  //   if (!content.length && storedContent) {
  //     setContent(JSON.parse(storedContent));
  //   }
  //   if (!claims.length && storedClaims) {
  //     setClaims(JSON.parse(storedClaims));
  //   }
  // }, []);
  const updateClaims = (newClaimsData) => {
    setClaims((prevClaims) => updateClaimsHelper(prevClaims, newClaimsData));
  };
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

      const connectWebSocket = () => {
        socket.onopen = () => {
          setState("connected");
          console.log("WebSocket connected");
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            console.log("Socket data:", data);

            if (data.claims) {
              updateClaims(data.claims);
            }
            if (data.job_info.status) {
              setStatus(data.job_info.status);
            }
            // if (data?.job_info?.status_message) {
            //   const status = data.job_info.status;
            //   if (status === "Extracting claims.") {
            //     setState("extractingClaims");
            //   }
            //   if (status === "DONE" && Object.keys(data).length > 2) {
            //     setClaims(Object.values(data.claims));
            //     setFirstResponse(true);
            //     setSecondResponse(true);
            //     setAllDone(true);
            //   }
            //   if (
            //     (status === "RUNNING" && data?.claims) ||
            //     (status === "PENDING" && state !== "extractingClaims")
            //   ) {
            //     setClaims(Object.values(data.claims));
            //     setState("extreactedClaims");
            //     setFirstResponse(true);
            //   }
            // }

            // if (data?.claims && state === "extractingClaims") {
            //   setState("extreactedClaims");
            //   setClaims((prevClaims) => [
            //     ...prevClaims,
            //     ...Object.values(data.claims),
            //   ]);
            //   setFirstResponse(true);
            // }

            // if (data?.claims && state === "extreactedClaims") {
            //   updateClaims(data.claims);
            // }
          } catch (error) {
            setState("error");
            console.error("WebSocket Message Error:", error);
          }
        };

        socket.onclose = (event) => {
          console.log("WebSocket disconnected", event.code, event.reason);
          setState("disconnected");
        };
        socket.onerror = (error) => {
          console.error("WebSocket Error:", error);
          socket.close(); // Close the socket to trigger onclose event
        };
      };

      connectWebSocket();

      return () => {
        socket.close();
      };
    }
  }, [jobId, id]);
  useEffect(() => {
    const saveResults = async () => {
      if (finished && jobId && content && claims) {
        await handleSave(jobId, content, claims);
        const storedButtons = JSON.parse(localStorage.getItem("buttons")) || [];
        const exists = storedButtons.some((button) => button.id === jobId);
        if (!exists) {
          const newButton = { id: jobId, title: claims[0].data[0][1] };
          const updatedButtons = [...storedButtons, newButton];
          localStorage.setItem("buttons", JSON.stringify(updatedButtons));
          window.dispatchEvent(new Event("storage"));
          setButtons(updatedButtons);
        } else {
          console.log("Button with this ID already exists!");
        }
      }
    };
    saveResults();
  }, [finished]);

  // const updateClaims = (claim) => {
  //   setClaims((prevClaims) => {
  //     const newClaims = [...prevClaims];
  //     const claimArray = Object.values(claim);
  //     console.log("Claim array:", claimArray);
  //     Object.entries(claim).forEach(([key, value]) => {
  //       const i = parseInt(key, 10);
  //       newClaims[i].verdict = claimArray[0].verdict;
  //       newClaims[i].justification = claimArray[0].justification;
  //     });
  //     return newClaims;
  //   });
  // };
  if (!content || content.length === 0) {
    return null;
  }
  return (
    <div className="parent">
      <div className="container">
        <div className="contentbox">
          <h1>Content to check</h1>
          {/*<div className="content-wrapper">*/}
          <div
            className="content"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              {(isHovered || isEditMode) && isAllDone && (
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => setEditMode(!isEditMode)}
                >
                  Edit
                </Button>
              )}
            </div>
            {!isEditMode ? (
              showContent(content)
            ) : (
              <FactCheckInput style = {{marginTop : "5px"}}isEdited={true} content={showContent(content)} />
            )}
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
                  data={item.data[0][1]}
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
