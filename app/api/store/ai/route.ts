import { openai } from "@/configs/openai";
import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

function getSystemPrompt(target) {
    if (target === "name") {
        return `You are a product name assistant for an e-commerce store.
Respond ONLY with raw JSON.
Return exactly this shape:
{
  "suggestions": [string, string, string]
}`;
    }

    if (target === "description") {
        return `You are a product description assistant for an e-commerce store.
Respond ONLY with raw JSON.
Return exactly this shape:
{
  "suggestions": [string, string, string]
}`;
    }

    return `You are a product listing assistant for an e-commerce store.
Respond ONLY with raw JSON.
Return exactly this shape:
{
  "name": string,
  "description": string
}`;
}

function getUserPrompt(target, category, currentName, currentDescription) {
    const sharedContext = [
        category ? `Category: ${category}` : "Category: not provided",
        currentName ? `Current name: ${currentName}` : "Current name: empty",
        currentDescription ? `Current description: ${currentDescription}` : "Current description: empty",
    ].join("\n");

    if (target === "name") {
        return `${sharedContext}\n\nAnalyze this product image and return 3 concise, market-ready product name suggestions. Keep them specific to the product in the image.`;
    }

    if (target === "description") {
        return `${sharedContext}\n\nAnalyze this product image and return 3 strong product description suggestions. Each suggestion should be plain text, useful for an e-commerce listing, and should not use markdown.`;
    }

    return `${sharedContext}\n\nAnalyze this product image and return one product name and one product description.`;
}

async function main(base64Image, mimeType, target, category, currentName, currentDescription) {
    const messages: ChatCompletionMessageParam[] = [
        {
            role: "system",
            content: getSystemPrompt(target),
        },
        {
            role: "user",
            content: [
                { type: "text", text: getUserPrompt(target, category, currentName, currentDescription) },
                { type: "image_url", image_url: { url: `data:${mimeType};base64,${base64Image}` } },
            ],
        },
    ];

    const response = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL,
        messages,
    });

    const raw = response.choices[0].message.content ?? "";
    const cleaned = raw.replace(/```json|```/g, "").trim();

    let parsed;
    try {
        parsed = JSON.parse(cleaned);
    } catch {
        throw new Error("AI did not return valid JSON");
    }

    if (target === "name" || target === "description") {
        if (!Array.isArray(parsed?.suggestions)) {
            throw new Error("AI did not return suggestions");
        }

        return {
            suggestions: parsed.suggestions
                .map((value) => String(value).trim())
                .filter(Boolean)
                .slice(0, 3),
        };
    }

    return parsed;
}

export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ error: "not authorized" }, { status: 401 });
        }

        const {
            base64Image,
            mimeType,
            target = "both",
            category = "",
            currentName = "",
            currentDescription = "",
        } = await request.json();

        const result = await main(base64Image, mimeType, target, category, currentName, currentDescription);
        return NextResponse.json({ ...result });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}
