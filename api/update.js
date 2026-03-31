export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { vacation, late, operator, type } = req.body;
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
        return res.status(500).json({ error: 'Vercel 环境变量未生效' });
    }

    const message = `📊 *考勤通知 (${type})*\n-------------------\n👤 操作人：${operator}\n🏖️ 请假：*${vacation}* 人\n⏰ 迟到：*${late}* 人\n-------------------\n✅ 数据上报完成`;

    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });
        return res.status(200).json({ success: true });
    } catch (e) {
        return res.status(500).json({ error: '机器人响应失败' });
    }
}
