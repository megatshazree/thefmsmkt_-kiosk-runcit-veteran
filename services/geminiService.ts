import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { GeminiResponse, AnonymizedCustomerAnalytics, CartItem, SupplierInfo, BuyerInfo, EInvoiceDetails, EInvoiceLineItem } from '../types';

// API_KEY is assumed to be set in the environment as process.env.API_KEY
// The GoogleGenAI client must be initialized with the API key directly from the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const textModel = 'gemini-2.5-flash-preview-04-17';
const imageGenerationModel = 'imagen-3.0-generate-002';

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
    console.error("Failed to parse JSON response from Gemini:", e, "Original text:", text);
    return { error: "Failed to parse JSON", originalText: text.substring(0, 500) };
  }
};


export const generateProductDescription = async (productName: string, category: string, keywords: string): Promise<GeminiResponse<string>> => {
  const prompt = `Anda adalah pembantu AI untuk sistem POS. Jana deskripsi produk yang menarik dan ringkas (sekitar 2-3 ayat) untuk produk berikut:\nNama Produk: ${productName}\nKategori: ${category || 'Tidak dinyatakan'}\nKata Kunci: ${keywords || 'Tiada'}\n\nFormatkan deskripsi dengan baik. Berikan hanya deskripsi produk, tanpa pengenalan tambahan.`;
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: textModel,
      contents: prompt,
    });
    const textResponse = response.text;
    if (textResponse && textResponse.trim() !== "") {
        return { data: textResponse.trim(), error: null };
    } else {
        return { data: null, error: "Gemini returned an empty description." };
    }
  } catch (error) {
    console.error("Error generating product description:", error);
    const errorMessage = (error instanceof Error) ? error.message : "An unknown error occurred while generating description.";
    return { data: null, error: errorMessage };
  }
};

export const getRelatedProductSuggestions = async (cartItemNames: string, productCatalogNames: string): Promise<GeminiResponse<string[]>> => {
  const prompt = `Pelanggan ini mempunyai item berikut dalam troli: ${cartItemNames}. Cadangkan 2-3 produk tambahan yang mungkin diminati pelanggan ini dari senarai produk katalog berikut: ${productCatalogNames}. Berikan cadangan sebagai senarai ringkas, setiap cadangan pada baris baru, dimulai dengan tanda sempang (-). Contoh: - Produk X. Berikan hanya senarai produk, tanpa pengenalan tambahan.`;
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: textModel,
      contents: prompt,
    });
    const textResponse = response.text;
    if (textResponse) {
      const suggestions = textResponse.split('\n').map(s => s.replace(/^- /,'').trim()).filter(s => s);
      if (suggestions.length > 0) {
        return { data: suggestions, error: null };
      } else {
        return { data: null, error: "Gemini returned no suggestions or an empty list." };
      }
    }
    return { data: null, error: "Gemini returned no text response for suggestions." };
  } catch (error) {
    console.error("Error getting product suggestions:", error);
    const errorMessage = (error instanceof Error) ? error.message : "An unknown error occurred while getting suggestions.";
    return { data: null, error: errorMessage };
  }
};

export const summarizeReportData = async (reportData: string): Promise<GeminiResponse<string>> => {
  const prompt = `Anda adalah penganalisis data AI. Berdasarkan data laporan berikut, berikan ringkasan eksekutif (2-3 ayat utama) mengenai tren jualan dan pemerhatian penting:\n${reportData}\n\nFokus pada tren utama dan sebarang anomali jika ada. Berikan hanya ringkasan, tanpa pengenalan tambahan.`;
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: textModel,
      contents: prompt,
    });
    const textResponse = response.text;
     if (textResponse && textResponse.trim() !== "") {
        return { data: textResponse.trim(), error: null };
    } else {
        return { data: null, error: "Gemini returned an empty summary." };
    }
  } catch (error) {
    console.error("Error summarizing report data:", error);
    const errorMessage = (error instanceof Error) ? error.message : "An unknown error occurred while summarizing data.";
    return { data: null, error: errorMessage };
  }
};

