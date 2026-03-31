export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { vacation, late, operator, type } = req.body;
    
    // 获取 Vercel 环境变量
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
        return res.status(500).json({ error: '服务器配置缺失 (Token/ChatID)' });
    }

    const message = `📊 *考勤数据上报 (${type})*\n` +
                    `-------------------\n` +
                    `👤 操作人：${operator}\n` +
                    `🏖️ 请假人数：*${vacation}* 人\n` +
                    `⏰ 迟到人数：*${late}* 人\n` +
                    `-------------------\n` +
                    `✅ 系统同步成功`;

    try {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        if (response.ok) {
            return res.status(200).json({ success: true });
        } else {
            const errorDetail = await response.json();
            return res.status(500).json({ error: 'Telegram API 错误', detail: errorDetail });
        }
    } catch (err) {
        return res.status(500).json({ error: '网络发送失败', detail: err.message });
    }
}
