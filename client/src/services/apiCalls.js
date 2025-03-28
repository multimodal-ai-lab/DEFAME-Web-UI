import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

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
export const deleteResults = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/results/${id}`);
  } catch (e) {
    throw error.response?.data?.message || "Failed to delete data";
  }
};
