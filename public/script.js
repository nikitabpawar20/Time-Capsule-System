// DOM Elements
const showComposeBtn = document.getElementById("showComposeBtn");
const showInboxBtn = document.getElementById("showInboxBtn");
const backToCompose = document.getElementById("backToCompose");
const inboxBadge = document.getElementById("inboxBadge");

const composeForm = document.getElementById("composeForm");
const inboxSection = document.getElementById("inboxSection");
const deliveredList = document.getElementById("deliveredList");

const pageTitle = document.getElementById("pageTitle");
const pageDesc = document.getElementById("pageDesc");

// --- Global Variable to track seen messages ---
let lastSeenCount = 0; 

// --- 1. Toggle Logic ---

function openCompose() {
    composeForm.style.display = "block";
    inboxSection.style.display = "none";
    showComposeBtn.classList.add("active");
    showInboxBtn.classList.remove("active");
    pageTitle.textContent = "Dashboard";
    pageDesc.textContent = "Send messages to your future self.";
    
    // Wapas aane par check karo ki kuch naya toh nahi aaya
    checkNewMessages();
}

async function openInbox() {
    composeForm.style.display = "none";
    inboxSection.style.display = "block";
    showInboxBtn.classList.add("active");
    showComposeBtn.classList.remove("active");
    pageTitle.textContent = "Inbox";
    pageDesc.textContent = "Your unlocked memories and messages.";
    
    // 1. Badge turant chhupao
    inboxBadge.style.display = "none";
    
    // 2. Messages load karo aur count update karo
    const messages = await loadDeliveredMessages();
    if (messages) {
        lastSeenCount = messages.length; // Ab browser ko pata hai humne ye dekh liye hain
    }
}

showComposeBtn.addEventListener("click", openCompose);
showInboxBtn.addEventListener("click", openInbox);
backToCompose.addEventListener("click", openCompose);

// --- 2. Notification Badge Logic (Smart Version) ---

async function checkNewMessages() {
    try {
        // Agar user pehle se Inbox dekh raha hai, toh badge dikhane ka sawal hi nahi banta
        if (inboxSection.style.display === "block") {
            inboxBadge.style.display = "none";
            return; 
        }

        const res = await fetch("/messages/delivered");
        const messages = await res.json();
        const currentCount = messages.length;
        
        // Badge sirf tab dikhao jab:
        // 1. User Compose page par ho
        // 2. Database mein messages 'lastSeenCount' se zyada ho gaye hon
        if (currentCount > lastSeenCount && composeForm.style.display === "block") {
            inboxBadge.textContent = currentCount - lastSeenCount; // Sirf naye messages ka count
            inboxBadge.style.display = "block";
        } else {
            inboxBadge.style.display = "none";
        }
    } catch (err) {
        console.log("Notification sync failed.");
    }
}

setInterval(checkNewMessages, 5000);

// --- 3. Load Delivered Messages ---

async function loadDeliveredMessages() {
    try {
        const res = await fetch("/messages/delivered");
        const messages = await res.json();
        
        if (!messages || messages.length === 0) {
            deliveredList.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-envelope-open"></i>
                    <p>Your future messages will appear here once they unlock.</p>
                </div>`;
            return [];
        }

        deliveredList.innerHTML = messages.map(msg => `
            <div class="message-item">
                <div class="meta">
                    <span class="recipient"><i class="fa-solid fa-user-tag"></i> ${msg.recipient_name}</span>
                    <span class="time"><i class="fa-solid fa-clock"></i> ${new Date(msg.deliver_at).toLocaleString()}</span>
                </div>
                <div class="content">${msg.message}</div>
            </div>
        `).join('');

        return messages; // Returning array to update lastSeenCount

    } catch (err) {
        console.error("Error loading messages:", err);
        deliveredList.innerHTML = `<p style="padding:20px; color:red; text-align:center;">Failed to load messages.</p>`;
        return [];
    }
}

// --- 4. Send Message Function ---

async function sendMessage() {
    const recipient = document.getElementById("recipient_name").value.trim();
    const message = document.getElementById("message").value.trim();
    const deliverAt = document.getElementById("deliverAt").value;
    const sendBtn = document.getElementById("scheduleBtn");

    if (!recipient || !message || !deliverAt) {
        showStatus("⚠ Please fill all fields.", "#f59e0b");
        return;
    }

    try {
        sendBtn.disabled = true;
        sendBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Scheduling...';

        const res = await fetch("/messages/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ recipient_name: recipient, message, deliver_at: deliverAt })
        });

        if (res.ok) {
            showStatus("✅ Message scheduled successfully!", "#10b981");
            resetForm();
            setTimeout(openInbox, 1500); 
        } else {
            showStatus("❌ Failed to send", "#ef4444");
        }
    } catch (err) {
        showStatus("❌ Server error.", "#ef4444");
    } finally {
        sendBtn.disabled = false;
        sendBtn.innerHTML = '<span>Schedule Delivery</span> <i class="fa-solid fa-rocket"></i>';
    }
}

function showStatus(text, color) {
    const status = document.getElementById("status");
    status.textContent = text;
    status.style.color = color;
    setTimeout(() => { status.textContent = ""; }, 5000);
}

function resetForm() {
    document.getElementById("recipient_name").value = "";
    document.getElementById("message").value = "";
    document.getElementById("deliverAt").value = "";
}

// Initial State
document.addEventListener("DOMContentLoaded", async () => {
    // Shuruat mein ek baar fetch karke count set kar lo taaki purane messages ka badge na dikhe
    const res = await fetch("/messages/delivered");
    const initialMessages = await res.json();
    lastSeenCount = initialMessages.length;
    
    openCompose();
});