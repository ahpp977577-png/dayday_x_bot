export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send();

    const { type, vacation, special, operator, role } = req.body;
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    // 根据不同类型构建不同的消息文本
    let text = `📢 *考勤系统回报*\n-------------------\n👤 操作人: ${operator} (${role})\n标签: #${type}\n`;

    if (type === '管理数据上报') {
        text += `🏖️ 请假/休假: *${vacation}* 人\n🤱 产假/特殊: *${special}* 人\n`;
    } else {
        text += `⏰ 动作: *${type}*\n📍 状态: 已实时记录\n`;
    }

    text += `-------------------\n📅 时间: ${new Date().toLocaleString('zh-CN')}`;

    try {
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: CHAT_ID, text: text, parse_mode: 'Markdown' })
        });
        return res.status(200).json({ success: true });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
