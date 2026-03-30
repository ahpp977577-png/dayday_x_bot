// 登录逻辑
document.getElementById('login-btn')?.addEventListener('click', () => {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    // 这里增加了“测试员”的登录判断
    if ((user === 'admin' && pass === '123456') || 
        (user === 'user' && pass === '123456') || 
        (user === '测试员' && pass === '123456')) {
        alert('登录成功！');
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('main-page').style.display = 'block';
    } else {
        alert('账号或密码错误！请输入 admin、user 或 测试员');
    }
});

// 打卡逻辑
async function handleAttendance(type) {
    // 模拟获取当前人数数据（你可以根据实际输入框获取）
    const vacationCount = 1; // 假设请假 1 人
    const lateCount = 0;     // 假设迟到 0 人

    try {
        const response = await fetch('/api/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                vacation: vacationCount,
                late: lateCount
            })
        });

        if (response.ok) {
            alert(`${type} 成功！数据已同步至机器人。`);
        } else {
            alert('同步失败，请检查后端配置。');
        }
    } catch (error) {
        console.error('错误:', error);
        alert('网络错误，无法连接到 API。');
    }
}

// 绑定按钮事件
document.getElementById('work-in-btn')?.addEventListener('click', () => handleAttendance('上班打卡'));
document.getElementById('work-out-btn')?.addEventListener('click', () => handleAttendance('下班打卡'));

// 实时时间显示
setInterval(() => {
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + 
                    now.getMinutes().toString().padStart(2, '0') + ':' + 
                    now.getSeconds().toString().padStart(2, '0');
    const timeElement = document.getElementById('current-time');
    if (timeElement) timeElement.textContent = timeStr;
}, 1000);
