import axios from "axios";

const API_BASE_URL = "http://localhost:3000";

export const postData = async (parsedContent) => {
  const dataToSend = parsedContent;
  try {
    const res = await axios.post(`${API_BASE_URL}/verify`, dataToSend, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: false,
    });
    return res.data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
};

export const downloadReport = async (claim_id) => {
  const url = `${API_BASE_URL}/results/${claim_id}/report.pdf`;

  try {
    const response = await axios.get(url, {
      responseType: "blob",
    });

    // Create a link and trigger download
    const blob = new Blob([response.data], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `report_${claim_id}.pdf`;
    link.click();
  } catch (error) {
    console.error("Error downloading report:", error);
  }
};
export const linkToShare = (claim_id) => {
  return `${API_BASE_URL}/results/${claim_id}/report.pdf`;
};
export const handleSave = async (job_id, content, claims) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/results/save`, {
      jobId: job_id,
      content: content,
      claims: claims,
    });
  } catch (error) {
    if (error.response && error.response.status === 409) {
      return null; 
    } else {
      alert("Failed to send data.");
    }
  }
};
export const getResults = async (id) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/results/${id}`);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch data";
  }
};
export const getContentByJobId = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/get-claim/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching claim:",
      error.response?.data || error.message
    );
    return null;
  }
};
export const saveContent = async (jobId, content) => {
  try {
    console.log("Sending saveContent request...");
    const response = await axios.post(`${API_BASE_URL}/save-content/${jobId}`, {
      content,
    });

    console.log("saveContent response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error saving content:",
      error.response?.data || error.message
    );
    return null;
  }
};
