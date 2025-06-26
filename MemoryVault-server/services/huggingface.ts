import axios from "axios";

const MODEL = 'SamLowe/roberta-base-go_emotions';

export async function analyzeEmotion(text: string) {
    try {
        const apiKey = process.env.HF_API_KEY;
        if (!apiKey) { throw new Error('Missing Hugging Face API key'); }

        const response = await axios.post(
            `https://api-inference.huggingface.co/models/${MODEL}`,
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