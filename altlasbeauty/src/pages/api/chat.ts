// import { NextApiRequest, NextApiResponse } from "next";
// import axios from "axios";

// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   const { message } = req.body;

//   try {
//     const response = await axios.post(
//       "https://api.openai.com/v1/chat/completions",
//       {
//         model: "gpt-3.5-turbo",
//         messages: [
//           {
//             role: "system",
//             content:
//               "Tu es un assistant IA spécialisé en tourisme médical. Tu donnes des réponses simples et rassurantes aux patients sur les procédures, les durées de récupération, etc.",
//           },
//           { role: "user", content: message },
//         ],
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const reply = response.data.choices[0].message.content;
//     res.status(200).json({ reply });
//   } catch (err: any) {
//     console.error(err.response?.data || err.message);
//     res.status(500).json({ reply: "Une erreur s’est produite. Réessaie plus tard." });
//   }
// };

// export default handler;

// pages/api/chat.ts
import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      
      "https://openrouter.ai/api/v1/chat/completions",
      {
        // model: "openrouter/auto", 
        model: "mistralai/mistral-7b-instruct",
        max_tokens: 500, 
        messages: [
          {
            role: "system",
            content:
            "Tu es un assistant virtuel pour une agence de tourisme médical basée en Tunisie. Tu réponds aux questions des patients de manière rassurante, claire et professionnelle. Tu expliques le déroulement des séjours, les procédures médicales proposées, les durées de repos, le suivi post-opératoire, et tout ce qui concerne l'accompagnement avant, pendant et après leur séjour médical en Tunisie. Donne des réponses courtes et concises (2 à 3 phrases maximum).",
          },
          { role: "user", content: message },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000", // ou ton domaine en prod
          "X-Title": "Chatbot IA Médical",
        },
      }
    );
   
    console.log("Réponse OpenRouter :", response.data);

    const reply = response.data.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error: any) {
    console.error(error?.response?.data || error.message);
    res
      .status(500)
      .json({ reply: "Une erreur est survenue avec le service IA." });
  }
};

export default handler;
