export default async function handler(req, res) {
  // разрешаем доступ с любого сайта
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // ответ для браузера (обязательно)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // запрещаем всё кроме POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "No message provided" });
    }

    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.DEEPSEEK_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [
            { role: "system", content: "Ты Алма — аналитик миграции Казахстана." },
            { role: "user", content: message }
          ]
        })
      }
    );

    const data = await response.json();

    return res.status(200).json({
      reply: data?.choices?.[0]?.message?.content || "Нет ответа"
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}
