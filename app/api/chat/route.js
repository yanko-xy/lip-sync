import ElevenLabs from "elevenlabs-node";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"],
});

const elevenLabsApiKey = process.env["ELEVEN_LABS_API_KEY"];
const voiceID = "eajsS10yOj3p4C1YsUri";

const voice = new ElevenLabs({
    apiKey: elevenLabsApiKey,
    voiceId: voiceID,
});

export async function GET(req) {
    const userMessage = (await req.json()).message;
    if (!userMessage) {
        return Response.json({
            messages: [
                {
                    text: "有什么问题都可以像我提问，我会尽力为你解答",
                    audio: await audioFileToBase64("public/audios/intro.ogg"),
                    lipsync: await readJsonTranscript("public/audios/intro.json"),
                    facialExpression: "smile",
                    animation: "Standing Greeting",
                },
            ],
        });
    }
    return Response.json({ messages: "123123" });
}
