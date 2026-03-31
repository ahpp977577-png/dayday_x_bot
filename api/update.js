export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send();

    const { type, targetUser, leaveType, operator, role } = req.body;
    
    // 1. 强制东八区时间
    const chinaTime = new Date().toLocaleString('zh-CN', { 
        timeZone: 'Asia/Shanghai', 
        hour12: false 
    });

    // 2. 根据类型构建消息模板
    let text = `📢 *考勤系统回报*\n-------------------\n`;
    
    if (type === '管理员代点假') {
        text += `👤 管理员: ${operator}\n` +
                `📋 代点对象: *${targetUser}*\n` +
                `🏖️ 假期类型: *${leaveType}*\n` +
                `📍 状态: 已由后台录入\n`;
    } else {
        text += `👤 操作人: ${operator} (${role})\n` +
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
