import { loadQARefineChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { Configuration, OpenAIApi } from "openai";
import dotenv from 'dotenv';
const config = dotenv.config();
console.log('CHAT-BOT AI API KEY : ' + process.env.API_TOKEN);
const configuration = new Configuration({
    //organization: "org-sdfds34dsf",
    apiKey: process.env.API_TOKEN,
});
const openai = new OpenAIApi(configuration);
//------------
async function runQA(query) {
    // Create the models and chain
    /*  const embeddings = new OpenAIEmbeddings({ openAIApiKey: "YOUR_OPENAI_API_KEY" });
     const model = new OpenAI({ openAIApiKey: "YOUR_OPENAI_API_KEY" }); */
    /* const embeddings = new OpenAIEmbeddings({ openAIApiKey: "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" });
    const model = new OpenAI({ openAIApiKey: "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" }); */
    const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.API_TOKEN });
    const model = new OpenAI({ openAIApiKey: process.env.API_TOKEN });
    const chain = loadQARefineChain(model);

    // Load the documents and create the vector store
    //const loader = new PDFLoader("./Arogya Sanjeevani Policy CIS_2.pdf");
    const loader = new PDFLoader("./angular.pdf");
    const docs = await loader.loadAndSplit();
    const store = await MemoryVectorStore.fromDocuments(docs, embeddings);

    // Select the relevant documents
    const question = query;
    const relevantDocs = await store.similaritySearch(question);

    // Call the chain
    const res = await chain.call({
        input_documents: relevantDocs,
        question,
    });

    return res;
    /*
    {
      output_text: '\n' +
        '\n' +
        "answer"
    }
    */
}

async function runQAUrl(query, url) {
    console.log('MIDDLE WARE query:' + query);
    console.log('MIDDLE WARE url:' + url);
    //++++++++++++
    /* const embeddings = new OpenAIEmbeddings({ openAIApiKey: "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" });
    const model = new OpenAI({ openAIApiKey: "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" }); */
    const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.API_TOKEN });
    const model = new OpenAI({ openAIApiKey: process.env.API_TOKEN });
    const chain = loadQARefineChain(model);

    // Load the documents and create the vector store
    //const loader = new PDFLoader("./Arogya Sanjeevani Policy CIS_2.pdf");
    //const loader = new PDFLoader("./angular.pdf");
    //const loader = new PDFLoader(pathString);
    //const loader = OnlinePDFLoader("https://arxiv.org/pdf/2302.03803.pdf")

    //const response = await fetch("https://example.com/path/to/pdf/file.pdf");
    const response = await fetch(url);
    const blob = await response.blob();

    const loader = new PDFLoader(blob);

    const docs = await loader.loadAndSplit();
    const store = await MemoryVectorStore.fromDocuments(docs, embeddings);

    // Select the relevant documents
    const question = query;
    const relevantDocs = await store.similaritySearch(question);

    // Call the chain
    const res = await chain.call({
        input_documents: relevantDocs,
        question,
    });

    return res;
    //++++++++++++
}
//setup the server and routes

const app = express();
app.use(bodyParser.json());
app.use(cors());
const port = 3000;

app.get("/qa", async (req, res) => {
    try {
        const { query } = req.query;
        const answer = await runQA(query);
        res.status(200).send(answer);

    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});

app.get("/qaurl", async (req, res) => {
    try {
        console.log(req);
        console.log(req.query.searchTxt);
        console.log(req.query.url);
        /*    const { query } = req.query.searchTxt;
           const { url } = req.query.url;
           console.log('entered qaurl query : ' + query);
           console.log('entered qaurl url : ' + url); */
        //const answer = await runQAUrl(query, url);
        const answer = await runQAUrl(req.query.searchTxt, req.query.url);
        res.status(200).send(answer);

    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
});
//---------------------------

app.post('/message', (req, res) => {
    // {prompt: "This is the message"}
    const response = openai.createCompletion({
        model: 'text-davinci-003',
        prompt: req.body.prompt,
        temperature: 0,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 256
    });

    response.then((data) => {
        console.log(data.data);
        console.log(data.data.choices[0].text);
        res.send({ message: data.data.choices[0].text });
    }).catch((err) => {
        res.send({ message: err });
    });

});
//---------------------------

app.listen(3000, () => console.log("Server started on " + port));

//run server and test api by sending GET requests like following:
//http://localhost:3000/qa?query="question?"
//node chain.js
//
//E:\AI-Related\168-multi-file-upload-angular-firebase-master\pdfReader-chatWithPDFs-main>node chain.js