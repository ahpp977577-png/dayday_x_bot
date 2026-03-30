// --- 1. 登录逻辑 ---
document.getElementById('login-btn')?.addEventListener('click', () => {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    // 匹配“测试员”账号
    if ((user === 'admin' && pass === '123456') || 
        (user === 'user' && pass === '123456') || 
        (user === '测试员' && pass === '123456')) {
        alert('登录成功！');
        // 修正 ID 匹配 index.html 里的结构
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
    } else {
        alert('账号错误！请输入：测试员');
    }
});

// --- 2. 核心打卡逻辑 (发送实时数据) ---
async function handleAttendance(type) {
    const vacationInput = document.getElementById('vacation-input');
    const lateInput = document.getElementById('late-input');
    
    const vacationCount = vacationInput ? parseInt(vacationInput.value) || 0 : 0;
    const lateCount = lateInput ? parseInt(lateInput.value) || 0 : 0;

    try {
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
            alert(`✅ ${type}成功！机器人消息已同步。`);
        } else {
            console.error('API 报错:', result);
            alert('❌ 同步失败：' + (result.error || '后端未响应'));
        }
    } catch (error) {
        console.error('连接失败:', error);
        alert('🌐 无法连接到服务器，请检查 Vercel 部署。');
    }
}

// 绑定按钮
document.getElementById('work-in-btn')?.addEventListener('click', () => handleAttendance('上班打卡'));
document.getElementById('work-out-btn')?.addEventListener('click', () => handleAttendance('下班打卡'));

// --- 3. 动态时间更新 ---
setInterval(() => {
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        const now = new Date();
        timeElement.textContent = now.getHours().toString().padStart(2, '0') + ':' + 
                                 now.getMinutes().toString().padStart(2, '0') + ':' + 
                                 now.getSeconds().toString().padStart(2, '0');
    }
}, 1000);
