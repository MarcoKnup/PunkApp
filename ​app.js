const firebaseConfig = {
    apiKey: "AIzaSyCmmj68joik-Y2UCwJrAaReKbs8EcMeyYg",
    authDomain: "punkapp-e91c2.firebaseapp.com",
    projectId: "punkapp-e91c2",
    storageBucket: "punkapp-e91c2.appspot.com",
    messagingSenderId: "1091665370587",
    appId: "1:1091665370587:web:1b68d249ac7b329222dbfe"
};

let db = null;
let messaging = null;
let cloudRegisteredUsers = [];

try {
    if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
    db = firebase.firestore();
    if (firebase.messaging.isSupported()) messaging = firebase.messaging();
} catch (e) {
    console.log("Errore Firebase:", e);
}

let defaultMenu = [
    { id: '1', category: 'Gin', name: 'Tanqueray', desc: 'Classico & Tonic', badge: 'Bar', points: 20, soldOut: false, specialPromo: false },
    { id: '2', category: 'Gin', name: 'Roku Gin', desc: 'Craft Giapponese', badge: 'Special', points: 30, soldOut: false, specialPromo: false },
    { id: '3', category: 'Gin', name: 'Gin N. 3', desc: 'London Dry Selection', badge: 'Premium', points: 35, soldOut: false, specialPromo: false },
    { id: '4', category: 'Gin', name: 'Z44', desc: 'Pino Cembro Botanico', badge: 'Special', points: 40, soldOut: false, specialPromo: false },
    { id: '5', category: 'Gin', name: 'Gin dell\'Adda', desc: 'Artigianale Locale', badge: 'Local', points: 25, soldOut: false, specialPromo: false },
    { id: '6', category: 'Gin', name: 'Etsu', desc: 'Gin Giapponese', badge: 'Oriental', points: 45, soldOut: false, specialPromo: false },
    { id: '19', category: 'Gin', name: 'Sip Smith', desc: 'London Dry Classico', badge: 'Classic', points: 30, soldOut: false, specialPromo: false },

    { id: '7', category: 'Analcolici', name: 'Acqua Naturale', desc: 'Bottiglietta', badge: 'Analcolico', points: 2, soldOut: false, specialPromo: false },
    { id: '8', category: 'Analcolici', name: 'Acqua Frizzante', desc: 'Bottiglietta', badge: 'Analcolico', points: 2, soldOut: false, specialPromo: false },
    { id: '9', category: 'Analcolici', name: 'Acqua Tonica', desc: 'Mixer', badge: 'Analcolico', points: 5, soldOut: false, specialPromo: false },
    { id: '10', category: 'Analcolici', name: 'Birra', desc: 'Selezione della Casa', badge: 'Alcolico', points: 15, soldOut: false, specialPromo: false },
    { id: '11', category: 'Analcolici', name: 'Vino Rosso', desc: 'Calice Selezionato', badge: 'Alcolico', points: 20, soldOut: false, specialPromo: false },
    { id: '20', category: 'Analcolici', name: 'Camparino, la trombetta', desc: 'Aperitivo Classico', badge: 'Alcolico', points: 18, soldOut: false, specialPromo: false },
    { id: '21', category: 'Analcolici', name: 'Caffè', desc: 'Espresso Caldo', badge: 'Analcolico', points: 2, soldOut: false, specialPromo: false },

    { id: '12', category: 'Smoke', name: 'Sensation Green', desc: 'Relax Selection', badge: 'Chill', points: 35, soldOut: false, specialPromo: false },
    { id: '13', category: 'Smoke', name: 'Avocado', desc: 'Gusto Fruttato Esotico', badge: 'top', points: 45, soldOut: false, specialPromo: false },
    { id: '14', category: 'Smoke', name: 'Hello Kitty', desc: 'Special Edition Blend', badge: 'Limited', points: 60, soldOut: false, specialPromo: false },

    { id: '15', category: 'PS3', name: 'Calcio', desc: 'PS3 / Torneo 1v1', badge: 'Disponibile', points: 10, soldOut: false, specialPromo: false },
    { id: '16', category: 'PS3', name: 'Tennis', desc: 'PS3 / Sport', badge: 'Disponibile', points: 10, soldOut: false, specialPromo: false },
    { id: '17', category: 'PS3', name: 'GTA 4', desc: 'PS3 / Liberty City', badge: 'Disponibile', points: 15, soldOut: false, specialPromo: false },
    { id: '18', category: 'PS3', name: 'GTA 5', desc: 'PS3 / Open World', badge: 'Disponibile', points: 20, soldOut: false, specialPromo: false },

    { id: '22', category: 'Carte', name: 'Scopa', desc: 'Carte Italiane / Tavolo', badge: 'Carte', points: 10, soldOut: false, specialPromo: false },
    { id: '23', category: 'Carte', name: 'Briscola', desc: 'Carte Italiane / Sfiamma', badge: 'Carte', points: 10, soldOut: false, specialPromo: false }
];

