import React, { useEffect, useRef, useState } from "react";
import "./LandingPage.css";
import { FaImage } from "react-icons/fa6";
import { LuSendHorizontal } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { postData, saveContent } from "../services/apiCalls";
import {
  handlePaste,
  handleFileUpload,
  parseContent,
} from "../utils/helperFunctions";
import { useId } from "react";

const LandingPage = () => {
  // const [isFocused, setIsFocused] = useState(false);
  const editorRef = useRef(null);
  // const handleFocus = () => {
  //   setIsFocused(true);
  // };
  useEffect(() => {
    editorRef.current.focus();
  }, []);
  const navigate = useNavigate();
  // Function to handle sending content
  const handleSendContent = async () => {
    const parsedContent = await parseContent(editorRef);
    if (parsedContent) {
      const response = await postData(parsedContent);
      if (response) {
        navigate("/checking", {
          state: { data: parsedContent , jobId : response },
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
              onPaste={(e) => {
                handlePaste(e, editorRef);
              }}
              // onFocus={handleFocus}
            >
              {/* <span style={{ color: "#A6A6A6", fontSize: "15px" }}>
                {!isFocused ? "Insert claim here ..." : ""}
              </span> */}
            </div>
            <div className="image-and-send">
              {/* Hidden file input for image upload */}
              <input
                type="file"
                id="file-input"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleFileUpload(e, editorRef)}
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
              <LuSendHorizontal
                className="icons"
                onClick={handleSendContent}
                style={{
                  width: "30px",
                  height: "30px",
                  cursor: "pointer",
                }}
              />
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
