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
        return `You (${sender.name || sender.address || "Me"})`;
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

/** Find the earliest "quote/history" start node in parsed body, or null if none. */
function findQuoteStartNode(body) {
    const candidates = [];

    const pushAll = (selector) => {
        body.querySelectorAll(selector).forEach((el) => candidates.push(el));
    };

    pushAll("blockquote");
    pushAll("blockquote[type='cite']");
    pushAll("div.gmail_quote, div[class*='gmail_quote']");
    pushAll("div.gmail_extra");
    pushAll("div[style*='border-left']");
    pushAll("#divRplyFwdMsg, div[id*='divRplyFwdMsg']");
    pushAll(".OutlookMessageHeader");

    body.querySelectorAll("hr").forEach((hr) => {
        const nextText =
            (hr.nextSibling?.textContent || "") +
            " " +
            (hr.nextElementSibling?.textContent || "");
        if (/(-----\s*Original Message\s*-----|^\s*From:\s|^\s*Sent:\s|^\s*To:\s|^\s*Subject:\s|On .+wrote:)/im.test(nextText)) {
            candidates.push(hr);
        }
    });

    const headerRegex =
        /(-----\s*Original Message\s*-----|-----\s*Forwarded message\s*-----|^\s*From:\s|^\s*Sent:\s|^\s*To:\s|^\s*Subject:\s|On .+wrote:)/im;

    body.querySelectorAll("div,p,td,section").forEach((el) => {
        const text = (el.textContent || "").replace(/\u00a0/g, " ").trim();
        if (!text) return;
        if (headerRegex.test(text)) candidates.push(el);
    });

    if (!candidates.length) return null;

    let cutNode = candidates[0];
    for (const n of candidates.slice(1)) {
        if (cutNode === n) continue;
        if (cutNode.compareDocumentPosition(n) & Node.DOCUMENT_POSITION_PRECEDING) {
            cutNode = n;
        }
    }
    return cutNode;
}

/** Returns { main, history }: main = content before quote, history = quoted part (or empty). */
export function getQuotedHtmlParts(html) {
    if (!html) return { main: "", history: "" };

    const doc = new DOMParser().parseFromString(html, "text/html");
    const body = doc.body;
    const cutNode = findQuoteStartNode(body);

    if (!cutNode) {
        const full = body.innerHTML.trim();
        return { main: full, history: "" };
    }

    const range = doc.createRange();
    range.setStart(body, 0);
    range.setEndBefore(cutNode);
    const mainFrag = range.cloneContents();
    const mainWrapper = doc.createElement("div");
    mainWrapper.appendChild(mainFrag);
    const main = mainWrapper.innerHTML
        .replace(/(?:\s|&nbsp;|<br\s*\/?>|<div>\s*<\/div>)+$/gi, "")
        .trim();

    range.setStartBefore(cutNode);
    range.setEndAfter(body);
    const historyFrag = range.cloneContents();
    const historyWrapper = doc.createElement("div");
    historyWrapper.appendChild(historyFrag);
    const history = historyWrapper.innerHTML.trim();

    return { main, history };
}

export const trimQuotedHtml = (html) => {
    const { main } = getQuotedHtmlParts(html || "");
    return main;
};

/** Trim plain-text preview to main content only (no quoted/history portion). */
export function trimQuotedText(text) {
    const { main } = getQuotedTextParts(text || "");
    return main;
}

// Match quote/history start with or without leading newline (bodyPreview is often one line)
// Order doesn't matter — we take the earliest match. Include separators (underscores, long dashes) first.
const QUOTED_TEXT_PATTERNS = [
    // Separator lines: underscores or long dashes (common in forwarded/reply headers)
    /\s*_{3,}/,   // optional space + 3+ underscores (catches "text___" or "text ___")
    /\s+_{3,}/,   // space + 3+ underscores
    /\s*-{5,}\s*/,
    /\s+-{5,}\s*/,
    // Standard reply/forward headers
    /\s+-----\s*Original Message\s*-----/i,
    /\s+-----\s*Forwarded message\s*-----/i,
    /\s+On\s+.+wrote:\s*$/im,
    /\s+On\s+\d{1,2}\/\d{1,2}\/\d{2,4}.+wrote:/im,
    /\s+From:\s+/im,
    /\s+Sent:\s+/im,
    /\s+To:\s+/im,
    /\s+Subject:\s+/im,
    /\s+<?[^\s@]+@[^\s>]+>\s*wrote:\s*$/im,
];

/** Returns { main, history } for plain text (main = before quote, history = rest). */
export function getQuotedTextParts(text) {
    if (!text || typeof text !== "string") return { main: "", history: "" };
    const t = text.trim();
    let earliest = t.length;
    for (const re of QUOTED_TEXT_PATTERNS) {
        const match = t.match(re);
        if (match && match.index !== undefined && match.index < earliest) {
            earliest = match.index;
        }
    }
    if (earliest < t.length) {
        let main = t.slice(0, earliest).trim();
        const history = t.slice(earliest).trim();
        // Strip any trailing separator line (underscores, long dashes) that leaked into main
        main = main.replace(/\s*[-_]{3,}\s*$/, "").trim();
        return { main, history };
    }
    return { main: t, history: "" };
}

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