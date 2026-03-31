const userRegistry = {
    'admin': { role: '管理层', isAdmin: true },
    '黄于短': { role: '正式员工', isAdmin: false },
    '郑瓜瓜': { role: '正式员工', isAdmin: false },
    '涂逼逼': { role: '正式员工', isAdmin: false }
};

document.getElementById('login-btn').onclick = () => {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();

    if (pass === '123456' && userRegistry[user]) {
        window.currentUser = { name: user, ...userRegistry[user] };
        
        // 切换页面
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        
        // 设置个人信息
        document.getElementById('welcome-msg').textContent = `你好，${user}`;
        const tag = document.getElementById('role-tag');
        tag.textContent = window.currentUser.role;
        tag.style.color = window.currentUser.isAdmin ? '#7c3aed' : '#059669';

        // 管理员逻辑：填充员工列表
        if (window.currentUser.isAdmin) {
            document.getElementById('admin-area').classList.remove('hidden');
            const select = document.getElementById('target-employee-select');
            select.innerHTML = '';
            Object.keys(userRegistry).forEach(name => {
                if (name !== 'admin') {
                    let opt = document.createElement('option');
                    opt.value = name;
                    opt.textContent = name;
                    select.appendChild(opt);
                }
            });
        }
    } else {
        alert('账号或密码错误！');
    }
};

// 统一回报函数
async function sendReport(data) {
    try {
        const response = await fetch('/api/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...data,
                operator: window.currentUser.name,
                role: window.currentUser.role
            })
        });
        if (response.ok) alert('✅ 机器人同步成功');
    } catch (e) {
        alert('❌ 网络同步失败');
    }
}

// 绑定按钮事件
document.getElementById('admin-sync-btn').onclick = () => {
    sendReport({
        type: '管理员代点假',
        targetUser: document.getElementById('target-employee-select').value,
        leaveType: document.getElementById('leave-type-select').value
    });
};

document.getElementById('work-in-btn').onclick = () => sendReport({ type: '上班签到' });
document.getElementById('work-out-btn').onclick = () => sendReport({ type: '下班签退' });

// 时钟逻辑
setInterval(() => {
    document.getElementById('current-time').textContent = new Date().toLocaleTimeString('zh-CN', {hour12:false});
}, 1000);
