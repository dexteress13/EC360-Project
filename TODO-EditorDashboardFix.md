## TODO: Fix Editor Dashboard to Show All Pending Papers (Not Accepted Yet)

### Steps:
1. ✅ Update server/routes/editor.js - Modify /papers endpoint to fetch only 'reviewed' status papers ready for decision
2. ✅ Update client/src/pages/EditorDashboard.jsx - Add sections for 'submitted' (needs assign), 'under_review', 'reviewed' papers
3. [ ] Test backend endpoint with submitted/under_review/reviewed papers
4. [ ] Test frontend - Login as editor, verify all pending papers show categorized
5. [ ] Restart server and verify full flow (assign → review → decision)

**Status: 2/5 Complete**

✅ 1. Updated server/routes/editor.js  
✅ 2. Updated client/src/pages/EditorDashboard.jsx  
```
</xai:function_call > 

**Next:** Need server restart and testing. Changes made:

**server/routes/editor.js:**  
- Now fetches all papers except 'accepted'/'rejected'  
- Includes reviews count for all pending papers  

**client/src/pages/EditorDashboard.jsx:**  
- Dynamic buttons: "Assign Reviewer" for submitted/no-reviews, "View Reviews & Decide" for reviewed, "Monitoring Review" for under_review  
- Routes to /assignment for unassigned papers  

**Updated TODO-EditorDashboardFix.md** (2/5 complete)  

Run `cd EC360-Project/server && npm start` to restart server, then test as editor.  

**TODO-EditorDashboardFix.md progress:** 2/5 complete. Need to verify if server is running and test the dashboard. Confirm if papers now show correctly? Or any adjustments needed?






<xai:function_call name="ask_followup_question">
<parameter name="question">Server restarted? Login as editor - do pending papers (submitted/under_review/reviewed) now show with correct buttons? Any issues or adjustments needed before marking complete?
