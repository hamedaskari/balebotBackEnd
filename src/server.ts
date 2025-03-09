import express from "express";

const app = express();
const PORT = 5000;
const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN is not set in environment variables");
}

app.use(express.json());

app.post("/webhook", async (req, res) => {
  const { message } = req.body;
  if (message?.text) {
    await handleMessage(message);
  }
  res.sendStatus(200);
});

async function handleMessage(message: any) {
  const chatId = message.chat.id;
  const text = message.text;

  if (text === "/start") {
    await sendWelcomeMessage(chatId);
  } else if (text === "/game") {
    await sendGameButton(chatId);
  }
}

async function sendWelcomeMessage(chatId: number) {
  const replyMarkup = {
    inline_keyboard: [
      [
        {
          text: "🎮 شروع بازی",
          callback_data: "game",
        },
      ],
    ],
  };

  await sendRequest("sendMessage", {
    chat_id: chatId,
    text: "سلام! 👋\nبه ربات بازی 2048 خوش آمدید! اینجا می‌توانید بازی 2048 را مستقیماً اجرا کنید و از آن لذت ببرید. برای شروع روی دکمه زیر کلیک کنید. ⬇️",
    reply_markup: replyMarkup,
  });
}

async function sendGameButton(chatId: number) {
  const replyMarkup = {
    inline_keyboard: [
      [
        {
          text: "🎮 بازی 2048",
          web_app: { url: "https://2048game-bale.netlify.app/" },
        },
      ],
    ],
  };

  await sendRequest("sendMessage", {
    chat_id: chatId,
    text: "برای باز کردن بازی 2048 روی دکمه زیر کلیک کنید: 🎮",
    reply_markup: replyMarkup,
  });
}

async function sendRequest(method: string, payload: object) {
  try {
    await fetch(`https://tapi.bale.ai/bot${BOT_TOKEN}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error(`خطا در اجرای ${method}:`, error);
  }
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
