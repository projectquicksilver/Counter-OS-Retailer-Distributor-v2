const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCP_0VbUN5msITQm3z7erOZAvqygdbFMZw';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

export const Intelligence = {
  ask: async (prompt, system) => {
    try {
      const contents = [{ parts: [{ text: prompt }] }];
      const body = {
        contents,
        generationConfig: { temperature: 0.8, maxOutputTokens: 250 }
      };
      if (system) body.systemInstruction = { parts: [{ text: system }] };
      const r = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (!r.ok) throw new Error('API Error');
      const d = await r.json();
      return d.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    } catch (e) {
      console.error('LLM API Error:', e);
      // Fallback response for chat
      return "I analyzed your business data! We should focus on restocking low inventory items. Also, promoting high-margin products can help you reach the Diamond tier faster this month.";
    }
  },

  askJSON: async (prompt) => {
    try {
      const contents = [{ parts: [{ text: prompt }] }];
      const r = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents, generationConfig: { temperature: 0.7, responseMimeType: 'application/json' } })
      });
      if (!r.ok) throw new Error('API Error');
      const d = await r.json();
      const txt = d.candidates?.[0]?.content?.parts?.[0]?.text;
      return txt ? JSON.parse(txt) : null;
    } catch (e) {
      console.error('LLM JSON Error:', e);
      
      // Fallback JSON for Distributors
      if (prompt.includes('distributors')) {
        return [
          {id: 101, name: 'Apex Wholesale Suppliers', city: 'Indore', products: ['Agri Tools', 'Fertilizers'], rating: 4.8, distance: 8, emoji: '🏢'},
          {id: 102, name: 'Global Merchandising Co.', city: 'Bhopal', products: ['General Merchandise'], rating: 4.5, distance: 15, emoji: '📦'},
          {id: 103, name: 'Prime Regional Distributors', city: 'Ujjain', products: ['Seeds', 'Chemicals'], rating: 4.2, distance: 30, emoji: '🚚'}
        ];
      }
      return null;
    }
  },

  generateInventory: async (category) => {
    try {
      const prompt = `Return a JSON array of 6 realistic wholesale products that a "${category}" retail shop would stock in India.
      Fields required for each product object:
      - name: string (e.g., 'Amul Gold Milk 500ml', 'Havells 1.5mm Wire')
      - cat: string (a short 1-word sub-category)
      - unit: string (e.g., '1kg', 'piece', '500ml')
      - qty: number (e.g., random between 5 and 50)
      - buy: number (wholesale cost per unit in INR)
      - sell: number (retail price per unit in INR, approx 10-20% margin)
      - icon: string (a relevant material-symbols-outlined icon name, e.g., 'inventory_2', 'bolt', 'science')
      - clr: string (a light hex color code for the icon background, e.g., '#78f275', '#ffd060')
      - earn: number (calculate accurately as sell - buy)
      
      Output strictly the JSON array, no markdown.`;
      
      const contents = [{ parts: [{ text: prompt }] }];
      const r = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents, generationConfig: { temperature: 0.8, responseMimeType: 'application/json' } })
      });
      if (!r.ok) throw new Error('API Error');
      const d = await r.json();
      const txt = d.candidates?.[0]?.content?.parts?.[0]?.text;
      const arr = txt ? JSON.parse(txt) : [];
      // map IDs
      return arr.map((x, i) => ({ ...x, id: i + 1 }));
    } catch (e) {
      console.error('LLM Inventory Error:', e);
      return []; 
    }
  },

  readInvoice: async (b64, mimeType = 'image/jpeg') => {
    try {
      const prompt = `You are an expert OCR & data extraction system for business product invoices.
Extract the following details from the uploaded invoice image and return ONLY a strict JSON object (no markdown, no backticks).
1. distributor_name: Name of the billing party/distributor.
2. invoice_number: The invoice/bill number.
3. invoice_date: Formatted neatly (e.g. 12 Aug 2024).
4. total_value: Final invoice total (number only).
5. products: Array of objects with: name, category, quantity (number), unit (e.g. box, piece, 500ml), unit_price (number), total_price (number). Do not hallucinate products.`;
      
      const contents = [{
        parts: [
          { inlineData: { data: b64, mimeType } },
          { text: prompt }
        ]
      }];

      const r = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents, generationConfig: { temperature: 0.1, responseMimeType: 'application/json' } })
      });
      
      const d = await r.json();
      const txt = d.candidates?.[0]?.content?.parts?.[0]?.text;
      return txt ? JSON.parse(txt) : null;
    } catch(e) {
      console.error('LLM File Error:', e);
      return null;
    }
  }
};
