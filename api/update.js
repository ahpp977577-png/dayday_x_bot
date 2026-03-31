// api/update.js
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { vacation, late } = req.body;
    
    // 获取你在 Vercel 设置的新环境变量名
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    // 检查变量是否存在
    if (!BOT_TOKEN || !CHAT_ID) {
        return res.status(500).json({ error: '服务器配置缺失：找不到 Token 或 Chat ID' });
    }

    const message = `📊 *考勤实时上报*\n---\n🏖️ 今日请假：${vacation} 人\n⏰ 今日迟到：${late} 人\n---\n✅ 数据同步成功`;

    try {
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        const response = await fetch(url, {
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
            const errData = await response.json();
            return res.status(500).json({ error: 'Telegram 接口返回错误', detail: errData });
        }
    } catch (error) {
        return res.status(500).json({ error: '网络请求失败', detail: error.message });
    }
}
