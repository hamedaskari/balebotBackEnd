import express from "express";
const app = express();
const PORT = 5000;
const BOT_TOKEN = process.env.BOT_TOKEN;
app.use(express.json());

if (!process.env.BOT_TOKEN)
  throw new Error("BOT_TOKEN is not set in environment variables");

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

  if (text.toLowerCase() === "/app") {
    await sendMiniaAppButton(chatId);
  }
  if (text.toLowerCase() === "/gmae") {
    await sendGameAppButton(chatId);
  }
  if (text === "/start") {
    await sendMessage(chatId, "سلام! به ربات ما خوش آمدید.");
  }
}
async function sendMessage(chatId: number, text: string) {
  try {
    await fetch(`https://tapi.bale.ai/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
      }),
    });
  } catch (error) {
    console.error("خطا در ارسال پیام:", error);
  }
}
async function sendMiniaAppButton(chatId: number) {
  const keyboard = {
    inline_keyboard: [
      [
        {
          text: "باز کردن مینی اپ",
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
async function sendGameAppButton(chatId: number) {
  const keyboard = {
    keyboard: [
      [
        {
          text: "بازی 2048",
          web_app: { url: "https://lovely-pastelito-f64030.netlify.app/" },
        },
      ],
    ],
    resize_keyboard: true,
    one_time_keyboard: false,
  };

  try {
    await fetch(`https://tapi.bale.ai/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: "برای باز کردن بازی 2048 روی دکمه زیر کلیک کنید:",
        reply_markup: keyboard,
      }),
    });
  } catch (error) {
    console.error("خطا در ارسال پیام:", error);
  }
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
