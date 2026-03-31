// --- 1. 用户配置 ---
const userRegistry = {
    'admin': { role: '管理层', isAdmin: true },
    '张三': { role: '正式员工', isAdmin: false },
    '李四': { role: '正式员工', isAdmin: false },
    '测试员': { role: '系统测试', isAdmin: false }
};

// --- 2. 登录逻辑 ---
document.getElementById('login-btn').onclick = () => {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();

    if (pass === '123456' && (userRegistry[user] || user === 'admin')) {
        const userInfo = userRegistry[user] || { role: '普通员工', isAdmin: false };
        window.currentUser = { name: user, ...userInfo };

        // 界面跳转
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        
        // 权限展示
        document.getElementById('welcome-msg').textContent = `你好，${user}`;
        const tag = document.getElementById('role-tag');
        tag.textContent = userInfo.role;
        tag.style.background = userInfo.isAdmin ? '#ede9fe' : '#dcfce7';
        tag.style.color = userInfo.isAdmin ? '#7c3aed' : '#059669';

        // 管理员特权显示
        if (userInfo.isAdmin) {
            document.getElementById('admin-area').classList.remove('hidden');
        }
    } else {
        alert('验证失败：账号不存在或密码错误');
    }
};

// --- 3. 统一发送函数 ---
async function reportToBot(payload) {
    try {
        const res = await fetch('/api/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...payload,
                operator: window.currentUser.name,
                role: window.currentUser.role
            })
        });
        if (res.ok) alert('✅ 机器人同步成功！');
        else alert('❌ 同步失败，请检查配置。');
    } catch (e) {
        alert('🌐 网络错误');
    }
}

// --- 4. 事件绑定 ---
// 管理员同步
document.getElementById('admin-sync-btn').onclick = () => {
    const vacation = document.getElementById('vacation-input').value;
    const special = document.getElementById('special-input').value;
    reportToBot({ type: '管理数据上报', vacation, special });
};

// 员工打卡
document.getElementById('work-in-btn').onclick = () => reportToBot({ type: '上班签到' });
document.getElementById('work-out-btn').onclick = () => reportToBot({ type: '下班签退' });

// 时钟
setInterval(() => {
    document.getElementById('current-time').textContent = new Date().toLocaleTimeString('zh-CN', {hour12:false});
}, 1000);
