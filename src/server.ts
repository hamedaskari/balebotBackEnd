import express from "express";
const app = express();
const PORT = 5000;
const BOT_TOKEN = "1060884978:yXKITOFYItkq5IsgEP2WdYRny8REUNPV5H1o6omN";

app.use(express.json());

// دریافت آپدیت‌ها از API بله
app.post("/webhook", async (req, res) => {
  const { message } = req.body;
  if (message && message.text) {
    await handleMessage(message);
  }
  res.sendStatus(200);
});

async function handleMessage(message: any) {
  const chatId = message.chat.id;
  const text = message.text;

  if (text.toLowerCase() === "باز کردن مینی‌اپ") {
    await sendMiniaAppButton(chatId);
  }
}

async function sendMiniaAppButton(chatId: number) {
  const keyboard = {
    inline_keyboard: [
      [
        {
          text: "باز کردن مینی‌اپ",
          web_app: { url: "https://baletestbot.netlify.app/" },
        },
      ],
    ],
  };

  try {
    await fetch(`https://tapi.bale.ai/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: "برای باز کردن مینی‌اپ روی دکمه زیر کلیک کنید:",
        reply_markup: keyboard,
      }),
    });
  } catch (error) {
    console.error("خطا در ارسال پیام:", error);
  }
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
