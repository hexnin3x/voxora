export async function sendLeadNotification(lead: {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  message?: string;
}) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    // Silently skip if webhook is not configured to avoid throwing errors
    return;
  }

  const payload = {
    text: `🚀 *New Lead Captured on Voxora AI!*`,
    attachments: [
      {
        color: "#4f46e5", // Voxora Theme Purple
        fields: [
          { title: "Name", value: lead.name, short: true },
          { title: "Email", value: lead.email, short: true },
          { title: "Company", value: lead.company || "N/A", short: true },
          { title: "Phone", value: lead.phone || "N/A", short: true },
          { title: "Message", value: lead.message || "_None provided_", short: false },
        ],
        ts: Math.floor(Date.now() / 1000),
      },
    ],
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("💥 Failed to send Slack lead notification:", await res.text());
    }
  } catch (err) {
    console.error("💥 Error sending Slack lead notification:", err);
  }
}
