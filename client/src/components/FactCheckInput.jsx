import React, { useEffect, useRef, useState } from "react";
import "./FactCheckInput.css";
import { FaImage } from "react-icons/fa6";
import { LuSendHorizontal } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { handlePaste, handleFileUpload, handleSendContent } from "../utils/helperFunctions";

const FactCheckInput = ({ style,editorRef, content, isEdited }) => {
  const [isSendDisabled, setIsSendDisabled] = useState(true);
  const navigate = useNavigate();

  // Create a fallback ref if one is not provided
  const effectiveRef = useRef(null);


  // Function to check if content is empty
  const checkContent = () => {
    const textContent = effectiveRef.current.innerText.trim();
    console.log(textContent);
    const hasImages = effectiveRef.current.querySelector("img") !== null;
    setIsSendDisabled(textContent === "" && !hasImages);
  };

  return (
    <div className="input-send"
    style={style}>
      {/* Editable content area */}
      <div
        className="inputform"
        ref={effectiveRef}
        contentEditable
        suppressContentEditableWarning
        onInput={checkContent}
        onPaste={(e) => {
          handlePaste(e, effectiveRef);
          setTimeout(checkContent, 50);
        }}
      >
        {content}
      </div>
      <div className="image-and-send">
        {/* Hidden file input for image upload */}
        <input
          type="file"
          id="file-input"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            handleFileUpload(e, effectiveRef);
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
          onClick={() => handleSendContent(effectiveRef, navigate, isEdited)}
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
  );
};

export default FactCheckInput;
