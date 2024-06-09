const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { Sequelize } = require('sequelize');
const authRoutes = require('./routes/auth');
const OpenAI = require("openai");
const { getJson } = require("serpapi");

// Initialize Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: process.env.DB_PORT,
  logging: false,
});

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use('/api/auth', authRoutes);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// SerpAPI key
const serpapi_key = process.env.SERPAPI_KEY;

const sessions = {}; // In-memory store for sessions

const callOpenAiSynchronously = async (prompt, model = 'gpt-3.5-turbo-16k', maxTokens = 2500) => {
  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [{ role: "system", content: prompt }],
      max_tokens: maxTokens,
      temperature: 0.2,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw new Error('OpenAI request failed');
  }
};

const htmlPage = async (userRequirement) => {
  const element = await callOpenAiSynchronously(`If user asks to add icon in its requirement say icon, if ask to add image say image, otherwise just say none. you just have to reply in single word as one of these three, icon, image, none. You have to see user requirement properly. Here is the requirement: ${userRequirement}`);

  let htmlData;
  if (element.toLowerCase() === 'icon') {
    htmlData = await callOpenAiSynchronously(`Modify the code based on my requirement, strictly use Google material icon library to add icons and as an output strictly just give me the full modified code. Here is the requirement stick to user requirement. ${userRequirement} Provide me combined HTML and CSS in one code, I just need the code as an output.`);
  } else {
    htmlData = await callOpenAiSynchronously(`Make a big and beautiful HTML CSS website for this user requirement, here is the requirement stick to user requirement. ${userRequirement} Provide me combined HTML and CSS in one code and I just need the code as an output.`);
  }

  const rawNames = await callOpenAiSynchronously(`Take out all the images from this code in Python list and if there is no image in the HTML data give empty array, strictly give me output enclosed in an array without anything along ${htmlData}`, 'gpt-3.5-turbo', 1800);

  if (rawNames === '[]') {
    return htmlData;
  }

  if (element.toLowerCase() === 'image') {
    try {
      const finalHtml = await webpageImageProcessing(htmlData, JSON.parse(rawNames), userRequirement);
      return finalHtml;
    } catch (error) {
      return htmlData;
    }
  } else {
    return htmlData;
  }
};

const webpageImageProcessing = async (htmlData, rawNames, userRequirement) => {
  const modifiedNames = await callOpenAiSynchronously(`Take out all the images except icons used in this HTML CSS code and replace those with real product names and give me in the format as [[before, after], [before, after]]. Here is the list you have to modify and my requirement is ${userRequirement} ${JSON.stringify(rawNames)}. Here is the HTML code ${htmlData}. Strictly remember you have to just give me the output as before after like this [[before, after], [before, after]] without any another instruction and where after is the product model.`, 'gpt-4-turbo-preview', 2000);

  const names = JSON.parse(modifiedNames).map(item => item[1]);
  const imagesLink = await Promise.all(names.map(name => websiteMaking(name)));

  const finalHtml = await callOpenAiSynchronously(`I have provided you some images ${JSON.stringify(names)} with their links ${JSON.stringify(imagesLink)} modify the HTML CSS code and add those links and change paragraph content based on these images and as an output just give me HTML code. Here is the code ${htmlData}`);
  return finalHtml;
};

const websiteMaking = (image) => {
  return new Promise((resolve, reject) => {
    getJson({
      engine: "google_images",
      q: image,
      location: "Austin, TX, Texas, United States",
      api_key: serpapi_key
    }, (json) => {
      const imageLinks = json.images_results.map(result => result.original);
      resolve(imageLinks.slice(0, 1)); // Return the first image link
    });
  });
};

const editHtmlPage = async (userMessage, elements) => {
  const elementNeeded = await callOpenAiSynchronously(`If user asks to add icon in its requirement say icon, if asks to add image say image, if do not want to add anything and just want some changes then reply none. You just have to reply in single word as one of these three, icon, image, none. You have to see user requirement properly. Here is the requirement: ${userMessage}`);

  let prompt;
  if (elementNeeded.toLowerCase() === 'icon') {
    prompt = `Modify the code based on my requirement, strictly use Google material icon library to add icons and as an output strictly just give me the full modified code. Requirement: ${userMessage} Code: ${elements}`;
  } else if (elementNeeded.toLowerCase() === 'image') {
    const htmlData = await callOpenAiSynchronously(`Modify the code based on my requirement and add image not icon and as an output strictly just give me the full modified code. Requirement: ${userMessage} Code: ${elements}`);
    const rawNames = await callOpenAiSynchronously(`Take out all the images from this code in Python list and if there is no image in the HTML data give empty array, strictly give me output enclosed in an array without anything along ${htmlData}`, 'gpt-3.5-turbo', 1800);
    const finalHtml = await webpageImageProcessing(htmlData, JSON.parse(rawNames), userMessage);
    return finalHtml;
  } else {
    prompt = `Modify the code based on my requirement and as an output strictly just give me the full modified code. Requirement: ${userMessage} Code: ${elements}`;
  }

  const result = await callOpenAiSynchronously(prompt, 'gpt-3.5-turbo-16k', 2500);
  return result;
};

app.post('/start-session', async (req, res) => {
  const sessionId = generateSessionId();
  sessions[sessionId] = [];

  const { message } = req.body;
  try {
    const response = await htmlPage(message);
    sessions[sessionId].push({ user: message, bot: response });
    res.json({ sessionId, data: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

app.post('/continue-session', async (req, res) => {
  const { sessionId, message } = req.body;
  if (!sessions[sessionId]) {
    return res.status(400).json({ error: 'Invalid session ID' });
  }

  const elements = sessions[sessionId].map(chat => chat.bot).join('\n');
  try {
    const response = await editHtmlPage(message, elements);
    sessions[sessionId].push({ user: message, bot: response });
    res.json({ data: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

app.post('/reset-session', (req, res) => {
  const { sessionId } = req.body;
  delete sessions[sessionId];
  res.json({ message: 'Session reset successfully' });
});

const generateSessionId = () => {
  return 'session_' + Math.random().toString(36).substr(2, 9);
};

const PORT = process.env.PORT || 3100;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    console.log('Database connected and synchronized');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
