# Email Setup for RevMatch Server

## Gmail App Password Required

**Why?** Gmail blocks Nodemailer SMTP login with your regular account password for security. You need a 16-character **App Password**.

## Step-by-Step Setup

### 1. Enable 2-Factor Authentication (2FA)
- Go to [Google Account](https://myaccount.google.com/)
- **Security** → **2-Step Verification** → Turn On
- Verify phone number

### 2. Generate App Password
- **Security** → **App passwords** (search if not visible)
- **Select app**: `Mail`, **Select device**: `Other (Custom name)` → `RevMatch Server`
- **Generate** → Copy the **16-character password** (e.g., `abcd efgh ijkl mnop`)

### 3. Update .env File
```env
EMAIL_USER=your.email@gmail.com
EMAIL_PASS=abcdefghijklmnop12  # ← Your 16-char app password (no spaces)
```

### 4. Restart Server
```bash
cd server
npm run dev
# or node index.js
```

### 5. Test
- Make a paper decision (EditorDashboard)
- Check logs: `✅ Decision email sent`

## Troubleshooting
- **Still "Missing credentials for "PLAIN"**: Wrong password in .env. Regenerate App Password.
- **"535-5.7.8 Username and Password not accepted"**: Use App Password, not account password.
- **No .env**: Create `.env` in server/ with above vars.
- Logs show `❌ EMAIL_USER or EMAIL_PASS missing` → Fix .env.

## Alternative: Use Environment Variables
Set in VSCode terminal:
```bash
set EMAIL_USER=your.email@gmail.com
set EMAIL_PASS=abcdefghijklmnop12
```

**Note**: Never commit .env to git (.gitignore has it).

---

*Your EMAIL_PASS is the 16-char App Password from step 2, NOT your Gmail login password.*

