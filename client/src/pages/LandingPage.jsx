import React, {useRef} from "react";
import "./LandingPage.css";


import FactCheckInput from "../components/FactCheckInput";

const LandingPage = () => {
  const editorRef = useRef(null);


  return (
    <div className="landing-parent">
      <div className="landing-container">
        <div style={{ width: "100%", height: "100%" }}>
          <h1 style={{ textAlign: "center" }}>FACT-CHECKER-CREATIVE-NAME</h1>
          <h3 style={{ textAlign: "center", marginTop: "30px" }}>
            Give me a claim and I will check it for you!
          </h3>
          <FactCheckInput isEdited={false} editorRef={editorRef} content="" />
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
