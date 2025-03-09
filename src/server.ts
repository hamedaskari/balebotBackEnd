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
  }
}

async function sendWelcomeMessage(chatId: number) {
  const gameDescription =
    `🎮 *بازی 2048 چیست؟*\n\n` +
    `2048 یک بازی پازلی و عددی اعتیادآور است که در سال ۲۰۱۴ منتشر شد. ` +
    `هدف این بازی ترکیب کاشی‌های عددی مشابه و رسیدن به عدد *2048* است.\n\n` +
    `🕹 *چطور بازی کنیم؟*\n` +
    `- بازی روی یک *شبکه ۴×۴* انجام می‌شود.\n` +
    `- در هر حرکت، می‌توانید کاشی‌ها را *به بالا، پایین، چپ یا راست* بکشید.\n` +
    `- وقتی دو کاشی با *عدد یکسان* با هم برخورد کنند، *با هم ترکیب شده و عددشان دو برابر می‌شود* (مثلاً ۲+۲=۴).\n` +
    `- بازی تا زمانی که *هیچ حرکت ممکنی باقی نماند* ادامه پیدا می‌کند.\n\n` +
    `🏆 *نکات مهم برای برنده شدن:*\n` +
    `- همیشه *بزرگ‌ترین عدد* را در یکی از گوشه‌های صفحه نگه دارید.\n` +
    `- *حرکات را مدیریت کنید* تا فضای کافی برای ترکیب کاشی‌ها داشته باشید.\n` +
    `- *تمرین کنید!* هر بار که بازی می‌کنید، استراتژی شما بهتر خواهد شد.\n\n` +
    `برای شروع روی دکمه زیر کلیک کنید. ⬇️`;

  const replyMarkup = {
    inline_button: [
      [
        {
          text: "🎮 شروع بازی",
          web_app: { url: "https://2048game-bale.netlify.app/" },
        },
      ],
    ],
  };

  await sendRequest("sendMessage", {
    chat_id: chatId,
    text: gameDescription,
    parse_mode: "Markdown",
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
