<?php
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOriginsEnv = getenv('ALLOWED_ORIGINS') ?: 'http://localhost:5173,http://127.0.0.1:5173';
$allowedOrigins = array_values(array_filter(array_map('trim', explode(',', $allowedOriginsEnv))));
$defaultOrigin = $allowedOrigins[0] ?? 'http://localhost:5173';
$allowOrigin = in_array($origin, $allowedOrigins, true) ? $origin : $defaultOrigin;

header("Access-Control-Allow-Origin: " . $allowOrigin);
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");
header("Vary: Origin");

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    exit(0);
}

$host = getenv('DB_HOST') ?: "localhost";
$user = getenv('DB_USER') ?: "root";
$password = getenv('DB_PASSWORD') ?: "";
$database = getenv('DB_NAME') ?: "locali_egypt";

$conn = new mysqli($host, $user, $password, $database);
if ($conn->connect_error) {
    http_response_code(500);
    die(json_encode(["error" => "Database connection failed"], JSON_UNESCAPED_UNICODE));
}
$conn->set_charset("utf8mb4");

function respond($data, $status = 200)
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function bindParams($stmt, $types, $params)
{
    if (!$params) return;
    $bind = [$types];
    foreach ($params as $k => $v) {
        $bind[] = &$params[$k];
    }
    call_user_func_array([$stmt, 'bind_param'], $bind);
}

function toSnakeCase($input)
{
    preg_match_all('!([A-Z][A-Z0-9]*(?=$|[A-Z][a-z0-9])|[A-Za-z][a-z0-9]+)!', $input, $matches);
    $ret = $matches[0];
    foreach ($ret as &$match) {
        $match = $match == strtoupper($match) ? strtolower($match) : lcfirst($match);
    }
    return implode('_', $ret);
}

$entity = isset($_GET['entity']) ? trim($_GET['entity']) : '';
if ($entity === '') {
    respond(["error" => "Please specify an entity (e.g., ?entity=Service)"], 400);
}
if (!preg_match('/^[A-Za-z][A-Za-z0-9_]*$/', $entity)) {
    respond(["error" => "Invalid entity format"], 400);
}

$target_table = toSnakeCase($entity);

$actual_tables = [];
$tables_query = $conn->query("SHOW TABLES");
if ($tables_query) {
    while ($row = $tables_query->fetch_array()) {
        $actual_tables[] = $row[0];
    }
}

if (!in_array($target_table, $actual_tables, true)) {
    respond([
        "error" => "Invalid entity requested.",
        "passed_entity" => $entity,
        "mapped_table" => $target_table
    ], 404);
}

$columns = [];
$primary_key = null;
$columns_query = $conn->query("SHOW COLUMNS FROM `$target_table`");
if ($columns_query) {
    while ($col = $columns_query->fetch_assoc()) {
        $columns[$col['Field']] = $col;
        if (($col['Key'] ?? '') === 'PRI') {
            $primary_key = $col['Field'];
        }
    }
}

if (!$primary_key) {
    if (isset($columns['id'])) $primary_key = 'id';
    elseif (isset($columns['id_index'])) $primary_key = 'id_index';
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $reserved = ['entity', 'page', 'limit', 'sort'];
    $where = [];
    $params = [];
    $types = '';

    foreach ($_GET as $key => $value) {
        if (in_array($key, $reserved, true)) continue;
        if (!array_key_exists($key, $columns)) continue;
        $where[] = "`$key` = ?";
        $params[] = (string)$value;
        $types .= 's';
    }

    $order_by = '';
    $sort = isset($_GET['sort']) ? trim((string)$_GET['sort']) : '';
    if ($sort !== '') {
        $desc = substr($sort, 0, 1) === '-';
        $sort_col = ltrim($sort, '+-');
        if (array_key_exists($sort_col, $columns)) {
            $order_by = " ORDER BY `$sort_col` " . ($desc ? "DESC" : "ASC");
        }
    } elseif (array_key_exists('id_index', $columns)) {
        $order_by = " ORDER BY `id_index` DESC";
    }

    $page = max(0, (int)($_GET['page'] ?? 0));
    $limit = max(0, (int)($_GET['limit'] ?? 0));
    $max_limit = 200;
    if ($limit > $max_limit) $limit = $max_limit;
    $pagination = '';
    if ($page > 0 && $limit > 0) {
        $offset = ($page - 1) * $limit;
        $pagination = " LIMIT $limit OFFSET $offset";
    } elseif ($limit > 0) {
        $pagination = " LIMIT $limit";
    }

    $sql = "SELECT * FROM `$target_table`";
    if ($where) $sql .= " WHERE " . implode(' AND ', $where);
    $sql .= $order_by . $pagination;

    if ($params) {
        $stmt = $conn->prepare($sql);
        if (!$stmt) respond(["error" => "Failed to prepare query"], 500);
        bindParams($stmt, $types, $params);
        if (!$stmt->execute()) respond(["error" => "Failed to execute query"], 500);
        $result = $stmt->get_result();
        $data = [];
        while ($row = $result->fetch_assoc()) $data[] = $row;
        $stmt->close();
        respond($data);
    }

    $result = $conn->query($sql);
    $data = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) $data[] = $row;
    }
    respond($data);
}

