// --- 核心逻辑 ---
const users = {
    'admin': '系统管理员',
    'user': '正式员工',
    '测试员': '系统测试员'
};

// 登录处理
document.getElementById('login-btn').addEventListener('click', function() {
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value.trim();

    console.log("尝试登录:", u); // 调试用

    if (users[u] && p === '123456') {
        window.currentUser = u;
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        document.getElementById('user-role-display').textContent = `操作人：${u} (${users[u]})`;
    } else {
        alert('账号或密码错误！\n提示：密码统一为 123456');
    }
});

// 打卡处理
async function sendData(type) {
    const vacation = document.getElementById('vacation-input').value || 0;
    const late = document.getElementById('late-input').value || 0;
    
    try {
        const res = await fetch('/api/update', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                vacation, late, type,
                operator: window.currentUser
            })
        });
        if (res.ok) alert(`✅ ${type}成功！消息已同步机器人。`);
        else alert('❌ 同步失败，请检查 Vercel 后端。');
    } catch (e) {
        alert('🌐 网络错误');
    }
}

document.getElementById('work-in-btn').onclick = () => sendData('上班打卡');
document.getElementById('work-out-btn').onclick = () => sendData('下班打卡');

// 时钟
setInterval(() => {
    const el = document.getElementById('current-time');
    if (el) el.textContent = new Date().toLocaleTimeString('zh-CN', {hour12:false});
}, 1000);
