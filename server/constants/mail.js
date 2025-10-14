const OTP_MAIL = (otp) => {
  return `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>OTP Verification</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    background-color: #f8fafc;
                    line-height: 1.5;
                    color: #334155;
                    padding: 20px 10px;
                    min-height: 100vh;
                }

                .email-container {
                    max-width: 480px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    width: 100%;
                }

                .email-header {
                    padding: 32px 24px 24px;
                    text-align: center;
                    background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
                }

                .logo {
                    width: 48px;
                    height: 48px;
                    background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
                    border-radius: 12px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    margin: 0 auto 16px;
                    box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
                }

                .brand-name {
                    font-size: 16px;
                    font-weight: 600;
                    color: #1e293b;
                    margin-bottom: 20px;
                    line-height: 1.2;
                }

                .verification-emoji {
                    font-size: 36px;
                    margin-bottom: 12px;
                    line-height: 1;
                }

                .title {
                    font-size: 24px;
                    font-weight: 700;
                    color: #0f172a;
                    margin-bottom: 6px;
                    line-height: 1.2;
                    word-wrap: break-word;
                }

                .subtitle {
                    font-size: 14px;
                    color: #64748b;
                    font-weight: 500;
                    line-height: 1.3;
                }

                .email-body {
                    padding: 0 24px 32px;
                    text-align: center;
                }

                .description {
                    font-size: 14px;
                    color: #475569;
                    margin-bottom: 24px;
                    line-height: 1.5;
                    text-align: center;
                }

                .otp-section {
                    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                    border: 2px solid #bae6fd;
                    border-radius: 12px;
                    padding: 20px 16px;
                    margin: 24px 0;
                    position: relative;
                    overflow: hidden;
                }

                .otp-section::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, #0ea5e9 0%, #0284c7 100%);
                }

                .otp-label {
                    font-size: 11px;
                    color: #0369a1;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    margin-bottom: 8px;
                    line-height: 1.2;
                }

                .otp-code {
                    font-size: 28px;
                    font-weight: 700;
                    color: #0f172a;
                    letter-spacing: 0.2em;
                    font-family: ui-monospace, 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace;
                    margin: 8px 0;
                    line-height: 1.2;
                    word-spacing: 0.1em;
                }

                .otp-note {
                    font-size: 11px;
                    color: #0369a1;
                    font-style: italic;
                    line-height: 1.3;
                }

                .instructions-section {
                    background-color: #f0f9ff;
                    border: 1px solid #bae6fd;
                    border-radius: 8px;
                    padding: 16px;
                    margin: 24px 0;
                    text-align: center;
                }

                .instructions-title {
                    font-size: 13px;
                    font-weight: 600;
                    color: #0c4a6e;
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    justify-content: center;
                    line-height: 1.3;
                }

                .instructions-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    text-align: left;
                }

                .instructions-list li {
                    font-size: 12px;
                    color: #0369a1;
                    margin-bottom: 4px;
                    padding-left: 16px;
                    position: relative;
                    line-height: 1.4;
                }

                .instructions-list li:last-child {
                    margin-bottom: 0;
                }

                .instructions-list li::before {
                    content: '•';
                    position: absolute;
                    left: 0;
                    color: #0ea5e9;
                    font-weight: bold;
                }

                .warning-section {
                    background-color: #fef3c7;
                    border: 1px solid #fde68a;
                    border-radius: 8px;
                    padding: 16px;
                    margin: 24px 0;
                    text-align: center;
                }

                .warning-title {
                    font-size: 13px;
                    font-weight: 600;
                    color: #92400e;
                    margin-bottom: 6px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    justify-content: center;
                    line-height: 1.3;
                }

                .warning-text {
                    font-size: 12px;
                    color: #92400e;
                    line-height: 1.4;
                }

                .footer {
                    padding: 20px 24px;
                    text-align: center;
                    background-color: #f8fafc;
                    border-top: 1px solid #f1f5f9;
                }

                .footer-text {
                    font-size: 11px;
                    color: #94a3b8;
                    margin-bottom: 6px;
                    line-height: 1.3;
                }

                .footer-links {
                    font-size: 11px;
                    line-height: 1.3;
                }

                .footer-link {
                    color: #0ea5e9;
                    text-decoration: none;
                    margin: 0 6px;
                    display: inline-block;
                }

                /* Enhanced Mobile Responsiveness */
                @media screen and (max-width: 480px) {
                    body {
                        padding: 15px 8px;
                    }

                    .email-container {
                        border-radius: 8px;
                    }

                    .email-header {
                        padding: 24px 16px 20px;
                    }

                    .logo {
                        width: 40px;
                        height: 40px;
                        font-size: 18px;
                        margin-bottom: 12px;
                    }

                    .brand-name {
                        font-size: 15px;
                        margin-bottom: 16px;
                    }

                    .verification-emoji {
                        font-size: 32px;
                        margin-bottom: 10px;
                    }

                    .title {
                        font-size: 20px;
                        margin-bottom: 4px;
                    }

                    .subtitle {
                        font-size: 13px;
                    }

                    .email-body {
                        padding: 0 16px 24px;
                    }

                    .description {
                        font-size: 13px;
                        margin-bottom: 20px;
                    }

                    .otp-section {
                        padding: 16px 12px;
                        margin: 20px 0;
                    }

                    .otp-label {
                        font-size: 10px;
                        margin-bottom: 6px;
                    }

                    .otp-code {
                        font-size: 24px;
                        letter-spacing: 0.15em;
                        margin: 6px 0;
                    }

                    .otp-note {
                        font-size: 10px;
                    }

                    .instructions-section {
                        padding: 12px;
                        margin: 20px 0;
                    }

                    .instructions-title {
                        font-size: 12px;
                        margin-bottom: 6px;
                        gap: 4px;
                    }

                    .instructions-list {
                        text-align: center;
                    }

                    .instructions-list li {
                        font-size: 11px;
                        padding-left: 12px;
                        margin-bottom: 3px;
                    }

                    .warning-section {
                        padding: 12px;
                        margin: 20px 0;
                    }

                    .warning-title {
                        font-size: 12px;
                        margin-bottom: 4px;
                        gap: 4px;
                    }

                    .warning-text {
                        font-size: 11px;
                    }

                    .footer {
                        padding: 16px;
                    }

                    .footer-text {
                        font-size: 10px;
                        margin-bottom: 4px;
                    }

                    .footer-links {
                        font-size: 10px;
                    }

                    .footer-link {
                        margin: 0 4px;
                        padding: 2px 0;
                    }
                }

                @media screen and (max-width: 360px) {
                    body {
                        padding: 10px 5px;
                    }

                    .email-header {
                        padding: 20px 12px 16px;
                    }

                    .email-body {
                        padding: 0 12px 20px;
                    }

                    .title {
                        font-size: 18px;
                    }

                    .description {
                        font-size: 12px;
                    }

                    .otp-section {
                        padding: 12px 8px;
                    }

                    .otp-code {
                        font-size: 20px;
                        letter-spacing: 0.1em;
                    }

                    .instructions-section {
                        padding: 10px 8px;
                    }

                    .instructions-list li {
                        font-size: 10px;
                        padding-left: 10px;
                    }

                    .warning-section {
                        padding: 10px;
                    }

                    .footer {
                        padding: 12px;
                    }
                }

                /* Dark mode support */
                @media (prefers-color-scheme: dark) {
                    body {
                        background-color: #0f172a;
                    }

                    .email-container {
                        background-color: #1e293b;
                    }

                    .email-header {
                        background: linear-gradient(135deg, #0c4a6e 0%, #075985 100%);
                    }

                    .brand-name {
                        color: #e2e8f0;
                    }

                    .title {
                        color: #f1f5f9;
                    }

                    .subtitle,
                    .description {
                        color: #94a3b8;
                    }

                    .otp-section {
                        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                        border-color: #334155;
                    }

                    .otp-label,
                    .otp-note {
                        color: #7dd3fc;
                    }

                    .otp-code {
                        color: #f1f5f9;
                    }

                    .instructions-section {
                        background-color: #0f172a;
                        border-color: #334155;
                    }

                    .instructions-title {
                        color: #e2e8f0;
                    }

                    .instructions-list li {
                        color: #94a3b8;
                    }

                    .footer {
                        background-color: #0f172a;
                        border-color: #334155;
                    }

                    .footer-text {
                        color: #64748b;
                    }
                }
            </style>
        </head>

        <body>
            <div class="email-container">
                <!-- Header -->
                <div class="email-header">
                    <div class="logo">💬</div>
                    <div class="brand-name">Viby Chat</div>
                    <div class="verification-emoji">🔐</div>
                    <h1 class="title">Email Verification</h1>
                    <p class="subtitle">Complete your account setup</p>
                </div>

                <!-- Main Content -->
                <div class="email-body">
                    <p class="description" style="margin-top: 1rem;">
                        We've sent you a verification code to confirm your email address. Enter the code below to complete your
                        account setup.
                    </p>

                    <!-- OTP Display -->
                    <div class="otp-section">
                        <div class="otp-label">Your Verification Code</div>
                        <div class="otp-code">${otp}</div>
                        <div class="otp-note">Enter this code in the verification form</div>
                    </div>

                    <!-- Instructions -->
                    <div class="instructions-section">
                        <h4 class="instructions-title">
                            📋 Quick Instructions
                        </h4>
                        <ul class="instructions-list">
                            <li>Copy the 6-digit code above</li>
                            <li>Return to the verification page</li>
                            <li>Paste or type the code to continue</li>
                        </ul>
                    </div>

                    <!-- Warning -->
                    <div class="warning-section">
                        <h4 class="warning-title">
                            ⏰ Important Notice
                        </h4>
                        <p class="warning-text">
                            This verification code expires in 10 minutes for your security. If you didn't attempt to sign up,
                            please ignore this email.
                        </p>
                    </div>
                </div>

                <!-- Footer -->
                <div class="footer">
                    <p class="footer-text">© 2025 Viby Chat</p>
                    <div class="footer-links">
                        <a href="#" class="footer-link">Help Center</a>
                        <a href="#" class="footer-link">Privacy Policy</a>
                        <a href="#" class="footer-link">Unsubscribe</a>
                    </div>
                </div>
            </div>
        </body>

        </html>
        
        `;
};