let defaultVipRewards = [
    { id: 'r1', name: 'Sensation Green', cost: 350, soldOut: false },
    { id: 'r2', name: 'Avocado', cost: 450, soldOut: false },
    { id: 'r3', name: 'Hello Kitty', cost: 600, soldOut: false },
    { id: 'r4', name: 'Tanqueray', cost: 200, soldOut: false },
    { id: 'r5', name: 'Roku Gin', cost: 300, soldOut: false },
    { id: 'r6', name: 'Gin N. 3', cost: 350, soldOut: false },
    { id: 'r7', name: 'Z44', cost: 400, soldOut: false },
    { id: 'r8', name: 'Gin dell\'Adda', cost: 250, soldOut: false },
    { id: 'r9', name: 'Etsu', cost: 450, soldOut: false },
    { id: 'r10', name: 'Sip Smith', cost: 300, soldOut: false },
    { id: 'r11', name: 'Gin Mare (1 Litro e mezzo)', cost: 800, soldOut: false },
    { id: 'r12', name: 'Kamagra', cost: 1000, soldOut: false }
];

let appMenu = defaultMenu;
let vipRewardsCatalog = defaultVipRewards;
let currentUsername = "";
let currentTab = "venerdi";
let selectedQuantities = {};
let selectedRewardsForOrder = [];
let editingOrderId = null;
let userPoints = 0;
let readyRewards = [];
let ordersHistory = [];
let appNotifications = [];
let chatMessagesStore = [];
let activeChatRoom = "global";
let currentViewingPhotoId = null;

