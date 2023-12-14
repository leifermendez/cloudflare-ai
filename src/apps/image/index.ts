import { OpenAPIHono } from "@hono/zod-openapi";
import { Hono } from "hono";
import { Bindings } from "@src/bindings";
import { generateImage } from "@src/services/image";
import { Buffer } from 'node:buffer';

const app = new Hono<{ Bindings: Bindings }>();

app.post("/create", async (c) => {
  const { prompt, num_steps } = await c.req.json();

  if(!prompt) return c.json({error:'PROMPT'})
  if(!num_steps) return c.json({error:'NUM_STEPS'})

  const imageArray = await generateImage({ prompt, num_steps, AI: c.env.AI });
  
    // Set appropriate headers for an image response
    c.res.headers.set('Content-Type', 'image/png');
    c.res.headers.set('Content-Disposition', 'inline; filename=image.png');

    // Send the image buffer using c.stream()
    return c.stream(async (stream) => {
      await stream.write(Buffer.from(imageArray));
    });

});

export default app;
