export default async function handler(req, res) {
  const { message } = req.body;
  if (!message) return res.status(200).send('ok');

  const chatId = message.chat.id;
  const text = message.text;

  async function getKV(key) {
    const response = await fetch(`${process.env.KV_REST_API_URL}/get/${key}`, {
      headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` }
    });
    const data = await response.json();
    return data.result || 0;
  }

  if (text === '/status' || text === '/start') {
    const vacation = await getKV('vacation_count');
    const late = await getKV('late_count');
    
    const reply = `📊 *今日打卡報表*\n---\n🏖️ 休假：${vacation} 人\n⏰ 遲到：${late} 人\n\n_數據更新自管理後台_`;

    await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: reply, parse_mode: 'Markdown' })
    });
  }
  res.status(200).send('ok');
}