window.onload = function() {
    try {
        const savedName = localStorage.getItem("punk_app_username");
        if (savedName) {
            currentUsername = savedName;
            const badgeDisp = document.getElementById("userBadgeDisplay");
            if (badgeDisp) badgeDisp.innerText = "👤 " + currentUsername;
            checkUserRoleVisibility();
        } else {
            openLoginModal(false);
        }

        const savedPoints = localStorage.getItem("punk_app_points");
        if (savedPoints !== null) userPoints = parseInt(savedPoints, 10);

        const savedReadyRewards = localStorage.getItem("punk_app_ready_rewards");
        if (savedReadyRewards) {
            try { readyRewards = JSON.parse(savedReadyRewards); } catch(e) {}
        }

        const savedOrders = localStorage.getItem("punk_app_orders");
        if (savedOrders) {
            try { ordersHistory = JSON.parse(savedOrders); } catch(e) {}
        }

        const savedNotifs = localStorage.getItem("punk_app_notifications");
        if (savedNotifs) {
            try { appNotifications = JSON.parse(savedNotifs); } catch(e) {}
        }

        const savedChat = localStorage.getItem("punk_app_chat_messages");
        if (savedChat) {
            try { chatMessagesStore = JSON.parse(savedChat); } catch(e) {}
        }

        const savedMenu = localStorage.getItem("punk_app_menu");
        if (savedMenu) {
            try { appMenu = JSON.parse(savedMenu); } catch(e) {}
        }

        const savedRewardsCatalog = localStorage.getItem("punk_app_vip_rewards_catalog");
        if (savedRewardsCatalog) {
            try { vipRewardsCatalog = JSON.parse(savedRewardsCatalog); } catch(e) {}
        }

        recalculateAllUserPoints();
        renderMenu();
        renderAdminMenuEditor();
        renderVipCatalog();
        renderAdminRewardsEditor();
        updateAdminBadge();
        updateNotificationsBadge();
        renderNotificationsList();
        renderReadyRewards();
        renderVenerdiRewards();
        renderOrders();
        renderUserHistory();
        renderAdminUsersList();
        renderRanking();
        checkLuckyWheelStatus();
        startCountdownTimer();
        generateVipQrCode();

        if (db) {
            db.collection("users").onSnapshot(snapshot => {
                cloudRegisteredUsers = [];
                snapshot.forEach(doc => {
                    const data = doc.data();
                    if (data && data.username) {
                        cloudRegisteredUsers.push({ username: data.username, lastLogin: data.lastLogin || null });
                    }
                });
                renderAdminUsersList();
                renderRanking();
                if (document.getElementById("globalChatModal") && document.getElementById("globalChatModal").style.display === "flex") {
                    renderChatSidebar();
                }
            });

            db.collection("menu").onSnapshot(snapshot => {
                let cloudMenu = [];
                snapshot.forEach(doc => cloudMenu.push(doc.data()));
                if (cloudMenu.length > 0) {
                    appMenu = cloudMenu;
                    localStorage.setItem("punk_app_menu", JSON.stringify(appMenu));
                    renderMenu();
                    renderAdminMenuEditor();
                }
            });

            db.collection("vipRewards").onSnapshot(snapshot => {
                let cloudRewards = [];
                snapshot.forEach(doc => cloudRewards.push(doc.data()));
                if (cloudRewards.length > 0) {
                    vipRewardsCatalog = cloudRewards;
                    localStorage.setItem("punk_app_vip_rewards_catalog", JSON.stringify(vipRewardsCatalog));
                    renderVipCatalog();
                    renderAdminRewardsEditor();
                }
            });

            db.collection("orders").orderBy("id", "desc").onSnapshot(snapshot => {
                let cloudOrders = [];
                snapshot.forEach(doc => cloudOrders.push(doc.data()));
                ordersHistory = cloudOrders;
                localStorage.setItem("punk_app_orders", JSON.stringify(ordersHistory));
                recalculateAllUserPoints();
                renderOrders();
                renderUserHistory();
                renderAdminUsersList();
                renderRanking();
                updateAdminBadge();
            });

            db.collection("chat_messages").onSnapshot(snapshot => {
                let cloudChat = [];
                snapshot.forEach(doc => { const data = doc.data(); if (data) cloudChat.push(data); });
                cloudChat.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
                chatMessagesStore = cloudChat;
                localStorage.setItem("punk_app_chat_messages", JSON.stringify(chatMessagesStore));

                if (document.getElementById("globalChatModal") && document.getElementById("globalChatModal").style.display === "flex") {
                    markCurrentChatMessagesAsRead();
                    renderChatSidebar();
                    renderActiveChatMessages();
                }
                updateNotificationsBadge();
            });

            db.collection("notifications").orderBy("timestamp", "asc").onSnapshot(snapshot => {
                let cloudNotifs = [];
                snapshot.forEach(doc => cloudNotifs.push(doc.data()));
                if (cloudNotifs.length > 0) {
                    appNotifications = cloudNotifs;
                    localStorage.setItem("punk_app_notifications", JSON.stringify(appNotifications));
                    updateNotificationsBadge();
                    renderNotificationsList();
                }
            });
        }
    } catch (err) {
        console.error("Errore critico durante l'avvio della Web App:", err);
    }
};

