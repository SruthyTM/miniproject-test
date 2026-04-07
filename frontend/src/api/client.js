const BASE_URL = "http://127.0.0.1:8001";

async function request(path, method = "GET", body, token) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.detail || "Request failed");
  }
  return data;
}

export const api = {
  getChallengeTime: () => request("/quiz/challenge-time", "GET"),
  register: (payload) => request("/auth/register", "POST", payload),
  verifyEmail: (payload) => request("/auth/verify-email", "POST", payload),
  login: (payload) => request("/auth/login", "POST", payload),
  eligibilityQuestions: (token) => request("/eligibility/questions", "GET", null, token),
  submitEligibility: (answers, token) =>
    request("/eligibility/submit", "POST", { answers }, token),
  startQuiz: (token) => request("/quiz/start", "POST", {}, token),
  submitAnswer: (sessionId, answerIndex, token) =>
    request(`/quiz/${sessionId}/answer`, "POST", { answer_index: answerIndex }, token),
  remainingSeconds: (sessionId, token) =>
    request(`/quiz/${sessionId}/remaining-seconds`, "GET", null, token),
  result: (sessionId, token) => request(`/quiz/${sessionId}/result`, "GET", null, token),
};