const RESET_PASSWORD_LINK_MAIL = (resetLink) => {
  return `
       <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    background-color: #f8fafc;
                    line-height: 1.5;
                    color: #334155;
                    padding: 40px 20px;
                }

                .email-container {
                    max-width: 480px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }

                .email-header {
                    padding: 48px 32px 32px;
                    text-align: center;
                    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
                }

                .logo {
                    width: 56px;
                    height: 56px;
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                    border-radius: 16px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    margin-bottom: 24px;
                    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
                }

                .brand-name {
                    font-size: 18px;
                    font-weight: 600;
                    color: #1e293b;
                    margin-bottom: 32px;
                }

                .security-emoji {
                    font-size: 48px;
                    margin-bottom: 16px;
                }

                .title {
                    font-size: 28px;
                    font-weight: 700;
                    color: #0f172a;
                    margin-bottom: 8px;
                    line-height: 1.2;
                }

                .subtitle {
                    font-size: 16px;
                    color: #64748b;
                    font-weight: 500;
                }

                .email-body {
                    padding: 0 32px 48px;
                    text-align: center;
                }

                .description {
                    font-size: 16px;
                    color: #475569;
                    margin-bottom: 32px;
                    line-height: 1.6;
                }

                .cta-button {
                    display: inline-block;
                    background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
                    color: #ffffff;
                    text-decoration: none;
                    font-size: 16px;
                    font-weight: 600;
                    padding: 16px 32px;
                    border-radius: 8px;
                    margin-bottom: 32px;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
                }

                .cta-button:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
                }

                .alternative-section {
                    background-color: #f8fafc;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 32px 0;
                    text-align: left;
                }

                .alternative-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #1e293b;
                    margin-bottom: 12px;
                }

                .alternative-link {
                    font-size: 13px;
                    color: #f59e0b;
                    word-break: break-all;
                    text-decoration: none;
                    background-color: #ffffff;
                    padding: 12px;
                    border-radius: 6px;
                    border: 1px solid #e2e8f0;
                    display: block;
                    transition: border-color 0.2s ease;
                }

                .alternative-link:hover {
                    border-color: #f59e0b;
                }

                .warning-section {
                    background-color: #fef2f2;
                    border: 1px solid #fecaca;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 32px 0;
                }

                .warning-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #991b1b;
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    justify-content: center;
                }

                .warning-text {
                    font-size: 13px;
                    color: #dc2626;
                    line-height: 1.5;
                }

                .footer {
                    padding: 24px 32px;
                    text-align: center;
                    background-color: #f8fafc;
                    border-top: 1px solid #f1f5f9;
                }

                .footer-text {
                    font-size: 12px;
                    color: #94a3b8;
                    margin-bottom: 8px;
                }

                .footer-links {
                    font-size: 12px;
                }

                .footer-link {
                    color: #f59e0b;
                    text-decoration: none;
                    margin: 0 8px;
                }

                /* Mobile Responsiveness */
                @media screen and (max-width: 600px) {
                    body {
                        padding: 20px 16px;
                    }

                    .email-container {
                        border-radius: 8px;
                    }

                    .email-header {
                        padding: 32px 24px 24px;
                    }

                    .logo {
                        width: 48px;
                        height: 48px;
                        font-size: 20px;
                        margin-bottom: 20px;
                    }

                    .brand-name {
                        font-size: 16px;
                        margin-bottom: 24px;
                    }

                    .security-emoji {
                        font-size: 40px;
                        margin-bottom: 12px;
                    }

                    .title {
                        font-size: 24px;
                    }

                    .subtitle {
                        font-size: 15px;
                    }

                    .email-body {
                        padding: 0 24px 32px;
                    }

                    .description {
                        font-size: 15px;
                        margin-bottom: 24px;
                    }

                    .cta-button {
                        width: 100%;
                        padding: 18px 24px;
                    }

                    .alternative-section {
                        padding: 16px;
                        margin: 24px 0;
                    }

                    .warning-section {
                        padding: 16px;
                        margin: 24px 0;
                    }

                    .footer {
                        padding: 20px 24px;
                    }
                }

                @media screen and (max-width: 480px) {
                    .email-header {
                        padding: 24px 20px 20px;
                    }

                    .email-body {
                        padding: 0 20px 24px;
                    }

                    .title {
                        font-size: 22px;
                    }

                    .description {
                        font-size: 14px;
                    }
                }

                /* Dark mode support */
                @media (prefers-color-scheme: dark) {
                    body {
                        background-color: #0f172a;
                    }

                    .email-container {
                        background-color: #1e293b;
                    }

                    .email-header {
                        background: linear-gradient(135deg, #451a03 0%, #78350f 100%);
                    }

                    .brand-name {
                        color: #e2e8f0;
                    }

                    .title {
                        color: #f1f5f9;
                    }

                    .subtitle,
                    .description {
                        color: #94a3b8;
                    }

                    .alternative-section {
                        background-color: #0f172a;
                    }

                    .alternative-title {
                        color: #e2e8f0;
                    }

                    .alternative-link {
                        background-color: #1e293b;
                        border-color: #475569;
                        color: #fbbf24;
                    }

                    .warning-section {
                        background-color: #450a0a;
                        border-color: #7f1d1d;
                    }

                    .warning-title {
                        color: #fca5a5;
                    }

                    .warning-text {
                        color: #f87171;
                    }

                    .footer {
                        background-color: #0f172a;
                        border-color: #334155;
                    }

                    .footer-text {
                        color: #64748b;
                    }
                }
            </style>
        </head>

        <body>
            <div class="email-container">
                <!-- Header -->
                <div class="email-header">
                    <div class="logo">💬</div>
                    <div class="brand-name">Viby Chat</div>
                    <div class="security-emoji">🔐</div>
                    <h1 class="title">Reset Your Password</h1>
                    <p class="subtitle">Secure your account with a new password</p>
                </div>

                <!-- Main Content -->
                <div class="email-body">
                    <p class="description" style="margin-top: 1rem;">
                        We received a request to reset your password. Click the button below to create a new password and regain
                        access to your account.
                    </p>

                    <a href="${resetLink}" target="_blank" class="cta-button">
                        Reset My Password
                    </a>

                    <!-- Alternative Access -->
                    <div class="alternative-section">
                        <h4 class="alternative-title">Button not working?</h4>
                        <a href="${resetLink}" target="_blank" class="alternative-link">
                            ${resetLink}
                        </a>
                    </div>

                    <!-- Security Warning -->
                    <div class="warning-section">
                        <h4 class="warning-title">
                            ⏰ Important Security Notice
                        </h4>
                        <p class="warning-text">
                            This reset link expires in 10 minutes for your security. If you didn't request this password reset,
                            please ignore this email.
                        </p>
                    </div>
                </div>

                <!-- Footer -->
                <div class="footer">
                    <p class="footer-text">© 2025 Viby Chat</p>
                    <div class="footer-links">
                        <a href="#" class="footer-link">Help Center</a>
                        <a href="#" class="footer-link">Privacy Policy</a>
                        <a href="#" class="footer-link">Unsubscribe</a>
                    </div>
                </div>
            </div>
        </body>

        </html>`;
};

