import { OpenAPIHono } from "@hono/zod-openapi";
import { Bindings } from "@src/bindings";
import { buildLlamaChainQA } from "@src/chains/llama_chain_qa";

const app = new OpenAPIHono<{ Bindings: Bindings }>();

app.post("/llama", async (c) => {
  const { question, name } = await c.req.json();

  if(!question) return c.json({error:'QUESTION'})
  if(!name) return c.json({error:'NAME'})

  const chain = await buildLlamaChainQA({
    cloudflareAccountId: c.env.CLOUDFLARE_ACCOUNT_ID,
    cloudflareApiToken: c.env.CLOUDFLARE_API_TOKEN,
    ai:c.env.AI,
    vectorize:c.env.VECTORIZE_INDEX,
    name
  });

  console.log(`[c.env.VECTORIZE_INDEX]:`,c.env.VECTORIZE_INDEX)
  
  const result = await chain.invoke(question, name);
  return c.json(result, 201);
});



export default app;
