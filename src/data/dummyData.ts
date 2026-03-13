import type { Mailbox, MessagesMap } from '../types';

// Random name generators for mailbox addresses
const prefixes = [
  'oxford', 'dev', 'temp', 'user', 'crypto', 'hack', 'cloud', 'swift',
  'pixel', 'nova', 'zero', 'flux', 'nano', 'apex', 'vex', 'ghost'
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateAddress(): string {
  const prefix = prefixes[randomInt(0, prefixes.length - 1)];
  const num = randomInt(10, 999);
  return `${prefix}_${num}@tempmail.dev`;
}

export function generateMailboxId(): string {
  return `mb_${Date.now()}_${randomInt(100, 999)}`;
}

// Initial dummy mailboxes
export const INITIAL_MAILBOXES: Mailbox[] = [
  {
    id: 'mb_1',
    address: 'oxford_342@tempmail.dev',
    createdAt: Date.now() - 120 * 1000,     // 2 min ago
    expiresIn: 86400 - 120,                  // ~24h left
  },
  {
    id: 'mb_2',
    address: 'dev_test_alt@tempmail.dev',
    createdAt: Date.now() - 34800 * 1000,    // ~9.6h ago
    expiresIn: 51200,                         // ~14h left
  },
  {
    id: 'mb_3',
    address: 'temp_user_88@tempmail.dev',
    createdAt: Date.now() - 78800 * 1000,    // ~21.8h ago
    expiresIn: 7600,                          // ~2.1h left
  },
];

// Dummy messages mapped by mailbox id
export const INITIAL_MESSAGES: MessagesMap = {
  'mb_1': [
    {
      id: 'msg_101',
      from: 'Linear App',
      fromEmail: 'notifications@linear.app',
      subject: 'New Issue assigned to you',
      preview: 'Issue ENG-342 has been assigned to you by @sarah...',
      body: `<p>Hello,</p>
<p>A new issue has been assigned to you in the <strong>Engineering</strong> project.</p>
<div style="margin: 24px 0; padding: 16px; background: rgba(99,102,241,0.1); border-radius: 8px; border: 1px solid rgba(99,102,241,0.2);">
  <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #6366f1; margin-bottom: 8px;">Issue Details</p>
  <p style="font-size: 16px; font-weight: 600;">ENG-342: Implement user authentication flow</p>
  <p style="font-size: 14px; color: #a1a1aa; margin-top: 8px;">Priority: <strong style="color: #f59e0b;">High</strong> · Sprint: v2.4</p>
</div>
<p>Please review the issue and update its status accordingly.</p>
<p style="color: #71717a; font-style: italic; font-size: 12px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 16px; margin-top: 24px;">This is an automated notification from Linear.</p>`,
      timestamp: 'Just now',
      timestampMs: Date.now() - 30000,
      isUnread: true,
    },
    {
      id: 'msg_102',
      from: 'Github Support',
      fromEmail: 'support@github.com',
      subject: 'Verification code: 893241',
      preview: 'Your verification code is 893241. It expires in 10 minutes...',
      body: `<p>Hello,</p>
<p>We received a request to access your account from a new device. To ensure the security of your information, please use the following One-Time Password (OTP) to complete the verification process.</p>
<div style="margin: 32px 0; display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 24px; background: #09090b; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
  <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.2em; color: #71717a; font-weight: 600;">Verification Code</span>
  <div style="font-size: 28px; font-family: 'JetBrains Mono', monospace; font-weight: 700; letter-spacing: 0.15em; color: #34d399; background: rgba(52,211,153,0.08); padding: 12px 24px; border-radius: 8px; border: 1px solid rgba(52,211,153,0.2);">893-241</div>
  <p style="font-size: 12px; color: #71717a;">Expires in 10 minutes</p>
</div>
<p>If you did not make this request, please ignore this email or contact our security team immediately if you suspect unauthorized activity.</p>
<p style="color: #71717a; font-style: italic; font-size: 12px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 16px; margin-top: 24px;">This is an automated message. Please do not reply directly to this email.</p>`,
      timestamp: '2m ago',
      timestampMs: Date.now() - 120000,
      isUnread: false,
      otp: '893-241',
    },
    {
      id: 'msg_103',
      from: 'Stripe Dashboard',
      fromEmail: 'dashboard@stripe.com',
      subject: 'Action required for your account',
      preview: 'Your payment method needs to be updated before March 15...',
      body: `<p>Hello,</p>
<p>We noticed that your payment method on file will expire soon. To avoid any interruption in service, please update your billing information.</p>
<p>Your current card ending in <strong>4242</strong> expires on <strong>03/2026</strong>.</p>
<p>Please visit your <a href="#" style="color: #6366f1;">billing settings</a> to update your payment method.</p>
<p style="color: #71717a; font-style: italic; font-size: 12px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 16px; margin-top: 24px;">— The Stripe Team</p>`,
      timestamp: '15m ago',
      timestampMs: Date.now() - 900000,
      isUnread: false,
    },
    {
      id: 'msg_104',
      from: 'Newsletter Weekly',
      fromEmail: 'hello@newsletter.dev',
      subject: 'The future of serverless functions...',
      preview: 'This week: Edge computing trends, new Deno features, and more...',
      body: `<p>Good morning!</p>
<p>Here's your weekly roundup of the most interesting developments in the serverless space:</p>
<ul style="padding-left: 20px; line-height: 1.8;">
  <li><strong>Edge Computing Trends</strong> — How Cloudflare Workers are changing the game</li>
  <li><strong>Deno 2.0 Features</strong> — What's new and what it means for you</li>
  <li><strong>AWS Lambda Updates</strong> — Cold start improvements and new runtimes</li>
  <li><strong>Vercel Edge Functions</strong> — Real-world performance benchmarks</li>
</ul>
<p>Happy coding! 🚀</p>
<p style="color: #71717a; font-size: 12px; margin-top: 24px;">You're receiving this because you subscribed to Newsletter Weekly. <a href="#" style="color: #6366f1;">Unsubscribe</a></p>`,
      timestamp: '1h ago',
      timestampMs: Date.now() - 3600000,
      isUnread: false,
    },
  ],
  'mb_2': [
    {
      id: 'msg_201',
      from: 'Docker Hub',
      fromEmail: 'noreply@docker.com',
      subject: 'Image push successful',
      preview: 'Your image myapp:latest has been pushed successfully...',
      body: `<p>Hello,</p><p>Your Docker image <code>myapp:latest</code> has been successfully pushed to Docker Hub.</p><p>Image digest: <code>sha256:a3b8...d1f4</code></p>`,
      timestamp: '3h ago',
      timestampMs: Date.now() - 10800000,
      isUnread: true,
    },
  ],
  'mb_3': [
    {
      id: 'msg_301',
      from: 'Vercel',
      fromEmail: 'notifications@vercel.com',
      subject: 'Deployment ready',
      preview: 'Your project has been deployed to production...',
      body: `<p>Your deployment is now live!</p><p>Visit <a href="#" style="color: #6366f1;">your-project.vercel.app</a> to see it in action.</p>`,
      timestamp: '5h ago',
      timestampMs: Date.now() - 18000000,
      isUnread: false,
    },
  ],
};