const WELCOME_MAIL = (url) => {
  return `
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Viby Chat</title>
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    background-color: #f8fafc;
                    line-height: 1.5;
                    color: #334155;
                    padding: 40px 20px;
                }

                .email-container {
                    max-width: 480px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }

                .email-header {
                    padding: 48px 32px 32px;
                    text-align: center;
                    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
                }

                .logo {
                    width: 56px;
                    height: 56px;
                    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                    border-radius: 16px;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    margin-bottom: 24px;
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                }

                .brand-name {
                    font-size: 18px;
                    font-weight: 600;
                    color: #1e293b;
                    margin-bottom: 32px;
                }

                .welcome-emoji {
                    font-size: 48px;
                    margin-bottom: 16px;
                }

                .title {
                    font-size: 28px;
                    font-weight: 700;
                    color: #0f172a;
                    margin-bottom: 8px;
                    line-height: 1.2;
                }

                .subtitle {
                    font-size: 16px;
                    color: #64748b;
                    font-weight: 500;
                }

                .email-body {
                    padding: 0 32px 48px;
                    text-align: center;
                }

                .welcome-message {
                    font-size: 16px;
                    color: #475569;
                    margin-bottom: 32px;
                    line-height: 1.6;
                }

                .cta-button {
                    display: inline-block;
                    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
                    color: #ffffff;
                    text-decoration: none;
                    font-size: 16px;
                    font-weight: 600;
                    padding: 16px 32px;
                    border-radius: 8px;
                    margin-bottom: 32px;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                }

                .cta-button:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
                }

                .features-section {
                    background-color: #f8fafc;
                    border-radius: 8px;
                    padding: 24px;
                    margin: 32px 0;
                    text-align: left;
                }

                .features-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #1e293b;
                    margin-bottom: 16px;
                    text-align: center;
                }

                .feature-list {
                    list-style: none;
                    padding: 0;
                }

                .feature-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 12px;
                    font-size: 14px;
                    color: #475569;
                }

                .feature-icon {
                    width: 24px;
                    height: 24px;
                    background-color: #dbeafe;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    flex-shrink: 0;
                }

                .help-section {
                    background-color: #f0f9ff;
                    border: 1px solid #bae6fd;
                    border-radius: 8px;
                    padding: 20px;
                    margin: 32px 0;
                }

                .help-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #0c4a6e;
                    margin-bottom: 8px;
                }

                .help-text {
                    font-size: 13px;
                    color: #0369a1;
                    line-height: 1.5;
                }

                .help-link {
                    color: #2563eb;
                    text-decoration: none;
                    font-weight: 500;
                }

                .footer {
                    padding: 24px 32px;
                    text-align: center;
                    background-color: #f8fafc;
                    border-top: 1px solid #f1f5f9;
                }

                .footer-text {
                    font-size: 12px;
                    color: #94a3b8;
                    margin-bottom: 8px;
                }

                .footer-links {
                    font-size: 12px;
                }

                .footer-link {
                    color: #3b82f6;
                    text-decoration: none;
                    margin: 0 8px;
                }

                /* Mobile Responsiveness */
                @media screen and (max-width: 600px) {
                    body {
                        padding: 20px 16px;
                    }

                    .email-container {
                        border-radius: 8px;
                    }

                    .email-header {
                        padding: 32px 24px 24px;
                    }

                    .logo {
                        width: 48px;
                        height: 48px;
                        font-size: 20px;
                        margin-bottom: 20px;
                    }

                    .brand-name {
                        font-size: 16px;
                        margin-bottom: 24px;
                    }

                    .welcome-emoji {
                        font-size: 40px;
                        margin-bottom: 12px;
                    }

                    .title {
                        font-size: 24px;
                    }

                    .subtitle {
                        font-size: 15px;
                    }

                    .email-body {
                        padding: 0 24px 32px;
                    }

                    .welcome-message {
                        font-size: 15px;
                        margin-bottom: 24px;
                    }

                    .cta-button {
                        width: 100%;
                        padding: 18px 24px;
                    }

                    .features-section {
                        padding: 20px;
                        margin: 24px 0;
                    }

                    .help-section {
                        padding: 16px;
                        margin: 24px 0;
                    }

                    .footer {
                        padding: 20px 24px;
                    }
                }

                @media screen and (max-width: 480px) {
                    .email-header {
                        padding: 24px 20px 20px;
                    }

                    .email-body {
                        padding: 0 20px 24px;
                    }

                    .title {
                        font-size: 22px;
                    }

                    .welcome-message {
                        font-size: 14px;
                    }
                }

                /* Dark mode support */
                @media (prefers-color-scheme: dark) {
                    body {
                        background-color: #0f172a;
                    }

                    .email-container {
                        background-color: #1e293b;
                    }

                    .email-header {
                        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                    }

                    .brand-name {
                        color: #e2e8f0;
                    }

                    .title {
                        color: #f1f5f9;
                    }

                    .subtitle,
                    .welcome-message {
                        color: #94a3b8;
                    }

                    .features-section {
                        background-color: #0f172a;
                    }

                    .features-title {
                        color: #e2e8f0;
                    }

                    .feature-item {
                        color: #94a3b8;
                    }

                    .feature-icon {
                        background-color: #1e293b;
                    }

                    .help-section {
                        background-color: #0f172a;
                        border-color: #334155;
                    }

                    .help-title {
                        color: #e2e8f0;
                    }

                    .help-text {
                        color: #94a3b8;
                    }

                    .footer {
                        background-color: #0f172a;
                        border-color: #334155;
                    }

                    .footer-text {
                        color: #64748b;
                    }
                }
            </style>
        </head>

        <body>
            <div class="email-container">
                <!-- Header -->
                <div class="email-header">
                    <div class="logo">💬</div>
                    <div class="brand-name">Viby Chat</div>
                    <div class="welcome-emoji">🎉</div>
                    <h1 class="title">Welcome to Viby Chat!</h1>
                    <p class="subtitle">Your account is ready to go</p>
                </div>

                <!-- Main Content -->
                <div class="email-body">
                    <p class="welcome-message" style="margin-top: 1rem;">
                        Congratulations! You've successfully set up your Viby Chat account.
                        You're now ready to connect, chat, and collaborate with friends and teams.
                    </p>

                    <a href="${url}" class="cta-button">
                        Start Chatting
                    </a>

                    <!-- Features Section -->
                    <div class="features-section">
                        <h3 class="features-title">What you can do now:</h3>
                        <ul class="feature-list">
                            <li class="feature-item">
                                <div class="feature-icon">👥</div>
                                <span>Create or join chat rooms</span>
                            </li>
                            <li class="feature-item">
                                <div class="feature-icon">📱</div>
                                <span>Send messages, photos, and files</span>
                            </li>
                            <li class="feature-item">
                                <div class="feature-icon">🔔</div>
                                <span>Customize your notification settings</span>
                            </li>
                            <li class="feature-item">
                                <div class="feature-icon">⚙️</div>
                                <span>Personalize your profile and preferences</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Help Section -->
                    <div class="help-section">
                        <h4 class="help-title">Need help getting started?</h4>
                        <p class="help-text">
                            Check out our <a href="#" class="help-link">quick start guide</a> or
                            <a href="#" class="help-link">contact our support team</a> if you have any questions.
                        </p>
                    </div>
                </div>

                <!-- Footer -->
                <div class="footer">
                    <p class="footer-text">© 2025 Viby Chat</p>
                    <div class="footer-links">
                        <a href="#" class="footer-link">Help Center</a>
                        <a href="#" class="footer-link">Privacy Policy</a>
                        <a href="#" class="footer-link">Unsubscribe</a>
                    </div>
                </div>
            </div>
        </body>

        </html>
                        `;
};

module.exports = {
  OTP_MAIL,
  RESET_PASSWORD_LINK_MAIL,
  WELCOME_MAIL,
};
