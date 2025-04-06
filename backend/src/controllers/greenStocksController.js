const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const getPersonalizedTips = async (req, res) => {
  try {
    const { transactions } = req.body;

    if (!transactions || typeof transactions !== "string") {
      return res.status(400).json({
        status: "fail",
        message: "Please provide a valid string of transactions.",
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: `You are a green finance assistant. Based on the following user transactions: \n${transactions}\n\nGive 3 personalized green finance tips as a JSON array of objects, each with:
- id (number)
- title (string)
- description (string)

Don't include icon components, we will render them on frontend.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    const parsedTips = JSON.parse(content);

    res.status(200).json({
      status: "success",
      data: parsedTips,
    });
  } catch (error) {
    console.error("Error generating personalized tips:", error.message);
    res.status(500).json({ status: "fail", message: error.message });
  }
};

const getGreenStocks = async (req, res) => {
  try {
    // Make a call to the OpenAI API with the appropriate prompt
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content:
            "Provide 3 green stocks data relevant to India. Each stock should include: id (number), name (string), ticker (string), return (string, e.g. '+12.8%'), impact (string), description (string), and color (string, choose one from '#429690', '#2A7C76', or '#30706A'). Format your response as a valid JSON array of objects.",
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: "json_object" }, // Specify JSON response format
    });

    // Extract the content from the response and parse it as JSON
    const content = response.choices[0].message.content;
    const parsedContent = JSON.parse(content);

    // Send the parsed object directly
    res.status(200).json({
      status: "success",
      data: parsedContent.stocks || parsedContent,
    });
  } catch (error) {
    console.error("Error fetching green stocks:", error.message);
    res.status(500).json({ status: "fail", message: error.message });
  }
};

module.exports = { getGreenStocks, getPersonalizedTips };
