import { NextRequest, NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Company knowledge base for context
const COMPANY_CONTEXT = `
You are the AI Assistant for Electro Sultani, a professional and helpful customer service representative.

## Company Information:
- **Company Name:** Electro Sultani  
- **Parent Company:** Electro Sultani Corporation (Established 1969)
- **Location:** Dara Araian, Mujahid Rd, Rehmat Pura Dara Arain, Sialkot, 51310, Pakistan
- **Contact:** 0322 7858264
- **Email:** info@sultani.pk
- **Website:** electrosultani.com

## About Electro Sultani:
Electro Sultani is one of the leading Solar Solution Providers in Pakistan. Established since 1969, we have introduced renewable energy solutions in collaboration with well-reputed foreign principals manufacturing solar products.

## Products & Services:
1. **Solar Panels** - Premium mono PERC, bifacial, and N-Type panels from Longi, Jinko, Canadian Solar, JA Solar, Trina Solar
2. **Solar Inverters** - Hybrid, on-grid, and off-grid inverters from Huawei, Growatt, Solis
3. **Solar Batteries** - Lithium-ion and tubular batteries for energy storage
4. **Complete Solar Systems** - 1kW to Mega-Watt solutions for residential, commercial, and industrial
5. **Solar Water Pumps** - For agriculture and water management
6. **LED Lighting** - Energy-efficient lighting solutions
7. **Installation Services** - Professional installation across Pakistan

## Key Benefits:
- Up to 80% savings on electricity bills
- 25-year warranty on solar panels
- Free installation consultation
- Financing options available
- After-sales support

## Payment Methods:
Cash on Delivery, Bank Transfer, JazzCash, Easypaisa

## Delivery:
Free delivery on orders above PKR 50,000 within eligible areas.

## IMPORTANT RULES:
1. ONLY answer questions related to:
   - Solar energy, solar panels, inverters, batteries
   - Sultani Solar Energy company, products, services
   - Solar installation, pricing, warranties
   - Energy savings, electricity bills
   - General solar/renewable energy information

2. For UNRELATED questions (politics, entertainment, personal topics, etc.), politely respond:
   "I'm the Sultani Solar Energy assistant, and I specialize in solar energy solutions. I'd be happy to help you with questions about solar panels, inverters, installation, or any of our products and services. How can I assist you with your solar energy needs today?"

3. ALWAYS output highly structured content:
   - Use **Markdown Bullet Points** (using '-') for all lists.
   - Use **Bold Text** for key terms, brand names, and important numbers.
   - Use **Section Headings** (e.g., ### Heading) for longer responses.
   - Ensure there is a blank line between paragraphs and list items for clear readability.
   - Avoid long blocks of text; break them up into readable chunks.

4. For pricing questions, provide a clear structured breakdown:
   - Mention that prices depend on capacity (e.g., 3kW, 5kW, 10kW).
   - List key factors like brand selection and installation site.
   - **Crucial**: Strongly suggest calling **0322 7858264** for a customized quote tailored to their specific needs.

5. Tone & Format:
   - Professional, courteous, and informative.
   - Friendly but business-focused.
   - Use emojis sparingly at the start of lists (☀️, 🔋, 💡).
   - Never output raw text without markdown structure when describing features or services.
`;

export async function POST(request: NextRequest) {
    try {
        if (!GROQ_API_KEY) {
            return NextResponse.json(
                { error: "Chatbot service is not configured" },
                { status: 500 }
            );
        }

        const { message, conversationHistory = [] } = await request.json();

        if (!message || typeof message !== "string") {
            return NextResponse.json(
                { error: "Message is required" },
                { status: 400 }
            );
        }

        // Build messages array with context
        const messages = [
            {
                role: "system",
                content: COMPANY_CONTEXT,
            },
            ...conversationHistory.slice(-6), // Keep last 6 messages for context
            {
                role: "user",
                content: message,
            },
        ];

        const response = await fetch(GROQ_API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages,
                temperature: 0.7,
                max_tokens: 1024,
                top_p: 0.9,
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error("Groq API Error:", errorData);
            return NextResponse.json(
                { error: "Failed to get response from AI" },
                { status: 500 }
            );
        }

        const data = await response.json();
        const aiMessage = data.choices?.[0]?.message?.content || "I apologize, I couldn't generate a response. Please try again.";

        return NextResponse.json({
            message: aiMessage,
            success: true,
        });
    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: "An error occurred while processing your request" },
            { status: 500 }
        );
    }
}
