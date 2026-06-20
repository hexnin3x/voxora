const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function loadEnv() {
  const envPath = path.join(__dirname, '../.env');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      } else if (value.startsWith("'") && value.endsWith("'")) {
        value = value.slice(1, -1);
      }
      env[key] = value.trim();
    }
  });
  return env;
}

const env = loadEnv();
const webhookUrl = env.SLACK_WEBHOOK_URL || process.env.SLACK_WEBHOOK_URL;

if (!webhookUrl) {
  console.error("❌ Error: SLACK_WEBHOOK_URL is not configured in your .env file.");
  process.exit(1);
}

// Get the task name from command arguments
const taskName = process.argv.slice(2).join(' ');

if (!taskName) {
  console.error("❌ Error: Please specify a task name. \nExample: npm run task-done \"Fixing login cookies\"");
  process.exit(1);
}

// Get the local Git user name automatically
let developerName = "Developer";
try {
  developerName = execSync('git config user.name').toString().trim();
} catch (e) {
  developerName = process.env.USER || process.env.USERNAME || "Developer";
}

const payload = {
  text: `🎉 *${developerName} completed a feature!*`,
  attachments: [
    {
      color: "#22c55e", // Bright Green for success/completion
      fields: [
        { title: "Task Completed", value: `*${taskName}*`, short: false },
        { title: "Completed By", value: developerName, short: true },
        { title: "Environment", value: "Local Machine (localhost)", short: true }
      ],
      ts: Math.floor(Date.now() / 1000)
    }
  ]
};

console.log(`🚀 Sending Slack completion notification for: "${taskName}"...`);

fetch(webhookUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
  .then(res => {
    if (res.ok) {
      console.log(`✅ Success! Slack notification sent.`);
    } else {
      res.text().then(err => {
        console.error(`❌ Failed to send: Status ${res.status}`, err);
      });
    }
  })
  .catch(err => {
    console.error(`💥 Network Error sending to Slack:`, err.message);
  });
