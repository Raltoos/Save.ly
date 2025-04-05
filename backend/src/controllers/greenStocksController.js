const OpenAI = require("openai");
require("dotenv").config();

// Initialize the OpenAI client using the API key from your environment
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

module.exports = { getGreenStocks };
