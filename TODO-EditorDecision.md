
User Story:
As an Editor, I want to view reviews and make a final decision so that papers can be accepted or rejected.

## Acceptance Criteria:
- [ ] Editor sees all reviews
- [ ] Editor selects final decision 
- [ ] Status updates to Accepted/Rejected
- [ ] Author is notified (Status->Accepted/Rejected)

FR: System shall allow editor to Accept/Reject paper after reviews.
NFR: Decision update ≤ 2 seconds.

## Detailed Steps:
1. [ ] Normalize roles to lowercase in server/middleware/auth.js
2. [ ] Fix role checks in server/routes/editor.js and paper.js (editor only or fix casing)
3. [ ] Update client/src/pages/AdminPaperDetails.jsx - dynamic back link (/editor-dashboard for editor), discard admin-only restriction if any
4. [ ] Restart server
5. [ ] Full end-to-end test
6. [ ] Update TODO.md and TODO-EditorDashboardFix.md to complete

Current Issue: "admin only" error when editor opens decision page - likely role casing or back link loop.

