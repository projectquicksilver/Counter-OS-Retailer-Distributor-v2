const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCP_0VbUN5msITQm3z7erOZAvqygdbFMZw';
const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';

const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

// Utility: Fetch with timeout
const fetchWithTimeout = (url, options = {}, timeoutMs = 8000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    )
  ]);
};

// Utility: Retry with exponential backoff
const retryWithBackoff = async (fn, maxRetries = 2, baseDelay = 500) => {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
};

// Fallback data for different business categories - Comprehensive coverage
const FALLBACK_INVENTORY = {
  'Agri Retailer': [
    { id: 1, name: 'IFFCO DAP Fertilizer', cat: 'Fertilizers', unit: 'bag', qty: 12, buy: 320, sell: 380, icon: 'package', clr: '#78f275', earn: 60 },
    { id: 2, name: 'Urea 46% Nitrogen', cat: 'Fertilizers', unit: 'bag', qty: 8, buy: 280, sell: 340, icon: 'package', clr: '#78f275', earn: 60 },
    { id: 3, name: 'Corteva Delegate Seeds', cat: 'Seeds', unit: 'pack', qty: 5, buy: 450, sell: 540, icon: 'leaf', clr: '#4ade80', earn: 90 },
    { id: 4, name: 'Gromor Amino Acid', cat: 'Pesticides', unit: 'bottle', qty: 15, buy: 280, sell: 350, icon: 'droplet', clr: '#ffa500', earn: 70 },
    { id: 5, name: 'Jain Agro Chemicals', cat: 'Chemicals', unit: 'container', qty: 3, buy: 620, sell: 750, icon: 'science', clr: '#ff6b6b', earn: 130 },
    { id: 6, name: 'Krishak Premium Soil', cat: 'Soil & Nutrients', unit: 'bag', qty: 20, buy: 100, sell: 150, icon: 'terrain', clr: '#8b6f47', earn: 50 }
  ],
  'Food & Grocery': [
    { id: 1, name: 'Rice (Basmati)', cat: 'Grains', unit: 'kg', qty: 25, buy: 60, sell: 85, icon: 'restaurant', clr: '#d4a574', earn: 25 },
    { id: 2, name: 'Wheat Flour', cat: 'Flour', unit: 'kg', qty: 40, buy: 30, sell: 45, icon: 'package', clr: '#d4a574', earn: 15 },
    { id: 3, name: 'Mustard Oil', cat: 'Oils', unit: 'ltr', qty: 10, buy: 180, sell: 240, icon: 'droplet', clr: '#ffd060', earn: 60 },
    { id: 4, name: 'Dal (Mixed)', cat: 'Legumes', unit: 'kg', qty: 15, buy: 80, sell: 110, icon: 'restaurant', clr: '#d4a574', earn: 30 },
    { id: 5, name: 'Sugar', cat: 'Sweeteners', unit: 'kg', qty: 20, buy: 45, sell: 60, icon: 'restaurant', clr: '#ffd060', earn: 15 },
    { id: 6, name: 'Tea Powder', cat: 'Beverages', unit: 'kg', qty: 8, buy: 320, sell: 420, icon: 'coffee', clr: '#8b4513', earn: 100 }
  ],
  'Pharmacy': [
    { id: 1, name: 'Aspirin 500mg', cat: 'Analgesics', unit: 'strip', qty: 50, buy: 45, sell: 65, icon: 'medicine', clr: '#ff1744', earn: 20 },
    { id: 2, name: 'Vitamin D3 1000IU', cat: 'Vitamins', unit: 'bottle', qty: 12, buy: 250, sell: 350, icon: 'health_and_safety', clr: '#ffc107', earn: 100 },
    { id: 3, name: 'Cough Syrup 100ml', cat: 'Cough & Cold', unit: 'bottle', qty: 20, buy: 85, sell: 130, icon: 'local_pharmacy', clr: '#e91e63', earn: 45 },
    { id: 4, name: 'Glucose Biscuits', cat: 'Nutrition', unit: 'pack', qty: 30, buy: 35, sell: 50, icon: 'restaurant', clr: '#ff9800', earn: 15 },
    { id: 5, name: 'First Aid Kit', cat: 'First Aid', unit: 'kit', qty: 5, buy: 450, sell: 650, icon: 'first_aid', clr: '#f44336', earn: 200 },
    { id: 6, name: 'Hand Sanitizer 500ml', cat: 'Hygiene', unit: 'bottle', qty: 25, buy: 80, sell: 120, icon: 'clean_hands', clr: '#2196f3', earn: 40 }
  ],
  'Hardware & Tools': [
    { id: 1, name: 'Hammer 500g', cat: 'Hand Tools', unit: 'piece', qty: 25, buy: 120, sell: 180, icon: 'construction', clr: '#ff6b35', earn: 60 },
    { id: 2, name: 'Drill Impact 18V', cat: 'Power Tools', unit: 'piece', qty: 5, buy: 2500, sell: 3500, icon: 'settings', clr: '#004e89', earn: 1000 },
    { id: 3, name: 'Paint Brush Set', cat: 'Painting', unit: 'set', qty: 15, buy: 280, sell: 420, icon: 'palette', clr: '#f77f00', earn: 140 },
    { id: 4, name: 'Wood Nails (1kg)', cat: 'Fasteners', unit: 'pack', qty: 30, buy: 80, sell: 140, icon: 'push_pin', clr: '#666', earn: 60 },
    { id: 5, name: 'Safety Gloves (10 pair)', cat: 'Safety', unit: 'pack', qty: 20, buy: 150, sell: 250, icon: 'pan_tool', clr: '#06a77d', earn: 100 },
    { id: 6, name: 'Tape Measure 5M', cat: 'Measuring', unit: 'piece', qty: 12, buy: 180, sell: 280, icon: 'straighten', clr: '#ffd60a', earn: 100 }
  ],
  'Textile & Fashion': [
    { id: 1, name: 'Cotton T-Shirt (XL)', cat: 'T-Shirts', unit: 'piece', qty: 50, buy: 120, sell: 220, icon: 'checkroom', clr: '#e63946', earn: 100 },
    { id: 2, name: 'Denim Jeans', cat: 'Jeans', unit: 'piece', qty: 20, buy: 450, sell: 750, icon: 'checkroom', clr: '#1d3557', earn: 300 },
    { id: 3, name: 'Silk Saree', cat: 'Traditional', unit: 'piece', qty: 8, buy: 1200, sell: 2000, icon: 'checkroom', clr: '#f1854a', earn: 800 },
    { id: 4, name: 'Cotton Bedsheet', cat: 'Bedding', unit: 'piece', qty: 25, buy: 280, sell: 450, icon: 'hotel', clr: '#9d84b7', earn: 170 },
    { id: 5, name: 'Casual Shoes', cat: 'Footwear', unit: 'pair', qty: 15, buy: 320, sell: 550, icon: 'directions_walk', clr: '#8b4513', earn: 230 },
    { id: 6, name: 'Scarf Collection', cat: 'Scarves', unit: 'piece', qty: 40, buy: 80, sell: 180, icon: 'checkroom', clr: '#d4d4d4', earn: 100 }
  ],
  'Electronics': [
    { id: 1, name: 'USB Cable 3M', cat: 'Cables', unit: 'piece', qty: 30, buy: 120, sell: 180, icon: 'cable', clr: '#9c27b0', earn: 60 },
    { id: 2, name: 'Phone Charger 65W', cat: 'Chargers', unit: 'piece', qty: 12, buy: 450, sell: 650, icon: 'power', clr: '#ff9800', earn: 200 },
    { id: 3, name: 'Screen Protector Pack', cat: 'Accessories', unit: 'pack', qty: 20, buy: 180, sell: 280, icon: 'shield', clr: '#2196f3', earn: 100 },
    { id: 4, name: 'Phone Stand', cat: 'Stands', unit: 'piece', qty: 15, buy: 250, sell: 380, icon: 'phone_android', clr: '#4caf50', earn: 130 },
    { id: 5, name: 'Bluetooth Speaker', cat: 'Audio', unit: 'piece', qty: 8, buy: 1200, sell: 1800, icon: 'speaker', clr: '#ff5722', earn: 600 },
    { id: 6, name: 'Power Bank 20000mAh', cat: 'Power Banks', unit: 'piece', qty: 10, buy: 800, sell: 1200, icon: 'battery_full', clr: '#4caf50', earn: 400 }
  ]
};

