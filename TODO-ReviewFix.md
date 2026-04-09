# Review Submission Fix TODO

**Issue:** AssignedPapers shows empty (no assignmentId in API response, broken map)

**Plan:**
1. Fix `/api/reviewer/dashboard` to return `assignmentId` for each paper
2. Add per-paper state for review form (local to each paper card)
3. Add review form below each paper: "Submit Review" toggle → comments + Accept/Reject
4. Submit uses `paper.assignmentId`
5. Keep PDF view intact

**Current Status:**
- Backend endpoint ready
- Model has `review` field
- Need API fix + frontend form per paper
