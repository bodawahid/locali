const db = require('../../db');

async function ensureTable() {
    const sql = `
    CREATE TABLE IF NOT EXISTS scraped_data (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      source VARCHAR(64) NOT NULL,
      city VARCHAR(128),
      type VARCHAR(64),
      item_id VARCHAR(128),
      title TEXT,
      price VARCHAR(64),
      currency VARCHAR(16),
      details JSON,
      url TEXT,
      fetched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uniq_source_item (source, item_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `;
    await db.query(sql);
}

async function upsertItem(item) {
    // item: { source, city, type, item_id, title, price, currency, details, url }
    const sql = `
    INSERT INTO scraped_data (source, city, type, item_id, title, price, currency, details, url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      title = VALUES(title),
      price = VALUES(price),
      currency = VALUES(currency),
      details = VALUES(details),
      url = VALUES(url),
      fetched_at = CURRENT_TIMESTAMP
  `;
    const params = [
        item.source,
        item.city || null,
        item.type || null,
        item.item_id || null,
        item.title || null,
        item.price || null,
        item.currency || null,
        JSON.stringify(item.details || {}),
        item.url || null,
    ];
    return db.query(sql, params);
}

async function queryItems({ source, city, type, limit = 50 } = {}) {
    let sql = 'SELECT * FROM scraped_data WHERE 1=1';
    const params = [];
    if (source) {
        sql += ' AND source = ?';
        params.push(source);
    }
    if (city) {
        sql += ' AND city = ?';
        params.push(city);
    }
    if (type) {
        sql += ' AND type = ?';
        params.push(type);
    }
    sql += ' ORDER BY fetched_at DESC LIMIT ?';
    params.push(parseInt(limit, 10));
    return db.query(sql, params);
}

// Ensure table at module load
ensureTable().catch(err => console.error('Error ensuring scraped_data table:', err));

module.exports = {
    upsertItem,
    queryItems,
};