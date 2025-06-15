import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GeminiResponse } from '../types';
import { config } from '../src/config/environment';

// Initialize GoogleGenAI with API key from environment configuration
const ai = config.gemini.apiKey ? new GoogleGenAI({ apiKey: config.gemini.apiKey }) : null;
const textModel = 'gemini-2.5-flash-preview-04-17';

const parseJsonFromText = (text: string): any => {
  let jsonStr = text.trim();
  const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[2]) {
    jsonStr = match[2].trim();
  }
  try {
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Failed to parse JSON response from Gemini (VisionAI):", e, "Original text:", text);
    return { error: "Failed to parse JSON", originalText: text.substring(0, 500) };
  }
};

export interface ExtractedProductDetails {
  name: string;
  category: string;
  sku?: string;
  keywords?: string[]; 
  description?: string;
}

export const extractProductDetailsFromImageText = async (
  imageText: string, 
  currentLang: 'ms' | 'en'
): Promise<GeminiResponse<ExtractedProductDetails>> => {
  if (!ai) {
    return { data: null, error: "Gemini AI is not configured. Please set VITE_GEMINI_API_KEY." };
  }
  
  const langInstruction = currentLang === 'ms' ? "Berikan nama produk, kategori, dan kata kunci dalam Bahasa Malaysia jika sesuai. Deskripsi juga dalam Bahasa Malaysia." : "Provide product name, category, and keywords in English if appropriate. Description also in English.";

  const prompt = `
    Anda adalah AI pembantu untuk sistem POS yang canggih, dengan keupayaan Vision AI.
    Berdasarkan teks berikut, yang disimulasikan sebagai hasil OCR dari imej produk atau bungkusannya, sila ekstrak maklumat produk.
    Teks Input: "${imageText}"

    Tugas Anda:
    1.  Kenal pasti NAMA PRODUK yang paling jelas.
    2.  Cadangkan KATEGORI yang sesuai untuk produk ini (cth: Makanan, Minuman, Pakaian, Elektronik, Barangan Runcit, dll.).
    3.  Jika ada nombor atau kod yang kelihatan seperti SKU (Stock Keeping Unit) atau kod bar, ekstraknya. Jika tiada, biarkan kosong.
    4.  Senaraikan beberapa KATA KUNCI yang relevan (3-5 kata kunci) untuk produk ini. Format sebagai array JSON string.
    5.  Jana DESKRIPSI produk yang ringkas dan menarik (1-2 ayat).
    ${langInstruction}

    Formatkan output anda sebagai objek JSON SAHAJA dengan struktur berikut:
    {
      "name": "Nama Produk Di Sini",
      "category": "Kategori Produk Di Sini",
      "sku": "SKU Di Sini (atau null jika tiada)",
      "keywords": ["kunci1", "kunci2", "kunci3"],
      "description": "Deskripsi produk ringkas di sini."
    }

    Pastikan output adalah JSON yang sah. Jangan tambah sebarang teks pengenalan atau penutup sebelum atau selepas objek JSON.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: textModel,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });
    
    const parsedJson = parseJsonFromText(response.text);

    if (parsedJson.error) {
      return { data: null, error: `JSON parsing failed for extracted details: ${parsedJson.error}. Original text: ${parsedJson.originalText}` };
    }
    
    if (!parsedJson.name || !parsedJson.category) {
        return { data: null, error: "Extracted data is missing required fields (name, category)." }
    }

    return { data: parsedJson as ExtractedProductDetails, error: null };

  } catch (error) {
    console.error("Error extracting product details via Vision AI:", error);
    const errorMessage = (error instanceof Error) ? error.message : "An unknown error occurred with Vision AI service.";
    return { data: null, error: errorMessage };
  }
};