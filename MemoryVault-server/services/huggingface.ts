import axios from "axios";
import { prisma } from '../server';

const MODEL = 'SamLowe/roberta-base-go_emotions';

// Get text from note and analyze emotion
async function analyzeEmotion(text: string) {
    try {
        const apiKey = process.env.HF_API_KEY;
        if (!apiKey) { throw new Error('Missing Hugging Face API key'); }

        const response = await axios.post(
            `https://router.huggingface.co/hf-inference/models/${MODEL}`,
            { inputs: text },
            {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
            }
        );
        return response.data[0];
    } catch (err: any) {
        console.error('Hugging Face API Error:', err.message);
        // throw new Error('Emotion analysis failed.');
        throw err;
    }
}

const extractText = (note: any): string => {
    if (note.type === 'text') return note.text ?? '';
    if (!note.content) return '';
    return note.content.map(extractText).join(' ');
};

// Get the highest scoring emotin and tag it
export async function tagTopEmotion(noteId: string, body: any) {
    const text = extractText(body);
    const emotions = await analyzeEmotion(text);
    const topEmotion = emotions[0]?.label;

    if (!topEmotion) { return null; }

    return prisma.note.update({
        where: { id: noteId },
        data: {
            Tags: {
                connectOrCreate: {
                    where: { name: topEmotion },
                    create: { name: topEmotion }
                }
            }
        },
        include: { Tags: true }
    });
}
