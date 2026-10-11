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
    if (!localStorage.getItem("punk_app_cache_cleaned_v2")) {
        localStorage.removeItem("punk_app_chat_messages");
        localStorage.setItem("punk_app_cache_cleaned_v2", "true");
    }

    const savedName = localStorage.getItem("punk_app_username");
    if (savedName) {
        currentUsername = savedName;
        document.getElementById("userBadgeDisplay").innerText = "👤 " + currentUsername;
        checkUserRoleVisibility();
        updateUserLoginsInFirestore();
    } else {
        openLoginModal(false);
    }

    const savedPoints = localStorage.getItem("punk_app_points");
    if (savedPoints !== null) userPoints = parseInt(savedPoints, 10);

    const savedReadyRewards = localStorage.getItem("punk_app_ready_rewards");
    if (savedReadyRewards) {
        try {
            readyRewards = JSON.parse(savedReadyRewards);
            readyRewards.forEach(r => { r.name = r.name.replace(/\bgratis\b/gi, '').trim(); });
            localStorage.setItem("punk_app_ready_rewards", JSON.stringify(readyRewards));
        } catch(e) {}
    }

    const savedOrders = localStorage.getItem("punk_app_orders");
    if (savedOrders) ordersHistory = JSON.parse(savedOrders);

    const savedNotifs = localStorage.getItem("punk_app_notifications");
    if (savedNotifs) appNotifications = JSON.parse(savedNotifs);

    const savedChat = localStorage.getItem("punk_app_chat_messages");
    if (savedChat) chatMessagesStore = JSON.parse(savedChat);

    const savedMenu = localStorage.getItem("punk_app_menu");
    if (savedMenu) {
        try { appMenu = JSON.parse(savedMenu); } catch(e) {}
    }

    const savedRewardsCatalog = localStorage.getItem("punk_app_vip_rewards_catalog");
    if (savedRewardsCatalog) {
        try {
            vipRewardsCatalog = JSON.parse(savedRewardsCatalog);
            vipRewardsCatalog.forEach(r => { r.name = r.name.replace(/\bgratis\b/gi, '').trim(); });
        } catch(e) {}
    } else {
        vipRewardsCatalog = defaultVipRewards;
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
                    cloudRegisteredUsers.push({
                        username: data.username,
                        lastLogin: data.lastLogin || null
                    });
                }
            });
            renderAdminUsersList();
            renderRanking();
            if (document.getElementById("globalChatModal").style.display === "flex") {
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
            } else if (appMenu === defaultMenu) {
                defaultMenu.forEach(item => {
                    db.collection("menu").doc(item.id).set(item);
                });
            }
        });

        db.collection("vipRewards").onSnapshot(snapshot => {
            let cloudRewards = [];
            snapshot.forEach(doc => {
                let data = doc.data();
                if (data && data.name) {
                    data.name = data.name.replace(/\bgratis\b/gi, '').trim();
                }
                cloudRewards.push(data);
            });

            if (cloudRewards.length > 0) {
                vipRewardsCatalog = cloudRewards;
                localStorage.setItem("punk_app_vip_rewards_catalog", JSON.stringify(vipRewardsCatalog));
                renderVipCatalog();
                renderAdminRewardsEditor();
            } else {
                defaultVipRewards.forEach(item => {
                    db.collection("vipRewards").doc(item.id).set(item);
                });
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
            snapshot.forEach(doc => {
                const data = doc.data();
                if (data) cloudChat.push(data);
            });
            
            cloudChat.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
            chatMessagesStore = cloudChat;
            localStorage.setItem("punk_app_chat_messages", JSON.stringify(chatMessagesStore));

            if (document.getElementById("globalChatModal").style.display === "flex") {
                markCurrentChatMessagesAsRead();
                renderChatSidebar();
                renderActiveChatMessages();
                if (document.getElementById("photoGalleryModal").style.display === "flex") {
                    renderPhotoGallery();
                }
            }
            updateNotificationsBadge();
        }, error => {
            console.error("Errore nell'ascolto della chat in tempo reale:", error);
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
};

function startCountdownTimer() {
    function updateTimer() {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const titleElem = document.getElementById("countdownTitleElem");
        const timersBox = document.getElementById("countdownTimersBox");

        const isFriday = (dayOfWeek === 5);

        if (isFriday) {
            if (titleElem) titleElem.innerText = "🎉 È VENERDÌ SERA!";
            if (timersBox) {
                timersBox.innerHTML = `
                    <div style="width: 100%; font-size: 0.9rem; font-weight: 900; color: var(--accent-yellow); text-shadow: 0 0 8px rgba(255, 230, 0, 0.5); padding: 4px 0;">
                        🔥 GODITI LA SERATA AL PUNK CLUB! 🍸
                    </div>
                `;
            }
        } else {
            if (titleElem) titleElem.innerText = "⏳ Conto alla Rovescia Prossimo Venerdì";
            if (timersBox && !document.getElementById("cdDays")) {
                timersBox.innerHTML = `
                    <div class="countdown-box">
                        <div class="countdown-number" id="cdDays">00</div>
                        <div class="countdown-label">Giorni</div>
                    </div>
                    <div class="countdown-box">
                        <div class="countdown-number" id="cdHours">00</div>
                        <div class="countdown-label">Ore</div>
                    </div>
                    <div class="countdown-box">
                        <div class="countdown-number" id="cdMins">00</div>
                        <div class="countdown-label">Minuti</div>
                    </div>
                    <div class="countdown-box">
                        <div class="countdown-number" id="cdSecs">00</div>
                        <div class="countdown-label">Secondi</div>
                    </div>
                `;
            }

            const targetDay = 5;
            let resultDate = new Date(now);
            resultDate.setDate(now.getDate() + ((targetDay + 7 - now.getDay()) % 7));
            resultDate.setHours(0, 0, 0, 0);

            if (now > resultDate) {
                resultDate.setDate(resultDate.getDate() + 7);
            }

            const diff = resultDate - now;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            const dElem = document.getElementById("cdDays");
            const hElem = document.getElementById("cdHours");
            const mElem = document.getElementById("cdMins");
            const sElem = document.getElementById("cdSecs");

            if (dElem && hElem && mElem && sElem) {
                dElem.innerText = String(days).padStart(2, '0');
                hElem.innerText = String(hrs).padStart(2, '0');
                mElem.innerText = String(minutes).padStart(2, '0');
                sElem.innerText = String(seconds).padStart(2, '0');
            }
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

    for (let x = 8; x < 87; x += 5) {
        for (let y = 36; y < 60; y += 5) {
            let checkStr = baseUser + "_x" + x + "_y" + y + "_alt";
            let hash = 0;
            for (let i = 0; i < checkStr.length; i++) {
                hash = ((hash << 5) - hash) + checkStr.charCodeAt(i);
                hash |= 0;
            }
            if (Math.abs(hash) % 3 === 0) {
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

    const baseUser = username ? username.toLowerCase() : "ospite";
    for (let x = 16; x < 20; x += 3) {
        for (let y = 3; y < 33; y += 3) {
            let checkStr = baseUser + "_mini_x" + x + "_y" + y;
            let hash = 0;
            for (let i = 0; i < checkStr.length; i++) {
                hash = ((hash << 5) - hash) + checkStr.charCodeAt(i);
                hash |= 0;
            }
            if (Math.abs(hash) % 2 === 0) {
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(x, y, 2, 2);
            }
        }
    }
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
                if (nameLower.includes("tanqueray") || nameLower.includes("roku") || nameLower.includes("gin") || nameLower.includes("z44") || nameLower.includes("etsu") || nameLower.includes("smith")) {
                    ginCount += qty;
                }
                if (nameLower.includes("sensation") || nameLower.includes("avocado") || nameLower.includes("hello kitty")) {
                    smokeCount += qty;
                }
                if (nameLower.includes("calcio") || nameLower.includes("tennis") || nameLower.includes("gta")) {
                    ps3Count += qty;
                }
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
    if (!userToCheck) {
        openLoginModal(false);
        return;
    }
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
        : `<div style="background: rgba(255,255,255,0.03); border: 1px solid #2d2d3a; padding: 10px; border-radius: 8px;"><strong>🏅 Titolo Speciale:</strong> <span style="color:#9a9ab0; font-size:0.85rem;">Nessun badge sbloccato (continua a ordinare!)</span></div>`;

    content.innerHTML = `
        <div style="background: rgba(255,255,255,0.03); border: 1px solid #2d2d3a; padding: 10px; border-radius: 8px;">
            <strong>👤 Utente:</strong> <span style="color:#fff;">${userToCheck}</span>
        </div>
        ${badgeHtml}
        <div style="background: rgba(255,255,255,0.03); border: 1px solid #2d2d3a; padding: 10px; border-radius: 8px;">
            <strong>💳 Punti VIP Totali:</strong> <span style="color:var(--accent-yellow); font-weight:bold;">${pts} Punti</span>
        </div>
        <div style="background: rgba(255,255,255,0.03); border: 1px solid #2d2d3a; padding: 10px; border-radius: 8px;">
            <strong>⭐ Livello Attuale:</strong> <span style="color:var(--accent-cyan); font-weight:bold;">${lvl.title} (${lvl.number})</span>
        </div>
        <div style="background: rgba(255,255,255,0.03); border: 1px solid #2d2d3a; padding: 10px; border-radius: 8px;">
            <strong>🎉 Serate Concluse:</strong> <span style="color:var(--accent-green); font-weight:bold;">${eveningsCount}</span>
        </div>
        <div style="background: rgba(255,255,255,0.03); border: 1px solid #2d2d3a; padding: 10px; border-radius: 8px;">
            <strong>🔒 ID Univoco Pass:</strong> <span style="font-size:0.8rem; color:#aaa;">PUNK-VIP-${userToCheck.toUpperCase()}-${uniqueIdHash}</span>
        </div>
    `;
    modal.style.display = "flex";
}

function closeVipDetailsModal() {
    document.getElementById("vipDetailsModal").style.display = "none";
}

function updateUserLoginsInFirestore() {
    if (!currentUsername || !db) return;
    const userRef = db.collection("users").doc(currentUsername.toLowerCase());
    const nowTime = Date.now();
    userRef.set({ username: currentUsername, lastLogin: nowTime }, { merge: true });
}

function notifyAdminUserLogin(username) {
    if (!db) return;
    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    const notifId = Date.now();

    const loginNotification = {
        id: notifId,
        type: "admin_alert",
        sender: username,
        target: "Il Punk",
        title: "👤 Nuovo Accesso Utente",
        body: `L'utente '${username}' è appena entrato nell'app!`,
        time: timeString,
        timestamp: Date.now(),
        read: false
    };

    db.collection("notifications").doc(notifId.toString()).set(loginNotification);
}

function checkUserRoleVisibility() {
    const ordinazioniBtn = document.getElementById("ordinazioniBtn");
    const isAdmin = currentUsername.trim().toLowerCase() === "il punk" || currentUsername.trim().toLowerCase() === "punk";
    ordinazioniBtn.style.display = isAdmin ? "flex" : "none";
}

function updateAdminBadge() {
    const badge = document.getElementById("adminUnreadBadge");
    const unreadCount = ordersHistory.filter(o => !o.completed).length;
    if (unreadCount > 0) {
        badge.innerText = unreadCount;
        badge.style.display = "inline-block";
    } else {
        badge.style.display = "none";
    }
}

function updateNotificationsBadge() {
    const notifBadge = document.getElementById("notifBadgeCount");
    const chatBadge = document.getElementById("globalChatBadgeCount");
    
    const unreadNotifs = appNotifications.filter(n => {
        if (n.read) return false;
        const isAdminUser = currentUsername.trim().toLowerCase() === "il punk" || currentUsername.trim().toLowerCase() === "punk";
        const isForMe = n.target && (n.target.toLowerCase() === currentUsername.toLowerCase() || n.target.toLowerCase() === "all" || (isAdminUser && n.target.toLowerCase() === "il punk"));
        return isForMe;
    }).length;

    if (unreadNotifs > 0) {
        notifBadge.innerText = unreadNotifs;
        notifBadge.style.display = "inline-block";
    } else {
        notifBadge.style.display = "none";
    }

    const unreadChat = chatMessagesStore.filter(n => {
        if (!n.sender || n.sender.toLowerCase() === currentUsername.toLowerCase()) return false;
        if (n.readBy && n.readBy.includes(currentUsername.toLowerCase())) return false;

        const isGlobal = n.target && n.target.toLowerCase() === "global";
        const isForMePrivate = n.target && n.target.toLowerCase() === currentUsername.toLowerCase();
        
        if (document.getElementById("globalChatModal").style.display === "flex") {
            if (activeChatRoom === "global" && isGlobal) return false;
            if (activeChatRoom.toLowerCase() === n.sender.toLowerCase() && isForMePrivate) return false;
        }

        return isGlobal || isForMePrivate;
    }).length;

    if (unreadChat > 0) {
        chatBadge.innerText = unreadChat;
        chatBadge.style.display = "inline-block";
    } else {
        chatBadge.style.display = "none";
    }
}

function openNotificationsModal() {
    document.getElementById("notificationsModal").style.display = "flex";
    renderNotificationsList();
    
    appNotifications.forEach(n => {
        const isAdminUser = currentUsername.trim().toLowerCase() === "il punk" || currentUsername.trim().toLowerCase() === "punk";
        const isForMe = n.target && (n.target.toLowerCase() === currentUsername.toLowerCase() || n.target.toLowerCase() === "all" || (isAdminUser && n.target.toLowerCase() === "il punk"));
        if (isForMe && !n.read) {
            n.read = true;
            if (db) db.collection("notifications").doc(n.id.toString()).update({ read: true });
        }
    });
    updateNotificationsBadge();
    localStorage.setItem("punk_app_notifications", JSON.stringify(appNotifications));
}

function closeNotificationsModal() {
    document.getElementById("notificationsModal").style.display = "none";
    updateNotificationsBadge();
}

function renderNotificationsList() {
    const container = document.getElementById("notificationsListContainer");
    if (!container) return;

    const isAdminUser = currentUsername.trim().toLowerCase() === "il punk" || currentUsername.trim().toLowerCase() === "punk";
    const myNotifs = appNotifications.filter(n => {
        const isForMe = n.target && (n.target.toLowerCase() === currentUsername.toLowerCase() || n.target.toLowerCase() === "all" || (isAdminUser && n.target.toLowerCase() === "il punk"));
        return isForMe;
    });

    if (myNotifs.length === 0) {
        container.innerHTML = '<div class="empty-orders">Nessuna notifica ricevuta.</div>';
        return;
    }

    let html = "";
    myNotifs.slice().reverse().forEach(n => {
        html += `
            <div style="background:rgba(255,255,255,0.03); border:1px solid #2d2d3a; padding:12px; border-radius:10px; position:relative;">
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px;">
                    <div style="font-weight:900; color:var(--accent-yellow); font-size:1.05rem; letter-spacing:0.5px;">${n.title || '🔔 Notifica'}</div>
                    <button onclick="deleteSingleNotification(${n.id})" style="background:none; border:none; color:var(--accent-red); font-size:0.8rem; cursor:pointer; font-weight:bold;">✕ Elimina</button>
                </div>
                <div style="font-size:0.88rem; color:#fff; line-height:1.4;">${n.body}</div>
                <span style="font-size:0.65rem; color:#9a9ab0; margin-top:8px; display:block; text-align:right;">${n.time || ''}</span>
            </div>
        `;
    });
    container.innerHTML = html;
}

function deleteSingleNotification(notifId) {
    appNotifications = appNotifications.filter(n => n.id !== notifId);
    localStorage.setItem("punk_app_notifications", JSON.stringify(appNotifications));

    if (db) {
        db.collection("notifications").doc(notifId.toString()).delete().catch(err => console.error(err));
    }

    renderNotificationsList();
    updateNotificationsBadge();
}

function clearAllNotifications() {
    if (!confirm("Sei sicuro di voler eliminare tutte le tue notifiche?")) return;
    const isAdminUser = currentUsername.trim().toLowerCase() === "il punk" || currentUsername.trim().toLowerCase() === "punk";
    
    const idsToDelete = appNotifications.filter(n => {
        const isForMe = n.target && (n.target.toLowerCase() === currentUsername.toLowerCase() || n.target.toLowerCase() === "all" || (isAdminUser && n.target.toLowerCase() === "il punk"));
        return isForMe;
    }).map(n => n.id);

    appNotifications = appNotifications.filter(n => !idsToDelete.includes(n.id));
    localStorage.setItem("punk_app_notifications", JSON.stringify(appNotifications));

    if (db) {
        idsToDelete.forEach(id => {
            db.collection("notifications").doc(id.toString()).delete().catch(err => console.error(err));
        });
    }

    renderNotificationsList();
    updateNotificationsBadge();
}

function sendBroadcastNotification() {
    const input = document.getElementById("broadcastMsgInput");
    const text = input.value.trim();
    if (!text) {
        alert("Scrivi un messaggio prima di inviare la notifica a tutti!");
        return;
    }

    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    const notifId = Date.now();

    const broadcastNotif = {
        id: notifId,
        type: "broadcast",
        sender: "Il Punk (Admin)",
        target: "all",
        title: "📢 Comunicazione Globale",
        body: text,
        time: timeString,
        timestamp: Date.now(),
        read: false
    };

    if (db) {
        db.collection("notifications").doc(notifId.toString()).set(broadcastNotif).then(() => {
            alert("✅ Notifiche inviate con successo a tutti gli utenti!");
            input.value = "";
        }).catch(err => {
            console.error("Errore invio broadcast:", err);
            alert("Errore durante l'invio della notifica.");
        });
    } else {
        appNotifications.push(broadcastNotif);
        localStorage.setItem("punk_app_notifications", JSON.stringify(appNotifications));
        alert("✅ Notifiche inviate con successo a tutti gli utenti!");
        input.value = "";
    }
}

function openGlobalChatModal() {
    document.getElementById("globalChatModal").style.display = "flex";
    activeChatRoom = "global";
    selectChatRoom("global");
}

function closeGlobalChatModal() {
    document.getElementById("globalChatModal").style.display = "none";
    updateNotificationsBadge();
}

function markCurrentChatMessagesAsRead() {
    let updated = false;
    const meKey = currentUsername.toLowerCase();
    
    chatMessagesStore.forEach(n => {
        const isGlobalRoom = activeChatRoom === "global" && n.target && n.target.toLowerCase() === "global";
        const isPrivateRoom = activeChatRoom.toLowerCase() !== "global" && n.sender && n.sender.toLowerCase() === activeChatRoom.toLowerCase() && n.target && n.target.toLowerCase() === currentUsername.toLowerCase();
        const isMySentToPartner = activeChatRoom.toLowerCase() !== "global" && n.sender && n.sender.toLowerCase() === currentUsername.toLowerCase() && n.target && n.target.toLowerCase() === activeChatRoom.toLowerCase();

        if (isGlobalRoom || isPrivateRoom || isMySentToPartner) {
            if (!n.readBy) n.readBy = [];
            if (!n.readBy.includes(meKey)) {
                n.readBy.push(meKey);
                updated = true;
                if (db) {
                    db.collection("chat_messages").doc(n.id.toString()).set({ readBy: n.readBy }, { merge: true }).catch(err => {
                        console.error("Errore salvataggio lettura su Firestore:", err);
                    });
                }
            }
        }
    });

    if (updated) {
        localStorage.setItem("punk_app_chat_messages", JSON.stringify(chatMessagesStore));
    }
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
                if (it.name.startsWith("🎁 PREMI VIP:")) return;
                if (it.done === true) {
                    const itemPts = (it.points !== undefined) ? it.points : findItemPoints(it.name);
                    const qty = it.qty || 1;
                    pts += (itemPts * qty);
                }
            });
        }
    });
    if (username.toLowerCase() === currentUsername.toLowerCase()) {
        return Math.max(pts, userPoints);
    }
    return pts;
}

function renderChatSidebar() {
    const globalBtn = document.getElementById("btnSidebarGlobal");
    const container = document.getElementById("chatSidebarUsersList");
    const galleryBtn = document.getElementById("chatHeaderGalleryBtn");
    if (!container) return;

    if (activeChatRoom === "global") {
        globalBtn.classList.add("active");
        if (galleryBtn) {
            galleryBtn.innerText = "🖼️ Galleria Globale";
            galleryBtn.style.display = "block";
        }
    } else {
        globalBtn.classList.remove("active");
        if (galleryBtn) {
            galleryBtn.innerText = "🖼️ Foto Private";
            galleryBtn.style.display = "block";
        }
    }

    const unreadGlobal = chatMessagesStore.filter(n => {
        if (!n.sender || n.sender.toLowerCase() === currentUsername.toLowerCase()) return false;
        if (n.target && n.target.toLowerCase() === "global") {
            if (n.readBy && n.readBy.includes(currentUsername.toLowerCase())) return false;
            return true;
        }
        return false;
    }).length;

    if (unreadGlobal > 0) {
        globalBtn.innerHTML = `<span>💬 Globale</span> <span style="background:var(--accent-cyan); color:#000; font-size:0.55rem; padding:1px 3px; border-radius:5px; font-weight:900;">${unreadGlobal}</span>`;
    } else {
        globalBtn.innerHTML = `<span>💬 Globale</span>`;
    }

    let userMap = {};
    cloudRegisteredUsers.forEach(u => {
        if (u.username) {
            userMap[u.username.toLowerCase()] = { name: u.username, lastLogin: u.lastLogin || 0 };
        }
    });
    chatMessagesStore.forEach(n => {
        if (n.sender && n.target) {
            [n.sender, n.target].forEach(uName => {
                if (uName && uName.toLowerCase() !== "global") {
                    const k = uName.toLowerCase();
                    if (!userMap[k]) userMap[k] = { name: uName, lastLogin: n.timestamp || 0 };
                }
            });
        }
    });
    ordersHistory.forEach(o => {
        if (o.user) {
            const k = o.user.toLowerCase();
            if (!userMap[k]) userMap[k] = { name: o.user, lastLogin: 0 };
        }
    });

    let userList = [];
    for (let k in userMap) {
        if (k !== currentUsername.toLowerCase()) {
            userList.push(userMap[k]);
        }
    }

    if (userList.length === 0) {
        container.innerHTML = '<div style="font-size:0.65rem; color:#777; padding:4px;">Nessun utente</div>';
        return;
    }

    const nowTime = Date.now();
    const fiveMinutes = 5 * 60 * 1000;

    let html = "";
    userList.forEach(userObj => {
        const isActive = activeChatRoom.toLowerCase() === userObj.name.toLowerCase();
        const unreadUser = chatMessagesStore.filter(n => {
            if (!n.sender || !n.target) return false;
            const isFromPartner = n.sender.toLowerCase() === userObj.name.toLowerCase() && n.target.toLowerCase() === currentUsername.toLowerCase();
            if (isFromPartner) {
                if (n.readBy && n.readBy.includes(currentUsername.toLowerCase())) return false;
                return true;
            }
            return false;
        }).length;

        const isOnline = (userObj.lastLogin && (nowTime - userObj.lastLogin < fiveMinutes));
        const dotClass = isOnline ? "online-dot" : "offline-dot";

        const uPts = calculateUserPointsByName(userObj.name);
        const lvlInfo = getLevelInfo(uPts);
        const badgeInfo = getUserAchievementBadge(userObj.name);
        const isUserAdmin = userObj.name.trim().toLowerCase() === "il punk" || userObj.name.trim().toLowerCase() === "punk";

        html += `
            <div class="contact-btn ${isActive ? 'active' : ''}" onclick="selectChatRoom('${userObj.name}')">
                <div style="display:flex; align-items:center; justify-content:space-between; width:100%;">
                    <div style="display:flex; align-items:center; gap:4px; overflow:hidden;">
                        <span class="${dotClass}" title="${isOnline ? 'Online' : 'Offline'}"></span>
                        <span style="overflow:hidden; text-overflow:ellipsis; font-weight:bold;">${userObj.name}</span>
                    </div>
                    ${unreadUser > 0 ? `<span style="background:var(--accent-cyan); color:#000; font-size:0.55rem; padding:1px 3px; border-radius:5px; font-weight:900;">${unreadUser}</span>` : ''}
                </div>
                <div style="display:flex; gap:2px; flex-wrap:wrap; margin-top:2px;">
                    <span class="chat-user-level-tag">${lvlInfo.title}</span>
                    ${badgeInfo ? `<span class="chat-achievement-badge" style="color:${badgeInfo.color}; border-color:${badgeInfo.color};">${badgeInfo.text}</span>` : ''}
                    ${isUserAdmin ? '<span class="chat-admin-tag">ADMIN</span>' : ''}
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function getDateFriendlyLabel(timestamp) {
    if (!timestamp) return "";
    const msgDate = new Date(timestamp);
    const today = new Date();

    const isToday = msgDate.getDate() === today.getDate() && 
                    msgDate.getMonth() === today.getMonth() && 
                    msgDate.getFullYear() === today.getFullYear();

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const isYesterday = msgDate.getDate() === yesterday.getDate() && 
                        msgDate.getMonth() === yesterday.getMonth() && 
                        msgDate.getFullYear() === today.getFullYear();

    if (isToday) return "Oggi";
    if (isYesterday) return "Ieri";
    return msgDate.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function renderActiveChatMessages() {
    const container = document.getElementById("globalChatMessagesBox");
    const titleHeader = document.getElementById("globalChatHeaderTitle");
    if (!container) return;

    let targetMessages = [];
    if (activeChatRoom === "global") {
        titleHeader.innerText = "💬 Chat Globale (Tutti)";
        targetMessages = chatMessagesStore.filter(n => n.target && n.target.toLowerCase() === "global");
    } else {
        titleHeader.innerText = "💬 Chat Privata: " + activeChatRoom;
        targetMessages = chatMessagesStore.filter(n => {
            if (!n.sender || !n.target) return false;
            const me = currentUsername.toLowerCase();
            const partner = activeChatRoom.toLowerCase();
            const sender = n.sender.toLowerCase();
            const target = n.target.toLowerCase();

            return (sender === me && target === partner) || (sender === partner && target === me);
        });
    }

    markCurrentChatMessagesAsRead();

    if (targetMessages.length === 0) {
        container.innerHTML = `<div class="empty-orders">Nessun messaggio con ${activeChatRoom}. Inizia la conversazione!</div>`;
        return;
    }

    let html = "";
    let lastDateLabel = "";

    targetMessages.forEach(n => {
        const msgTimestamp = n.timestamp || Date.now();
        const currentDateLabel = getDateFriendlyLabel(msgTimestamp);

        if (currentDateLabel !== lastDateLabel) {
            html += `
                <div class="chat-date-divider">
                    <span class="chat-date-badge">${currentDateLabel}</span>
                </div>
            `;
            lastDateLabel = currentDateLabel;
        }

        const isMe = n.sender.toLowerCase() === currentUsername.toLowerCase();
        
        let isReadByOther = false;
        if (isMe && n.readBy && n.readBy.length > 0) {
            if (activeChatRoom === "global") {
                isReadByOther = n.readBy.some(u => u !== currentUsername.toLowerCase());
            } else {
                isReadByOther = n.readBy.includes(activeChatRoom.toLowerCase());
            }
        }
        const tickClass = isReadByOther ? "msg-ticks read-tick" : "msg-ticks";
        const ticksHtml = isMe ? `<span class="${tickClass}">✓✓</span>` : '';

        const senderPts = calculateUserPointsByName(n.sender);
        const senderLvl = getLevelInfo(senderPts);
        const senderBadge = getUserAchievementBadge(n.sender);
        const isSenderAdmin = n.sender.trim().toLowerCase() === "il punk" || n.sender.trim().toLowerCase() === "punk";

        let contentHtml = "";
        if (n.type === "chat_photo") {
            contentHtml = `<img src="${n.body}" style="max-width:100%; border-radius:8px; cursor:pointer;" onclick="openSinglePhotoModal('${n.body}', '${n.sender}', ${n.id})" />`;
        } else {
            contentHtml = `<div>${n.body}</div>`;
        }

        html += `
            <div class="chat-bubble ${isMe ? 'sent' : 'received'}">
                ${(!isMe && activeChatRoom === 'global') ? `
                    <div style="display:flex; align-items:center; gap:5px; margin-bottom:3px; flex-wrap:wrap;">
                        <span style="font-size:0.75rem; color:var(--accent-yellow); font-weight:bold;">${n.sender}</span>
                        <span class="chat-user-level-tag">${senderLvl.title}</span>
                        ${senderBadge ? `<span class="chat-achievement-badge" style="color:${senderBadge.color}; border-color:${senderBadge.color};">${senderBadge.text}</span>` : ''}
                        ${isSenderAdmin ? '<span class="chat-admin-tag">ADMIN</span>' : ''}
                    </div>
                ` : ''}
                ${contentHtml}
                <div class="chat-meta">
                    <span>${n.time || ''}</span>
                    ${ticksHtml}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    container.scrollTop = container.scrollHeight;
    updateNotificationsBadge();
}

function sendActiveChatMessage() {
    const input = document.getElementById("globalChatInputText");
    const text = input.value.trim();
    if (!text) return;

    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    const msgId = Date.now();

    const chatMsg = {
        id: msgId,
        type: (activeChatRoom === "global") ? "global_chat" : "user_chat",
        sender: currentUsername,
        target: activeChatRoom,
        title: "",
        body: text,
        time: timeString,
        timestamp: Date.now(),
        readBy: [currentUsername.toLowerCase()]
    };

    chatMessagesStore.push(chatMsg);
    localStorage.setItem("punk_app_chat_messages", JSON.stringify(chatMessagesStore));
    renderActiveChatMessages();
    renderChatSidebar();

    if (db) {
        db.collection("chat_messages").doc(msgId.toString()).set(chatMsg).catch(err => {
            console.error("Errore invio messaggio chat:", err);
        });
    }

    input.value = "";
}

function handleImageUpload(inputElement) {
    const file = inputElement.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            const maxDimension = 500;

            if (width > height) {
                if (width > maxDimension) {
                    height *= maxDimension / width;
                    width = maxDimension;
                }
            } else {
                if (height > maxDimension) {
                    width *= maxDimension / height;
                    height = maxDimension;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);

            const now = new Date();
            const timeString = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
            const msgId = Date.now();

            const photoMsg = {
                id: msgId,
                type: "chat_photo",
                sender: currentUsername,
                target: activeChatRoom,
                title: "🖼️ Foto condivisa",
                body: compressedBase64,
                time: timeString,
                timestamp: Date.now(),
                readBy: [currentUsername.toLowerCase()]
            };

            chatMessagesStore.push(photoMsg);
            localStorage.setItem("punk_app_chat_messages", JSON.stringify(chatMessagesStore));
            renderActiveChatMessages();

            if (db) {
                db.collection("chat_messages").doc(msgId.toString()).set(photoMsg).then(() => {
                    if (document.getElementById("photoGalleryModal").style.display === "flex") {
                        renderPhotoGallery();
                    }
                }).catch(err => {
                    console.error("Errore invio foto su Firebase:", err);
                });
            }

            inputElement.value = "";
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

function openPhotoGalleryModal() {
    document.getElementById("photoGalleryModal").style.display = "flex";
    renderPhotoGallery();
}

function closePhotoGalleryModal() {
    document.getElementById("photoGalleryModal").style.display = "none";
}

function renderPhotoGallery() {
    const container = document.getElementById("photoGalleryContainer");
    const modalTitle = document.getElementById("photoGalleryModalTitle");
    const modalDesc = document.getElementById("photoGalleryModalDesc");
    if (!container) return;

    let photoMessages = [];

    if (activeChatRoom === "global") {
        modalTitle.innerText = "🖼️ Galleria Foto Globale";
        modalDesc.innerText = "Tutte le foto condivise nella chat di gruppo.";
        photoMessages = chatMessagesStore.filter(n => n.type === "chat_photo" && n.target && n.target.toLowerCase() === "global");
    } else {
        modalTitle.innerText = "🖼️ Foto Chat Privata: " + activeChatRoom;
        modalDesc.innerText = "Foto scambiate esclusivamente tra te e " + activeChatRoom + ".";
        photoMessages = chatMessagesStore.filter(n => {
            if (n.type !== "chat_photo") return false;
            const me = currentUsername.toLowerCase();
            const partner = activeChatRoom.toLowerCase();
            const sender = n.sender ? n.sender.toLowerCase() : "";
            const target = n.target ? n.target.toLowerCase() : "";

            return (sender === me && target === partner) || (sender === partner && target === me);
        });
    }

    if (photoMessages.length === 0) {
        container.innerHTML = '<div class="empty-orders">Nessuna foto trovata in questa chat.</div>';
        return;
    }

    let html = '<div class="photo-grid">';
    photoMessages.slice().reverse().forEach(n => {
        html += `<img src="${n.body}" class="photo-grid-item" onclick="openSinglePhotoModal('${n.body}', '${n.sender}', ${n.id})" />`;
    });
    html += '</div>';

    container.innerHTML = html;
}

function openSinglePhotoModal(imgSrc, senderName, photoId) {
    currentViewingPhotoId = photoId;
    document.getElementById("fullSizePhotoImg").src = imgSrc;
    document.getElementById("fullSizePhotoMeta").innerText = `Condivisa da: ${senderName || 'Utente'}`;
    
    const isAdmin = currentUsername.trim().toLowerCase() === "il punk" || currentUsername.trim().toLowerCase() === "punk";
    const isMyPhoto = senderName && senderName.toLowerCase() === currentUsername.toLowerCase();
    const isPrivateChat = activeChatRoom !== "global";
    const deleteBtn = document.getElementById("deletePhotoBtn");

    if (isPrivateChat || isAdmin || isMyPhoto) {
        deleteBtn.style.display = "inline-block";
    } else {
        deleteBtn.style.display = "none";
    }

    document.getElementById("singlePhotoModal").style.display = "flex";
}

function closeSinglePhotoModal() {
    currentViewingPhotoId = null;
    document.getElementById("singlePhotoModal").style.display = "none";
}

function deleteCurrentViewingPhoto() {
    if (!currentViewingPhotoId) return;
    if (!confirm("Sei sicuro di voler eliminare questa foto?")) return;

    chatMessagesStore = chatMessagesStore.filter(n => n.id !== currentViewingPhotoId);
    localStorage.setItem("punk_app_chat_messages", JSON.stringify(chatMessagesStore));

    if (db) {
        db.collection("chat_messages").doc(currentViewingPhotoId.toString()).delete().catch(err => console.error(err));
    }

    closeSinglePhotoModal();
    renderActiveChatMessages();
    if (document.getElementById("photoGalleryModal").style.display === "flex") {
        renderPhotoGallery();
    }
    updateNotificationsBadge();
}

function getTodayDateString() {
    const d = new Date();
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
}

function checkLuckyWheelStatus() {
    if (!currentUsername) return;
    const spinBtn = document.getElementById("wheelSpinBtn");
    const statusBadge = document.getElementById("wheelBadgeStatus");
    if (!spinBtn || !statusBadge) return;

    const storageKey = "punk_wheel_last_free_" + currentUsername.toLowerCase();
    const lastFreeDate = localStorage.getItem(storageKey);
    const today = getTodayDateString();

    if (lastFreeDate === today) {
        spinBtn.innerText = "Gira la Ruota (50 P.)";
        statusBadge.innerText = "🔒 Giro giornaliero già utilizzato";
        statusBadge.style.color = "var(--accent-orange)";
        statusBadge.style.borderColor = "rgba(255, 159, 67, 0.4)";
        statusBadge.style.background = "rgba(255, 159, 67, 0.1)";
    } else {
        spinBtn.innerText = "Gira Gratis (0 P.)";
        statusBadge.innerText = "✨ 1 Giro Gratis Disponibile Oggi";
        statusBadge.style.color = "var(--accent-yellow)";
        statusBadge.style.borderColor = "rgba(255, 230, 0, 0.3)";
        statusBadge.style.background = "rgba(255, 230, 0, 0.12)";
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
let currentWheelAngle = 0;

function openLuckyWheelModal() {
    if (!currentUsername) {
        openLoginModal(false);
        return;
    }
    document.getElementById("luckyWheelModal").style.display = "flex";
    document.getElementById("wheelResultBanner").innerText = "";
    document.getElementById("modalSpinBtn").disabled = false;
    drawWheel(0);
}

function closeLuckyWheelModal() {
    document.getElementById("luckyWheelModal").style.display = "none";
}

function drawWheel(angleOffset) {
    const canvas = document.getElementById("wheelCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = canvas.width / 2 - 4;
    const numSlices = wheelPrizes.length;
    const arcSize = (2 * Math.PI) / numSlices;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < numSlices; i++) {
        const startAngle = angleOffset + i * arcSize;
        const endAngle = startAngle + arcSize;

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = wheelPrizes[i].color;
        ctx.fill();
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(startAngle + arcSize / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "#000000";
        ctx.font = "bold 11px sans-serif";
        ctx.fillText(wheelPrizes[i].text, radius - 16, 4);
        ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(cx, cy, 18, 0, 2 * Math.PI);
    ctx.fillStyle = "#111116";
    ctx.fill();
    ctx.strokeStyle = "#ffe600";
    ctx.lineWidth = 3;
    ctx.stroke();
}

function executeWheelSpinAnimation() {
    const storageKey = "punk_wheel_last_free_" + currentUsername.toLowerCase();
    const lastFreeDate = localStorage.getItem(storageKey);
    const today = getTodayDateString();
    const isFree = (lastFreeDate !== today);

    if (!isFree) {
        if (userPoints < 50) {
            alert("Non hai abbastanza punti! Ti servono almeno 50 Punti VIP per girare la ruota.");
            return;
        }
        userPoints -= 50;
    } else {
        localStorage.setItem(storageKey, today);
    }

    updateVipUI();
    checkLuckyWheelStatus();

    const spinBtn = document.getElementById("modalSpinBtn");
    spinBtn.disabled = true;
    document.getElementById("wheelResultBanner").innerText = "🌀 La ruota sta girando...";

    const winningIndex = Math.floor(Math.random() * wheelPrizes.length);
    const numSlices = wheelPrizes.length;
    const arcSize = (2 * Math.PI) / numSlices;

    const targetAngle = (2 * Math.PI * 5) + (2 * Math.PI - (winningIndex * arcSize + arcSize / 2)) - (Math.PI / 2);
    
    let startTime = null;
    const spinDuration = 3000;

    function animateSpin(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = timestamp - startTime;
        const percent = Math.min(progress / spinDuration, 1);
        
        const easeOut = 1 - Math.pow(1 - percent, 3);
        const currentAngle = currentWheelAngle + (targetAngle - currentWheelAngle) * easeOut;

        drawWheel(currentAngle);

        if (percent < 1) {
            requestAnimationFrame(animateSpin);
        } else {
            currentWheelAngle = targetAngle % (2 * Math.PI);
            const prize = wheelPrizes[winningIndex];

            let resultText = "";
            if (prize.pts > 0) {
                userPoints += prize.pts;
                resultText = `🎉 Complimenti! Hai vinto ${prize.text}!`;
            } else if (prize.text.toLowerCase().includes("acqua")) {
                readyRewards.push({ id: Date.now(), name: "Acqua Naturale" });
                localStorage.setItem("punk_app_ready_rewards", JSON.stringify(readyRewards));
                renderReadyRewards();
                renderVenerdiRewards();
                resultText = `💧 Hai vinto un'Acqua Naturale gratis!`;
            } else {
                resultText = `😅 Peccato! Ritenta la prossima volta!`;
            }

            document.getElementById("wheelResultBanner").innerText = resultText;
            document.getElementById("wheelDisplayBox").innerText = prize.text;
            updateVipUI();
            spinBtn.disabled = false;
        }
    }

    requestAnimationFrame(animateSpin);
}

function renderRanking() {
    const container = document.getElementById("rankingListContainer");
    if (!container) return;

    let userStats = {};
    let allKnownUsers = [];
    if (currentUsername) allKnownUsers.push(currentUsername);
    cloudRegisteredUsers.forEach(u => { if (!allKnownUsers.includes(u.username)) allKnownUsers.push(u.username); });
    ordersHistory.forEach(o => { if (o.user && !allKnownUsers.includes(o.user)) allKnownUsers.push(o.user); });

    allKnownUsers.forEach(user => {
        userStats[user] = { count: 0 };
    });

    ordersHistory.forEach(o => {
        if (o.completed === true && o.user) {
            if (!userStats[o.user]) userStats[o.user] = { count: 0 };
            userStats[o.user].count += 1;
        }
    });

    let rankingArray = [];
    for (let u in userStats) {
        if (userStats[u].count > 0) {
            rankingArray.push({ name: u, count: userStats[u].count });
        }
    }

    rankingArray.sort((a, b) => b.count - a.count);

    if (rankingArray.length === 0) {
        container.innerHTML = '<div class="empty-orders">Nessun utente in classifica al momento.</div>';
        return;
    }

    let html = "";
    rankingArray.forEach((item, index) => {
        let medal = `#${index + 1}`;
        let podiumClass = "";
        if (index === 0) { medal = "🥇 1°"; podiumClass = "podium-1"; }
        else if (index === 1) { medal = "🥈 2°"; podiumClass = "podium-2"; }
        else if (index === 2) { medal = "🥉 3°"; podiumClass = "podium-3"; }

        const badgeInfo = getUserAchievementBadge(item.name);

        html += `
            <div class="ranking-item ${podiumClass}">
                <div style="display:flex; align-items:center; gap:12px;">
                    <span style="font-size:1.1rem; font-weight:bold; min-width:40px; color:var(--accent-cyan);">${medal}</span>
                    <div>
                        <strong style="font-size:1rem; color:#fff;">👤 ${item.name}</strong>
                        ${badgeInfo ? `<div style="margin-top:2px;"><span class="chat-achievement-badge" style="color:${badgeInfo.color}; border-color:${badgeInfo.color};">${badgeInfo.text}</span></div>` : ''}
                    </div>
                </div>
                <div style="text-align:right;">
                    <span style="font-size:0.95rem; font-weight:bold; color:var(--accent-yellow);">${item.count} Serate</span>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function deleteUser(usernameToDelete) {
    if (!confirm(`Sei sicuro di voler ELIMINARE DEFINITIVAMENTE l'utente '${usernameToDelete}' e tutti i suoi dati, messaggi e notifiche?`)) return;

    const targetLower = usernameToDelete.toLowerCase();

    if (db) {
        db.collection("users").get().then(snapshot => {
            snapshot.forEach(doc => {
                const data = doc.data();
                if (data && data.username && data.username.toLowerCase() === targetLower) {
                    doc.ref.delete();
                }
            });
        });

        db.collection("notifications").get().then(snapshot => {
            snapshot.forEach(doc => {
                const n = doc.data();
                if (n && (n.sender.toLowerCase() === targetLower || (n.target && n.target.toLowerCase() === targetLower))) {
                    doc.ref.delete();
                }
            });
        });

        db.collection("chat_messages").get().then(snapshot => {
            snapshot.forEach(doc => {
                const n = doc.data();
                if (n && (n.sender.toLowerCase() === targetLower || (n.target && n.target.toLowerCase() === targetLower))) {
                    doc.ref.delete();
                }
            });
        });

        db.collection("orders").get().then(snapshot => {
            snapshot.forEach(doc => {
                const o = doc.data();
                if (o && o.user && o.user.toLowerCase() === targetLower) {
                    doc.ref.delete();
                }
            });
        });
    }

    cloudRegisteredUsers = cloudRegisteredUsers.filter(u => u.username.toLowerCase() !== targetLower);
    ordersHistory = ordersHistory.filter(o => o.user.toLowerCase() !== targetLower);
    localStorage.setItem("punk_app_orders", JSON.stringify(ordersHistory));

    chatMessagesStore = chatMessagesStore.filter(n => {
        const isUserInvolved = n.sender.toLowerCase() === targetLower || (n.target && n.target.toLowerCase() === targetLower);
        return !isUserInvolved;
    });
    localStorage.setItem("punk_app_chat_messages", JSON.stringify(chatMessagesStore));

    renderOrders();
    renderUserHistory();
    renderAdminUsersList();
    renderRanking();
    updateNotificationsBadge();
    
    if (document.getElementById("globalChatModal").style.display === "flex") {
        if (activeChatRoom.toLowerCase() === targetLower) {
            selectChatRoom("global");
        }
        renderChatSidebar();
        renderActiveChatMessages();
    }

    alert(`✅ L'utente '${usernameToDelete}' e tutti i suoi messaggi/dati sono stati eliminati ovunque con successo!`);
}

function triggerSilentPushNotification(targetUser, orderId, earnedPoints) {
    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    const pointsMsg = earnedPoints > 0 ? ` +${earnedPoints} Punti VIP accreditati!` : '';

    const autoNotif = {
        id: Date.now(),
        type: "order_complete",
        sender: "Il Punk (Admin)",
        target: targetUser,
        title: "🎉 Serata Conclusa & Punti!",
        body: `La tua serata è stata servita e archiviata!${pointsMsg}`,
        time: timeString,
        timestamp: Date.now(),
        read: false
    };

    if (db) db.collection("notifications").doc(autoNotif.id.toString()).set(autoNotif);
}

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
            const isSelected = qty > 0;
            const isSoldOut = item.soldOut === true;
            const isSpecial = item.specialPromo === true;
            const escapedName = item.name.replace(/'/g, "\\'");

            if (isSoldOut && selectedQuantities[itemKey]) {
                delete selectedQuantities[itemKey];
            }

            html += `
                <div class="card-item ${isSelected ? 'selected' : ''} ${isSoldOut ? 'sold-out' : ''} ${isSpecial ? 'special-promo' : ''}" id="card-${cat}-${item.name.replace(/\s+/g, '')}">
                    ${isSoldOut ? '<div class="sold-out-badge">SOLD OUT</div>' : (isSpecial ? '<div class="special-badge">🔥 PUNTI DOPPI</div>' : '')}
                    <div>
                        <h4>${item.name}</h4>
                        <p>${item.desc || ''}</p>
                    </div>
                    <div class="card-bottom-row">
                        <div class="badge">${item.badge || 'Menu'}</div>
                        ${!isSoldOut ? `
                            <div class="qty-selector" onclick="event.stopPropagation();">
                                <button class="qty-btn" onclick="changeQty('${cat}', '${escapedName}', -1)">-</button>
                                <span class="qty-value" id="qty-${cat}-${item.name.replace(/\s+/g, '')}">${qty}</span>
                                <button class="qty-btn" onclick="changeQty('${cat}', '${escapedName}', 1)">+</button>
                            </div>
                        ` : '<span style="font-size:0.75rem; color:#888; font-weight:bold; margin-left:auto;">Non disponibile</span>'}
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

    if (currentQty === 0) {
        delete selectedQuantities[itemKey];
    } else {
        selectedQuantities[itemKey] = currentQty;
    }

    const safeNameId = name.replace(/\s+/g, '');
    const qtyElem = document.getElementById(`qty-${category}-${safeNameId}`);
    if (qtyElem) qtyElem.innerText = currentQty;

    const cardElem = document.getElementById(`card-${category}-${safeNameId}`);
    if (cardElem) {
        if (currentQty > 0) cardElem.classList.add('selected');
        else cardElem.classList.remove('selected');
    }

    updateSelectedCount();
}

function updateSelectedCount() {
    let totalItems = 0;
    for (let key in selectedQuantities) totalItems += selectedQuantities[key];
    const total = totalItems + selectedRewardsForOrder.length;
    document.getElementById('selectedCount').innerText = total;
}

function resetSelections() {
    selectedQuantities = {};
    selectedRewardsForOrder = [];
    editingOrderId = null;
    updateSelectedCount();
    renderMenu();
    renderVenerdiRewards();
}

function renderVipCatalog() {
    const container = document.getElementById("vipCatalogContainer");
    if (!container) return;

    if (vipRewardsCatalog.length === 0) {
        container.innerHTML = '<div class="empty-orders">Nessun premio disponibile nel catalogo al momento.</div>';
        return;
    }

    let html = "";
    vipRewardsCatalog.forEach(reward => {
        const isSoldOut = reward.soldOut === true;
        const btnId = "btnClaim_" + reward.id;
        html += `
            <div class="reward-card ${isSoldOut ? 'sold-out' : ''}">
                <div>
                    <h4>${reward.name} ${isSoldOut ? '<span style="color:var(--accent-orange); font-size:0.7rem;">[SOLD OUT]</span>' : ''}</h4>
                    <p style="font-size:0.75rem; color:#9a9ab0;">Costo: ${reward.cost} Punti</p>
                </div>
                ${!isSoldOut ? `<button class="btn-claim" id="${btnId}" onclick="claimReward('${reward.name.replace(/'/g, "\\'")}', ${reward.cost})">Riscatta (${reward.cost} P)</button>` : '<span style="font-size:0.75rem; color:#888; font-weight:bold;">Non disponibile</span>'}
            </div>
        `;
    });
    container.innerHTML = html;
    updateVipUI();
}

function renderAdminRewardsEditor() {
    const container = document.getElementById("adminRewardsListContainer");
    if (!container) return;

    if (vipRewardsCatalog.length === 0) {
        container.innerHTML = '<div class="empty-orders">Nessun premio configurato.</div>';
        return;
    }

    let html = "";
    vipRewardsCatalog.forEach(reward => {
        const isSoldOut = reward.soldOut === true;
        html += `
            <div class="menu-item-row" style="${isSoldOut ? 'opacity:0.6;' : ''}">
                <div>
                    <span style="${isSoldOut ? 'text-decoration:line-through; color:#aaa;' : ''}">${reward.name}</span> 
                    <span style="color:var(--accent-yellow);">(${reward.cost} pts)</span>
                    ${isSoldOut ? '<span style="color:var(--accent-orange); font-size:0.75rem; font-weight:bold; margin-left:6px;">[SOLD OUT]</span>' : ''}
                </div>
                <div class="menu-item-actions">
                    <button class="btn-soldout-toggle ${isSoldOut ? 'active' : ''}" onclick="toggleRewardSoldOut('${reward.id}')">${isSoldOut ? 'Riattiva' : 'Sold Out'}</button>
                    <button class="btn-delete-menu" onclick="deleteVipReward('${reward.id}')">Elimina</button>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function toggleRewardSoldOut(rewardId) {
    const reward = vipRewardsCatalog.find(r => r.id === rewardId);
    if (reward) {
        reward.soldOut = !reward.soldOut;
        if (db) {
            db.collection("vipRewards").doc(rewardId).set(reward);
        } else {
            localStorage.setItem("punk_app_vip_rewards_catalog", JSON.stringify(vipRewardsCatalog));
            renderVipCatalog();
            renderAdminRewardsEditor();
        }
    }
}

function addNewVipReward() {
    let name = document.getElementById("newRewardName").value.trim();
    const costInput = parseInt(document.getElementById("newRewardCost").value, 10);

    if (!name || isNaN(costInput)) {
        alert("Inserisci un nome valido e un costo in punti numerico!");
        return;
    }

    name = name.replace(/\bgratis\b/gi, '').trim();

    const newReward = {
        id: 'r_' + Date.now(),
        name: name,
        cost: costInput,
        soldOut: false
    };

    vipRewardsCatalog.push(newReward);

    if (db) {
        db.collection("vipRewards").doc(newReward.id).set(newReward);
    } else {
        localStorage.setItem("punk_app_vip_rewards_catalog", JSON.stringify(vipRewardsCatalog));
    }

    document.getElementById("newRewardName").value = "";
    document.getElementById("newRewardCost").value = "";

    renderVipCatalog();
    renderAdminRewardsEditor();
    alert("✅ Nuovo premio VIP aggiunto con successo!");
}

function deleteVipReward(rewardId) {
    if (confirm("Sei sicuro di voler eliminare questo premio dal catalogo VIP?")) {
        vipRewardsCatalog = vipRewardsCatalog.filter(r => r.id !== rewardId);

        if (db) {
            db.collection("vipRewards").doc(rewardId).delete();
        } else {
            localStorage.setItem("punk_app_vip_rewards_catalog", JSON.stringify(vipRewardsCatalog));
        }

        renderVipCatalog();
        renderAdminRewardsEditor();
    }
}

function renderAdminMenuEditor() {
    const container = document.getElementById("adminMenuListContainer");
    if (!container) return;

    const categories = [
        { id: 'Gin', label: '🍸 Drink Gin' },
        { id: 'Analcolici', label: '🥤 Analcolici, Acqua, Birra & Vino' },
        { id: 'Smoke', label: '🌿 Smoke Selection' },
        { id: 'PS3', label: '🎮 PlayStation 3' },
        { id: 'Carte', label: '🎴 Giochi di Carte' }
    ];

    let html = "";
    categories.forEach(cat => {
        const itemsInCat = appMenu.filter(m => m.category === cat.id);
        
        html += `<div style="font-size: 0.95rem; font-weight: bold; color: var(--accent-cyan); margin: 16px 0 8px 0; border-bottom: 1px solid #2d2d3a; padding-bottom: 4px;">${cat.label}</div>`;

        if (itemsInCat.length === 0) {
            html += `<div class="empty-orders" style="padding: 10px; margin-bottom: 8px;">Nessun prodotto in questa categoria.</div>`;
        } else {
            itemsInCat.forEach(item => {
                const isSoldOut = item.soldOut === true;
                const isSpecial = item.specialPromo === true;
                html += `
                    <div class="menu-item-row" style="${isSoldOut ? 'opacity:0.6;' : ''}">
                        <div>
                            <span style="${isSoldOut ? 'text-decoration:line-through; color:#aaa;' : ''}">${item.name}</span> 
                            <span style="color:var(--accent-yellow);">(${item.points || 10} pts)</span>
                            ${isSoldOut ? '<span style="color:var(--accent-orange); font-size:0.75rem; font-weight:bold; margin-left:6px;">[SOLD OUT]</span>' : ''}
                            ${isSpecial ? '<span style="color:var(--accent-yellow); font-size:0.75rem; font-weight:bold; margin-left:6px;">[🔥 2X]</span>' : ''}
                        </div>
                        <div class="menu-item-actions">
                            <button class="btn-special-toggle ${isSpecial ? 'active' : ''}" onclick="toggleSpecialPromo('${item.id}')">${isSpecial ? 'Standard' : 'Punti 2X'}</button>
                            <button class="btn-soldout-toggle ${isSoldOut ? 'active' : ''}" onclick="toggleSoldOut('${item.id}')">${isSoldOut ? 'Riattiva' : 'Sold Out'}</button>
                            <button class="btn-delete-menu" onclick="deleteMenuItem('${item.id}')">Elimina</button>
                        </div>
                    </div>
                `;
            });
        }
    });

    container.innerHTML = html;
}

function toggleSoldOut(itemId) {
    const item = appMenu.find(m => m.id === itemId);
    if (item) {
        item.soldOut = !item.soldOut;
        if (db) {
            db.collection("menu").doc(itemId).set(item);
        } else {
            localStorage.setItem("punk_app_menu", JSON.stringify(appMenu));
            renderMenu();
            renderAdminMenuEditor();
        }
    }
}

function toggleSpecialPromo(itemId) {
    const item = appMenu.find(m => m.id === itemId);
    if (item) {
        item.specialPromo = !item.specialPromo;
        if (db) {
            db.collection("menu").doc(itemId).set(item);
        } else {
            localStorage.setItem("punk_app_menu", JSON.stringify(appMenu));
            renderMenu();
            renderAdminMenuEditor();
        }
    }
}

function addNewMenuItem() {
    const category = document.getElementById("newMenuCategory").value;
    const name = document.getElementById("newMenuName").value.trim();
    const desc = document.getElementById("newMenuDesc").value.trim();
    const badge = document.getElementById("newMenuBadge").value.trim() || 'Novità';
    const pointsInput = parseInt(document.getElementById("newMenuPoints").value, 10);
    const points = !isNaN(pointsInput) ? pointsInput : 20;

    if (!name) {
        alert("Inserisci almeno il nome del prodotto!");
        return;
    }

    const newItem = {
        id: Date.now().toString(),
        category: category,
        name: name,
        desc: desc,
        badge: badge,
        points: points,
        soldOut: false,
        specialPromo: false
    };

    if (db) {
        db.collection("menu").doc(newItem.id).set(newItem);
    } else {
        appMenu.push(newItem);
        localStorage.setItem("punk_app_menu", JSON.stringify(appMenu));
        renderMenu();
        renderAdminMenuEditor();
    }

    document.getElementById("newMenuName").value = "";
    document.getElementById("newMenuDesc").value = "";
    document.getElementById("newMenuBadge").value = "";
    document.getElementById("newMenuPoints").value = "";

    alert("Elemento aggiunto con successo nella categoria corretta!");
}

function deleteMenuItem(itemId) {
    if (confirm("Sei sicuro di voler eliminare definitivamente questo prodotto dal menu?")) {
        if (db) {
            db.collection("menu").doc(itemId).delete();
        } else {
            appMenu = appMenu.filter(m => m.id !== itemId);
            localStorage.setItem("punk_app_menu", JSON.stringify(appMenu));
            renderMenu();
            renderAdminMenuEditor();
        }
    }
}

function renderAdminUsersList() {
    const container = document.getElementById("adminUsersListContainer");
    if (!container) return;

    let usersMap = {};
    cloudRegisteredUsers.forEach(u => {
        if (u.username) {
            usersMap[u.username.toLowerCase()] = { name: u.username, lastLogin: u.lastLogin || null };
        }
    });

    ordersHistory.forEach(o => {
        if (o.user) {
            const key = o.user.toLowerCase();
            if (!usersMap[key]) usersMap[key] = { name: o.user, lastLogin: null };
        }
    });

    let htmlUsers = "";
    for (let key in usersMap) {
        const userObj = usersMap[key];
        if (currentUsername && userObj.name.toLowerCase() === currentUsername.toLowerCase()) continue;

        let lastDateStr = "Non disponibile";
        if (userObj.lastLogin) {
            const ld = new Date(userObj.lastLogin);
            lastDateStr = `${ld.toLocaleDateString('it-IT')} alle ${ld.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}`;
        }

        const userOrdersCount = ordersHistory.filter(o => o.user.toLowerCase() === userObj.name.toLowerCase()).length;
        const qrCanvasId = "admin_qr_" + userObj.name.replace(/\s+/g, '_');
        const badgeInfo = getUserAchievementBadge(userObj.name);

        htmlUsers += `
            <div class="menu-item-row" style="align-items:center;">
                <div style="display:flex; align-items:center; gap:10px; overflow:hidden;">
                    <canvas id="${qrCanvasId}" width="36" height="36" style="background:#fff; border-radius:4px; cursor:pointer; flex-shrink:0;" onclick="openVipDetailsModal('${userObj.name}')" title="Clicca per vedere i dettagli utente"></canvas>
                    <div style="overflow:hidden;">
                        <strong>👤 ${userObj.name}</strong>
                        ${badgeInfo ? `<div style="margin-top:2px;"><span class="chat-achievement-badge" style="color:${badgeInfo.color}; border-color:${badgeInfo.color};">${badgeInfo.text}</span></div>` : ''}
                        <div style="font-size:0.75rem; color:var(--accent-cyan); margin-top:2px;">🕒 Ultimo accesso: ${lastDateStr}</div>
                        <div style="font-size:0.75rem; color:#9a9ab0; margin-top:2px;">Serate registrate: ${userOrdersCount}</div>
                    </div>
                </div>
                <div style="display:flex; gap:6px; align-self:center;">
                    <button class="btn-delete-menu" style="padding:6px 10px; font-size:0.75rem;" onclick="deleteUser('${userObj.name}')">Elimina</button>
                </div>
            </div>
        `;
    }

    container.innerHTML = htmlUsers || '<div class="empty-orders">Nessun altro utente registrato trovato.</div>';

    setTimeout(() => {
        for (let key in usersMap) {
            const userObj = usersMap[key];
            if (currentUsername && userObj.name.toLowerCase() === currentUsername.toLowerCase()) continue;
            const qrCanvasId = "admin_qr_" + userObj.name.replace(/\s+/g, '_');
            drawMiniQr(qrCanvasId, userObj.name);
        }
    }, 50);
}

function openLoginModal(isEditing) {
    const modal = document.getElementById("loginModal");
    const logoutBtn = document.getElementById("logoutBtn");
    const cancelBtn = document.getElementById("cancelModalBtn");
    const input = document.getElementById("usernameInput");
    const modalTitle = document.getElementById("modalTitle");
    const modalDesc = document.getElementById("modalDesc");

    if (isEditing && currentUsername) {
        modalTitle.innerText = "Profilo Utente";
        modalDesc.innerText = "Puoi cambiare il nome corrente con un altro.";
        input.value = currentUsername;
        logoutBtn.style.display = "block";
        cancelBtn.style.display = "block";
    } else {
        modalTitle.innerText = "Accesso Richiesto";
        modalDesc.innerText = "Inserisci il tuo Nome o Soprannome per continuare.";
        input.value = "";
        logoutBtn.style.display = "none";
        cancelBtn.style.display = "none";
    }

    modal.style.display = "flex";
    setTimeout(() => input.focus(), 100);
}

function closeLoginModal() {
    if (!currentUsername) {
        alert("Devi inserire un nome per poter usare l'App!");
        return;
    }
    document.getElementById("loginModal").style.display = "none";
}

function saveUsername() {
    const input = document.getElementById("usernameInput").value.trim();
    if (input !== "") {
        currentUsername = input;
        localStorage.setItem("punk_app_username", currentUsername);
        document.getElementById("userBadgeDisplay").innerText = "👤 " + currentUsername;
        updateUserLoginsInFirestore();

        const isAdmin = currentUsername.trim().toLowerCase() === "il punk" || currentUsername.trim().toLowerCase() === "punk";
        if (!isAdmin) notifyAdminUserLogin(currentUsername);

        checkUserRoleVisibility();
        document.getElementById("loginModal").style.display = "none";
        recalculateAllUserPoints();
        renderUserHistory();
        renderAdminUsersList();
        renderRanking();
        updateNotificationsBadge();
        checkLuckyWheelStatus();
        generateVipQrCode();
    } else {
        alert("Devi inserire un nome o soprannome per accedere!");
    }
}

function logout() {
    localStorage.removeItem("punk_app_username");
    currentUsername = "";
    document.getElementById("userBadgeDisplay").innerText = "👤 Inserisci Nome";
    document.getElementById("usernameInput").value = "";
    checkUserRoleVisibility();
    resetSelections();
    recalculateAllUserPoints();
    renderUserHistory();
    updateNotificationsBadge();
    generateVipQrCode();
    openLoginModal(false);
}

function switchTab(tabName, btnElement) {
    currentTab = tabName;
    document.querySelectorAll('#tabsBar .tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.container > .section-page').forEach(page => page.classList.remove('active'));

    if(btnElement) btnElement.classList.add('active');
    document.getElementById('tab-' + tabName).classList.add('active');

    if (tabName === 'venerdi') {
        document.getElementById('orderBar').style.display = 'flex';
        renderVenerdiRewards();
    } else {
        document.getElementById('orderBar').style.display = 'none';
    }
}

function switchAdminTab(subPageId, btnElement) {
    document.querySelectorAll('#adminTabsBar .tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.admin-sub-page').forEach(page => page.style.display = 'none');

    if(btnElement) btnElement.classList.add('active');
    document.getElementById('admin-sub-' + subPageId.replace('admin-', '')).style.display = 'block';
}

function getLevelInfo(points) {
    const cappedPoints = Math.min(Math.max(points, 0), 1000);
    if (cappedPoints < 100) {
        return { title: "Principiante", number: "Livello 1 / 10", percent: (cappedPoints / 100) * 100, nextText: `Mancano ${100 - cappedPoints} P. al liv. 2` };
    } else if (cappedPoints < 200) {
        return { title: "Esploratore", number: "Livello 2 / 10", percent: ((cappedPoints - 100) / 100) * 100, nextText: `Mancano ${200 - cappedPoints} P. al liv. 3` };
    } else if (cappedPoints < 300) {
        return { title: "Apprendista", number: "Livello 3 / 10", percent: ((cappedPoints - 200) / 100) * 100, nextText: `Mancano ${300 - cappedPoints} P. al liv. 4` };
    } else if (cappedPoints < 400) {
        return { title: "Praticante", number: "Livello 4 / 10", percent: ((cappedPoints - 300) / 100) * 100, nextText: `Mancano ${400 - cappedPoints} P. al liv. 5` };
    } else if (cappedPoints < 500) {
        return { title: "Esperto", number: "Livello 5 / 10", percent: ((cappedPoints - 400) / 100) * 100, nextText: `Mancano ${500 - cappedPoints} P. al liv. 6` };
    } else if (cappedPoints < 620) {
        return { title: "Veterano", number: "Livello 6 / 10", percent: ((cappedPoints - 500) / 120) * 100, nextText: `Mancano ${620 - cappedPoints} P. al liv. 7` };
    } else if (cappedPoints < 750) {
        return { title: "Maestro", number: "Livello 7 / 10", percent: ((cappedPoints - 620) / 130) * 100, nextText: `Mancano ${750 - cappedPoints} P. al liv. 8` };
    } else if (cappedPoints < 870) {
        return { title: "Guru", number: "Livello 8 / 10", percent: ((cappedPoints - 750) / 120) * 100, nextText: `Mancano ${870 - cappedPoints} P. al liv. 9` };
    } else if (cappedPoints < 1000) {
        return { title: "Leggenda", number: "Livello 9 / 10", percent: ((cappedPoints - 870) / 130) * 100, nextText: `Mancano ${1000 - cappedPoints} P. all'ultimo livello!` };
    } else {
        return { title: "L'immortale", number: "Livello 10 / 10", percent: 100, nextText: "Livello massimo raggiunto! 🔥" };
    }
}

function updateVipUI() {
    document.getElementById("pointsDisplay").innerText = userPoints + " Punti";

    const lvlInfo = getLevelInfo(userPoints);
    document.getElementById("userLevelTitle").innerText = lvlInfo.title;
    document.getElementById("userLevelNumber").innerText = lvlInfo.number;
    document.getElementById("levelProgressBar").style.width = lvlInfo.percent + "%";
    document.getElementById("userPointsStat").innerText = `${userPoints} / 1000 Punti`;
    document.getElementById("nextLevelStat").innerText = lvlInfo.nextText;

    vipRewardsCatalog.forEach(reward => {
        const btn = document.getElementById("btnClaim_" + reward.id);
        if (btn) btn.disabled = userPoints < reward.cost;
    });

    localStorage.setItem("punk_app_points", userPoints);
    generateVipQrCode();
}

function claimReward(rewardName, cost) {
    if (userPoints >= cost) {
        userPoints -= cost;

        const cleanRewardName = rewardName.replace(/\bgratis\b/gi, '').trim();
        const newReward = { id: Date.now(), name: cleanRewardName };
        readyRewards.push(newReward);
        localStorage.setItem("punk_app_ready_rewards", JSON.stringify(readyRewards));

        updateVipUI();
        renderReadyRewards();
        renderVenerdiRewards();

        alert("🎉 Premio riscattato con successo!\n\n'" + cleanRewardName + "' è ora disponibile nel tuo box 'Premi pronti all'uso'!");
    } else {
        alert("Non hai abbastanza punti per riscattare questo premio!");
    }
}

function renderReadyRewards() {
    const container = document.getElementById("readyRewardsList");
    if (!container) return;
    if (readyRewards.length === 0) {
        container.innerHTML = '<div class="empty-orders">Nessun premio riscattato al momento. Riscattane uno dal catalogo qui sotto!</div>';
    } else {
        let html = "";
        readyRewards.forEach(item => {
            const cleanName = item.name.replace(/\bgratis\b/gi, '').trim();
            html += `
                <div class="ready-reward-item">
                    <span style="font-weight:bold; color:#fff;">✨ ${cleanName}</span>
                    <span style="font-size:0.75rem; color:var(--accent-green); font-weight:bold;">PRONTO ALL'USO</span>
                </div>
            `;
        });
        container.innerHTML = html;
    }
}

function renderVenerdiRewards() {
    const mainContainer = document.getElementById("venerdiRewardsContainer");
    const listContainer = document.getElementById("venerdiAvailableRewardsList");
    if (!mainContainer || !listContainer) return;

    if (readyRewards.length === 0) {
        mainContainer.style.display = "none";
        return;
    }

    mainContainer.style.display = "block";
    let html = "";
    readyRewards.forEach(item => {
        const isSelected = selectedRewardsForOrder.some(r => r.id === item.id);
        const cleanName = item.name.replace(/\bgratis\b/gi, '').trim();
        html += `
            <div class="card-item ${isSelected ? 'selected' : ''}" style="margin-bottom:8px; border-color:var(--accent-green);" onclick="toggleRewardSelection(${item.id})">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h4 style="color:var(--accent-green);">🎁 ${cleanName}</h4>
                    <span class="badge" style="background:rgba(0,255,136,0.2); color:var(--accent-green);">${isSelected ? 'SELEZIONATO' : 'CLICCA PER USARE'}</span>
                </div>
                <p>Premio VIP riscattato a costo 0!</p>
            </div>
        `;
    });
    listContainer.innerHTML = html;
}

function toggleRewardSelection(rewardId) {
    const reward = readyRewards.find(r => r.id === rewardId);
    if (!reward) return;

    const index = selectedRewardsForOrder.findIndex(r => r.id === rewardId);
    if (index !== -1) {
        selectedRewardsForOrder.splice(index, 1);
    } else {
        selectedRewardsForOrder.push(reward);
    }

    renderVenerdiRewards();
    updateSelectedCount();
}

function findItemPoints(itemName) {
    if (itemName.startsWith("🎁 PREMI VIP:")) return 0;
    for (let m of appMenu) {
        if (m.name.toLowerCase() === itemName.toLowerCase()) {
            let basePts = m.points || 15;
            return m.specialPromo ? basePts * 2 : basePts;
        }
    }
    if (itemName.includes(":")) {
        const parts = itemName.split(":");
        const name = parts[1].trim();
        const found = appMenu.find(m => m.name.toLowerCase() === name.toLowerCase());
        if (found) {
            let basePts = found.points || 15;
            return found.specialPromo ? basePts * 2 : basePts;
        }
    }
    return 15;
}

function recalculateAllUserPoints() {
    let totalUserPoints = 0;
    ordersHistory.forEach(order => {
        if (order.user.toLowerCase() === currentUsername.toLowerCase() && order.completed === true && order.items) {
            order.items.forEach(it => {
                if (it.name.startsWith("🎁 PREMI VIP:")) return;
                if (it.done === true) {
                    const pts = (it.points !== undefined) ? it.points : findItemPoints(it.name);
                    const qty = it.qty || 1;
                    totalUserPoints += (pts * qty);
                }
            });
        }
    });
    userPoints = totalUserPoints;
    updateVipUI();
}

function getElegantComment(itemsList, rewardsCount) {
    let totalQuantity = 0;
    itemsList.forEach(it => { totalQuantity += (it.qty || 1); });

    const comments = [
        "Un'ottima scelta, pensata con grande classe e buongusto!",
        "Una selezione davvero eccellente per una serata indimenticabile.",
        "Scelte curate nei minimi dettagli per vivere al meglio la serata.",
        "Un abbinamento raffinato che esprime tutto il piacere della compagnia.",
        "Una composizione impeccabile, perfetta per iniziare nel modo migliore.",
        "Stile, eleganza e qualità superiore racchiuse in un unico ordine."
    ];

    return comments[totalQuantity % comments.length];
}

function prepareOrderReview() {
    if (!currentUsername) {
        openLoginModal(false);
        return;
    }

    const hasSelections = Object.keys(selectedQuantities).length > 0;
    if (!hasSelections && selectedRewardsForOrder.length === 0) {
        alert("Seleziona almeno un elemento o quantità prima di inviare l'ordine!");
        return;
    }

    let orderItemsList = [];
    for (let itemKey in selectedQuantities) {
        const qty = selectedQuantities[itemKey];
        const parts = itemKey.split(":");
        const name = parts[1] ? parts[1].trim() : itemKey;
        const pts = findItemPoints(name);
        orderItemsList.push({ name: name, points: pts, qty: qty, done: null });
    }

    if (selectedRewardsForOrder.length > 0) {
        selectedRewardsForOrder.forEach(r => {
            orderItemsList.push({ name: "🎁 PREMI VIP: " + r.name.replace(/\bgratis\b/gi, '').trim(), points: 0, qty: 1, done: true });
        });
    }

    const elegantText = getElegantComment(orderItemsList, selectedRewardsForOrder.length);
    document.getElementById("orderRoastText").innerText = `"${elegantText}"`;

    let container = document.getElementById("checkoutItemsList");
    let html = "";

    for (let itemKey in selectedQuantities) {
        const qty = selectedQuantities[itemKey];
        const parts = itemKey.split(":");
        const name = parts[1] ? parts[1].trim() : itemKey;
        html += `
            <div style="background:rgba(255,255,255,0.03); border:1px solid #2d2d3a; padding:8px 12px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
                <span style="font-size:0.9rem; color:#fff;">${name}</span>
                <span style="font-size:0.85rem; color:var(--accent-cyan); font-weight:bold;">x${qty}</span>
            </div>
        `;
    }

    if (selectedRewardsForOrder.length > 0) {
        selectedRewardsForOrder.forEach(r => {
            const cleanName = r.name.replace(/\bgratis\b/gi, '').trim();
            html += `
                <div style="background:rgba(0,255,136,0.05); border:1px solid var(--accent-green); padding:8px 12px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:0.9rem; color:var(--accent-green);">✨ ${cleanName}</span>
                    <span style="font-size:0.75rem; color:var(--accent-green); font-weight:bold;">VIP</span>
                </div>
            `;
        });
    }

    container.innerHTML = html;
    document.getElementById("checkoutReviewModal").style.display = "flex";
}

function closeCheckoutReviewModal() {
    document.getElementById("checkoutReviewModal").style.display = "none";
}

function confirmAndSendOrder() {
    closeCheckoutReviewModal();

    let orderItemsList = [];
    for (let itemKey in selectedQuantities) {
        const qty = selectedQuantities[itemKey];
        const parts = itemKey.split(":");
        const name = parts[1] ? parts[1].trim() : itemKey;
        const pts = findItemPoints(name);
        orderItemsList.push({ name: name, points: pts, qty: qty, done: null });
    }

    if (selectedRewardsForOrder.length > 0) {
        selectedRewardsForOrder.forEach(r => {
            orderItemsList.push({ name: "🎁 PREMI VIP: " + r.name.replace(/\bgratis\b/gi, '').trim(), points: 0, qty: 1, done: true });
        });
    }

    const now = new Date();
    const timeString = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    const dateString = now.toLocaleDateString('it-IT');

    let orderToSave = null;

    if (editingOrderId) {
        const orderIndex = ordersHistory.findIndex(o => o.id === editingOrderId);
        if (orderIndex !== -1) {
            ordersHistory[orderIndex].items = orderItemsList;
            ordersHistory[orderIndex].time = timeString;
            orderToSave = ordersHistory[orderIndex];
        }
    } else {
        orderToSave = {
            id: Date.now(),
            user: currentUsername,
            date: dateString,
            time: timeString,
            items: orderItemsList,
            completed: false
        };
        ordersHistory.unshift(orderToSave);
    }

    if (db && orderToSave) {
        db.collection("orders").doc(orderToSave.id.toString()).set(orderToSave);
    }

    if (selectedRewardsForOrder.length > 0) {
        const usedIds = selectedRewardsForOrder.map(r => r.id);
        readyRewards = readyRewards.filter(r => !usedIds.includes(r.id));
        localStorage.setItem("punk_app_ready_rewards", JSON.stringify(readyRewards));
        renderReadyRewards();
    }

    recalculateAllUserPoints();
    renderOrders();
    renderUserHistory();
    renderAdminUsersList();
    renderRanking();
    resetSelections();
    
    const successModal = document.getElementById("successModal");
    successModal.style.display = "flex";
    setTimeout(() => {
        successModal.style.display = "none";
        switchTab('history', document.querySelectorAll('#tabsBar .tab-btn')[1]);
    }, 1500);
}

function loadOrderForEditing(orderId) {
    const order = ordersHistory.find(o => o.id === orderId);
    if (!order || order.completed) {
        alert("Questo ordine non può più essere modificato.");
        return;
    }

    selectedQuantities = {};
    selectedRewardsForOrder = [];
    editingOrderId = order.id;

    order.items.forEach(it => {
        if (it.name.startsWith("🎁 PREMI VIP:")) {
            const rewardName = it.name.replace("🎁 PREMI VIP: ", "").replace(/\bgratis\b/gi, '').trim();
            const found = readyRewards.find(r => r.name.replace(/\bgratis\b/gi, '').trim() === rewardName);
            if (found) selectedRewardsForOrder.push(found);
        } else {
            let foundCat = "Gin";
            for (let m of appMenu) {
                if (m.name.toLowerCase() === it.name.toLowerCase()) {
                    foundCat = m.category;
                    break;
                }
            }
            const key = foundCat + ":" + it.name;
            selectedQuantities[key] = it.qty || 1;
        }
    });

    updateSelectedCount();
    renderMenu();
    renderVenerdiRewards();
    switchTab('venerdi', document.getElementById('tabBtnVenerdi'));
    alert("Stai modificando il tuo ordine in corso. Effettua le variazioni e premi 'Invia Ordine' per aggiornarlo!");
}

function deleteMyOrder(orderId) {
    const order = ordersHistory.find(o => o.id === orderId);
    if (!order || order.completed) {
        alert("Questo ordine non può essere eliminato.");
        return;
    }

    if (!confirm("Sei sicuro di voler eliminare definitivamente questo ordine?")) return;

    ordersHistory = ordersHistory.filter(o => o.id !== orderId);
    localStorage.setItem("punk_app_orders", JSON.stringify(ordersHistory));

    if (db) {
        db.collection("orders").doc(orderId.toString()).delete().catch(err => console.error(err));
    }

    recalculateAllUserPoints();
    renderOrders();
    renderUserHistory();
    renderAdminUsersList();
    renderRanking();
    updateAdminBadge();
    alert("✅ Ordine eliminato con successo.");
}

function renderUserHistory() {
    const container = document.getElementById("userHistoryList");
    if (!container) return;
    if (!currentUsername) {
        container.innerHTML = '<div class="empty-orders">Inserisci un nome utente per vedere le tue serate.</div>';
        return;
    }

    const myOrders = ordersHistory.filter(o => o.user.toLowerCase() === currentUsername.toLowerCase());

    if (myOrders.length === 0) {
        container.innerHTML = '<div class="empty-orders">Nessuna serata ancora programmata per ' + currentUsername + '.</div>';
    } else {
        let html = "";
        myOrders.forEach(order => {
            let itemsSummaryHtml = "";
            let totalOrderPoints = 0;

            if (order.items && Array.isArray(order.items)) {
                itemsSummaryHtml += '<div class="summary-box"><div class="summary-title">Cose scelte & Punti:</div>';
                order.items.forEach(it => {
                    const isReward = it.name.startsWith("🎁 PREMI VIP:");
                    const itemPts = isReward ? 0 : ((it.points !== undefined) ? it.points : findItemPoints(it.name));
                    const qty = it.qty || 1;
                    const totalItemPts = itemPts * qty;
                    const qtyText = qty > 1 ? ` (x${qty})` : '';
                    const cleanItemName = it.name.replace(/\bgratis\b/gi, '').trim();

                    if (isReward) {
                        itemsSummaryHtml += `
                            <div class="summary-item done">
                                <span>✨ ${cleanItemName}</span>
                                <span class="summary-points-badge" style="background:rgba(0,255,136,0.15); color:var(--accent-green); border-color:rgba(0,255,136,0.3);">Premio VIP</span>
                            </div>`;
                    } else if (order.completed && it.done === true) {
                        totalOrderPoints += totalItemPts;
                        itemsSummaryHtml += `
                            <div class="summary-item done">
                                <span>✔️ ${cleanItemName}${qtyText}</span>
                                <span class="summary-points-badge">+${totalItemPts} pts</span>
                            </div>`;
                    } else if (order.completed && (it.done === false || it.done === null)) {
                        itemsSummaryHtml += `
                            <div class="summary-item not-done">
                                <span>❌ ${cleanItemName}${qtyText} (Non servito)</span>
                                <span class="summary-points-badge" style="background:rgba(255,71,87,0.15); color:var(--accent-red); border-color:rgba(255,71,87,0.3);">0 pts</span>
                            </div>`;
                    } else {
                        const statusLabel = (it.done === true) ? '✔️ Pronto' : '⏳ In attesa';
                        itemsSummaryHtml += `
                            <div class="summary-item" style="color:#fff;">
                                <span>${statusLabel}: ${cleanItemName}${qtyText}</span>
                                <span class="summary-points-badge" style="background:rgba(255,159,67,0.15); color:var(--accent-orange); border-color:rgba(255,159,67,0.3);">+${totalItemPts} pts da confermare</span>
                            </div>`;
                    }
                });

                if (order.completed) {
                    itemsSummaryHtml += `
                        <div class="order-total-earned">
                            <span>⚡ Punti Guadagnati Stasera:</span>
                            <span style="color:var(--accent-yellow); font-size:1rem;">+${totalOrderPoints} Punti VIP</span>
                        </div>
                    `;
                } else {
                    itemsSummaryHtml += `
                        <div class="order-total-earned">
                            <span>⚡ Stato Punti:</span>
                            <span style="color:var(--accent-orange); font-size:0.85rem;">In attesa della chiusura serata</span>
                        </div>
                    `;
                }
                itemsSummaryHtml += '</div>';
            }

            const statusTag = order.completed 
                ? '<span style="color:var(--accent-green); font-weight:bold;">👍 Serata Conclusa</span>' 
                : `
                    <span style="color:var(--accent-yellow); font-weight:bold; display:block; margin-bottom:8px;">⏳ In Corso / In Preparazione</span>
                    <div style="display:flex; gap:8px;">
                        <button class="btn-edit-order" onclick="loadOrderForEditing(${order.id})">✏️ Modifica</button>
                        <button class="btn-delete-order" onclick="deleteMyOrder(${order.id})">🗑️ Elimina Ordine</button>
                    </div>
                `;

            html += `
                <div class="order-list-item ${order.completed ? 'archived' : ''}">
                    <div class="order-header">
                        <span>🎉 Serata del ${order.date || ''}</span>
                        <span class="order-time">${order.time}</span>
                    </div>
                    ${itemsSummaryHtml}
                    <div style="font-size:0.8rem; margin-top:10px;">Stato: ${statusTag}</div>
                </div>
            `;
        });
        container.innerHTML = html;
    }
}

function clearMyHistory() {
    const confirmVal = prompt("Per confermare l'azzeramento delle tue serate, digita 666:");
    if (confirmVal === "666") {
        const myOrders = ordersHistory.filter(o => o.user.toLowerCase() === currentUsername.toLowerCase());
        ordersHistory = ordersHistory.filter(o => o.user.toLowerCase() !== currentUsername.toLowerCase());
        localStorage.setItem("punk_app_orders", JSON.stringify(ordersHistory));

        if (db) {
            myOrders.forEach(o => {
                db.collection("orders").doc(o.id.toString()).delete().catch(err => console.error(err));
            });
        }

        recalculateAllUserPoints();
        renderOrders();
        renderUserHistory();
        renderAdminUsersList();
        renderRanking();
        alert("Le tue serate sono state azzerate con successo.");
    } else if (confirmVal !== null) {
        alert("Codice errato. Operazione annullata.");
    }
}

function clearAdminArchive() {
    const confirmVal = prompt("Per confermare l'azzeramento dell'archivio storico, digita 666:");
    if (confirmVal === "666") {
        const completedOrders = ordersHistory.filter(o => o.completed);
        ordersHistory = ordersHistory.filter(o => !o.completed);
        localStorage.setItem("punk_app_orders", JSON.stringify(ordersHistory));
        
        if (db) {
            completedOrders.forEach(o => {
                db.collection("orders").doc(o.id.toString()).delete().catch(err => console.error(err));
            });
        }
        
        renderOrders();
        renderUserHistory();
        renderRanking();
        alert("L'archivio storico è stato azzerato definitivamente.");
    } else if (confirmVal !== null) {
        alert("Codice errato. Operazione annullata.");
    }
}

function toggleItemStatus(orderId, itemIndex, statusValue) {
    const order = ordersHistory.find(o => o.id === orderId);
    if (order && order.items && order.items[itemIndex]) {
        order.items[itemIndex].done = statusValue;
        if (db) {
            db.collection("orders").doc(orderId.toString()).update({ items: order.items });
        }
    }
}

function completeOrder(orderId) {
    const orderIndex = ordersHistory.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        let totalEarnedInThisOrder = 0;
        ordersHistory[orderIndex].items.forEach(it => {
            if (it.done === true) {
                const pts = (it.points !== undefined) ? it.points : findItemPoints(it.name);
                const qty = it.qty || 1;
                totalEarnedInThisOrder += (pts * qty);
            } else {
                it.done = false;
            }
        });

        ordersHistory[orderIndex].completed = true;
        if (db) {
            db.collection("orders").doc(orderId.toString()).update({ items: ordersHistory[orderIndex].items, completed: true });
        }

        triggerSilentPushNotification(ordersHistory[orderIndex].user, orderId, totalEarnedInThisOrder);
        recalculateAllUserPoints();
        renderOrders();
        renderUserHistory();
        renderRanking();
        alert(`✅ Ordine di ${ordersHistory[orderIndex].user} completato ed archiviato!`);
    }
}

function renderOrders() {
    const activeContainer = document.getElementById("adminOrdersList");
    const archiveContainer = document.getElementById("adminArchiveList");
    const archiveCountElem = document.getElementById("archiveCount");
    if (!activeContainer || !archiveContainer || !archiveCountElem) return;

    const activeOrders = ordersHistory.filter(o => !o.completed);
    const archivedOrders = ordersHistory.filter(o => o.completed);
    archiveCountElem.innerText = archivedOrders.length;

    if (activeOrders.length === 0) {
        activeContainer.innerHTML = '<div class="empty-orders">Nessun ordine attivo in attesa.</div>';
    } else {
        let htmlActive = "";
        activeOrders.forEach(order => {
            let itemsListHtml = '<div class="items-vertical-list">';
            if (order.items && Array.isArray(order.items)) {
                order.items.forEach((it, idx) => {
                    const isReward = it.name.startsWith("🎁 PREMI VIP:");
                    const isDone = it.done === true;
                    const isNotDone = it.done === false;
                    const qty = it.qty || 1;
                    const qtyText = qty > 1 ? ` (x${qty})` : '';
                    const cleanItemName = it.name.replace(/\bgratis\b/gi, '').trim();

                    if (isReward) {
                        itemsListHtml += `
                            <div class="item-row" style="border-color:var(--accent-green);">
                                <span class="item-row-text" style="color:var(--accent-green);">✨ ${cleanItemName}</span>
                                <span style="font-size:0.75rem; color:var(--accent-green); font-weight:bold;">PREMIO VIP</span>
                            </div>
                        `;
                    } else {
                        itemsListHtml += `
                            <div class="item-row">
                                <span class="item-row-text">${cleanItemName}${qtyText}</span>
                                <div class="item-row-actions">
                                    <button class="btn-status-toggle ${isDone ? 'active-done' : ''}" onclick="toggleItemStatus(${order.id}, ${idx}, true)">✔️ Fatto</button>
                                    <button class="btn-status-toggle ${isNotDone ? 'active-notdone' : ''}" onclick="toggleItemStatus(${order.id}, ${idx}, false)">❌ Non fatto (-)</button>
                                </div>
                            </div>
                        `;
                    }
                });
            }
            itemsListHtml += '</div>';

            htmlActive += `
                <div class="order-list-item">
                    <div class="order-header">
                        <span>👤 ${order.user} (${order.date || ''})</span>
                        <span class="order-time">${order.time}</span>
                    </div>
                    ${itemsListHtml}
                    <button class="btn-close-order" onclick="completeOrder(${order.id})">💾 Salva & Archivia Serata</button>
                </div>
            `;
        });
        activeContainer.innerHTML = htmlActive;
    }

    if (archivedOrders.length === 0) {
        archiveContainer.innerHTML = '<div class="empty-orders">L\'archivio è vuoto.</div>';
    } else {
        let htmlArchive = "";
        archivedOrders.forEach(order => {
            let itemsSummaryHtml = "";
            let calcPoints = 0;
            if (order.items && Array.isArray(order.items)) {
                itemsSummaryHtml += '<div class="summary-box">';
                order.items.forEach(it => {
                    const isReward = it.name.startsWith("🎁 PREMI VIP:");
                    const p = isReward ? 0 : ((it.points !== undefined) ? it.points : findItemPoints(it.name));
                    const qty = it.qty || 1;
                    const totalP = p * qty;
                    const qtyText = qty > 1 ? ` (x${qty})` : '';
                    const cleanItemName = it.name.replace(/\bgratis\b/gi, '').trim();

                    if (isReward) {
                        itemsSummaryHtml += `
                            <div class="summary-item done">
                                <span>✨ ${cleanItemName}</span>
                                <span class="summary-points-badge" style="background:rgba(0,255,136,0.15); color:var(--accent-green); border-color:rgba(0,255,136,0.3);">Premio VIP</span>
                            </div>`;
                    } else if (it.done === true) {
                        calcPoints += totalP;
                        itemsSummaryHtml += `
                            <div class="summary-item done">
                                <span>✔️ ${cleanItemName}${qtyText}</span>
                                <span class="summary-points-badge">+${totalP} pts</span>
                            </div>`;
                    } else {
                        itemsSummaryHtml += `
                            <div class="summary-item not-done">
                                <span>❌ ${cleanItemName}${qtyText} (Non fatto)</span>
                                <span class="summary-points-badge" style="background:rgba(255,71,87,0.15); color:var(--accent-red); border-color:rgba(255,71,87,0.3);">0 pts</span>
                            </div>`;
                    }
                });
                itemsSummaryHtml += `
                    <div class="order-total-earned">
                        <span>⚡ Punti Totali Guadagnati:</span>
                        <span style="color:var(--accent-yellow); font-size:1rem;">+${calcPoints} Punti VIP</span>
                    </div>
                `;
                itemsSummaryHtml += '</div>';
            }

            htmlArchive += `
                <div class="order-list-item archived">
                    <div class="order-header">
                        <span>👤 ${order.user} (${order.date || ''})</span>
                        <span class="order-time">${order.time}</span>
                    </div>
                    ${itemsSummaryHtml}
                    <span class="badge-archived">📁 Archiviato</span>
                </div>
            `;
        });
        archiveContainer.innerHTML = htmlArchive;
    }
}

function toggleArchiveVisibility() {
    const archiveSection = document.getElementById("archiveSection");
    const icon = document.getElementById("archiveToggleIcon");
    if (!archiveSection || !icon) return;

    if (archiveSection.style.display === "none") {
        archiveSection.style.display = "block";
        icon.innerText = "▲";
    } else {
        archiveSection.style.display = "none";
        icon.innerText = "▼";
    }
}

function openOrdinazioniSection() {
    updateAdminBadge();
    document.getElementById("tabsBar").style.display = "none";
    document.getElementById('orderBar').style.display = 'none';

    document.querySelectorAll('.container > .section-page').forEach(page => page.classList.remove('active'));
    document.getElementById('tab-admin').style.display = 'block';
    document.getElementById('tab-admin').classList.add('active');
    renderAdminUsersList();
    renderOrders();
}

function exitAdmin() {
    document.getElementById("tabsBar").style.display = "flex";
    document.getElementById('tab-admin').style.display = 'none';
    switchTab('venerdi', document.getElementById('tabBtnVenerdi'));
}
