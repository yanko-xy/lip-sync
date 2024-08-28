import { audioFileToBase64, lipSyncMessage, readJsonTranscript } from "@/utils/file";
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

export async function POST(req) {
    const userMessage = (await req.json()).message;
    if (!userMessage) {
        return Response.json({
            messages: [
                {
                    text: "有什么问题都可以像我提问，我会尽力为你解答",
                    audio: await audioFileToBase64("public/audios/intro1.ogg"),
                    lipsync: await readJsonTranscript("public/audios/intro1.json"),
                    facialExpression: "smile",
                    animation: "Greeting",
                },
                {
                    text: "如果没有问题的话，就当我放了个屁",
                    audio: await audioFileToBase64("public/audios/intro2.ogg"),
                    lipsync: await readJsonTranscript("public/audios/intro2.json"),
                    facialExpression: "funnyFace",
                    animation: "Happy Idle",
                },
            ],
        });
    }

    // TODO: without open key
    if (!elevenLabsApiKey || openai.apiKey === "-") {
        return Response.json({
            messages: [
                {
                    text: "Please my dear, don't forget to add your API keys!",
                    audio: await audioFileToBase64("public/audios/api_0.wav"),
                    lipsync: await readJsonTranscript("public/audios/api_0.json"),
                    facialExpression: "angry",
                    animation: "Angry",
                },
                {
                    text: "You don't want to ruin Wawa Sensei with a crazy ChatGPT and ElevenLabs bill, right?",
                    audio: await audioFileToBase64("public/audios/api_1.wav"),
                    lipsync: await readJsonTranscript("public/audios/api_1.json"),
                    facialExpression: "smile",
                    animation: "Laughing",
                },
            ],
        });
    }

    // let time = new Date().getTime();
    // console.info("send req to chatGPT");

    const completion = await openai.chat.completions.create({
        model: "gpt-4-1106-preview",
        max_tokens: 1000,
        temperature: 0.6,
        response_format: {
            type: "json_object",
        },
        messages: [
            {
                role: "system",
                content: `
            You are a virtual Chinese boyfriend.
            Your name is 小羊.
            You will always reply with a JSON array of messages.
            The messages returned are an array, don't give me anything else.
            Each message has a text, facialExpression, and animation property, text is Chinese.
            The different facial expressions are: smile, sad, angry, surprised, funnyFace, and default.
            The different animations are: Idle, Sad Idle, Angry, Happy Idle, Wave Dance, Robot Dance, Locking Dance, Rumba Dance.  
            Here is a Message template:
            messages: [
                {
                     text: "有什么问题都可以像我提问，我会尽力为你解答",
                     audio: await audioFileToBase64("public/audios/intro1.ogg"),
                     lipsync: await readJsonTranscript("public/audios/intro1.json"),
                     facialExpression: "smile",
                     animation: "Greeting",
                },
                {
                    text: "如果没有问题的话，就当我放了个屁",
                    audio: await audioFileToBase64("public/audios/intro2.ogg"),
                    lipsync: await readJsonTranscript("public/audios/intro2.json"),
                    facialExpression: "funnyFace",
                    animation: "Happy Idle",
                },
            ]
            `,
            },
            {
                role: "user",
                content: userMessage || "Hello",
            },
        ],
    });
    let messages = JSON.parse(completion.choices[0].message.content);
    if (messages.messages) {
        // ChatGPT is not 100% reliable, sometimes it directly returns an array
        // and sometimes a JSON object with a messages property
        messages = messages.messages;
    }

    // console.info(`receive resp from chatGPT: ${new Date().getTime() - time}ms`);
    // time = new Date().getTime();
    // console.info("start convet");

    await Promise.all(
        messages.map(async (message, i) => {
            // generate audio file
            const fileName = `public/audios/message_${i}.mp3`; // The name of audio file
            const textInput = message.text; // The text you wish to convert to speech
            await voice.textToSpeech({
                voiceId: voiceID,
                fileName: fileName,
                textInput: textInput,
                stability: 0.5,
                similarityBoost: 0.75,
                speakerBoost: true,
                modelId: "eleven_multilingual_v2",
            });
            // generate lipsync
            await lipSyncMessage(i);
            message.audio = await audioFileToBase64(fileName);
            message.lipsync = await readJsonTranscript(`public/audios/message_${i}.json`);
        }),
    );

    // console.info(`finish convert: ${new Date().getTime() - time}ms`);

    return Response.json({ messages });
}
