import React, { useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { SiTicktick, SiTrueup } from "react-icons/si";
import { IoMdCloseCircleOutline } from "react-icons/io";
import { GoQuestion } from "react-icons/go";
import { MdOfflineBolt } from "react-icons/md";
import { FaRegFileAlt } from "react-icons/fa";
import { IoShareSocialSharp } from "react-icons/io5";
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";
import { BiDislike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";
import { downloadReport, linkToShare } from "../services/apiCalls";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from "react-share";
import {
  EmailIcon,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import "./AccordionFact.css";
import { setTitle } from "../utils/helperFunctions";

const AccordionFact = (props) => {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  if (props.secondResponse) {
    console.log(props.item);
  }

  const getIconVerdict = (verdict, color) => {
    if (verdict == "SUPPORTED") {
      return (
        <SiTicktick
          style={{
            height: "20px",
            width: "20px",
            marginRight: "10px",
            color: color,
          }}
        />
      );
    } else if (verdict == "REFUTED") {
      return (
        <IoMdCloseCircleOutline
          style={{
            height: "20px",
            width: "20px",
            marginRight: "10px",
            color: color,
          }}
        />
      );
    } else if (verdict == "NEI") {
      return (
        <GoQuestion
          style={{
            height: "20px",
            width: "20px",
            marginRight: "10px",
            color: color,
          }}
        />
      );
    } else {
      return (
        <MdOfflineBolt
          style={{
            height: "20px",
            width: "20px",
            marginRight: "10px",
            color: color,
          }}
        />
      );
    }
  };

  const setColor = (verdict) => {
    if (verdict == "SUPPORTED") {
      return "#1BC975";
    } else if (verdict == "REFUTED") {
      return "#D00538";
    } else if (verdict == "NEI") {
      return "#646464";
    } else {
      return "#F9BF00";
    }
  };

  // Function to convert Markdown links to clickable links
  const renderJustificationWithLinks = (text, color) => {
    if (!text) return "";

    return text.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      `<a href="$2" target="_blank" rel="noopener noreferrer" style="color: ${color}; text-decoration: underline;">$1</a>`
    );
  };

  return (
    <Accordion
      style={{
        borderRadius: "15px",
        border: `1px solid ${
          props.secondResponse ? setColor(props.item.verdict) : null
        }`,
      }}
      disabled={props.secondResponse ? false : true}
    >
      <AccordionSummary
        style={{
          backgroundColor: props.secondResponse
            ? setColor(props.item.verdict)
            : null,

          borderRadius: "15px",
        }}
        expandIcon={
          <ExpandMoreIcon
            style={
              props.secondResponse ? { color: "white" } : { color: "black" }
            }
          />
        }
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <Typography component="span">
          {!props.secondResponse ? (
            <div
              className="spinner-border text-secondary"
              role="status"
              style={{
                width: "1.2rem",
                height: "1.2rem",
                marginRight: "10px",
              }}
            ></div>
          ) : (
            getIconVerdict(props.item.verdict, "white")
          )}
          <span
            style={
              props.secondResponse ? { color: "white" } : { color: "black" }
            }
          >
            {props.firstResponse && setTitle(props.data)}
          </span>
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography style={{ transition: "text-decoration 0.3s" }}>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "start",
                gap: "20px",
              }}
            >
              <p
                style={{
                  width: "110px",
                  textAlign: "right",
                  minWidth: "110px",
                }}
              >
                Claim:
              </p>{" "}
              <p>{props.item.data[0][1]}</p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "start",
                gap: "20px",
              }}
            >
              <p
                style={{
                  width: "110px",
                  textAlign: "right",
                  minWidth: "110px",
                }}
              >
                Verdict:
              </p>
              <div
                style={{
                  display: "flex",
                  //alignItems: "center",
                  gap: "3px",
                }}
              >
                <span>
                  {getIconVerdict(
                    props.item.verdict,
                    setColor(props.item.verdict)
                  )}
                </span>
                <p style={{ color: setColor(props.item.verdict) }}>
                  {props.item.verdict}
                </p>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "start",
                gap: "20px",
              }}
            >
              {" "}
              <p
                style={{
                  width: "110px",
                  textAlign: "right",
                  minWidth: "110px",
                }}
              >
                Justification:
              </p>{" "}
              <p
                dangerouslySetInnerHTML={{
                  __html: renderJustificationWithLinks(
                    props.item.justification
                      ? props.item.justification[0][1]
                      : "",
                    setColor(props.item.verdict)
                  ),
                }}
              ></p>
            </div>
            <div style={{ display: "inline-block", width: "100%" }}>
              <div
                style={{
                  float: "left",
                  display: "flex",
                  alignItems: "start",
                  gap: "10px",
                }}
              >
                <i
                  style={{
                    height: "20px",
                    width: "20px",
                    color: setColor(props.item.verdict),
                  }}
                >
                  <FaRegFileAlt />
                </i>
                <a
                  onClick={() => {
                    downloadReport(props.item.claim_id);
                  }}
                  className="full-report"
                  style={{
                    color: setColor(props.item.verdict),
                    marginTop: 2,
                  }}
                >
                  Full Report
                </a>
              </div>
              <div
                style={{
                  float: "right",
                  display: "flex",
                  alignItems: "start",
                  gap: "10px",
                }}
              >
                <IoShareSocialSharp
                  style={{
                    height: "20px",
                    width: "20px",
                    textAlign: "right",
                    color: setColor(props.item.verdict),
                    cursor: "pointer",
                  }}
                  onClick={handleOpen}
                />
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <Typography
                      id="modal-modal-title"
                      variant="h6"
                      component="h2"
                      style={{ textAlign: "center" }}
                    >
                      Spread the truth!
                    </Typography>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "10px",
                        marginTop: "10px",
                      }}
                    >
                      <FacebookShareButton
                        url="www.google.com"
                        hashtag="#factcheck"
                      >
                        <FacebookIcon />
                      </FacebookShareButton>
                      <TwitterShareButton
                        url={linkToShare(props.item.claim_id)}
                        title={`Is this Claim really true? "${props.item.data[0][1]}." Let's find out!`}
                      >
                        <TwitterIcon />
                      </TwitterShareButton>
                      <WhatsappShareButton
                        url={linkToShare(props.item.claim_id)}
                        title={`Is this Claim really true? "${props.item.data[0][1]}." Let's find out!`}
                      >
                        <WhatsappIcon />
                      </WhatsappShareButton>
                      <EmailShareButton
                        url={linkToShare(props.item.claim_id)}
                        subject={props.item.data[0][1]}
                        body={`Is this Claim really true? "${props.item.data[0][1]}." Let's find out!`}
                      >
                        <EmailIcon />
                      </EmailShareButton>
                    </div>
                  </Box>
                </Modal>

                {!liked ? (
                  <BiLike
                    style={{
                      height: "20px",
                      width: "20px",
                      textAlign: "right",
                      color: setColor(props.item.verdict),
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setLiked(true);
                      setDisliked(false);
                    }}
                  />
                ) : (
                  <BiSolidLike
                    style={{
                      height: "20px",
                      width: "20px",
                      textAlign: "right",
                      color: setColor(props.item.verdict),
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setLiked(false);
                    }}
                  />
                )}

                {!disliked ? (
                  <BiDislike
                    style={{
                      height: "20px",
                      width: "20px",
                      textAlign: "right",
                      color: setColor(props.item.verdict),
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setDisliked(true);
                      setLiked(false);
                    }}
                  />
                ) : (
                  <BiSolidDislike
                    style={{
                      height: "20px",
                      width: "20px",
                      textAlign: "right",
                      color: setColor(props.item.verdict),
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setDisliked(false);
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export default AccordionFact;
