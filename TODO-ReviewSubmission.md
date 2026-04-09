en# Review Submission Feature TODO

**Information Gathered:**
- Assignment model has `review: String`, `rating: Number` fields already
- No existing submit-review API endpoint
- AssignedPapers.jsx fetches assignments via /api/reviewer/dashboard (includes assignmentId needed)

**Plan:**
1. [x] Create `server/routes/reviewer.js` PUT `/submit-review/:assignmentId` endpoint
2. Update AssignedPapers.jsx paper cards: add form (comments textarea, Accept/Reject select, Submit)
3. On submit → update assignment (status='completed', review, decision='accept/reject')
4. Show confirmation, disable submitted reviews

**Dependent Files:**
- server/routes/reviewer.js (add endpoint)
- server/models/Assignment.js (add decision field if needed)
- client/src/pages/AssignedPapers.jsx (add review form per paper)

**Followup:** [x] Test submission, verify DB update, ≤2s NFR

**COMPLETE** 🎉 Review submission fully implemented!