export const getDemographicInsightSummary = async (analytics: AnonymizedCustomerAnalytics, currentLang: 'ms' | 'en'): Promise<GeminiResponse<string>> => {
  let demographicDetails = [];
  if (analytics.ageGroup) demographicDetails.push(`Age Group: ${analytics.ageGroup}`);
  if (analytics.gender) demographicDetails.push(`Gender: ${analytics.gender}`);
  if (analytics.sentiment) demographicDetails.push(`Sentiment: ${analytics.sentiment}`);
  
  const detailsString = demographicDetails.join(', ');
  const langInstruction = currentLang === 'ms' ? "Berikan cerapan dalam Bahasa Malaysia." : "Provide the insight in English.";

  const prompt = `Anda adalah penganalisis perniagaan AI. Untuk pelanggan dengan profil berikut: ${detailsString}, berikan satu cerapan perniagaan generik atau cadangan pemasaran yang mungkin relevan (1-2 ayat). ${langInstruction} Contoh: "Pelanggan dalam segmen ini mungkin menghargai promosi kesetiaan." atau "Pertimbangkan untuk menonjolkan produk mesra keluarga." Berikan hanya cerapan, tanpa pengenalan tambahan.`;
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: textModel,
      contents: prompt,
    });
    const textResponse = response.text;
    if (textResponse && textResponse.trim() !== "") {
        return { data: textResponse.trim(), error: null };
    } else {
        return { data: null, error: "Gemini returned an empty insight summary." };
    }
  } catch (error) {
    console.error("Error generating demographic insight summary:", error);
    const errorMessage = (error instanceof Error) ? error.message : "An unknown error occurred while generating insight.";
    return { data: null, error: errorMessage };
  }
};


export const getStructuredDataExample = async (promptText: string): Promise<GeminiResponse<any>> => {
  try {
    const response = await ai.models.generateContent({
      model: textModel,
      contents: promptText,
      config: {
        responseMimeType: "application/json",
      }
    });
    const parsedJson = parseJsonFromText(response.text);
    if (parsedJson.error) { // Check if parseJsonFromText itself returned an error object
        return { data: null, error: `JSON parsing failed: ${parsedJson.error}. Original text: ${parsedJson.originalText}` };
    }
    return { data: parsedJson, error: null };
  } catch (error) {
    console.error("Error getting structured data from Gemini:", error);
    const errorMessage = (error instanceof Error) ? error.message : "API call failed for structured data.";
    return { data: null, error: errorMessage };
  }
};

