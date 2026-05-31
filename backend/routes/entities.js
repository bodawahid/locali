const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const { query } = require('../db');
const { authenticate, getToken } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

const ENTITY_ALIASES = {
  "priceguide": "price_entries",
  "price_guides": "price_entries",
  "homecontent": "home_contents",
  "home_contents": "home_contents"
};

function toSnakeCase(value) {
  return value.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
}

function pluralize(value) {
  if (value.endsWith('y') && !/[aeiou]y$/.test(value)) return value.slice(0, -1) + 'ies';
  if (value.endsWith('s')) return value;
  return `${value}s`;
}

function normalizeEntityName(name) {
  if (!name) return name;
  const normalized = name.replace(/-/g, '_').toLowerCase();
  return ENTITY_ALIASES[normalized] || normalized;
}

function loadEntities() {
  const entitiesDir = path.join(__dirname, '../../entities');
  const rawFiles = fs.readdirSync(entitiesDir);
  const entities = {};

  rawFiles.forEach((fileName) => {
    const filePath = path.join(entitiesDir, fileName);
    if (!fs.statSync(filePath).isFile()) return;

    const fileText = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(fileText);
    const name = data.name || path.parse(fileName).name;
    const normalizedName = name.replace(/-/g, '_');
    const routeName = normalizedName === 'PriceGuide' ? 'price_entries' : pluralize(toSnakeCase(normalizedName));

    const properties = Object.keys(data.properties || {});
    const columns = Array.from(new Set([...(entities[routeName]?.columns || []), ...properties]));
    if (!columns.includes('created_at')) columns.push('created_at');
    if (!columns.includes('updated_at')) columns.push('updated_at');

    entities[routeName] = {
      table: routeName,
      columns,
      defaultSort: columns.includes('created_at') ? 'created_at desc' : 'updated_at desc',
    };
  });

  return entities;
}

const ENTITIES = loadEntities();

function sanitizeSort(sortParam, allowedColumns, defaultSort) {
  if (!sortParam) return defaultSort;

  const direction = sortParam.startsWith('-') ? 'DESC' : 'ASC';
  const fieldName = sortParam.startsWith('-') ? sortParam.slice(1) : sortParam;
  const normalized = fieldName === 'created_date' ? 'created_at'
    : fieldName === 'updated_date' ? 'updated_at'
    : fieldName === 'createdAt' ? 'created_at'
    : fieldName === 'updatedAt' ? 'updated_at'
    : fieldName;

  if (!allowedColumns.includes(normalized)) return defaultSort;
  return `\`${normalized}\` ${direction}`;
}

function buildFilters(query, allowedColumns) {
  const conditions = [];
  const values = [];

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || ['sort', 'page', 'limit'].includes(key)) return;
    const normalized = key === 'created_date' ? 'created_at' : key === 'updated_date' ? 'updated_at' : key;
    if (allowedColumns.includes(normalized)) {
      conditions.push(`\`${normalized}\` = ?`);
      values.push(value);
    }
  });

  return { clause: conditions.length ? `WHERE ${conditions.join(' AND ')}` : '', values };
}

async function getOptionalUser(req) {
  const token = getToken(req);
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const rows = await query('SELECT id, name, email, role FROM users WHERE id = ? LIMIT 1', [decoded.userId]);
    return rows[0] || null;
  } catch (err) {
    return null;
  }
}

function normalizeValue(value) {
  if (Array.isArray(value) || (value && typeof value === 'object')) {
    return JSON.stringify(value);
  }
  return value;
}

router.get('/:entity', async (req, res) => {
  try {
    const entityName = normalizeEntityName(req.params.entity);
    const entity = ENTITIES[entityName];
    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }

    const limit = Math.min(parseInt(req.query.limit || '100', 10), 500);
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const offset = (page - 1) * limit;
    const sort = sanitizeSort(req.query.sort, entity.columns, entity.defaultSort);
    const { clause, values } = buildFilters(req.query, entity.columns);

    const rows = await query(`SELECT * FROM \`${entity.table}\` ${clause} ORDER BY ${sort} LIMIT ? OFFSET ?`, [...values, limit, offset]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch entity records.' });
  }
});

router.get('/:entity/:id', async (req, res) => {
  try {
    const entityName = normalizeEntityName(req.params.entity);
    const entity = ENTITIES[entityName];
    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }

    const rows = await query(`SELECT * FROM \`${entity.table}\` WHERE id = ? LIMIT 1`, [req.params.id]);
    if (!rows.length) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch record.' });
  }
});

router.post('/:entity', async (req, res) => {
  try {
    const entityName = normalizeEntityName(req.params.entity);
    const entity = ENTITIES[entityName];
    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }

    const user = await getOptionalUser(req);
    const payload = req.body || {};
    const fields = Object.keys(payload).filter((field) => entity.columns.includes(field) && field !== 'id' && field !== 'created_by' && field !== 'updated_by');
    const values = fields.map((field) => normalizeValue(payload[field]));

    if (entity.columns.includes('created_by') && user) {
      fields.push('created_by');
      values.push(user.id);
    }

    if (entity.columns.includes('updated_by') && user) {
      fields.push('updated_by');
      values.push(user.id);
    }

    if (!fields.length) {
      return res.status(400).json({ error: 'No valid fields provided.' });
    }

    const placeholders = fields.map(() => '?').join(', ');
    const result = await query(`INSERT INTO \`${entity.table}\` (${fields.map((field) => `\`${field}\``).join(', ')}) VALUES (${placeholders})`, values);

    const created = await query(`SELECT * FROM \`${entity.table}\` WHERE id = ? LIMIT 1`, [result.insertId]);
    res.status(201).json(created[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not create record.' });
  }
});

router.put('/:entity/:id', authenticate, async (req, res) => {
  try {
    const entityName = normalizeEntityName(req.params.entity);
    const entity = ENTITIES[entityName];
    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }

    const payload = req.body || {};
    const fields = Object.keys(payload).filter((field) => entity.columns.includes(field) && field !== 'id' && field !== 'created_by');
    const values = fields.map((field) => normalizeValue(payload[field]));

    if (entity.columns.includes('updated_by')) {
      fields.push('updated_by');
      values.push(req.user.id);
    }

    if (!fields.length) {
      return res.status(400).json({ error: 'No valid fields provided.' });
    }

    const setClause = fields.map((field) => `\`${field}\` = ?`).join(', ');
    values.push(req.params.id);

    await query(`UPDATE \`${entity.table}\` SET ${setClause} WHERE id = ?`, values);
    const updated = await query(`SELECT * FROM \`${entity.table}\` WHERE id = ? LIMIT 1`, [req.params.id]);
    res.json(updated[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not update record.' });
  }
});

router.delete('/:entity/:id', authenticate, async (req, res) => {
  try {
    const entityName = normalizeEntityName(req.params.entity);
    const entity = ENTITIES[entityName];
    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }

    await query(`DELETE FROM \`${entity.table}\` WHERE id = ?`, [req.params.id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not delete record.' });
  }
});

module.exports = router;
