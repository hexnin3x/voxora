const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function loadEnv() {
  const envPath = path.join(__dirname, '../.env');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?/);
    if (match) {
      let value = (match[2] || '').trim();
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      env[match[1]] = value;
    }
  });
  return env;
}

const env = loadEnv();
const webhookUrl = env.SLACK_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL;

if (!webhookUrl) {
  console.error('❌ SLACK_WEBHOOK_URL not found in .env');
  process.exit(1);
}

const hash    = execSync('git log -1 --pretty=format:"%H"').toString().trim();
const short   = execSync('git log -1 --pretty=format:"%h"').toString().trim();
const message = execSync('git log -1 --pretty=format:"%s"').toString().trim();
const author  = execSync('git log -1 --pretty=format:"%an"').toString().trim();
const date    = execSync('git log -1 --pretty=format:"%ad" --date=format:"%Y-%m-%d %H:%M"').toString().trim();
const remote  = execSync('git remote get-url origin').toString().trim();
const repoUrl = remote.replace(/\.git$/, '');
const commitUrl = `${repoUrl}/commit/${hash}`;

const payload = {
  text: `🚀 *New commit pushed to GitHub!*`,
  attachments: [
    {
      color: '#22c55e',
      fields: [
        { title: 'Commit Message', value: `*${message}*`, short: false },
        { title: 'Author',  value: author,               short: true  },
        { title: 'Date',    value: date,                 short: true  },
        { title: 'Commit',  value: `<${commitUrl}|\`${short}\`>`, short: false },
      ],
      ts: Math.floor(Date.now() / 1000),
    }
  ]
};

fetch(webhookUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
})
  .then(res => {
    if (res.ok) console.log('✅ Slack notified!');
    else res.text().then(t => console.error('❌ Failed:', res.status, t));
  })
  .catch(err => console.error('💥 Network error:', err.message));
