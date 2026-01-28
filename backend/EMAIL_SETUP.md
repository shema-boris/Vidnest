# Email Configuration for Password Reset

## Required Environment Variables

Add these variables to your `backend/.env` file:

```env
# Email Configuration (Required for Password Reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Email Sender Info
FROM_NAME=VidNest
FROM_EMAIL=noreply@vidnest.com

# Frontend URL (for reset link)
FRONTEND_URL=http://localhost:5173
```

## Email Service Options

### Option 1: Gmail (Recommended for Development)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account Settings → Security
   - Under "2-Step Verification", find "App passwords"
   - Generate a new app password for "Mail"
   - Use this password as `SMTP_PASS`

**Configuration:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-16-char-app-password
```

### Option 2: SendGrid (Recommended for Production)

1. Sign up at [SendGrid](https://sendgrid.com/)
2. Create an API key
3. Use SendGrid SMTP credentials

**Configuration:**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
```

### Option 3: Mailgun

1. Sign up at [Mailgun](https://www.mailgun.com/)
2. Get SMTP credentials from dashboard

**Configuration:**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=your-mailgun-username
SMTP_PASS=your-mailgun-password
```

### Option 4: Ethereal Email (Testing Only)

For development/testing without real emails:

1. Go to [Ethereal Email](https://ethereal.email/)
2. Click "Create Ethereal Account"
3. Use the provided credentials

**Configuration:**
```env
SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=generated-username@ethereal.email
SMTP_PASS=generated-password
```

**Note:** Ethereal emails are fake and only viewable via the preview URL logged in console.

## Testing the Setup

1. Start your backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Test forgot password endpoint:
   ```bash
   curl -X POST http://localhost:5000/api/auth/forgot-password \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}'
   ```

3. Check console for email preview URL (if using Ethereal)
4. Check your email inbox (if using real SMTP)

## Password Reset Flow

1. **User requests reset**: `POST /api/auth/forgot-password` with email
2. **Backend generates token**: 20-byte random token, hashed and stored in DB
3. **Email sent**: Contains reset link with unhashed token
4. **User clicks link**: Opens `/reset-password?token=...` in frontend
5. **User sets new password**: `POST /api/auth/reset-password` with token + password
6. **Backend verifies token**: Checks hash and expiry (10 minutes)
7. **Password updated**: User is automatically logged in

## Security Features

- ✅ Tokens are hashed before storage (SHA-256)
- ✅ Tokens expire after 10 minutes
- ✅ One-time use (token deleted after successful reset)
- ✅ No user enumeration (same response for valid/invalid emails)
- ✅ Automatic login after successful reset
- ✅ httpOnly cookies for session management

## Troubleshooting

### Email not sending

1. **Check SMTP credentials**: Verify username/password are correct
2. **Check firewall**: Ensure port 587 is not blocked
3. **Check spam folder**: Reset emails might be filtered
4. **Check console logs**: Look for detailed error messages

### "Invalid or expired token"

1. **Token expired**: Tokens are only valid for 10 minutes
2. **Token already used**: Request a new password reset
3. **Wrong token**: Ensure you're using the latest reset email

### Gmail "Less secure app" error

- Gmail no longer supports "less secure apps"
- **Solution**: Use App Passwords (requires 2FA enabled)

## Production Recommendations

1. **Use a dedicated email service** (SendGrid, Mailgun, AWS SES)
2. **Set up SPF/DKIM records** for better deliverability
3. **Use a custom domain** for FROM_EMAIL
4. **Monitor email delivery rates**
5. **Set up email templates** with your branding
6. **Add rate limiting** to prevent abuse

## Environment Variables Summary

```env
# Required
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FRONTEND_URL=http://localhost:5173

# Optional (with defaults)
FROM_NAME=VidNest
FROM_EMAIL=noreply@vidnest.com
NODE_ENV=development
```

## Next Steps

1. Add email variables to your `.env` file
2. Restart your backend server
3. Test the forgot password flow
4. Verify emails are being sent
5. Test the complete password reset flow

---

**Need help?** Check the backend console logs for detailed error messages.
