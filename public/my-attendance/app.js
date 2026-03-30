/**
 * 企业考勤管理系统 - 核心逻辑控制 (app.js)
 * 功能：页面切换、多角色登录、实时时钟、打卡记录、Telegram 机器人同步回报
 */

// --- 1. 自动化配置区 ---
// 这里已经填入你截图中的 Token 和 Chat ID
const BOT_TOKEN = '8776473309:AAHXDOT7tWrTIgwJmFWznuGddNimKY4Z9uU';
const CHAT_ID = '1415332176';

let currentUser = ""; // 记录当前登录用户

// --- 2. 基础初始化 ---
window.onload = function() {
    console.log("考勤系统已启动...");
    // 启动实时时钟
    setInterval(() => {
        const clock = document.getElementById('current-time');
        if (clock) {
            const now = new Date();
            clock.innerText = now.toLocaleString('zh-CN', { hour12: false });
        }
    }, 1000);
};

// --- 3. 登录逻辑 ---
function handleLogin() {
    const usernameInput = document.getElementById('username');
    if (!usernameInput) return;
    
    const user = usernameInput.value.trim();

    if (user === "") {
        alert("请输入名字！");
        return;
    }

    // 登录判断
    if (user.toLowerCase() === 'admin') {
        currentUser = 'admin';
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('admin-page').style.display = 'block';
    } else {
        // 只要不是 admin，全部视为员工登录
        currentUser = user;
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('user-page').style.display = 'block';
        
        // 更新打卡页面的欢迎语
        const welcomeTitle = document.querySelector('#user-page h2');
        if (welcomeTitle) {
            welcomeTitle.innerText = `👋 欢迎回来，${user}`;
        }
    }
}

// --- 4. 员工打卡功能 (主动回报) ---
async function submitAttendance(type) {
    const now = new Date();
    const timeStr = now.toLocaleString('zh-CN', { hour12: false });
    
    // 构造发给机器人的漂亮消息
    const message = `
✨ **新的考勤打卡回报** ✨
━━━━━━━━━━━━━━
👤 **打卡员工**: ${currentUser}
📅 **打卡时间**: ${timeStr}
📍 **打卡动作**: ${type === 'in' ? '🟢 上班打卡' : '🔴 下班打卡'}
━━━━━━━━━━━━━━
✅ *打卡数据已实时同步至后台*
    `.trim();

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
            alert(`${currentUser}，${type === 'in' ? '上班' : '下班'}打卡成功！机器人已同步。`);
        } else {
            alert("打卡成功，但机器人回报失败，请检查网络或配置。");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("打卡过程发生错误，请查看控制台。");
    }
}

// --- 5. 管理员数据同步 (被动回报) ---
async function syncToBot() {
    const holidayCount = document.getElementById('holiday-count').value || 0;
    const lateCount = document.getElementById('late-count').value || 0;

    const message = `
📊 **考勤数据日报**
━━━━━━━━━━━━━━
🏖️ **休假人数**: ${holidayCount}
⏰ **迟到人数**: ${lateCount}
━━━━━━━━━━━━━━
📢 *管理员已更新今日考勤统计*
    `.trim();

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
            alert("数据已同步至机器人！");
        } else {
            alert("同步失败。");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("同步出错。");
    }
}