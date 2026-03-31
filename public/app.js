// --- 1. 登录与身份识别 ---
document.getElementById('login-btn')?.addEventListener('click', () => {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();

    const users = {
        'admin': '系统管理员',
        'user': '正式员工',
        '测试员': '系统测试员'
    };

    if (users[user] && pass === '123456') {
        window.currentUser = { name: user, role: users[user] };
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        
        const display = document.getElementById('user-role-display');
        if (display) display.textContent = `当前操作人：${user} (${users[user]})`;
    } else {
        alert('登录失败：账号或密码(123456)不正确');
    }
});

// --- 2. 机器人数据上报 ---
async function handleAttendance(type) {
    const vacation = document.getElementById('vacation-input')?.value || 0;
    const late = document.getElementById('late-input')?.value || 0;
    const operator = window.currentUser?.name || '未知';

    try {
        const response = await fetch('/api/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vacation, late, operator, type })
        });

        if (response.ok) {
            alert(`✅ ${type}数据已成功送达 Telegram 机器人`);
        } else {
            const resData = await response.json();
            alert(`❌ 同步失败：${resData.error || '后端响应异常'}`);
        }
    } catch (error) {
        alert('🌐 网络请求异常，请检查 Vercel 网络');
    }
}

document.getElementById('work-in-btn').onclick = () => handleAttendance('上班打卡');
document.getElementById('work-out-btn').onclick = () => handleAttendance('下班打卡');

// --- 3. 实时时钟 ---
function tick() {
    const clock = document.getElementById('current-time');
    if (clock) {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString('zh-CN', { hour12: false });
    }
}
setInterval(tick, 1000);
tick();
