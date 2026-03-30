// --- 1. 登录逻辑 (已增加“测试员”权限) ---
document.getElementById('login-btn')?.addEventListener('click', () => {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    if ((user === 'admin' && pass === '123456') || 
        (user === 'user' && pass === '123456') || 
        (user === '测试员' && pass === '123456')) {
        alert('登录成功！');
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('main-page').style.display = 'block';
    } else {
        alert('账号或密码错误！请输入：测试员');
    }
});

// --- 2. 核心打卡逻辑 (确保发送真实人数) ---
async function handleAttendance(type) {
    // 获取输入框里的数字，如果没填则默认为 0
    const vacationInput = document.getElementById('vacation-input');
    const lateInput = document.getElementById('late-input');
    
    const vacationCount = vacationInput ? parseInt(vacationInput.value) || 0 : 0;
    const lateCount = lateInput ? parseInt(lateInput.value) || 0 : 0;

    try {
        // 发送 POST 请求到你的后端 API
        const response = await fetch('/api/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                vacation: vacationCount,
                late: lateCount
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert(`✅ ${type}成功！消息已实时发送给机器人。`);
        } else {
            console.error('API 报错:', result);
            alert('❌ 同步失败：' + (result.error || '后端未响应'));
        }
    } catch (error) {
        console.error('网络错误:', error);
        alert('🌐 网络连接失败，请确认 Vercel 部署是否完成。');
    }
}

// 绑定按钮事件
document.getElementById('work-in-btn')?.addEventListener('click', () => handleAttendance('上班打卡'));
document.getElementById('work-out-btn')?.addEventListener('click', () => handleAttendance('下班打卡'));

// --- 3. 时间显示 ---
setInterval(() => {
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        const now = new Date();
        timeElement.textContent = now.getHours().toString().padStart(2, '0') + ':' + 
                                 now.getMinutes().toString().padStart(2, '0') + ':' + 
                                 now.getSeconds().toString().padStart(2, '0');
    }
}, 1000);
