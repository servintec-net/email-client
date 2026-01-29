import {
    AVATAR_COLORS,
} from "./constants";

export const getAvatarColor = (name) => {
    if (!name) return AVATAR_COLORS[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

export const hashStringToInt = (str = "") => {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
};

export const getAvatarGradient = (name = "") => {
    const s = (name || "").trim().toLowerCase();
    const h = hashStringToInt(s);
    const hue1 = (h % 360 + 180) % 360;
    const hue2 = (hue1 + 50) % 360;

    const c1 = `hsl(${hue1} 64% 74%)`;
    const c2 = `hsl(${hue2} 62% 68%)`;

    return `linear-gradient(135deg, ${c1}, ${c2})`;
};

export const getInitials = (sender) => {
    if (!sender?.name) return "?";
    const parts = sender.name.split(" ");
    return parts.length > 1
        ? parts[0][0] + parts[1][0]
        : parts[0][0];
};

/** Initials from a display name (e.g. username "JohnDoe" -> "JD") */
export const getInitialsFromName = (name) => {
    if (!name || typeof name !== "string") return "?";
    const s = name.trim();
    if (!s) return "?";
    if (s.length === 1) return s[0].toUpperCase();
    return (s[0] + s[s.length - 1]).toUpperCase();
};

/** For connected mailbox UI: no cache → email only; cache → "Name <email>". */
export const getMailboxDisplayLabel = (mailbox, displayNamesCache) => {
    const email = mailbox?.mailbox_email || "";
    if (!email) return "";
    const name = displayNamesCache && displayNamesCache[mailbox.id];
    if (name) return `${name} <${email}>`;
    return email;
};

export const getSenderLabel = (msg, userEmail) => {
    const sender = msg?.from?.emailAddress;
    if (!sender) return "Sender";

    if (sender.address?.toLowerCase() === userEmail?.toLowerCase()) {
        return "You";
    }

    return sender.name || sender.address || "Sender";
};

export const getTimeLabel = (isoDate) => {
    if (!isoDate) return "";

    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now - date;

    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;

    if (diffMs < minute) return "Just now";
    if (diffMs < hour) return `${Math.floor(diffMs / minute)}m ago`;
    if (diffMs < day) return `${Math.floor(diffMs / hour)}h ago`;
    if (diffMs < 7 * day)
        return date.toLocaleString("en-US", {
            weekday: "short",
            hour: "numeric",
            minute: "2-digit",
        });

    return date.toLocaleDateString("en-US");
};

export const formatFullDateTime = (isoDate) => {
    try {
        return new Date(isoDate).toLocaleString();
    } catch {
        return "";
    }
};

export const trimQuotedHtml = (html) => {
    if (!html) return "";

    const doc = new DOMParser().parseFromString(html, "text/html");
    const body = doc.body;

    // Collect candidate "quote/history" start nodes
    const candidates = [];

    const pushAll = (selector) => {
        body.querySelectorAll(selector).forEach((el) => candidates.push(el));
    };

    // Common containers
    pushAll("blockquote");                       // Gmail / generic / Apple Mail cites
    pushAll("blockquote[type='cite']");
    pushAll("div.gmail_quote, div[class*='gmail_quote']");
    pushAll("div.gmail_extra");
    pushAll("div[style*='border-left']");        // Outlook inline quote style
    pushAll("#divRplyFwdMsg, div[id*='divRplyFwdMsg']"); // Outlook reply/forward wrapper (often present)
    pushAll(".OutlookMessageHeader");            // Some Outlook variants

    // HR is noisy; only treat it as a cut if the text right after looks like a header
    body.querySelectorAll("hr").forEach((hr) => {
        const nextText =
            (hr.nextSibling?.textContent || "") +
            " " +
            (hr.nextElementSibling?.textContent || "");
        if (/(-----\s*Original Message\s*-----|^\s*From:\s|^\s*Sent:\s|^\s*To:\s|^\s*Subject:\s|On .+wrote:)/im.test(nextText)) {
            candidates.push(hr);
        }
    });

    // Text-based reply separators (covers many Outlook/plain-text replies embedded in HTML)
    const headerRegex =
        /(-----\s*Original Message\s*-----|-----\s*Forwarded message\s*-----|^\s*From:\s|^\s*Sent:\s|^\s*To:\s|^\s*Subject:\s|On .+wrote:)/im;

    // Scan typical block elements for header patterns
    body.querySelectorAll("div,p,td,section").forEach((el) => {
        const text = (el.textContent || "").replace(/\u00a0/g, " ").trim();
        if (!text) return;
        if (headerRegex.test(text)) candidates.push(el);
    });

    // No history detected → return full
    if (!candidates.length) return body.innerHTML.trim();

    // Pick the earliest node in document order
    let cutNode = candidates[0];
    for (const n of candidates.slice(1)) {
        if (cutNode === n) continue;
        // If n is before cutNode, replace
        if (cutNode.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_PRECEDING) {
            cutNode = n;
        }
    }

    // Use Range so nested cutNode still works (keeps everything before cutNode)
    const range = doc.createRange();
    range.setStart(body, 0);
    range.setEndBefore(cutNode);

    const frag = range.cloneContents();
    const wrapper = doc.createElement("div");
    wrapper.appendChild(frag);

    // Optional: trim trailing empty space / <br> spam
    const out = wrapper.innerHTML
        .replace(/(?:\s|&nbsp;|<br\s*\/?>|<div>\s*<\/div>)+$/gi, "")
        .trim();

    return out;
};

export const formatBytes = (bytes = 0) => {
    const b = Number(bytes) || 0;
    if (b < 1024) return `${b} B`;
    const kb = b / 1024;
    if (kb < 1024) return `${kb.toFixed(kb < 10 ? 1 : 0)} KB`;
    const mb = kb / 1024;
    if (mb < 1024) return `${mb.toFixed(mb < 10 ? 1 : 0)} MB`;
    const gb = mb / 1024;
    return `${gb.toFixed(gb < 10 ? 1 : 0)} GB`;
};

export function getFileMeta(ext, contentType) {
    const e = (ext || "").toLowerCase();

    // images
    if (["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg"].includes(e))
        return { label: e.toUpperCase(), icon: "🖼️" };

    // pdf
    if (e === "pdf" || contentType === "application/pdf") return { label: "PDF", icon: "📄" };

    // office docs
    if (["doc", "docx"].includes(e)) return { label: e.toUpperCase(), icon: "📝" };
    if (["xls", "xlsx", "csv"].includes(e)) return { label: e.toUpperCase(), icon: "📊" };
    if (["ppt", "pptx"].includes(e)) return { label: e.toUpperCase(), icon: "📽️" };

    // code/text
    if (["txt", "md", "log", "json", "xml", "yaml", "yml"].includes(e))
        return { label: e.toUpperCase(), icon: "📃" };

    // archives
    if (["zip", "rar", "7z", "tar", "gz"].includes(e)) return { label: e.toUpperCase(), icon: "🗜️" };

    // fallback
    if (e) return { label: e.toUpperCase(), icon: "📎" };
    return { label: "FILE", icon: "📎" };
}

export function flattenFolderTree(tree, prefix = "") {
    const out = [];
    for (const [name, child] of Object.entries(tree || {})) {
        const path = prefix ? `${prefix} > ${name}` : name;
        out.push(path);
        if (child && typeof child === "object") out.push(...flattenFolderTree(child, path));
    }
    return out;
}