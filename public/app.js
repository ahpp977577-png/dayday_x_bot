// --- 1. 用户与员工名单配置 ---
const userRegistry = {
    'admin': { role: '管理层', isAdmin: true },
    '黄于短': { role: '正式员工', isAdmin: false },
    '郑地瓜': { role: '正式员工', isAdmin: false },
    '涂小B': { role: '正式员工', isAdmin: false }
};

// --- 2. 登录逻辑 ---
document.getElementById('login-btn').onclick = () => {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();

    if (pass === '123456' && (userRegistry[user])) {
        const userInfo = userRegistry[user];
        window.currentUser = { name: user, ...userInfo };

        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        
        document.getElementById('welcome-msg').textContent = `你好，${user}`;
        const tag = document.getElementById('role-tag');
        tag.textContent = userInfo.role;

        // 管理员特权：初始化员工下拉列表
        if (userInfo.isAdmin) {
            document.getElementById('admin-area').classList.remove('hidden');
            const select = document.getElementById('target-employee');
            select.innerHTML = ''; // 清空
            Object.keys(userRegistry).forEach(name => {
                if(name !== 'admin') { // 管理员帮员工点假
                    let opt = document.createElement('option');
                    opt.value = name;
                    opt.textContent = name;
                    select.appendChild(opt);
                }
            });
        }
    } else {
        alert('验证失败');
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
                operatorRole: window.currentUser.role
            })
        });
        if (res.ok) alert('✅ 机器人同步成功！');
    } catch (e) {
        alert('🌐 网络错误');
    }
}

// --- 4. 事件绑定 ---
// 管理员：代点假功能
document.getElementById('admin-sync-btn').onclick = () => {
    const target = document.getElementById('target-employee').value;
    const leaveType = document.getElementById('leave-type').value;
    
    reportToBot({ 
        type: '管理员代点假', 
        targetUser: target, 
        leaveType: leaveType 
    });
};

// 个人打卡 (admin和员工通用)
document.getElementById('work-in-btn').onclick = () => reportToBot({ type: '上班签到' });
document.getElementById('work-out-btn').onclick = () => reportToBot({ type: '下班签退' });

// 时钟
setInterval(() => {
    document.getElementById('current-time').textContent = new Date().toLocaleTimeString('zh-CN', {hour12:false});
}, 1000);
