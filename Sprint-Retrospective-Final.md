# RevMatch Sprint Retrospective

## What Went Well ✅
- **Auth & Registration**: Multi-role signup/login w/ JWT, bcrypt hashing, role redirects ✓
- **Dashboards**: Reviewer sees assigned papers (title/abstract/PDF), Author tracks status ✓
- **Assignment**: Auto-matches expertise to paper keywords ✓
- **Review Submission**: Comments + Accept/Reject → DB save, status → 'reviewed', UI disables post-submit ✓
- Clean React UI w/ loading/error states

## What Went Wrong ❌
- Windows file casing bug (User.js → user.js → git mv fix)
- Multer field mismatch → Unexpected field error
- Mongo duplicate email crash → added check
- CORS → added middleware
- Paper status enum missing 'reviewed' → enum update
- NFR timing unmeasured

## Improvements (2+) 🚀
1. **Performance Monitoring**: Add response timers, verify 2s NFRs
2. **Client Validation**: Form libs (Zod), password strength
3. **Tests**: Jest for auth/review flows

**Score: 8.5/10** - Full workflow complete!

