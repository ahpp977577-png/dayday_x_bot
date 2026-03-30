export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send('只允许 POST 请求');
    }

    try {
        const { vacation, late } = req.body;

        // --- 1. 将数据存入 Redis 数据库 ---
        // 使用你原本的 KV 存储逻辑
        await fetch(`${process.env.KV_REST_API_URL}/set/vacation_count/${vacation}`, {
            headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` }
        });

        await fetch(`${process.env.KV_REST_API_URL}/set/late_count/${late}`, {
            headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` }
        });

        // --- 2. 发送实时消息给 Telegram 机器人 ---
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;
        
        // 这里的文字你可以根据喜好修改
        const message = `📢 **考勤数据已更新**\n\n🌴 今日请假人数：${vacation}\n⏰ 今日迟到人数：${late}\n\n✅ 数据已同步至后台。`;

        await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown' // 让文字支持加粗等格式
            })
        });

        res.status(200).json({ success: true, message: "数据已存入数据库并通知机器人" });

    } catch (error) {
        console.error('API 错误:', error);
        res.status(500).json({ error: error.message });
    }
}
