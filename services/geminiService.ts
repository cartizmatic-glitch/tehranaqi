import { GoogleGenAI } from "@google/genai";
import { AQIData, AQILevel, GroundingSource } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchTehranAQI = async (): Promise<AQIData> => {
  try {
    const model = 'gemini-2.5-flash';
    // Prompt improved to target official sources and request structured output
    const prompt = `
      لطفاً در گوگل عبارت "شاخص آنلاین کیفیت هوای تهران شرکت کنترل کیفیت هوا" (airnow.tehran.ir) را جستجو کن.
      هدف پیدا کردن دقیق‌ترین عدد شاخص آلودگی (AQI) در همین لحظه (شاخص آنلاین) است.
      
      پاسخ را دقیقاً با فرمت زیر تولید کن:
      AQI: [فقط عدد انگلیسی]
      Summary: [وضعیت هوا و یک توصیه کوتاه بهداشتی در حد دو جمله. اگر زمان بروزرسانی شاخص در سایت مشخص بود، آن را هم ذکر کن]
      
      نکته: اگر عدد آنلاین پیدا نشد، عدد ۲۴ ساعت گذشته را بنویس اما در متن اشاره کن که میانگین ۲۴ ساعت است.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "اطلاعاتی یافت نشد.";
    
    // Extract Sources
    const sources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || 'منبع وب',
            uri: chunk.web.uri,
          });
        }
      });
    }

    // Improved extraction logic matches "AQI: 123"
    const aqiMatch = text.match(/AQI[:\s]*(\d+)/i) || text.match(/شاخص[:\s]*(\d+)/);
    const aqiValue = aqiMatch ? parseInt(aqiMatch[1], 10) : null;

    let level: AQILevel = AQILevel.Unknown;
    
    if (aqiValue !== null) {
        if (aqiValue <= 50) level = AQILevel.Good;
        else if (aqiValue <= 100) level = AQILevel.Moderate;
        else if (aqiValue <= 150) level = AQILevel.UnhealthySensitive;
        else if (aqiValue <= 200) level = AQILevel.Unhealthy;
        else if (aqiValue <= 300) level = AQILevel.VeryUnhealthy;
        else level = AQILevel.Hazardous;
    } else {
        // Fallback textual analysis
        if (text.includes("خطرناک")) level = AQILevel.Hazardous;
        else if (text.includes("بسیار ناسالم")) level = AQILevel.VeryUnhealthy;
        else if (text.includes("ناسالم برای")) level = AQILevel.UnhealthySensitive;
        else if (text.includes("ناسالم")) level = AQILevel.Unhealthy;
        else if (text.includes("سالم") || text.includes("قابل قبول")) level = AQILevel.Moderate;
        else if (text.includes("پاک")) level = AQILevel.Good;
    }

    // Clean up summary by removing the 'AQI: ...' line to avoid duplication in UI
    let summary = text;
    if (aqiMatch && aqiMatch[0]) {
      // Remove the line containing the AQI match
      summary = text.replace(new RegExp(`^.*${aqiMatch[0]}.*$\n?`, 'm'), '').trim();
    }
    // Remove "Summary:" prefix if present from model output
    summary = summary.replace(/^Summary[:\s]*/i, '').trim();

    const recommendation = summary; // Using the cleaned summary for display

    return {
      aqi: aqiValue,
      level,
      summary,
      recommendation,
      sources,
      lastUpdated: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };

  } catch (error) {
    console.error("Error fetching AQI:", error);
    throw error;
  }
};