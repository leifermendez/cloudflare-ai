import type {
  VectorizeIndex,
} from "@cloudflare/workers-types";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { CloudflareVectorizeStore } from "langchain/vectorstores/cloudflare_vectorize";
import { CloudflareWorkersAIEmbeddings } from "langchain/embeddings/cloudflare_workersai";

export interface Env {
  VECTORIZE_INDEX: VectorizeIndex;
  AI: any;
}


const ingestLlama = async (ai: Env, text: string) => {
  const embeddings = new CloudflareWorkersAIEmbeddings({
    binding: ai.AI,
    modelName: "@cf/baai/bge-base-en-v1.5",
  });
  const store = new CloudflareVectorizeStore(embeddings, {
    index: ai.VECTORIZE_INDEX,
  });

  await store.addDocuments([
    {
      pageContent: text,
      metadata: {},
    }
  ]);
  return { success: true }
}

export { ingestLlama }