const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply('你好！我是 DayDay 助手。输入 /status 查看今日数据。'));

bot.command('status', (ctx) => {
  const vacation = Math.floor(Math.random() * 5); 
  const late = Math.floor(Math.random() * 3);
  const msg = `📊 **今日报表**\n---\n🏖 休假：${vacation}人\n⏰ 迟到：${late}人\n✅ 正常出勤：25人`;
  ctx.replyWithMarkdown(msg);
});

module.exports = async (req, res) => {
  try {
    if (req.method === 'POST') {
      await bot.handleUpdate(req.body);
    }
    res.status(200).send('OK');
  } catch (err) {
    res.status(500).send(err.message);
  }
};
