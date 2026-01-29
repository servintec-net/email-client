export const API_BASE = "http://localhost:4000";
export const WS_BASE = (() => {
    try {
        const u = new URL(API_BASE);
        return (u.protocol === "https:" ? "wss:" : "ws:") + "//" + u.host;
    } catch {
        return "ws://localhost:4000";
    }
})();

export const AVATAR_COLORS = [
    "#FF5722", "#3F51B5", "#009688",
    "#9C27B0", "#2196F3", "#FF9800",
    "#4CAF50", "#E91E63", "#795548"
];

export const FOLDER_TREE = {
    "Inbox": {
        "Applications": {
            "Job Alerts": null,
            "Applied Confirmation": null,
            "Recruiter Outreach": null,
            "On Hold": null,
            "Rejected": null
        },
        "Interviews": {
            "Interview Request": {
                "HR Screening": null,
                "Technical": null,
                "Behavioral": null,
                "Take Home": null,
                "Coding Challenge": null,
                "System Design": null,
                "Final": null
            },
            "Interview Scheduled": null
        },
        "Offer": {
            "Background Check": null,
            "Offer Accepted": null,
            "Onboarding": null,
            "Offer Declined": null
        },
        "Docs Requested": null,
        "System Noise": null,
        "Personal": null
    }
};

export const ICON_BY_NAME = {
    // roots
    inbox: "inbox",
    applications: "work_outline",
    interviews: "event_available",
    offer: "local_offer",
    "docs requested": "description",
    "system noise": "notifications_off",
    personal: "person",

    // Applications children
    "job alerts": "notifications",
    "applied confirmation": "task_alt",
    "recruiter outreach": "person_search",
    "on hold": "pause_circle",
    rejected: "highlight_off",

    // Interviews children
    "interview request": "mark_email_unread",
    "interview scheduled": "calendar_month",

    // Interview Request subfolders
    "hr screening": "support_agent",
    technical: "code",
    behavioral: "psychology",
    "take home": "home_work",
    "coding challenge": "quiz",
    "system design": "account_tree",
    final: "flag",

    // Offer children
    "background check": "fact_check",
    "offer accepted": "done_all",
    onboarding: "school",
    "offer declined": "do_not_disturb_on",
};

// Available labels for the Labels tab (category strings must match categorizer output)
export const LABELS_CONFIG = {
    jobBoards: [
        { display: "LinkedIn", category: "JobBoard: LinkedIn" },
        { display: "Indeed", category: "JobBoard: Indeed" },
        { display: "Dice", category: "JobBoard: Dice" },
        { display: "Glassdoor", category: "JobBoard: Glassdoor" },
        { display: "Simplyhired", category: "JobBoard: Simplyhired" },
        { display: "Greenhouse", category: "JobBoard: Greenhouse" },
        { display: "Lever", category: "JobBoard: Lever" },
        { display: "Workday", category: "JobBoard: Workday" },
        { display: "Ashby", category: "JobBoard: Ashby" },
        { display: "AngelList-Wellfound", category: "JobBoard: AngelList-Wellfound" },
        { display: "Direct Recruiter", category: "JobBoard: Direct Recruiter" },
        { display: "Other", category: "JobBoard: Other Job Board" },
    ],
    roles: [
        { display: "Software Engineer", category: "Role: Software Engineer" },
        { display: "Full Stack Engineer", category: "Role: Full Stack Engineer" },
        { display: "Backend Engineer", category: "Role: Backend Engineer" },
        { display: "Frontend Engineer", category: "Role: Frontend Engineer" },
        { display: "AI/ML Engineer", category: "Role: AI/ML Engineer" },
        { display: "Platform/Infra Engineer", category: "Role: Platform/Infra Engineer" },
        { display: "Data Engineer", category: "Role: Data Engineer" },
        { display: "Manager", category: "Role: Manager" },
        { display: "Other", category: "Role: Other" },
    ],
};