function startCountdownTimer() {
    function updateTimer() {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const titleElem = document.getElementById("countdownTitleElem");
        const timersBox = document.getElementById("countdownTimersBox");
        if (!timersBox) return;

        if (dayOfWeek === 5) {
            if (titleElem) titleElem.innerText = "🎉 È VENERDÌ SERA!";
            timersBox.innerHTML = `<div style="width: 100%; font-size: 0.9rem; font-weight: 900; color: var(--accent-yellow); padding: 4px 0;">🔥 GODITI LA SERATA AL PUNK CLUB! 🍸</div>`;
        } else {
            if (titleElem) titleElem.innerText = "⏳ Conto alla Rovescia Prossimo Venerdì";
            const targetDay = 5;
            let resultDate = new Date(now);
            resultDate.setDate(now.getDate() + ((targetDay + 7 - now.getDay()) % 7));
            resultDate.setHours(0, 0, 0, 0);
            if (now > resultDate) resultDate.setDate(resultDate.getDate() + 7);

            const diff = resultDate - now;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            const dElem = document.getElementById("cdDays");
            const hElem = document.getElementById("cdHours");
            const mElem = document.getElementById("cdMins");
            const sElem = document.getElementById("cdSecs");

            if (dElem) dElem.innerText = String(days).padStart(2, '0');
            if (hElem) hElem.innerText = String(hrs).padStart(2, '0');
            if (mElem) mElem.innerText = String(minutes).padStart(2, '0');
            if (sElem) sElem.innerText = String(seconds).padStart(2, '0');
        }
    }
    updateTimer();
    setInterval(updateTimer, 1000);
}

function generateVipQrCode() {
    const canvas = document.getElementById("vipQrCanvas");
    const metaText = document.getElementById("vipPassMetaText");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const userNameStr = currentUsername ? currentUsername.toUpperCase() : "OSPITE";
    if (metaText) metaText.innerText = `PUNK-PASS: ${userNameStr}`;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(8, 8, 24, 24);
    ctx.fillRect(63, 8, 24, 24);
    ctx.fillRect(8, 63, 24, 24);

    ctx.fillStyle = "#000000";
    ctx.fillRect(12, 12, 16, 16);
    ctx.fillRect(67, 12, 16, 16);
    ctx.fillRect(12, 67, 16, 16);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(16, 16, 8, 8);
    ctx.fillRect(71, 16, 8, 8);
    ctx.fillRect(16, 71, 8, 8);

    const baseUser = currentUsername ? currentUsername.toLowerCase() : "ospite";
    for (let x = 36; x < 60; x += 5) {
        for (let y = 8; y < 87; y += 5) {
            let checkStr = baseUser + "_x" + x + "_y" + y;
            let hash = 0;
            for (let i = 0; i < checkStr.length; i++) {
                hash = ((hash << 5) - hash) + checkStr.charCodeAt(i);
                hash |= 0;
            }
            if (Math.abs(hash) % 2 === 0) {
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(x, y, 4, 4);
            }
        }
    }
}

function drawMiniQr(canvasId, username) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(3, 3, 11, 11);
    ctx.fillRect(22, 3, 11, 11);
    ctx.fillRect(3, 22, 11, 11);

    ctx.fillStyle = "#000000";
    ctx.fillRect(6, 6, 5, 5);
    ctx.fillRect(25, 6, 5, 5);
    ctx.fillRect(6, 25, 5, 5);
}

function getUserAchievementBadge(username) {
    let ginCount = 0;
    let smokeCount = 0;
    let ps3Count = 0;
    let completedEvenings = 0;

    ordersHistory.forEach(o => {
        if (o.user && o.user.toLowerCase() === username.toLowerCase() && o.completed === true && o.items) {
            completedEvenings++;
            o.items.forEach(it => {
                const nameLower = it.name.toLowerCase();
                const qty = it.qty || 1;
                if (nameLower.includes("tanqueray") || nameLower.includes("roku") || nameLower.includes("gin") || nameLower.includes("z44") || nameLower.includes("etsu") || nameLower.includes("smith")) ginCount += qty;
                if (nameLower.includes("sensation") || nameLower.includes("avocado") || nameLower.includes("hello kitty")) smokeCount += qty;
                if (nameLower.includes("calcio") || nameLower.includes("tennis") || nameLower.includes("gta")) ps3Count += qty;
            });
        }
    });

    if (ginCount >= 3) return { text: "🍸 Re del Gin", color: "var(--accent-pink)" };
    if (smokeCount >= 2) return { text: "🌿 Fumatore Pro", color: "var(--accent-green)" };
    if (ps3Count >= 2) return { text: "🎮 Gamer Pro", color: "var(--accent-cyan)" };
    if (completedEvenings >= 3) return { text: "🔥 Veterano", color: "var(--accent-yellow)" };
    return null;
}

