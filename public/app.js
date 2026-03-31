// --- 1. 登录逻辑 ---
document.getElementById('login-btn')?.addEventListener('click', () => {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    const userRegistry = {
        'admin': { pass: '123456', role: '系统管理员' },
        'user': { pass: '123456', role: '正式员工' },
        '测试员': { pass: '123456', role: '系统测试员' }
    };

    if (userRegistry[user] && userRegistry[user].pass === pass) {
        window.currentUser = { name: user, role: userRegistry[user].role };
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        
        const display = document.getElementById('user-role-display');
        if (display) display.textContent = `当前操作人：${user} (${window.currentUser.role})`;
    } else {
        alert('账号或密码错误！');
    }
});

// --- 2. 打卡及机器人同步 ---
async function handleAttendance(type) {
    const vacation = document.getElementById('vacation-input')?.value || 0;
    const late = document.getElementById('late-input')?.value || 0;
    const operator = window.currentUser?.name || '未知用户';

    try {
        const response = await fetch('/api/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                vacation,
                late,
                operator,
                type
            })
        });

        if (response.ok) {
            alert(`✅ ${type}成功！机器人消息已同步。`);
        } else {
            const result = await response.json();
            alert(`❌ 同步失败: ${result.error || '未知错误'}`);
        }
    } catch (error) {
        alert('🌐 网络连接失败，请确认 Vercel 部署状态。');
    }
}

document.getElementById('work-in-btn').onclick = () => handleAttendance('上班打卡');
document.getElementById('work-out-btn').onclick = () => handleAttendance('下班打卡');
document.getElementById('logout-btn').onclick = () => location.reload();

// --- 3. 时间显示 (修复停止问题) ---
function updateClock() {
    const clock = document.getElementById('current-time');
    if (clock) {
        const now = new Date();
        clock.textContent = now.getHours().toString().padStart(2, '0') + ':' + 
                          now.getMinutes().toString().padStart(2, '0') + ':' + 
                          now.getSeconds().toString().padStart(2, '0');
    }
}
setInterval(updateClock, 1000);
updateClock(); // 初始化立即显示
