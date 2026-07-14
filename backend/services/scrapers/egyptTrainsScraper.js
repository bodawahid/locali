const scrapedData = require('./scrapedDataService');

function makeGoogleMapsDirectionLink(from, to) {
    const o = encodeURIComponent(from || 'Egypt');
    const d = encodeURIComponent(to || 'Cairo');
    return `https://www.google.com/maps/dir/?api=1&origin=${o}&destination=${d}&travelmode=transit`;
}

function makeMinistryLink(from, to) {
    // Fallback to a Google search pointing to ministry resources
    const q = encodeURIComponent(`${from || ''} to ${to || ''} Egypt train timetable`);
    return `https://www.google.com/search?q=${q}`;
}

async function generateTrainLinks({ from, to }) {
    const google = makeGoogleMapsDirectionLink(from, to);
    const ministry = makeMinistryLink(from, to);

    // Store a quick reference in DB
    try {
        await scrapedData.upsertItem({
            source: 'egypt_trains_link',
            city: from || null,
            type: 'trains',
            item_id: `trains:${from || ''}:${to || ''}`,
            title: `Train links ${from || ''} → ${to || ''}`,
            details: { google, ministry },
            url: google,
        });
    } catch (err) {
        console.error('Failed to store train links', err);
    }

    return { google, ministry };
}

module.exports = { generateTrainLinks };