export const Intelligence = {
  // Use Gemini for general chat/intelligence with retry + timeout
  ask: async (prompt, system) => {
    try {
      return await retryWithBackoff(async () => {
        const contents = [{ parts: [{ text: prompt }] }];
        const body = {
          contents,
          generationConfig: { temperature: 0.8, maxOutputTokens: 250 }
        };
        if (system) body.systemInstruction = { parts: [{ text: system }] };
        
        const r = await fetchWithTimeout(GEMINI_URL, { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(body) 
        }, 8000);
        
        if (!r.ok) {
          const errText = await r.text();
          throw new Error(`Gemini API error: ${r.status} ${errText}`);
        }
        const d = await r.json();
        const text = d.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (!text) throw new Error('Empty response from Gemini');
        return text;
      }, 2, 500);
    } catch (e) {
      console.error('❌ Gemini Chat Error:', e.message);
      console.log('🔄 Switching to OpenAI...');
      
      // Fallback to OpenAI for dynamic, smart responses
      const openaiReply = await Intelligence.askOpenAIText(prompt, system);
      if (openaiReply) {
        console.log('✅ OpenAI fallback successful');
        return openaiReply;
      }
      
      // Final fallback: Smart business data analyzer
      if (system) {
        return Intelligence.analyzeBusinessData(system);
      }
      return "I analyzed your business data! We should focus on restocking low inventory items and maintaining premium quality for better margins. 📊";
    }
  },

  // Use OpenAI for precise JSON structured data (better at mini tasks)
  askOpenAI: async (prompt, system) => {
    if (!OPENAI_KEY) {
      console.warn('⚠️ OpenAI API key not configured. Using offline mode.');
      return null;
    }
    
    try {
      return await retryWithBackoff(async () => {
        const body = {
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: system || "You are a helpful business assistant." },
            { role: "user", content: prompt }
          ],
          response_format: { type: "json_object" },
          temperature: 0.1,
          timeout: 8
        };
        
        const r = await fetchWithTimeout(OPENAI_URL, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_KEY}`
          },
          body: JSON.stringify(body)
        }, 10000);
        
        if (!r.ok) {
          const errData = await r.json().catch(() => ({}));
          throw new Error(`OpenAI error ${r.status}: ${errData.error?.message || 'Unknown'}`);
        }
        
        const d = await r.json();
        const content = d.choices?.[0]?.message?.content;
        if (!content) throw new Error('Empty response from OpenAI');
        
        return JSON.parse(content);
      }, 2, 800);
    } catch (e) {
      console.error('❌ OpenAI JSON Error:', e.message);
      return null;
    }
  },

  // OpenAI for text responses (when Gemini fails) - More dynamic & interactive
  askOpenAIText: async (prompt, system) => {
    if (!OPENAI_KEY) {
      console.warn('⚠️ OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in .env file');
      return null;
    }
    
    if (OPENAI_KEY.includes('your_') || OPENAI_KEY === 'sk-' || OPENAI_KEY.length < 20) {
      console.warn('⚠️ OpenAI API key appears invalid. Current key:', OPENAI_KEY?.substring(0, 10) + '...');
      return null;
    }
    
    try {
      console.log('🔄 Calling OpenAI API with key:', OPENAI_KEY?.substring(0, 10) + '...');
      return await retryWithBackoff(async () => {
        const body = {
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: system || "You are CounterOS, an intelligent business advisor. Be concise, practical, and highly specific to the user's business metrics. Use markdown formatting with bold and line breaks." },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 300,
          top_p: 0.9
        };
        
        const r = await fetchWithTimeout(OPENAI_URL, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_KEY}`
          },
          body: JSON.stringify(body)
        }, 10000);
        
        if (!r.ok) {
          const errData = await r.json().catch(() => ({}));
          const errMsg = errData.error?.message || `HTTP ${r.status}`;
          throw new Error(`OpenAI error: ${errMsg}`);
        }
        
        const d = await r.json();
        const content = d.choices?.[0]?.message?.content;
        if (!content) throw new Error('Empty response from OpenAI');
        
        console.log('✅ OpenAI response received successfully');
        return content.trim();
      }, 2, 800);
    } catch (e) {
      console.error('❌ OpenAI Text Error:', e.message);
      console.warn('💡 Tip: Make sure VITE_OPENAI_API_KEY is set in .env file');
      return null;
    }
  },

  getFormSuggestions: async (businessType) => {
    const prompt = `Return a JSON object with 3 arrays for a "${businessType}" retail shop in India:
    1. products: 6 most common product names.
    2. categories: 4 relevant inventory categories.
    3. units: common units used (e.g., kg, unit, ml, strip).
    Return strictly JSON: {"products": [], "categories": [], "units": []}`;
    
    try {
      const res = await Intelligence.askOpenAI(prompt, "You are an inventory expert for Indian retail businesses.");
      if (res) return res;
    } catch (e) {
      console.error('GetFormSuggestions error:', e);
    }
    
    // Fallback suggestions by business type - Comprehensive mapping
    const fallbacks = {
      'Agri Retailer': { 
        products: ['IFFCO DAP', 'Urea 46%', 'Corteva Seeds', 'Gromor Amino', 'Jain Chemicals', 'Premium Soil'],
        categories: ['Fertilizers', 'Seeds', 'Pesticides', 'Chemicals'],
        units: ['bag', 'pack', 'bottle', 'container']
      },
      'Food & Grocery': {
        products: ['Rice Basmati', 'Wheat Flour', 'Mustard Oil', 'Dal Mixed', 'Sugar', 'Tea Powder'],
        categories: ['Grains', 'Flour', 'Oils', 'Legumes'],
        units: ['kg', 'ltr', 'units', 'pack']
      },
      'Pharmacy': {
        products: ['Aspirin 500mg', 'Vitamin D3', 'Cough Syrup', 'Glucose Biscuits', 'First Aid Kit', 'Hand Sanitizer'],
        categories: ['Analgesics', 'Vitamins', 'Cough & Cold', 'Nutrition'],
        units: ['strip', 'bottle', 'pack', 'kit']
      },
      'Hardware & Tools': {
        products: ['Hammer 500g', 'Drill Impact', 'Paint Brush Set', 'Wood Nails', 'Safety Gloves', 'Tape Measure'],
        categories: ['Hand Tools', 'Power Tools', 'Painting', 'Fasteners'],
        units: ['piece', 'set', 'pack', 'box']
      },
      'Textile & Fashion': {
        products: ['Cotton T-Shirt', 'Denim Jeans', 'Silk Saree', 'Cotton Bedsheet', 'Casual Shoes', 'Scarf'],
        categories: ['T-Shirts', 'Jeans', 'Traditional', 'Bedding'],
        units: ['piece', 'yard', 'set', 'pair']
      },
      'Electronics': {
        products: ['USB Cable', 'Phone Charger', 'Screen Protector', 'Phone Stand', 'Bluetooth Speaker', 'Power Bank'],
        categories: ['Cables', 'Chargers', 'Accessories', 'Audio'],
        units: ['piece', 'pack', 'set', 'units']
      }
    };
    
    return fallbacks[businessType] || fallbacks['Food & Grocery'];
  },

  getProductDefaults: async (productName, businessType) => {
    const prompt = `For the product "${productName}" in a "${businessType}" shop, what are the most likely common:
    1. category
    2. unit
    Return strictly JSON: {"category": "...", "unit": "..."}`;
    
    try {
      const res = await Intelligence.askOpenAI(prompt, "You are a retail product mapping expert.");
      if (res?.category && res?.unit) return res;
    } catch (e) {
      console.error('GetProductDefaults error:', e);
    }
    
    // Fallback intelligent guessing based on product name
    const nameUpper = productName.toUpperCase();
    const isWeight = /kg|gram|gm|g\b|liter|ltr|ml|pound|oz/.test(nameUpper);
    const isContainer = /bottle|can|box|pack|strip|tablet|capsule|container|kit|set/.test(nameUpper);
    
    let categoryGuess = 'General', unitGuess = 'units';
    
    if (nameUpper.includes('FERTILIZER') || nameUpper.includes('DAP') || nameUpper.includes('UREA')) {
      categoryGuess = 'Fertilizers';
      unitGuess = 'bag';
    } else if (nameUpper.includes('SEED') || nameUpper.includes('DELEGATE')) {
      categoryGuess = 'Seeds';
      unitGuess = 'pack';
    } else if (nameUpper.includes('OIL')) {
      categoryGuess = 'Oils';
      unitGuess = 'ltr';
    } else if (nameUpper.includes('RICE') || nameUpper.includes('WHEAT') || nameUpper.includes('FLOUR')) {
      categoryGuess = 'Grains';
      unitGuess = isWeight ? 'kg' : 'pack';
    } else if (nameUpper.includes('TABLET') || nameUpper.includes('CAPSULE') || nameUpper.includes('STRIP') || nameUpper.includes('MEDICINE')) {
      categoryGuess = 'Medicine';
      unitGuess = 'strip';
    } else if (nameUpper.includes('HAMMER') || nameUpper.includes('TOOL') || nameUpper.includes('DRILL')) {
      categoryGuess = 'Hand Tools';
      unitGuess = 'piece';
    } else if (nameUpper.includes('SHIRT') || nameUpper.includes('JEANS') || nameUpper.includes('SAREE') || nameUpper.includes('TEXTILE')) {
      categoryGuess = 'Apparel';
      unitGuess = 'piece';
    } else if (isContainer) {
      unitGuess = 'bottle';
    } else if (isWeight) {
      unitGuess = 'kg';
    }
    
    return { category: categoryGuess, unit: unitGuess };
  },

  generateInventory: async (category) => {
    try {
      // Use OpenAI for better inventory generation
      const prompt = `Return a JSON array of 6 realistic wholesale products for a "${category}" retail shop in India.
      Fields: name, cat, unit, qty (random 5-50), buy (INR cost), sell (10-20% margin), icon (material icon name), clr (hex), earn (sell-buy).
      Return strictly JSON: {"data": [...]}`;
      
      const res = await Intelligence.askOpenAI(prompt, "You are an inventory generator.");
      if (res?.data && Array.isArray(res.data)) {
        // Map to correct business category code
        const catMap = {
          'Agri Retailer': 'agri',
          'Food & Grocery': 'food',
          'Pharmacy': 'pharma',
          'Hardware & Tools': 'hardware',
          'Textile & Fashion': 'textile',
          'Electronics': 'electronics'
        };
        const businessCat = catMap[category] || category.toLowerCase().substring(0, 5);
        return res.data.map((x, i) => ({ ...x, id: i + 1, businessCat }));
      }
    } catch (e) {
      console.error('❌ Inventory Generation Error:', e.message);
    }
    
    // Smart fallback mapping based on category name
    const categoryMap = {
      'agri': 'Agri Retailer',
      'food': 'Food & Grocery',
      'pharma': 'Pharmacy',
      'hardware': 'Hardware & Tools',
      'textile': 'Textile & Fashion',
      'electronics': 'Electronics'
    };
    
    // Try direct key match first
    let fallbackKey = FALLBACK_INVENTORY[category] ? category : null;
    
    // Try mapped key if direct match fails
    if (!fallbackKey) {
      const mappedKey = categoryMap[category.toLowerCase()];
      fallbackKey = mappedKey && FALLBACK_INVENTORY[mappedKey] ? mappedKey : null;
    }
    
    // Try fuzzy matching if still not found
    if (!fallbackKey) {
      fallbackKey = Object.keys(FALLBACK_INVENTORY).find(k => 
        category.toLowerCase().includes(k.toLowerCase().split(' ')[0]) ||
        k.toLowerCase().includes(category.toLowerCase().split(' ')[0])
      ) || 'Food & Grocery';
    }
    
    console.log(`✅ Using fallback inventory for: ${fallbackKey}`);
    
    // Get business category code from fallback key
    const reverseCatMap = {
      'Agri Retailer': 'agri',
      'Food & Grocery': 'food',
      'Pharmacy': 'pharma',
      'Hardware & Tools': 'hardware',
      'Textile & Fashion': 'textile',
      'Electronics': 'electronics'
    };
    const businessCat = reverseCatMap[fallbackKey] || 'food';
    
    // Add businessCat field to each item
    return FALLBACK_INVENTORY[fallbackKey].map(item => ({
      ...item,
      businessCat
    }));
  },

  readInvoice: async (b64, mimeType = 'image/jpeg') => {
    try {
      return await retryWithBackoff(async () => {
        const prompt = `Extract details from this invoice image and return ONLY JSON: distributor_name, invoice_number, invoice_date, total_value, products (name, category, quantity, unit, unit_price, total_price).`;
        const contents = [{ parts: [{ inlineData: { data: b64, mimeType } }, { text: prompt }] }];
        
        const r = await fetchWithTimeout(GEMINI_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            contents, 
            generationConfig: { temperature: 0.1, responseMimeType: 'application/json', maxOutputTokens: 1000 } 
          })
        }, 15000); // Longer timeout for vision tasks
        
        if (!r.ok) throw new Error(`Invoice read failed: ${r.status}`);
        const d = await r.json();
        const text = d.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error('No invoice data extracted');
        
        return JSON.parse(text);
      }, 1, 1000);
    } catch(e) {
      console.error('❌ Invoice Reading Error:', e.message);
      return null;
    }
  },

  // Helper: Get fallback products for a specific category
  getFallbackProducts: (category) => {
    const categoryMap = {
      'agri': 'Agri Retailer',
      'food': 'Food & Grocery',
      'pharma': 'Pharmacy',
      'hardware': 'Hardware & Tools',
      'textile': 'Textile & Fashion',
      'electronics': 'Electronics'
    };
    
    const key = categoryMap[category] || categoryMap['food'];
    const inventory = FALLBACK_INVENTORY[key] || FALLBACK_INVENTORY['Food & Grocery'];
    return inventory.map(item => item.name);
  },

  // Helper: Get fallback categories for a specific business category
  getFallbackCategories: (category) => {
    const categoryMap = {
      'agri': 'Agri Retailer',
      'food': 'Food & Grocery',
      'pharma': 'Pharmacy',
      'hardware': 'Hardware & Tools',
      'textile': 'Textile & Fashion',
      'electronics': 'Electronics'
    };
    
    const fallbacks = {
      'Agri Retailer': ['Fertilizers', 'Seeds', 'Pesticides', 'Chemicals', 'Soil & Nutrients'],
      'Food & Grocery': ['Grains', 'Flour', 'Oils', 'Legumes', 'Sweeteners', 'Beverages'],
      'Pharmacy': ['Analgesics', 'Vitamins', 'Cough & Cold', 'Nutrition', 'First Aid', 'Hygiene'],
      'Hardware & Tools': ['Hand Tools', 'Power Tools', 'Painting', 'Fasteners', 'Safety', 'Measuring'],
      'Textile & Fashion': ['T-Shirts', 'Jeans', 'Traditional', 'Bedding', 'Footwear', 'Scarves'],
      'Electronics': ['Cables', 'Chargers', 'Accessories', 'Audio', 'Power Banks', 'Stands']
    };
    
    const key = categoryMap[category] || categoryMap['food'];
    return fallbacks[key] || fallbacks['Food & Grocery'];
  },

  // Helper: Get fallback units for a specific business category
  getFallbackUnits: (category) => {
    const categoryMap = {
      'agri': 'Agri Retailer',
      'food': 'Food & Grocery',
      'pharma': 'Pharmacy',
      'hardware': 'Hardware & Tools',
      'textile': 'Textile & Fashion',
      'electronics': 'Electronics'
    };
    
    const fallbacks = {
      'Agri Retailer': ['bag', 'pack', 'bottle', 'container', 'kg', 'liter'],
      'Food & Grocery': ['kg', 'ltr', 'units', 'pack', 'gram', 'ml'],
      'Pharmacy': ['strip', 'bottle', 'pack', 'kit', 'piece', 'units'],
      'Hardware & Tools': ['piece', 'set', 'pack', 'box', 'meter', 'dozen'],
      'Textile & Fashion': ['piece', 'yard', 'set', 'pair', 'meter', 'bundle'],
      'Electronics': ['piece', 'pack', 'set', 'units', 'bundle', 'box']
    };
    
    const key = categoryMap[category] || categoryMap['food'];
    return fallbacks[key] || fallbacks['Food & Grocery'];
  },

  // Smart AI fallback: Analyzes actual business data when API fails - HIGHLY DYNAMIC
  analyzeBusinessData: (businessContext) => {
    try {
      // Extract data from system context
      const nameMatch = businessContext.match(/Retailer:\s*([^|]+)/);
      const catMatch = businessContext.match(/Business Category:\s*([^\n]+)/);
      const walletMatch = businessContext.match(/Wallet Balance:\s*₹([\d,]+)/);
      const invCountMatch = businessContext.match(/Inventory Count:\s*(\d+)/);
      const lowStockMatch = businessContext.match(/Low Stock Alerts:\s*([^\n]+)/);
      const topProdMatch = businessContext.match(/Highest Margin Product:\s*([^\n]+)/);

      const retailerName = nameMatch?.[1]?.trim() || 'friend';
      const category = catMatch?.[1]?.trim() || 'retail';
      const wallet = parseInt(walletMatch?.[1]?.replace(/,/g, '') || '0');
      const invCount = parseInt(invCountMatch?.[1] || '0');
      const lowStock = lowStockMatch?.[1]?.trim() || 'none';
      const topProd = topProdMatch?.[1]?.trim() || 'products';

      // Parse inventory data for deeper insights
      const lines = businessContext.split('\n').filter(l => l.includes('- '));
      let avgMargin = 0, highEarners = [], lowMargin = [], totalQty = 0, totalBuy = 0;
      
      lines.forEach(line => {
        const earnMatch = line.match(/Profit: ₹([\d.]+)/);
        const qtyMatch = line.match(/(\d+)\s+({\w+}|bag|piece|strip|kg|ltr)/);
        const buyMatch = line.match(/Buy: ₹([\d.]+)/);
        const namePartMatch = line.match(/- ([^:]+):/);
        
        if (earnMatch && namePartMatch) {
          const earn = parseFloat(earnMatch[1]);
          const prodName = namePartMatch[1].trim();
          avgMargin += earn;
          if (earn > 50) highEarners.push({ name: prodName, profit: earn });
          else if (earn < 20) lowMargin.push({ name: prodName, profit: earn });
        }
        if (qtyMatch) totalQty += parseInt(qtyMatch[1]);
        if (buyMatch) totalBuy += parseFloat(buyMatch[1]);
      });
      
      if (lines.length > 0) avgMargin = Math.round(avgMargin / lines.length);

      // VARIED response patterns - pick random insights
      const patterns = [];

      // Pattern: Low stock urgency
      if (lowStock !== 'none' && lowStock !== '') {
        const urgencyPhrases = [
          `🚨 **URGENT:** ${lowStock} running out! Reorder ASAP to prevent lost sales.`,
          `⚠️ **Low Stock Critical:** ${lowStock} need immediate restocking. This is costing you earnings!`,
          `📉 **Stock Depletion Alert:** ${lowStock} are at critical levels. Customers will go to competitors if you run out.`
        ];
        patterns.push(urgencyPhrases[Math.floor(Math.random() * urgencyPhrases.length)]);
      } else {
        patterns.push(`✅ Good inventory levels overall. All ${invCount} products are sufficiently stocked.`);
      }

      // Pattern: Profit optimization varied messages
      if (highEarners.length > 0) {
        const topEarner = highEarners[0];
        const profitPhrases = [
          `💎 **Star Performer:** ${topEarner.name} - your cash cow with ₹${topEarner.profit}+ profit per unit! Push sales on this.`,
          `🎯 **Maximum Opportunity:** ${topEarner.name} generates ₹${topEarner.profit} per sale. Stock this item prominently!`,
          `💰 **Revenue Booster:** ${topEarner.name} brings ₹${topEarner.profit}/unit profit. Make this your #1 selling item.`
        ];
        patterns.push(profitPhrases[Math.floor(Math.random() * profitPhrases.length)]);
      }

      // Pattern: Margin optimization varied messages
      if (lowMargin.length > 0) {
        const lowItem = lowMargin[0];
        const marginPhrases = [
          `💸 **Pricing Issue:** ${lowItem.name} only returns ₹${lowItem.profit} profit. Negotiate better rates with suppliers or raise price.`,
          `📊 **Low ROI Alert:** ${lowItem.name} at low margin. Either increase price or reduce cost base.`,
          `⚡ **Quick Win:** Raise prices on ${lowItem.name} by 15% to boost margins significantly.`
        ];
        patterns.push(marginPhrases[Math.floor(Math.random() * marginPhrases.length)]);
      }

      // Pattern: Cash flow varied messages
      const cashFlowPhrases = wallet > 10000 
        ? [
            `🏦 **Strong Cash Position:** ₹${wallet.toLocaleString('en-IN')} balance. Opportunity to stock premium, high-margin items!`,
            `💵 **Financial Strength:** With ₹${wallet.toLocaleString('en-IN')}, you can negotiate bulk discounts. Seize this advantage!`
          ]
        : wallet > 5000
        ? [
            `💰 **Moderate Liquidity:** ₹${wallet.toLocaleString('en-IN')} available. Focus on fast-selling items to maintain flow.`,
            `⚙️ **Optimize Inventory:** With ₹${wallet.toLocaleString('en-IN')}, stock only proven sellers to maximize turnover.`
          ]
        : [
            `⚡ **Cash Constraint Mode:** ₹${wallet.toLocaleString('en-IN')} balance. Accelerate sales on existing stock ASAP.`,
            `🔥 **Urgent Liquidity:** Low cash (₹${wallet.toLocaleString('en-IN')}). Push quick sales to generate working capital.`
          ];
      patterns.push(cashFlowPhrases[Math.floor(Math.random() * cashFlowPhrases.length)]);

      // Pattern: Category-specific strategies (VARIED)
      const catStrategies = {
        'pharma': [
          `💊 **Pharmacy Strategy:** Expiry dates are gold - organize by date. Customers trust expiry-aware pharmacies.`,
          `🏥 **Pharmacy Opportunity:** Bundle vitamins + cold meds. Customers often need multiple items.`,
          `💼 **Pharmacy Edge:** Build loyalty - remember regular customers' preferences. Repeat customers = stable revenue.`
        ],
        'food': [
          `🍎 **Grocery Strategy:** Seasonal products. Stock in-season items to maximize margins.`,
          `🛒 **Food Tip:** FIFO is critical - rotate stock daily. One spoiled item damages trust.`,
          `📦 **Bulk Opportunity:** Food items = bulk sales potential. Offer 10% discount for ₹500+ purchases.`
        ],
        'hardware': [
          `🔧 **Hardware Strategy:** Customers need advice. Train yourself on product uses - boost add-on sales.`,
          `🛠️ **Tool Sales:** Bundle complementary items (drill + bits, hammer + nails). Increases basket size 3x.`,
          `⚙️ **Display Matters:** Premium tools in front window = impulse buys. Organize by use-case.`
        ],
        'textile': [
          `👕 **Fashion Strategy:** Sizes matter more than quantity. Stock varied sizes in each item.`,
          `🧵 **Seasonal Key:** Winter = warm clothes, Summer = light wear. Plan 2 months ahead.`,
          `💫 **Fashion Trend:** Quality over quantity. One premium brand outsells 5 cheap items.`
        ],
        'electronics': [
          `📱 **Tech Strategy:** Warranty > Price. Position yourself as trustworthy. Long-term customers > one-time sales.`,
          `🔌 **Accessory Goldmine:** Cables, chargers, covers = high-margin, fast-moving. Stock heavily.`,
          `⚡ **Demo Advantage:** Let customers test products. Hands-on experience = higher conversion.`
        ],
        'agri': [
          `🌾 **Seasonal Farming:** Monitor monsoon/harvest calendars. Stock accordingly.`,
          `🥕 **Bulk Sales:** Farmers buy in bulk. Offer volume discounts - they'll return every season.`,
          `📍 **Local Advantage:** Know local crop patterns. Tailor inventory to region - beat competitors.`
        ]
      };
      
      const catKey = Object.keys(catStrategies).find(k => category.toLowerCase().includes(k));
      const strategies = catStrategies[catKey] || catStrategies['food'];
      patterns.push(strategies[Math.floor(Math.random() * strategies.length)]);

      // Pattern: Varied action items
      const actionPhrases = [
        `\n🎯 **Today's Action:** ${lowStock !== 'none' ? `Make one call to reorder ${lowStock.split(',')[0]}` : `Focus sales on ${topProd}`}`,
        `\n⚡ **Do This Now:** ${lowStock !== 'none' ? `Contact supplier for ${lowStock.split(',')[0]} - don't lose sales!` : `Push ${topProd} in every transaction`}`,
        `\n💪 **Make It Happen:** ${wallet < 5000 ? 'Convert today\'s stock to cash - run promotions!' : 'Stock high-margin items aggressively'}`
      ];
      patterns.push(actionPhrases[Math.floor(Math.random() * actionPhrases.length)]);

      return patterns.join('\n\n');
    } catch (e) {
      console.error('❌ Business Analysis Error:', e.message);
      return "I'm analyzing your business. Check back soon for recommendations!";
    }
  }
};
