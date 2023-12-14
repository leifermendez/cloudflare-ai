import { Ai } from "@cloudflare/ai";

type Params = {
  cloudflareAccountId: string;
  cloudflareApiToken: string;
  ai: any;
  vectorize: any;
  prompt: string;
  num_steps: number;
};

export const stableChain = async (params: Params) => {
  const ai = new Ai(params.ai);
  const inputs = {
    prompt: params.prompt,
    num_steps: params.num_steps,
  };
  const model = "@cf/stabilityai/stable-diffusion-xl-base-1.0";
  const response = await ai.run(model, inputs);
  return response;
};