export const generateSimulatedEInvoiceData = async (
  cartItems: CartItem[],
  overallDiscount: number,
  taxRate: number, // e.g., 0.06 for 6%
  grandTotal: number,
  paymentMethod: string,
  supplierInfo: SupplierInfo,
  buyerInfo: BuyerInfo, // Can be partial for walk-in
  language: 'ms' | 'en'
): Promise<GeminiResponse<EInvoiceDetails>> => {
  const lineItemsFormatted = cartItems.map(item => {
    const itemSubtotal = item.price * item.quantity;
    return {
      description: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
      totalPrice: itemSubtotal, 
      category: item.category
    };
  });

  const prompt = `
    Anda adalah AI yang membantu menjana data E-Invois yang disimulasikan untuk sistem POS, mematuhi format asas LHDN Malaysia.
    Hasilkan objek JSON SAHAJA berdasarkan butiran transaksi berikut. Pastikan semua nilai numerik adalah nombor, bukan string.

    Butiran Pembekal:
    ${JSON.stringify(supplierInfo, null, 2)}

    Butiran Pembeli (mungkin minimum untuk pelanggan walk-in):
    ${JSON.stringify(buyerInfo, null, 2)}

    Item-item Belian:
    ${JSON.stringify(lineItemsFormatted, null, 2)}

    Ringkasan Transaksi:
    - Diskaun Keseluruhan Pesanan: RM ${overallDiscount.toFixed(2)}
    - Kadar Cukai (SST): ${(taxRate * 100).toFixed(0)}%
    - Jumlah Keseluruhan (termasuk cukai & selepas diskaun): RM ${grandTotal.toFixed(2)}
    - Mod Pembayaran: ${paymentMethod}
    - Mata Wang: MYR

    Tugas Anda:
    Jana objek JSON untuk E-Invois. Struktur JSON perlu mengandungi medan berikut:
    - invoiceId: String (Hasilkan ID invois unik yang disimulasikan, cth., "SIM-INV-" + tarikh + nombor siri)
    - dateTimeStamp: String (Timestamp semasa dalam format ISO 8601 UTC, cth., "YYYY-MM-DDTHH:mm:ssZ")
    - validationDateTimeStamp: String (Timestamp semasa + beberapa saat, juga ISO 8601 UTC, untuk simulasi pengesahan)
    - supplier: Objek (gunakan data supplierInfo yang diberi)
    - buyer: Objek (gunakan data buyerInfo yang diberi; jika nama/tin tiada, guna nilai null atau string kosong yang sesuai)
    - lineItems: Array objek, setiap objek mengandungi:
        - classificationCode: String (Pilihan - jika boleh, jana kod klasifikasi produk simulasi berdasarkan kategori item, cth., "010101" untuk makanan. Jika tidak pasti, guna "000000".)
        - description: String (Nama item)
        - quantity: Number
        - unitPrice: Number (Harga seunit sebelum cukai)
        - totalPrice: Number (quantity * unitPrice)
        - taxType: String (cth., "SST")
        - taxRate: Number (cth., ${taxRate})
        - taxAmount: Number (Cukai untuk item ini = totalPrice * taxRate)
        - discountAmount: Number (Diskaun untuk item ini - anggap 0 untuk simulasi ini)
        - amountExcludingTax: Number (totalPrice - discountAmount)
        - amountIncludingTax: Number (amountExcludingTax + taxAmount)
    - subTotal: Number (Jumlah semua 'totalPrice' dari lineItems)
    - discountAmount: Number (Diskaun keseluruhan pesanan yang diberi)
    - taxableAmount: Number (subTotal - discountAmount)
    - totalTaxAmount: Number (Jumlah semua 'taxAmount' dari lineItems, atau (taxableAmount * taxRate) jika lebih mudah diselaraskan)
    - totalAmountIncludingTax: Number (Jumlah keseluruhan yang diberi)
    - paymentMode: String (Mod pembayaran yang diberi)
    - currencyCode: String ("MYR")
    - irbmUniqueId: String (Hasilkan ID unik simulasi dari IRBM, cth., gabungan rawak huruf & nombor, 15-20 aksara)
    - validationUrl: String (URL pengesahan simulasi, cth., "https://myinvois.hasil.gov.my/sim/check/{irbmUniqueId}")
    - qrCodeData: String (Data simulasi untuk Kod QR. Gabungkan beberapa elemen penting seperti: validationUrl|invoiceId|totalAmountIncludingTax|supplier.tin|buyer.tin (jika ada)|dateTimeStamp. Formatkan sebagai string dipisahkan paip.)
    - notes: String (Contoh: "E-Invois Simulasi Dijana oleh Sistem POS THEFMSMKT")

    PENTING:
    1.  Pastikan SEMUA nilai kewangan mempunyai dua tempat perpuluhan.
    2.  Pastikan jumlah keseluruhan, cukai, dan subtotal adalah konsisten. Sesuaikan 'taxAmount' per item jika perlu untuk memastikan 'totalTaxAmount' dan 'totalAmountIncludingTax' adalah tepat berdasarkan input yang diberi. Utamakan 'grandTotal' yang diberi sebagai nilai akhir yang betul.
    3.  Bahasa untuk nota dan mana-mana teks yang dijana (jika ada) hendaklah dalam ${language === 'ms' ? 'Bahasa Malaysia' : 'English'}.
    4.  Output mestilah HANYA objek JSON yang sah. Tiada teks tambahan sebelum atau selepas JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: textModel,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are an expert system designed to generate flawless Malaysian LHDN E-Invoice JSON data based on provided transaction details. Adhere strictly to the requested JSON format and ensure all calculations are accurate. Output ONLY the JSON object.",
      }
    });

    const parsedJson = parseJsonFromText(response.text);

    if (parsedJson.error) {
      return { data: null, error: `JSON parsing failed for E-Invoice: ${parsedJson.error}. Original text: ${parsedJson.originalText}` };
    }
    
    if (!parsedJson.invoiceId || !parsedJson.supplier || !parsedJson.buyer || !parsedJson.lineItems || !parsedJson.qrCodeData) {
        return { data: null, error: "Generated E-Invoice data is missing crucial fields." };
    }

    return { data: parsedJson as EInvoiceDetails, error: null };

  } catch (error) {
    console.error("Error generating simulated E-Invoice data:", error);
    const errorMessage = (error instanceof Error) ? error.message : "An unknown error occurred while generating E-Invoice data.";
    return { data: null, error: errorMessage };
  }
};

export const generateProductImageWithImagen = async (
  productName: string,
  category: string,
  description?: string
): Promise<GeminiResponse<string>> => {
  const prompt = `High-quality commercial product photography of: ${productName}. Category: ${category}. ${description ? `Details: ${description}` : ''}. Clean white background, well-lit, appealing, professional. Focus on the product itself.`;

  try {
    const response = await ai.models.generateImages({
      model: imageGenerationModel,
      prompt: prompt,
      config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
    });

    if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image.imageBytes) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return { data: base64ImageBytes, error: null };
    } else {
      return { data: null, error: "Imagen returned no image data." };
    }
  } catch (error) {
    console.error("Error generating product image with Imagen:", error);
    const errorMessage = (error instanceof Error) ? error.message : "An unknown error occurred with Imagen service.";
    return { data: null, error: errorMessage };
  }
};