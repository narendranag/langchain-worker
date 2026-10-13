import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAI } from "langchain/llms/openai";
import { RetrievalQAChain } from "langchain/chains";

export default {
	 async fetch(request, env, ctx) {

		console.log(env.OPENAI_API_KEY);

		const loader = new CheerioWebBaseLoader(
        	"https://en.wikipedia.org/wiki/Brooklyn"
        );
        
		const docs = await loader.loadAndSplit();

        const store = await MemoryVectorStore.fromDocuments(docs, new OpenAIEmbeddings({ openAIApiKey: env.OPENAI_API_KEY}));
		
		const model = new OpenAI({ openAIApiKey: env.OPENAI_API_KEY});
        const chain = RetrievalQAChain.fromLLM(model, store.asRetriever());

        const question = "What is this article about? Can you give me 3 facts about it?";

        const res = await chain.call({
            query: question,
        });

        return new Response(res.text); 
  },
};