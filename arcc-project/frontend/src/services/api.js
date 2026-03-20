const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";

export async function uploadResume(file) {

  const formData = new FormData();
  formData.append("resume", file);

  const response = await fetch(`${API_BASE}/resume/upload`, {
    method: "POST",
    body: formData
  });

  return response.json();
}