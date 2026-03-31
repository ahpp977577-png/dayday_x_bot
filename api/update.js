export default async function handler(req, res) {
    const { type, targetUser, leaveType, operator, operatorRole } = req.body;
    
    const now = new Date();
    const chinaTime = now.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai', hour12: false });

    let text = `📢 *考勤系统回报*\n-------------------\n`;

    if (type === '管理员代点假') {
        text += `👤 管理员: ${operator}\n` +
                `📋 代办对象: *${targetUser}*\n` +
                `🏖️ 假期类型: *${leaveType}*\n` +
                `📍 状态: 管理员手动录入\n`;
    } else {
        text += `👤 操作人: ${operator} (${operatorRole})\n` +
                `⏰ 动作: *${type}*\n` +
                `📍 状态: 个人实时记录\n`;
    }

    text += `-------------------\n📅 汇报时间: ${chinaTime}`;

    try {
        await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: process.env.TELEGRAM_CHAT_ID,
                text: text,
                parse_mode: 'Markdown'
            })
        });
        return res.status(200).json({ success: true });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
}
