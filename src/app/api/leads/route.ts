import { NextResponse } from "next/server";

interface Lead {
    id: number;
    name: string;
    type: string;
    location: string;
    platform: string;
    website: string | null;
    status: string;
    phone: string | null;
    rating: number;
    reviews: number;
    email: string | null;
}

const EMAIL_REGEX = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;

// Blacklisted domains/patterns that are not real contact emails
const EMAIL_BLACKLIST = [
    "sentry.io", "wixpress.com", "example.com", "yoursite.com",
    "domain.com", "email.com", "user@", "noreply", "no-reply",
    "wordpress.org", "schema.org", "w3.org", "googleapis.com",
    "placeholder", "test@", "info@test", "@2x", "png", "jpg", "svg", "gif",
];

function isValidEmail(email: string): boolean {
    const lower = email.toLowerCase();
    return !EMAIL_BLACKLIST.some((bad) => lower.includes(bad));
}

async function extractEmailFromWebsite(website: string): Promise<string | null> {
    try {
        const url = website.startsWith("http") ? website : `https://${website}`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const res = await fetch(url, {
            signal: controller.signal,
            headers: { "User-Agent": "Mozilla/5.0 (compatible; LeadFinderBot/1.0)" },
        });
        clearTimeout(timeout);

        if (!res.ok) return null;
        const html = await res.text();

        // Also try /contact page
        const emails = html.match(EMAIL_REGEX) || [];
        const valid = emails.filter(isValidEmail);
        if (valid.length > 0) return valid[0];

        // Try contact page
        try {
            const contactController = new AbortController();
            const contactTimeout = setTimeout(() => contactController.abort(), 4000);
            const contactUrl = url.replace(/\/$/, "") + "/contact";
            const contactRes = await fetch(contactUrl, {
                signal: contactController.signal,
                headers: { "User-Agent": "Mozilla/5.0 (compatible; LeadFinderBot/1.0)" },
            });
            clearTimeout(contactTimeout);
            if (contactRes.ok) {
                const contactHtml = await contactRes.text();
                const contactEmails = contactHtml.match(EMAIL_REGEX) || [];
                const validContact = contactEmails.filter(isValidEmail);
                if (validContact.length > 0) return validContact[0];
            }
        } catch {
            // ignore contact page errors
        }
    } catch {
        // ignore fetch errors
    }
    return null;
}

async function searchEmailViaSerper(businessName: string, location: string, apiKey: string): Promise<string | null> {
    try {
        const query = `"${businessName}" "${location}" email contact`;
        const res = await fetch("https://google.serper.dev/search", {
            method: "POST",
            headers: {
                "X-API-KEY": apiKey,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ q: query, num: 3 }),
        });
        if (!res.ok) return null;
        const data = await res.json();

        // Extract emails from snippets and titles
        const text = JSON.stringify(data.organic || []);
        const emails = text.match(EMAIL_REGEX) || [];
        const valid = emails.filter(isValidEmail);
        return valid.length > 0 ? valid[0] : null;
    } catch {
        return null;
    }
}

export async function POST(req: Request) {
    try {
        const { keyword, location, platform } = await req.json();

        if (!process.env.SERPER_API_KEY) {
            return NextResponse.json(
                { error: "Missing SERPER_API_KEY in server environment" },
                { status: 500 }
            );
        }

        const query = `${keyword} ${platform === "all" ? "" : platform} in ${location}`;

        // Serper /places hard-limits to 10 results per request.
        // Fetch page 1 and page 2 in parallel to get up to 20 results.
        const fetchPage = async (page: number) => {
            const res = await fetch("https://google.serper.dev/places", {
                method: "POST",
                headers: {
                    "X-API-KEY": process.env.SERPER_API_KEY!,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    q: query,
                    location: location || undefined,
                    page,
                }),
            });
            if (!res.ok) return [];
            const json = await res.json();
            return json.places || [];
        };

        const [page1, page2] = await Promise.all([fetchPage(1), fetchPage(2)]);

        // Merge and deduplicate by business name
        const seen = new Set<string>();
        const places = [...page1, ...page2].filter((p: any) => {
            if (seen.has(p.title)) return false;
            seen.add(p.title);
            return true;
        });

        // Extract emails in parallel (with concurrency limit)
        const CONCURRENCY = 5;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const leadsRaw: Lead[] = places.map((place: any, index: number) => ({
            id: index + 1,
            name: place.title,
            type: place.category,
            location: place.address,
            platform: "Google Maps",
            website: place.website || null,
            status: !place.website ? "No Website" : "Good",
            phone: place.phoneNumber || null,
            rating: place.rating,
            reviews: place.userRatingsTotal,
            email: null as string | null,
        }));

        // Process in batches to respect concurrency
        for (let i = 0; i < leadsRaw.length; i += CONCURRENCY) {
            const batch = leadsRaw.slice(i, i + CONCURRENCY);
            await Promise.all(
                batch.map(async (lead) => {
                    if (lead.website) {
                        lead.email = await extractEmailFromWebsite(lead.website);
                    }
                    // If no email found from website, try Serper search
                    if (!lead.email) {
                        lead.email = await searchEmailViaSerper(
                            lead.name,
                            lead.location || "",
                            process.env.SERPER_API_KEY!
                        );
                    }
                })
            );
        }

        return NextResponse.json({ leads: leadsRaw });
    } catch (error) {
        console.error("API Route error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