function openVipDetailsModal(targetUsername) {
    const userToCheck = (typeof targetUsername === 'string' && targetUsername.trim() !== '') ? targetUsername : currentUsername;
    if (!userToCheck) { openLoginModal(false); return; }
    const modal = document.getElementById("vipDetailsModal");
    const content = document.getElementById("vipDetailsContent");
    
    const pts = calculateUserPointsByName(userToCheck);
    const lvl = getLevelInfo(pts);
    const badgeInfo = getUserAchievementBadge(userToCheck);
    const myOrders = ordersHistory.filter(o => o.user && o.user.toLowerCase() === userToCheck.toLowerCase() && o.completed);
    const eveningsCount = myOrders.length;
    const uniqueIdHash = Math.abs((userToCheck + "_PUNK_KEY").split('').reduce((acc, char) => ((acc << 5) - acc) + char.charCodeAt(0), 0));
    
    let badgeHtml = badgeInfo 
        ? `<div style="background: rgba(255,255,255,0.03); border: 1px solid #2d2d3a; padding: 10px; border-radius: 8px;"><strong>🏅 Titolo Speciale:</strong> <span style="color:${badgeInfo.color}; font-weight:bold;">${badgeInfo.text}</span></div>`
        : `<div style="background: rgba(255,255,255,0.03); border: 1px solid #2d2d3a; padding: 10px; border-radius: 8px;"><strong>🏅 Titolo Speciale:</strong> <span style="color:#9a9ab0; font-size:0.85rem;">Nessun badge sbloccato</span></div>`;

    content.innerHTML = `
        <div style="background: rgba(255,255,255,0.03); border: 1px solid #2d2d3a; padding: 10px; border-radius: 8px;"><strong>👤 Utente:</strong> <span style="color:#fff;">${userToCheck}</span></div>
        ${badgeHtml}
        <div style="background: rgba(255,255,255,0.03); border: 1px solid #2d2d3a; padding: 10px; border-radius: 8px;"><strong>💳 Punti VIP:</strong> <span style="color:var(--accent-yellow); font-weight:bold;">${pts} Punti</span></div>
        <div style="background: rgba(255,255,255,0.03); border: 1px solid #2d2d3a; padding: 10px; border-radius: 8px;"><strong>⭐ Livello:</strong> <span style="color:var(--accent-cyan); font-weight:bold;">${lvl.title} (${lvl.number})</span></div>
        <div style="background: rgba(255,255,255,0.03); border: 1px solid #2d2d3a; padding: 10px; border-radius: 8px;"><strong>🎉 Serate Concluse:</strong> <span style="color:var(--accent-green); font-weight:bold;">${eveningsCount}</span></div>
        <div style="background: rgba(255,255,255,0.03); border: 1px solid #2d2d3a; padding: 10px; border-radius: 8px;"><strong>🔒 ID Pass:</strong> <span style="font-size:0.8rem; color:#aaa;">PUNK-VIP-${userToCheck.toUpperCase()}-${uniqueIdHash}</span></div>
    `;
    modal.style.display = "flex";
}

function closeVipDetailsModal() { document.getElementById("vipDetailsModal").style.display = "none"; }

function checkUserRoleVisibility() {
    const ordinazioniBtn = document.getElementById("ordinazioniBtn");
    const isAdmin = currentUsername.trim().toLowerCase() === "il punk" || currentUsername.trim().toLowerCase() === "punk";
    if (ordinazioniBtn) ordinazioniBtn.style.display = isAdmin ? "flex" : "none";
}

function updateAdminBadge() {
    const badge = document.getElementById("adminUnreadBadge");
    if (!badge) return;
    const unreadCount = ordersHistory.filter(o => !o.completed).length;
    if (unreadCount > 0) { badge.innerText = unreadCount; badge.style.display = "inline-block"; }
    else { badge.style.display = "none"; }
}

