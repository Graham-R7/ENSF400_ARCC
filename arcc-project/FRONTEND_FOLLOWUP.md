# Frontend follow-up (audit notes — backend done)

Backend items from the same audit are implemented. **Do not assume this file stays in sync**; treat it as a checklist for the React app.

## Quick fixes

| Item | File | Action |
|------|------|--------|
| Upload size | `ResumeUploader` (or equivalent) | Client limit **5 MB → 4 MB** to match `MAX_CONTENT_LENGTH` on the Flask app (`413` + JSON `File exceeds 4 MB limit`). |
| Persist resume | After upload success | Save `resume_id` from the JSON response to **localStorage** and/or **React context** so downstream pages can call analysis. Currently some flows only `console.log` it. |

## `api.js` — wire remaining endpoints

`API_BASE` should stay `process.env.REACT_APP_API_BASE || "http://localhost:5000/api"`.

Add (or equivalent) helpers:

- `runAnalysis(resumeId, jobDescription, userId = null)` → `POST /analysis/run` with `{ resume_id, job_description, user_id }`
- `getAnalysis(analysisId)` → `GET /analysis/<id>`
- `getHistory(userId, limit = 20)` → `GET /analysis/history?user_id=...&limit=...` — response: `{ user_id, count, history[] }` (empty history if `user_id` omitted)
- `startInterview(jobDescription, role = "")` → `POST /interview/start` with `{ job_description, role }`
- `submitAnswer(sessionId, answer)` → `POST /interview/answer` with `{ session_id, answer }`
- `endInterview(sessionId)` → `POST /interview/end` with `{ session_id }`

Optional later: `GET /interview/<session_id>` for refresh/resume; `POST /interview/transcribe` (multipart `audio`) before feeding text into `submitAnswer`.

## Empty / stub components to build

- **`AnalysisResults.js`** — display analysis payload; used by results route/page.
- **`InterviewChat.js`** — text loop: `startInterview` → show `first_question` → `submitAnswer` until `complete`, show `summary`; optional `endInterview` on leave.
- **`JobInput.js`** — reusable JD field if the page needs it.

## Pages

- **`JobDescriptionPage`** — replace dead `handleSubmit` (`console.log`) with **`runAnalysis(resume_id, jd, user_id)`** (IDs from storage/context after login + upload), then **navigate to `/results`** (or wherever results live) with `analysis_id` if the API returns it.

## Auth UX (if applicable)

- **`auth_routes` login** now returns `{ "error": "Invalid credentials" }` (capital **I**) on 401 and `{ "error": "Database error" }` on 500 — parse JSON on **all** non-OK responses so the UI does not assume a body exists only on success.

## Summary table (frontend only)

| File | Status | Action |
|------|--------|--------|
| `api.js` | Partial | Add analysis + interview helpers |
| `ResumeUploader.js` | Mismatch / no ID | 4 MB cap; persist `resume_id` |
| `AnalysisResults.js` | Empty | Build |
| `InterviewChat.js` | Empty | Build |
| `JobInput.js` | Empty | Build |
| `JobDescriptionPage.js` | Dead submit | Wire `runAnalysis` + navigation |
