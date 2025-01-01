import openai from "@/libs/openai";

export default class AIService {

    static promtDiff = `
    Input = { html1: "<html>...</html>", html2: "<html>...</html>" , notifyIf: "If any new frontend job posted" };

    Output = { changelog: "The difference between the two HTMLs is: ...", notifyUser: true };\n

    Compare two HTMLs that given by the user. and notify the user if the difference is fit with the given condition.
    `;

    public static async CompareTwoHTMLs(notifyIf: string, html1: string, html2: string): Promise<{ changelog: string, notifyUser: boolean }> {
        
        const response = await openai.createCompletion({
            engine: 'davinci-codex',
            prompt: this.promtDiff,
            max_tokens: 1000,
            temperature: 0,
            top_p: 1,
            n: 1,
            stop: ["\n"],
            logprobs: 1,
            model: 'text-davinci-003',
            inputs: {
                html1: html1,
                html2: html2,
                notifyIf: notifyIf
            }
        });

        const output = response.data.choices[0].text;
        console.log(output);
        const result = JSON.parse(output);

        return result;
    }
}
