// 登录逻辑
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
        alert('账号错误！请输入: 测试员');
    }
});

// 核心：打卡并通知机器人
async function handleAttendance(type) {
    // 1. 自动从网页输入框获取人数（请确保你的 HTML 里有这两个 ID）
    // 如果没有，它会默认发送 0
    const vacationCount = document.getElementById('vacation-input')?.value || 0;
    const lateCount = document.getElementById('late-input')?.value || 0;

    try {
        // 2. 发送请求到后端 api/update.js
        const response = await fetch('/api/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                vacation: parseInt(vacationCount),
                late: parseInt(lateCount)
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert(`✅ ${type}成功！机器人已同步。`);
        } else {
            console.error('服务器错误:', result);
            alert('❌ 机器人通知失败：' + (result.error || '未知错误'));
        }
    } catch (error) {
        console.error('网络错误:', error);
        alert('🌐 网络连线失败，请检查部署状态。');
    }
}

// 绑定按钮
document.getElementById('work-in-btn')?.addEventListener('click', () => handleAttendance('上班打卡'));
document.getElementById('work-out-btn')?.addEventListener('click', () => handleAttendance('下班打卡'));

// 时间显示
setInterval(() => {
    const timeElement = document.getElementById('current-time');
    if (timeElement) timeElement.textContent = new Date().toLocaleTimeString();
}, 1000);
