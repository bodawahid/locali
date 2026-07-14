/**
 * Telegram Client API config — server-side only.
 * Full group message sync requires phone auth + TDLib/GramJS session (future).
 * Credentials from my.telegram.org — store in backend/.env, NOT in frontend.
 */
const TELEGRAM_APP_ID = parseInt(process.env.TELEGRAM_APP_ID || '0', 10);
const TELEGRAM_APP_HASH = process.env.TELEGRAM_APP_HASH || '';

const MONITORED_GROUPS = [
    'SharmExpats',
    'Sharm_el_Sheikh_live',
    'dahabchat',
    'idakvam_egypt',
    'HurghadaChat1',
];

function getTelegramConfig() {
    return {
        configured: Boolean(TELEGRAM_APP_ID && TELEGRAM_APP_HASH),
        appId: TELEGRAM_APP_ID || null,
        groups: MONITORED_GROUPS,
        note: 'Live Telegram feed requires authenticated server session. Community links are injected as static context for LOKI.',
    };
}

module.exports = { getTelegramConfig, MONITORED_GROUPS };