import React, { useEffect, useState } from "react";
import "./LoadingAnimation.css";
import "bootstrap/dist/css/bootstrap.css";

const LoadingAnimation = (props) => {


  return (
          <div className="loadbox">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                className="spinner-border text-secondary"
                style={{ width: "5rem", height: "5rem", marginBottom: "20px" }}
                role="status"
              ></div>
              {!props.isLandingPage && (<>
              <h2 className="firsttext" style={{ textAlign: "center" }}>Fact-Check in Progress...</h2>
              <p className="secondtext" style={{ textAlign: "center" }}>Identifying claims...</p>
              </>)}
            </div>
          </div>
  );
};
export default LoadingAnimation;
