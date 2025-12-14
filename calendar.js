// ★★★ CONFIGURATION — REPLACE THESE ★★★
const API_KEY = "AIzaSyBwjQrcIu6rtRTH9eH1WFedLBBwhPumRL8"; // Your Google Cloud API Key
const CALENDAR_ID = "55319adb44ec2783481a05dc58524b4b2bfebe68533fc2a5b63e9e0aea74484a@group.calendar.google.com"; // Your public Google Calendar ID

// Element where events will be displayed
const eventsEl = document.getElementById("events");

// Fetch upcoming events from Google Calendar API
async function fetchEvents() {
    const now = new Date().toISOString();
    const url =
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events` +
        `?key=${API_KEY}` +
        `&timeMin=${encodeURIComponent(now)}` +
        `&singleEvents=true` +
        `&orderBy=startTime` +
        `&maxResults=25`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status} - ${res.statusText}`);

        const data = await res.json();
        renderEvents(data.items || []);

    } catch (err) {
        eventsEl.innerHTML = `<p style="color:red">Error loading events: ${err.message}</p>`;
        console.error(err);
    }
}

// Render events into the page
function renderEvents(events) {
    if (!events.length) {
        eventsEl.innerHTML = "<p>No upcoming events.</p>";
        return;
    }

    eventsEl.innerHTML = events
        .map(event => {
            const start = event.start.dateTime || event.start.date || '';
            const date = new Date(start);
            const pretty = isNaN(date) ? start : date.toLocaleString();

            return `
                <div class="event">
                    <strong>${event.summary || "(no title)"}</strong>
                    <div class="time">${pretty}</div>
                    ${event.location ? `<div>${event.location}</div>` : ""}
                    ${event.description ? `<div>${event.description}</div>` : ""}
                </div>
            `;
        })
        .join("");
}

// Initialize
fetchEvents();
