import React, { useEffect, useRef, useState } from "react";
import "./LandingPage.css";
import { FaImage } from "react-icons/fa6";
import { LuSendHorizontal } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { postData } from "../services/apiCalls";
import { handlePaste, handleFileUpload, parseContent } from "../utils/helperFunctions";

const LandingPage = () => {
  const editorRef = useRef(null);
  const [isSendDisabled, setIsSendDisabled] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    editorRef.current.focus();
  }, []);

  // Function to check if content is empty
  const checkContent = () => {
    const textContent = editorRef.current.innerText.trim();
    const hasImages = editorRef.current.querySelector("img") !== null;
    setIsSendDisabled(textContent === "" && !hasImages);
  };

  // Function to handle sending content
  const handleSendContent = async () => {
    const parsedContent = await parseContent(editorRef);
    if (parsedContent) {
      const response = await postData(parsedContent);
      if (response) {
        navigate("/checking", {
          state: { data: parsedContent, jobId: response },
        });
      }
    }
  };

  return (
    <div className="landing-parent">
      <div className="landing-container">
        <div style={{ width: "100%", height: "100%" }}>
          <h1 style={{ textAlign: "center" }}>FACT-CHECKER-CREATIVE-NAME</h1>
          <h3 style={{ textAlign: "center", marginTop: "30px" }}>
            Give me a claim and I will check it for you!
          </h3>
          <div className="input-send">
            {/* Editable content area */}
            <div
              className="inputform"
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={checkContent}
              onPaste={(e) => {
                handlePaste(e, editorRef);
                setTimeout(checkContent, 50); 
              }}
            ></div>
            <div className="image-and-send">
              {/* Hidden file input for image upload */}
              <input
                type="file"
                id="file-input"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  handleFileUpload(e, editorRef);
                  setTimeout(checkContent, 50); 
                }}
              />
              {/* Image upload icon */}
              <button
                className="image-button"
                onClick={() => document.getElementById("file-input").click()}
              >
                <FaImage
                  className="icons"
                  style={{
                    width: "100%",
                    height: "100%",
                    stroke: "none",
                    border: "none",
                  }}
                />
              </button>
              {/* Send button */}
              <button
                className="send-button"
                onClick={handleSendContent}
                disabled={isSendDisabled} 
                style={{
                  cursor: isSendDisabled ? "not-allowed" : "pointer",
                  opacity: isSendDisabled ? 0.5 : 1, 
                  border: "none",
                  background: "none",
                }}
              >
                <LuSendHorizontal
                  className="icons"
                  style={{
                    width: "30px",
                    height: "30px",
                  }}
                />
              </button>
            </div>
          </div>
        </div>
        <div
          style={{
            width: "100%",
            height: "100%",
            marginTop: "10px",
            marginRight: "20px",
          }}
        >
          <h6 style={{ textAlign: "right", color: "#9D9D9D" }}>
            You can even upload photos!
          </h6>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
