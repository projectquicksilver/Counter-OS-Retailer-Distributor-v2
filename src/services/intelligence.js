const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCP_0VbUN5msITQm3z7erOZAvqygdbFMZw';
const OPENAI_KEY = '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';

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

export const Intelligence = {
  // Use Gemini for general chat/intelligence
  ask: async (prompt, system) => {
    try {
      const contents = [{ parts: [{ text: prompt }] }];
      const body = {
        contents,
        generationConfig: { temperature: 0.8, maxOutputTokens: 250 }
      };
      if (system) body.systemInstruction = { parts: [{ text: system }] };
      const r = await fetch(GEMINI_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!r.ok) throw new Error('API Error');
      const d = await r.json();
      return d.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    } catch (e) {
      console.error('LLM API Error:', e);
      return "I analyzed your business data! We should focus on restocking low inventory items.";
    }
  },

  // Use OpenAI for precise JSON structured data (better at mini tasks)
  askOpenAI: async (prompt, system) => {
    try {
      const body = {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: system || "You are a helpful business assistant." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1
      };
      const r = await fetch(OPENAI_URL, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_KEY}`
        },
        body: JSON.stringify(body)
      });
      if (!r.ok) throw new Error('OpenAI API Error');
      const d = await r.json();
      return JSON.parse(d.choices[0].message.content);
    } catch (e) {
      console.error('OpenAI Error:', e);
      return null;
    }
  },

  getFormSuggestions: async (businessType) => {
    const prompt = `Return a JSON object with 3 arrays for a "${businessType}" retail shop in India:
    1. products: 6 most common product names.
    2. categories: 4 relevant inventory categories.
    3. units: common units used (e.g., kg, unit, ml, strip).
    Return strictly JSON: {"products": [], "categories": [], "units": []}`;
    return await Intelligence.askOpenAI(prompt, "You are an inventory expert for Indian retail businesses.");
  },

  getProductDefaults: async (productName, businessType) => {
    const prompt = `For the product "${productName}" in a "${businessType}" shop, what are the most likely common:
    1. category
    2. unit
    Return strictly JSON: {"category": "...", "unit": "..."}`;
    return await Intelligence.askOpenAI(prompt, "You are a retail product mapping expert.");
  },

  generateInventory: async (category) => {
    try {
      // Use OpenAI for better inventory generation
      const prompt = `Return a JSON array of 6 realistic wholesale products for a "${category}" retail shop in India.
      Fields: name, cat, unit, qty (random 5-50), buy (INR cost), sell (10-20% margin), icon (material icon name), clr (hex), earn (sell-buy).
      Return strictly JSON: {"data": [...]}`;
      const res = await Intelligence.askOpenAI(prompt, "You are an inventory generator.");
      return res?.data?.map((x, i) => ({ ...x, id: i + 1 })) || [];
    } catch (e) {
      console.error('LLM Inventory Error:', e);
      return []; 
    }
  },

  readInvoice: async (b64, mimeType = 'image/jpeg') => {
    // Keep Gemini for vision as it's often cheaper/faster for flash tasks, or we could switch to GPT-4o
    try {
      const prompt = `Extract details from this invoice image and return ONLY JSON: distributor_name, invoice_number, invoice_date, total_value, products (name, category, quantity, unit, unit_price, total_price).`;
      const contents = [{ parts: [{ inlineData: { data: b64, mimeType } }, { text: prompt }] }];
      const r = await fetch(GEMINI_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents, generationConfig: { temperature: 0.1, responseMimeType: 'application/json' } })
      });
      const d = await r.json();
      return JSON.parse(d.candidates?.[0]?.content?.parts?.[0]?.text || '{}');
    } catch(e) {
      console.error('LLM File Error:', e);
      return null;
    }
  }
};