if ($method === 'POST') {
    $json_input = file_get_contents('php://input');
    $request_data = json_decode($json_input, true);

    if (!is_array($request_data) || empty($request_data)) {
        respond(["error" => "No data provided for insertion/update"], 400);
    }

    $action = $request_data['action'] ?? 'create';

    if ($action === 'update_city') {
        if (!array_key_exists('city', $columns)) {
            respond(["error" => "City column does not exist in this table"], 400);
        }
        $id_index = (int)($request_data['id_index'] ?? 0);
        $new_city = (string)($request_data['city'] ?? '');
        if ($id_index <= 0 || $new_city === '') {
            respond(["error" => "Invalid id_index or city"], 400);
        }
        $stmt = $conn->prepare("UPDATE `$target_table` SET `city` = ? WHERE `id_index` = ?");
        $stmt->bind_param("si", $new_city, $id_index);
        if ($stmt->execute()) {
            $stmt->close();
            respond(["success" => true, "message" => "City updated successfully"]);
        }
        $err = $stmt->error;
        $stmt->close();
        respond(["error" => "Failed to update city: " . $err], 500);
    }

    if ($action === 'update') {
        $id = (int)($request_data['id'] ?? $request_data['id_index'] ?? 0);
        if ($id <= 0) respond(["error" => "Missing valid id for update"], 400);
        $id_column = $primary_key ?: (array_key_exists('id_index', $columns) ? 'id_index' : null);
        if (!$id_column) respond(["error" => "No primary key available for update"], 400);

        $update_data = $request_data['data'] ?? $request_data;
        if (!is_array($update_data)) respond(["error" => "Invalid update payload"], 400);

        $set_parts = [];
        $params = [];
        $types = '';
        foreach ($update_data as $key => $val) {
            if ($key === 'action' || $key === 'id' || $key === 'id_index') continue;
            if (!array_key_exists($key, $columns)) continue;
            if ($key === $id_column) continue;
            $set_parts[] = "`$key` = ?";
            $params[] = is_array($val) ? json_encode($val, JSON_UNESCAPED_UNICODE) : (string)$val;
            $types .= 's';
        }

        if (empty($set_parts)) respond(["error" => "No valid fields provided for update"], 400);

        $sql = "UPDATE `$target_table` SET " . implode(', ', $set_parts) . " WHERE `$id_column` = ?";
        $params[] = $id;
        $types .= 'i';

        $stmt = $conn->prepare($sql);
        if (!$stmt) respond(["error" => "Failed to prepare update query"], 500);
        bindParams($stmt, $types, $params);
        if ($stmt->execute()) {
            $affected = $stmt->affected_rows;
            $stmt->close();
            respond(["success" => true, "message" => "Record updated successfully", "affected_rows" => $affected]);
        }
        $err = $stmt->error;
        $stmt->close();
        respond(["error" => "Failed to update record: " . $err], 500);
    }

    if ($action === 'delete') {
        $id = (int)($request_data['id'] ?? $request_data['id_index'] ?? 0);
        if ($id <= 0) respond(["error" => "Missing valid id for delete"], 400);
        $id_column = $primary_key ?: (array_key_exists('id_index', $columns) ? 'id_index' : null);
        if (!$id_column) respond(["error" => "No primary key available for delete"], 400);

        $sql = "DELETE FROM `$target_table` WHERE `$id_column` = ?";
        $stmt = $conn->prepare($sql);
        if (!$stmt) respond(["error" => "Failed to prepare delete query"], 500);
        $stmt->bind_param("i", $id);
        if ($stmt->execute()) {
            $affected = $stmt->affected_rows;
            $stmt->close();
            respond(["success" => true, "message" => "Record deleted successfully", "affected_rows" => $affected]);
        }
        $err = $stmt->error;
        $stmt->close();
        respond(["error" => "Failed to delete record: " . $err], 500);
    }

    $fields = [];
    $placeholders = [];
    $params = [];
    $types = '';

    foreach ($request_data as $key => $val) {
        if ($key === 'action' || $key === 'id' || $key === 'id_index') continue;
        if (!array_key_exists($key, $columns)) continue;
        if ($primary_key && $key === $primary_key) continue;
        $fields[] = "`$key`";
        $placeholders[] = "?";
        $params[] = is_array($val) ? json_encode($val, JSON_UNESCAPED_UNICODE) : (string)$val;
        $types .= 's';
    }

    if (empty($fields)) {
        respond(["error" => "No valid fields provided for insertion"], 400);
    }

    $sql = "INSERT INTO `$target_table` (" . implode(', ', $fields) . ") VALUES (" . implode(', ', $placeholders) . ")";
    $stmt = $conn->prepare($sql);
    if (!$stmt) respond(["error" => "Failed to prepare insert query"], 500);
    bindParams($stmt, $types, $params);

    if ($stmt->execute()) {
        $inserted_id = $conn->insert_id;
        $stmt->close();
        respond([
            "success" => true,
            "message" => "Record created successfully in $target_table",
            "inserted_id" => $inserted_id
        ]);
    }
    $err = $stmt->error;
    $stmt->close();
    respond(["error" => "Failed to insert record: " . $err], 500);
}

respond(["error" => "Method not allowed"], 405);