function updateNotificationsBadge() {
    const notifBadge = document.getElementById("notifBadgeCount");
    const chatBadge = document.getElementById("globalChatBadgeCount");
    if (!notifBadge || !chatBadge) return;
    
    const unreadNotifs = appNotifications.filter(n => {
        if (n.read) return false;
        const isAdminUser = currentUsername.trim().toLowerCase() === "il punk" || currentUsername.trim().toLowerCase() === "punk";
        return n.target && (n.target.toLowerCase() === currentUsername.toLowerCase() || n.target.toLowerCase() === "all" || (isAdminUser && n.target.toLowerCase() === "il punk"));
    }).length;

    if (unreadNotifs > 0) { notifBadge.innerText = unreadNotifs; notifBadge.style.display = "inline-block"; }
    else { notifBadge.style.display = "none"; }

    const unreadChat = chatMessagesStore.filter(n => {
        if (!n.sender || n.sender.toLowerCase() === currentUsername.toLowerCase()) return false;
        if (n.readBy && n.readBy.includes(currentUsername.toLowerCase())) return false;
        return (n.target && n.target.toLowerCase() === "global") || (n.target && n.target.toLowerCase() === currentUsername.toLowerCase());
    }).length;

    if (unreadChat > 0) { chatBadge.innerText = unreadChat; chatBadge.style.display = "inline-block"; }
    else { chatBadge.style.display = "none"; }
}

function openNotificationsModal() {
    document.getElementById("notificationsModal").style.display = "flex";
    renderNotificationsList();
    appNotifications.forEach(n => { n.read = true; });
    updateNotificationsBadge();
    localStorage.setItem("punk_app_notifications", JSON.stringify(appNotifications));
}

function closeNotificationsModal() { document.getElementById("notificationsModal").style.display = "none"; updateNotificationsBadge(); }

function renderNotificationsList() {
    const container = document.getElementById("notificationsListContainer");
    if (!container) return;
    const isAdminUser = currentUsername.trim().toLowerCase() === "il punk" || currentUsername.trim().toLowerCase() === "punk";
    const myNotifs = appNotifications.filter(n => n.target && (n.target.toLowerCase() === currentUsername.toLowerCase() || n.target.toLowerCase() === "all" || (isAdminUser && n.target.toLowerCase() === "il punk")));

    if (myNotifs.length === 0) { container.innerHTML = '<div class="empty-orders">Nessuna notifica ricevuta.</div>'; return; }
    let html = "";
    myNotifs.slice().reverse().forEach(n => {
        html += `<div style="background:rgba(255,255,255,0.03); border:1px solid #2d2d3a; padding:12px; border-radius:10px;"><div style="font-weight:900; color:var(--accent-yellow);">${n.title || '🔔 Notifica'}</div><div style="font-size:0.88rem; color:#fff;">${n.body}</div><span style="font-size:0.65rem; color:#9a9ab0; display:block; text-align:right;">${n.time || ''}</span></div>`;
    });
    container.innerHTML = html;
}

function clearAllNotifications() {
    appNotifications = [];
    localStorage.setItem("punk_app_notifications", JSON.stringify(appNotifications));
    renderNotificationsList();
    updateNotificationsBadge();
}

function openGlobalChatModal() { document.getElementById("globalChatModal").style.display = "flex"; selectChatRoom("global"); }
function closeGlobalChatModal() { document.getElementById("globalChatModal").style.display = "none"; updateNotificationsBadge(); }

function markCurrentChatMessagesAsRead() {
    const meKey = currentUsername.toLowerCase();
    chatMessagesStore.forEach(n => {
        if (!n.readBy) n.readBy = [];
        if (!n.readBy.includes(meKey)) n.readBy.push(meKey);
    });
    localStorage.setItem("punk_app_chat_messages", JSON.stringify(chatMessagesStore));
}

function selectChatRoom(roomName) {
    activeChatRoom = roomName;
    markCurrentChatMessagesAsRead();
    renderChatSidebar();
    renderActiveChatMessages();
    updateNotificationsBadge();
}

function calculateUserPointsByName(username) {
    let pts = 0;
    ordersHistory.forEach(order => {
        if (order.user && order.user.toLowerCase() === username.toLowerCase() && order.completed === true && order.items) {
            order.items.forEach(it => {
                if (!it.name.startsWith("🎁 PREMI VIP:") && it.done === true) {
                    const itemPts = (it.points !== undefined) ? it.points : 15;
                    pts += (itemPts * (it.qty || 1));
                }
            });
        }
    });
    return Math.max(pts, (username.toLowerCase() === currentUsername.toLowerCase() ? userPoints : 0));
}

