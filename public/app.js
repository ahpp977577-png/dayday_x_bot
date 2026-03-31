// --- 优化后的登录逻辑 ---
document.getElementById('login-btn')?.addEventListener('click', () => {
    const userInput = document.getElementById('username').value;
    const passInput = document.getElementById('password').value;

    // 账号数据库：可以在这里添加无限个账号
    const userRegistry = {
        'admin': { pass: '123456', role: '系统管理员' },
        'user01': { pass: '123456', role: '正式员工' },
        'user02': { pass: '123456', role: '正式员工' },
        '测试员': { pass: '123456', role: '系统测试员' }
    };

    const matchedUser = userRegistry[userInput];

    if (matchedUser && matchedUser.pass === passInput) {
        alert(`登录成功！欢迎，${matchedUser.role}`);
        
        // 保存当前角色到全局，以便打卡时使用
        window.currentUser = { name: userInput, role: matchedUser.role };
        
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        
        // 在界面上显示当前登录人
        const display = document.getElementById('user-role-display');
        if (display) display.textContent = `当前操作人：${userInput} (${matchedUser.role})`;
    } else {
        alert('账号或密码错误！请检查输入。');
    }
});
