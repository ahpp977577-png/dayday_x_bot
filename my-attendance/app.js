/**
 * 企业考勤管理系统 - 核心逻辑控制 (app.js)
 * 功能：页面切换、模拟登录、实时时钟、打卡记录、Telegram 机器人同步回报
 */

// --- 1. 自动化配置区 ---
const BOT_TOKEN = '8776473309:AAHXDOT7tWrtIgwJmFWznuGddNimkY4Z9uU'; 
const CHAT_ID = '1415332176'; 

// --- 2. 基础初始化 ---
function initApp() {
    console.log("考勤系统已启动...");
    // 每秒更新一次网页上的时钟显示
    setInterval(() => {
        const clock = document.getElementById('current-time');
        if (clock) {
            const now = new Date();
            clock.innerText = now.toLocaleTimeString('zh-CN', { hour12: false });
        }
    }, 1000);
}

// --- 3. 登录逻辑 ---
function handleLogin() {
    const usernameInput = document.getElementById('username');
    const user = usernameInput.value.trim();

    if (user !== "") {
        // 隐藏登录页，显示主程序
        document.getElementById('login-page').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');
        
        // 根据角色渲染菜单（演示逻辑：输入 admin 视为管理员）
        renderMenu(user.toLowerCase() === 'admin' ? 'admin' : 'user');
        console.log(`用户 ${user} 已登录`);
    } else {
        alert('请输入姓名或工号以继续');
    }
}

// 动态生成侧边栏菜单
function renderMenu(role) {
    const nav = document.getElementById('nav-menu');
    let menuHtml = `
        <a onclick="showPage('check-in')" class="nav-item">今日打卡</a>
        <a onclick="showPage('history')" class="nav-item">打卡记录</a>
    `;
    
    // 如果是管理员，可以额外看到请假申请（演示用）
    if (role === 'admin') {
        menuHtml += `<a onclick="showPage('leave')" class="nav-item">请假管理</a>`;
    }
    
    nav.innerHTML = menuHtml;
}

// 页面切换逻辑
function showPage(pageId) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    // 显示目标页面
    const targetPage = document.getElementById(pageId + '-section');
    if (targetPage) {
        targetPage.classList.remove('hidden');
    }
}

// --- 4. 核心功能：打卡并同步给飞机机器人 ---
async function punchIn(type) {
    const now = new Date();
    const time