function renderChatSidebar() {
    const container = document.getElementById("chatSidebarUsersList");
    if (!container) return;
    container.innerHTML = '<div style="font-size:0.65rem; color:#777; padding:4px;">Chat Globale attiva</div>';
}

function renderActiveChatMessages() {
    const container = document.getElementById("globalChatMessagesBox");
    if (!container) return;
    const targetMessages = chatMessagesStore.filter(n => n.target && n.target.toLowerCase() === "global");
    if (targetMessages.length === 0) { container.innerHTML = `<div class="empty-orders">Nessun messaggio nella chat globale.</div>`; return; }
    let html = "";
    targetMessages.forEach(n => {
        html += `<div class="chat-bubble received"><strong style="color:var(--accent-yellow);">${n.sender}:</strong> <div>${n.body}</div></div>`;
    });
    container.innerHTML = html;
}

function sendActiveChatMessage() {
    const input = document.getElementById("globalChatInputText");
    const text = input.value.trim();
    if (!text) return;
    const now = new Date();
    const chatMsg = { id: Date.now(), type: "global_chat", sender: currentUsername, target: "global", body: text, time: now.getHours()+':'+now.getMinutes(), timestamp: Date.now(), readBy: [currentUsername.toLowerCase()] };
    chatMessagesStore.push(chatMsg);
    localStorage.setItem("punk_app_chat_messages", JSON.stringify(chatMessagesStore));
    renderActiveChatMessages();
    input.value = "";
}

function handleImageUpload(input) {}
function openPhotoGalleryModal() { document.getElementById("photoGalleryModal").style.display = "flex"; }
function closePhotoGalleryModal() { document.getElementById("photoGalleryModal").style.display = "none"; }
function openSinglePhotoModal(src, sender, id) {}
function closeSinglePhotoModal() { document.getElementById("singlePhotoModal").style.display = "none"; }
function deleteCurrentViewingPhoto() {}

function getTodayDateString() {
    const d = new Date();
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}

function checkLuckyWheelStatus() {
    const spinBtn = document.getElementById("wheelSpinBtn");
    const statusBadge = document.getElementById("wheelBadgeStatus");
    if (spinBtn && statusBadge) {
        spinBtn.innerText = "Gira Gratis (0 P.)";
        statusBadge.innerText = "✨ 1 Giro Gratis Disponibile Oggi";
    }
}

const wheelPrizes = [
    { text: "+300 Punti", pts: 300, color: "#ff2a75" },
    { text: "+50 Punti", pts: 50, color: "#00f0ff" },
    { text: "Acqua", pts: 0, color: "#ffe600" },
    { text: "+150 Punti", pts: 150, color: "#00ff88" },
    { text: "+200 Punti", pts: 200, color: "#b000ff" },
    { text: "Ritenta", pts: 0, color: "#ff4757" }
];

function openLuckyWheelModal() {
    if (!currentUsername) { openLoginModal(false); return; }
    document.getElementById("luckyWheelModal").style.display = "flex";
    drawWheel(0);
}

function closeLuckyWheelModal() { document.getElementById("luckyWheelModal").style.display = "none"; }

function drawWheel(angleOffset) {
    const canvas = document.getElementById("wheelCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const cx = canvas.width / 2; const cy = canvas.height / 2;
    const radius = canvas.width / 2 - 4;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    wheelPrizes.forEach((p, i) => {
        ctx.beginPath(); ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, i * (2*Math.PI)/6, (i+1)*(2*Math.PI)/6);
        ctx.fillStyle = p.color; ctx.fill();
    });
}

function executeWheelSpinAnimation() {
    userPoints += 50;
    updateVipUI();
    document.getElementById("wheelResultBanner").innerText = "🎉 Hai vinto +50 Punti!";
}

