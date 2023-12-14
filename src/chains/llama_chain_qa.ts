import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from "langchain/prompts";
import { StringOutputParser } from "langchain/schema/output_parser";
import { RunnablePassthrough, RunnableSequence } from "langchain/schema/runnable";
import { ChatCloudflareWorkersAI } from "langchain/chat_models/cloudflare_workersai";
import { CloudflareVectorizeStore } from "langchain/vectorstores/cloudflare_vectorize";
import { CloudflareWorkersAIEmbeddings } from "langchain/embeddings/cloudflare_workersai";
import { formatDocumentsAsString } from "langchain/util/document";
type Params = {
  cloudflareAccountId: string;
  cloudflareApiToken: string;
  ai: any;
  vectorize: any;
  name: string;
};

export const buildLlamaChainQA = async ({ cloudflareAccountId, cloudflareApiToken, ai, vectorize, name }: Params) => {

  const model = new ChatCloudflareWorkersAI({
    model: "@cf/meta/llama-2-7b-chat-int8",
    cloudflareAccountId,
    cloudflareApiToken,
  });

  const SYSTEM_TEMPLATE = `Responda a la pregunta basándose únicamente en el siguiente contexto:
  {context}`;
  const messages = [
    SystemMessagePromptTemplate.fromTemplate(SYSTEM_TEMPLATE),
    HumanMessagePromptTemplate.fromTemplate("{question}"),
  ];

  const prompt = ChatPromptTemplate.fromMessages(messages);

  const outputParser = new StringOutputParser();
  const embeddings = new CloudflareWorkersAIEmbeddings({
    binding: ai,
    modelName: "@cf/baai/bge-base-en-v1.5",
  });

  const vectorStore = new CloudflareVectorizeStore(embeddings, {
    index: vectorize,
  });

  const vectorStoreRetriever = vectorStore.asRetriever();

  return RunnableSequence.from([
    {
      context: vectorStoreRetriever.pipe(formatDocumentsAsString),
      question: new RunnablePassthrough(),
      customer_name: () => name
    },
    prompt,
    model,
    outputParser
  ]);
};
