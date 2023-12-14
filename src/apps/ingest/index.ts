import { OpenAPIHono } from "@hono/zod-openapi";
import { Bindings } from "@src/bindings";
import { ingestLlama } from "@src/chains/llama_ingest";

const app = new OpenAPIHono<{ Bindings: Bindings }>();

app.post("/data", async (c) => {
  const { data } = await c.req.json();
  if(!data) return c.json({error:'DATA'})
  const result = await ingestLlama({ AI: c.env.AI, VECTORIZE_INDEX: c.env.VECTORIZE_INDEX }, data);
  return c.json({a:1}, 201);
});

export default app;