function renderRanking() {
    const container = document.getElementById("rankingListContainer");
    if (!container) return;
    container.innerHTML = '<div class="empty-orders">Classifica in aggiornamento.</div>';
}

function deleteUser(u) {}
function triggerSilentPushNotification(u, id, pts) {}

function renderMenu() {
    const categories = ['Gin', 'Analcolici', 'Smoke', 'PS3', 'Carte'];
    categories.forEach(cat => {
        const container = document.getElementById("menuGrid-" + cat);
        if (!container) return;
        const items = appMenu.filter(m => m.category === cat);
        let html = "";
        items.forEach(item => {
            const itemKey = cat + ":" + item.name;
            const qty = selectedQuantities[itemKey] || 0;
            const safeNameId = item.name.replace(/\s+/g, '');
            html += `
                <div class="card-item ${qty > 0 ? 'selected' : ''}" id="card-${cat}-${safeNameId}">
                    <div><h4>${item.name}</h4><p>${item.desc || ''}</p></div>
                    <div class="card-bottom-row">
                        <div class="badge">${item.badge || 'Menu'}</div>
                        <div class="qty-selector">
                            <button class="qty-btn" onclick="changeQty('${cat}', '${item.name.replace(/'/g, "\\'")}', -1)">-</button>
                            <span class="qty-value" id="qty-${cat}-${safeNameId}">${qty}</span>
                            <button class="qty-btn" onclick="changeQty('${cat}', '${item.name.replace(/'/g, "\\'")}', 1)">+</button>
                        </div>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    });
    updateSelectedCount();
}

function changeQty(category, name, delta) {
    const itemKey = category + ":" + name;
    let currentQty = selectedQuantities[itemKey] || 0;
    currentQty += delta;
    if (currentQty < 0) currentQty = 0;
    if (currentQty === 0) delete selectedQuantities[itemKey];
    else selectedQuantities[itemKey] = currentQty;
    renderMenu();
}

function updateSelectedCount() {
    let totalItems = 0;
    for (let key in selectedQuantities) totalItems += selectedQuantities[key];
    const total = totalItems + selectedRewardsForOrder.length;
    const countElem = document.getElementById('selectedCount');
    if (countElem) countElem.innerText = total;
}

function resetSelections() {
    selectedQuantities = {};
    selectedRewardsForOrder = [];
    editingOrderId = null;
    updateSelectedCount();
    renderMenu();
}

function renderVipCatalog() {
    const container = document.getElementById("vipCatalogContainer");
    if (!container) return;
    let html = "";
    vipRewardsCatalog.forEach(reward => {
        html += `<div class="reward-card"><div><h4>${reward.name}</h4><p>${reward.cost} Punti</p></div><button class="btn-claim" onclick="claimReward('${reward.name.replace(/'/g, "\\'")}', ${reward.cost})">Riscatta</button></div>`;
    });
    container.innerHTML = html;
    updateVipUI();
}

function renderAdminRewardsEditor() {}
function toggleRewardSoldOut(id) {}
function addNewVipReward() {}
function deleteVipReward(id) {}
function renderAdminMenuEditor() {}
function toggleSoldOut(id) {}
function toggleSpecialPromo(id) {}
function addNewMenuItem() {}
function deleteMenuItem(id) {}
function renderAdminUsersList() {}

function openLoginModal(isEditing) {
    const modal = document.getElementById("loginModal");
    if (modal) modal.style.display = "flex";
}
function closeLoginModal() {
    if (!currentUsername) return;
    document.getElementById("loginModal").style.display = "none";
}
function saveUsername() {
    const input = document.getElementById("usernameInput").value.trim();
    if (input) {
        currentUsername = input;
        localStorage.setItem("punk_app_username", currentUsername);
        const badgeDisp = document.getElementById("userBadgeDisplay");
        if (badgeDisp) badgeDisp.innerText = "👤 " + currentUsername;
        checkUserRoleVisibility();
        document.getElementById("loginModal").style.display = "none";
        generateVipQrCode();
    }
}
function logout() {
    localStorage.removeItem("punk_app_username");
    currentUsername = "";
    openLoginModal(false);
}

function switchTab(tabName, btnElement) {
    document.querySelectorAll('#tabsBar .tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll
