  // api/ai-chat.js
  import OpenAI from "openai";

  export default async function handler(req, res) {
    // CORS headers so your website can call this from any domain
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(200).end();
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    try {
      const { msg, url } = req.body || {};
      if (!msg) return res.status(400).json({ error: "Missing msg" });

      const KB = `
PRODUCTS:
- Template Invitation — self-editable Canva template. Edit text and download MP4 or PDF. From £10. What you can edit: all text, add/remove boxes, duplicate/delete pages. What you cannot edit: graphics/backdrops, size/orientation.
- Luxury Invitation — personalised, we do the edits. First draft ~48 hours after payment. Two revision rounds. Add-ons: audio track, customised couple illustration. Final files delivered HD & Ultra HD via WhatsApp or email. From £35.
- Bespoke Invitation — designed from scratch to the client’s theme and colours. First draft ~72 hours after payment. Up to three revisions are included in this price. Delivered HD & Ultra HD via WhatsApp or email. From £45.

HOW TO ORDER:
1) DM on Instagram or TikTok with the product you want. 2) We confirm price and take your WhatsApp number or email. 3) You receive a secure Stripe payment link. 4) Once payment is complete, we begin your design. 5) Your first draft will be ready within 48 hours for your review and feedback.
6) Your final invitation will be delivered straight to your WhatsApp in HD and Ultra HD (4K) quality, ready to share with your guests.

WHY CHOOSE US:
Hundreds sold worldwide on Etsy, TikTok, Instagram. UK based. Limited orders for a personalised experience. Worldwide service.
CONTACT LINKS: Instagram and TikTok icons in the site footer.
`;

      const SYSTEM_PROMPT = `
You are the Sakinah Studios website assistant. Tone: warm, polite, concise, UK English.
Always greet with "Assalamu alaikum" on the first reply.
Goals:
- Answer questions using the Knowledge Base (KB) below and the user's message.
- If an answer is unknown, say you’re not sure and suggest DM on Instagram or TikTok to confirm.
- Offer next steps clearly, and if the user wants to proceed, collect: Name, WhatsApp number or email, Event date, Which product (Template/Luxury/Bespoke), Any add-ons (audio, couple illustration).
- Never promise delivery times beyond what the KB states. Never quote prices other than “From £10/£25/£35” unless the user already saw a specific quote.
- When asked to order, share: Instagram DM link and TikTok link.

Brand facts you can use:
${KB}

Format short paragraphs. Use bullet points when listing options.
`;

      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

      const response = await client.responses.create({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        input: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Page: ${url}\nUser: ${msg}` }
        ]
      });

      const text = response.output_text || response.output?.[0]?.content?.[0]?.text || "Sorry, I don't have an answer right now.";
      return res.status(200).json({ reply: text.trim() });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ reply: "Sorry, I ran into an error. Please try again." });
    }
  }
