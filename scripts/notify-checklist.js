const fs = require('fs');
const path = require('path');

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

const taskPath = path.join(__dirname, '../task.md');
if (!fs.existsSync(taskPath)) {
  console.error("❌ Error: task.md file not found.");
  process.exit(1);
}

// Read and parse task.md
const content = fs.readFileSync(taskPath, 'utf8');
const lines = content.split('\n');

let currentSection = "";
const sections = {};

lines.forEach(line => {
  const trimmed = line.trim();
  
  // Detect Section Headers (e.g. ## 🔒 Phase 1 or ## ⚙️ Phase 2)
  if (trimmed.startsWith('##')) {
    currentSection = trimmed.replace(/^##\s*/, '').trim();
    sections[currentSection] = [];
    return;
  }

  // Parse list items in current section
  if (currentSection && (trimmed.startsWith('- [') || trimmed.startsWith('|'))) {
    // Format Checklist items
    if (trimmed.startsWith('- [')) {
      let formatted = trimmed;
      if (trimmed.startsWith('- [x]')) {
        formatted = trimmed.replace(/^-\s*\[x\]\s*/, ':white_check_mark: ~').trim() + '~';
      } else if (trimmed.startsWith('- [/]')) {
        formatted = trimmed.replace(/^-\s*\[\/\]\s*/, ':hourglass_flowing_sand: ').trim();
      } else if (trimmed.startsWith('- [ ]')) {
        formatted = trimmed.replace(/^-\s*\[\s*\]\s*/, ':white_square: ').trim();
      }
      // Remove double asterisks (Slack uses single asterisks for bold)
      formatted = formatted.replace(/\*\*/g, '*');
      sections[currentSection].push(formatted);
    }
    // Format Table items (Phase 1 master list table)
    else if (trimmed.startsWith('|') && !trimmed.includes('---')) {
      const parts = trimmed.split('|').map(p => p.trim()).filter(Boolean);
      // Skip header row
      if (parts[0] === 'Task / Feature' || parts[0] === 'Task Description') return;
      
      const taskName = parts[0] ? parts[0].replace(/\*\*/g, '*') : '';
      const status = parts[1] || '';
      
      if (taskName && status) {
        let emoji = ':white_square:';
        if (status.includes('[x]') || status.includes('Completed') || status.includes('Implemented')) {
          emoji = ':white_check_mark:';
        } else if (status.includes('[/]') || status.includes('Progress')) {
          emoji = ':hourglass_flowing_sand:';
        }
        sections[currentSection].push(`${emoji} ${taskName}`);
      }
    }
  }
});

// Format Block Kit message attachments
const attachments = Object.entries(sections)
  .filter(([_, items]) => items.length > 0)
  .map(([sectionName, items]) => {
    let color = "#4f46e5"; // default purple
    if (sectionName.includes("Phase 1")) color = "#22c55e"; // green
    if (sectionName.includes("Phase 2")) color = "#f59e0b"; // orange
    
    return {
      color: color,
      title: sectionName,
      text: items.join('\n'),
    };
  });

const payload = {
  text: `📋 *Voxora AI Project Checklist Status Update*`,
  attachments: attachments
};

console.log(`🚀 Sending checklist to Slack...`);

fetch(webhookUrl, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
  .then(res => {
    if (res.ok) {
      console.log(`✅ Success! Checklist broadcasted to Slack.`);
    } else {
      res.text().then(err => {
        console.error(`❌ Failed to send checklist: Status ${res.status}`, err);
      });
    }
  })
  .catch(err => {
    console.error(`💥 Network Error sending checklist:`, err.message);
  });
