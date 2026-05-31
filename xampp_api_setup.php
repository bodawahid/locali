<?php
/**
 * LOCALI EGYPT - Local PHP API Router for XAMPP
 * Location: C:\xampp\htdocs\locali-api\api.php
 * 
 * This router serves the Vite React frontend running on http://localhost:5173
 * All requests are proxied to the local MySQL database via PDO.
 * 
 * Routes: /api/v1/[resource]/[action]
 * Database: locali_egypt (localhost, user: root, no password)
 * 
 * Last Updated: May 2026
 */

// ============================================================================
// CORS Headers - Allow localhost:5173 (Vite dev server)
// ============================================================================
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=utf-8");

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// ============================================================================
// Environment & Configuration
// ============================================================================
define('DB_HOST', 'localhost');
define('DB_NAME', 'locali_egypt');
define('DB_USER', 'root');
define('DB_PASS', '');
define('JWT_SECRET', 'locali_egypt_super_secret_key_change_in_production_2026');
define('API_VERSION', 'v1');

error_reporting(E_ALL);
ini_set('display_errors', 0); // Don't leak errors to client
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/error.log');

// ============================================================================
// PDO Database Connection
// ============================================================================
class Database {
    private static $instance = null;
    private $pdo;

    private function __construct() {
        try {
            $this->pdo = new PDO(
                "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
                DB_USER,
                DB_PASS,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ]
            );
        } catch (PDOException $e) {
            http_response_code(500);
            die(json_encode(['error' => 'Database connection failed. Check XAMPP MySQL.']));
        }
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function query($sql, $params = []) {
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($params);
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            error_log("Query error: " . $e->getMessage());
            return [];
        }
    }

    public function execute($sql, $params = []) {
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($params);
            return $stmt->rowCount();
        } catch (PDOException $e) {
            error_log("Execute error: " . $e->getMessage());
            return 0;
        }
    }

    public function lastInsertId() {
        return $this->pdo->lastInsertId();
    }
}

// ============================================================================
// JWT Authentication Helper
// ============================================================================
class Auth {
    public static function generateToken($userId, $role = 'traveler') {
        $payload = [
            'iat' => time(),
            'exp' => time() + (24 * 3600), // 24 hours
            'userId' => $userId,
            'role' => $role,
        ];
        $token = self::base64UrlEncode(json_encode(['typ' => 'JWT', 'alg' => 'HS256'])) . '.' .
                 self::base64UrlEncode(json_encode($payload));
        $signature = hash_hmac('sha256', $token, JWT_SECRET, true);
        return $token . '.' . self::base64UrlEncode($signature);
    }

    public static function verifyToken($token) {
        $parts = explode('.', $token);
        if (count($parts) !== 3) return null;

        try {
            $payload = json_decode(self::base64UrlDecode($parts[1]), true);
            $signature = hash_hmac('sha256', $parts[0] . '.' . $parts[1], JWT_SECRET, true);
            $expectedSignature = base64_decode(strtr($parts[2], '-_', '+/'));

            if ($signature !== $expectedSignature || time() > $payload['exp']) {
                return null;
            }
            return $payload;
        } catch (Exception $e) {
            return null;
        }
    }

    private static function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function base64UrlDecode($data) {
        return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', 4 - strlen($data) % 4));
    }

    public static function getAuthToken() {
        $headers = getallheaders();
        if (isset($headers['Authorization'])) {
            return str_replace('Bearer ', '', $headers['Authorization']);
        }
        return null;
    }
}

// ============================================================================
// Request Router
// ============================================================================
function parseRequest() {
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $path = str_replace('/locali-api/api.php', '', $path);
    $path = trim($path, '/');

    $parts = explode('/', $path);
    return [
        'method' => $_SERVER['REQUEST_METHOD'],
        'resource' => $parts[0] ?? '',
        'id' => $parts[1] ?? null,
        'action' => $parts[2] ?? null,
    ];
}

function getJsonInput() {
    $input = file_get_contents('php://input');
    return json_decode($input, true) ?? [];
}

// ============================================================================
// Response Helper
// ============================================================================
function response($data = null, $statusCode = 200) {
    http_response_code($statusCode);
    echo json_encode($data ?? ['error' => 'Unknown error']);
    exit;
}

// ============================================================================
// Database
// ============================================================================
$db = Database::getInstance();
$request = parseRequest();
$input = getJsonInput();

// ============================================================================
// ROUTES: AUTH
// ============================================================================
if ($request['resource'] === 'auth') {
    if ($request['method'] === 'POST' && $request['action'] === 'login') {
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';

        if (!$email || !$password) {
            response(['error' => 'Email and password required.'], 400);
        }

        $users = $db->query('SELECT * FROM users WHERE email = ? LIMIT 1', [$email]);
        
        if ($users) {
            $user = $users[0];
            // For development: hardcoded admin check OR proper bcrypt validation
            if ($email === 'admin@locali.eg' && $password === 'admin') {
                $token = Auth::generateToken($user['id'], $user['role']);
                response([
                    'token' => $token,
                    'user' => [
                        'id' => $user['id'],
                        'name' => $user['name'],
                        'email' => $user['email'],
                        'role' => $user['role'],
                        'phone' => $user['phone'],
                        'city' => $user['city'],
                    ]
                ]);
            }
        }

        response(['error' => 'Invalid credentials.'], 401);
    }

    if ($request['method'] === 'GET' && $request['action'] === 'me') {
        $token = Auth::getAuthToken();
        $payload = Auth::verifyToken($token);

        if (!$payload) {
            response(['error' => 'Unauthorized.'], 401);
        }

        $users = $db->query('SELECT id, name, email, role, phone, city FROM users WHERE id = ? LIMIT 1', [$payload['userId']]);
        
        if ($users) {
            response($users[0]);
        }
        
        response(['error' => 'User not found.'], 404);
    }

    if ($request['method'] === 'POST' && $request['action'] === 'register') {
        $name = $input['name'] ?? '';
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';
        $role = $input['role'] ?? 'traveler';

        if (!$name || !$email || !$password) {
            response(['error' => 'Name, email, and password required.'], 400);
        }

        // Check existing email
        $existing = $db->query('SELECT id FROM users WHERE email = ? LIMIT 1', [$email]);
        if ($existing) {
            response(['error' => 'Email already registered.'], 409);
        }

        // For production, use password_hash. For local dev:
        $passwordHash = password_hash($password, PASSWORD_BCRYPT);
        
        $sql = 'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)';
        $db->execute($sql, [$name, $email, $passwordHash, $role]);
        $userId = $db->lastInsertId();

        $users = $db->query('SELECT id, name, email, role FROM users WHERE id = ?', [$userId]);
        $user = $users[0];
        $token = Auth::generateToken($user['id'], $user['role']);

        response([
            'token' => $token,
            'user' => $user
        ], 201);
    }
}

// ============================================================================
// ROUTES: CURRENCY_RATES
// ============================================================================
if ($request['resource'] === 'currency-rates') {
    if ($request['method'] === 'GET') {
        if ($request['id']) {
            $rates = $db->query('SELECT * FROM currency_rates WHERE id = ? LIMIT 1', [$request['id']]);
            response($rates[0] ?? ['error' => 'Not found'], $rates ? 200 : 404);
        } else {
            $limit = $_GET['limit'] ?? 10;
            $page = $_GET['page'] ?? 1;
            $offset = ($page - 1) * $limit;
            $rates = $db->query('SELECT * FROM currency_rates ORDER BY rate_date DESC LIMIT ?, ?', [$offset, $limit]);
            response($rates);
        }
    }

    if ($request['method'] === 'POST') {
        $token = Auth::getAuthToken();
        $payload = Auth::verifyToken($token);
        if (!$payload || $payload['role'] !== 'admin') {
            response(['error' => 'Unauthorized.'], 401);
        }

        $sql = 'INSERT INTO currency_rates (usd, eur, gbp, rub, pln, cad, aud, sar, rate_date, source) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        $db->execute($sql, [
            $input['usd'] ?? null,
            $input['eur'] ?? null,
            $input['gbp'] ?? null,
            $input['rub'] ?? null,
            $input['pln'] ?? null,
            $input['cad'] ?? null,
            $input['aud'] ?? null,
            $input['sar'] ?? null,
            date('Y-m-d'),
            'manual'
        ]);
        
        response(['id' => $db->lastInsertId()], 201);
    }
}

// ============================================================================
// ROUTES: LIVE_SITUATIONS
// ============================================================================
if ($request['resource'] === 'live-situations') {
    if ($request['method'] === 'GET') {
        if ($request['id']) {
            $situations = $db->query('SELECT * FROM live_situations WHERE id = ? LIMIT 1', [$request['id']]);
            response($situations[0] ?? ['error' => 'Not found'], $situations ? 200 : 404);
        } else {
            $city = $_GET['city'] ?? '';
            if ($city) {
                $situations = $db->query('SELECT * FROM live_situations WHERE city = ? ORDER BY update_date DESC LIMIT 1', [$city]);
                response($situations[0] ?? ['error' => 'No data for city'], $situations ? 200 : 404);
            } else {
                $situations = $db->query('SELECT DISTINCT city, status, weather, temperature_c FROM live_situations ORDER BY update_date DESC');
                response($situations);
            }
        }
    }
}

// ============================================================================
// ROUTES: SERVICES
// ============================================================================
if ($request['resource'] === 'services') {
    if ($request['method'] === 'GET') {
        if ($request['id']) {
            $services = $db->query('SELECT * FROM services WHERE id = ? LIMIT 1', [$request['id']]);
            response($services[0] ?? ['error' => 'Not found'], $services ? 200 : 404);
        } else {
            $city = $_GET['city'] ?? '';
            $category = $_GET['category'] ?? '';
            $limit = $_GET['limit'] ?? 20;
            $page = $_GET['page'] ?? 1;
            $offset = ($page - 1) * $limit;

            $sql = 'SELECT * FROM services WHERE 1=1';
            $params = [];

            if ($city) {
                $sql .= ' AND city = ?';
                $params[] = $city;
            }
            if ($category) {
                $sql .= ' AND category = ?';
                $params[] = $category;
            }

            $sql .= ' LIMIT ?, ?';
            $params[] = $offset;
            $params[] = $limit;

            $services = $db->query($sql, $params);
            response($services);
        }
    }

    if ($request['method'] === 'POST') {
        $token = Auth::getAuthToken();
        $payload = Auth::verifyToken($token);
        if (!$payload) {
            response(['error' => 'Unauthorized.'], 401);
        }

        $sql = 'INSERT INTO services (name, category, city, description, phone, is_active) VALUES (?, ?, ?, ?, ?, 1)';
        $db->execute($sql, [
            $input['name'] ?? '',
            $input['category'] ?? '',
            $input['city'] ?? '',
            $input['description'] ?? '',
            $input['phone'] ?? '',
        ]);

        response(['id' => $db->lastInsertId()], 201);
    }
}

// ============================================================================
// ROUTES: PLACES
// ============================================================================
if ($request['resource'] === 'places') {
    if ($request['method'] === 'GET') {
        if ($request['id']) {
            $places = $db->query('SELECT * FROM places WHERE id = ? LIMIT 1', [$request['id']]);
            response($places[0] ?? ['error' => 'Not found'], $places ? 200 : 404);
        } else {
            $city = $_GET['city'] ?? '';
            $category = $_GET['category'] ?? '';
            $limit = $_GET['limit'] ?? 20;
            $page = $_GET['page'] ?? 1;
            $offset = ($page - 1) * $limit;

            $sql = 'SELECT * FROM places WHERE status = "active"';
            $params = [];

            if ($city) {
                $sql .= ' AND city = ?';
                $params[] = $city;
            }
            if ($category) {
                $sql .= ' AND category = ?';
                $params[] = $category;
            }

            $sql .= ' ORDER BY is_featured DESC, rating DESC LIMIT ?, ?';
            $params[] = $offset;
            $params[] = $limit;

            $places = $db->query($sql, $params);
            response($places);
        }
    }
}

// ============================================================================
// ROUTES: SCAM_REPORTS
// ============================================================================
if ($request['resource'] === 'scam-reports') {
    if ($request['method'] === 'GET') {
        if ($request['id']) {
            $reports = $db->query('SELECT * FROM scam_reports WHERE id = ? LIMIT 1', [$request['id']]);
            response($reports[0] ?? ['error' => 'Not found'], $reports ? 200 : 404);
        } else {
            $city = $_GET['city'] ?? '';
            $limit = $_GET['limit'] ?? 50;
            $page = $_GET['page'] ?? 1;
            $offset = ($page - 1) * $limit;

            $sql = 'SELECT * FROM scam_reports WHERE status IN ("verified", "pending")';
            $params = [];

            if ($city) {
                $sql .= ' AND city = ?';
                $params[] = $city;
            }

            $sql .= ' ORDER BY upvotes DESC, created_at DESC LIMIT ?, ?';
            $params[] = $offset;
            $params[] = $limit;

            $reports = $db->query($sql, $params);
            response($reports);
        }
    }

    if ($request['method'] === 'POST') {
        $token = Auth::getAuthToken();
        if (!$token) {
            response(['error' => 'Unauthorized.'], 401);
        }

        $sql = 'INSERT INTO scam_reports (title, description, city, category, severity, status) VALUES (?, ?, ?, ?, ?, "pending")';
        $db->execute($sql, [
            $input['title'] ?? '',
            $input['description'] ?? '',
            $input['city'] ?? '',
            $input['category'] ?? '',
            $input['severity'] ?? 'moderate',
        ]);

        response(['id' => $db->lastInsertId()], 201);
    }
}

// ============================================================================
// ROUTES: PRICE_ENTRIES
// ============================================================================
if ($request['resource'] === 'price-entries') {
    if ($request['method'] === 'GET') {
        if ($request['id']) {
            $entries = $db->query('SELECT * FROM price_entries WHERE id = ? LIMIT 1', [$request['id']]);
            response($entries[0] ?? ['error' => 'Not found'], $entries ? 200 : 404);
        } else {
            $city = $_GET['city'] ?? '';
            $category = $_GET['category'] ?? '';
            $limit = $_GET['limit'] ?? 100;

            $sql = 'SELECT * FROM price_entries WHERE is_active = 1';
            $params = [];

            if ($city) {
                $sql .= ' AND city = ?';
                $params[] = $city;
            }
            if ($category) {
                $sql .= ' AND category = ?';
                $params[] = $category;
            }

            $sql .= ' ORDER BY category, item LIMIT ?';
            $params[] = $limit;

            $entries = $db->query($sql, $params);
            response($entries);
        }
    }
}

// ============================================================================
// ROUTES: GUIDES
// ============================================================================
if ($request['resource'] === 'guides') {
    if ($request['method'] === 'GET') {
        if ($request['id']) {
            $guides = $db->query('SELECT * FROM guides WHERE id = ? LIMIT 1', [$request['id']]);
            response($guides[0] ?? ['error' => 'Not found'], $guides ? 200 : 404);
        } else {
            $city = $_GET['city'] ?? '';
            $limit = $_GET['limit'] ?? 20;

            $sql = 'SELECT * FROM guides WHERE status = "active"';
            $params = [];

            if ($city) {
                $sql .= ' AND city = ?';
                $params[] = $city;
            }

            $sql .= ' ORDER BY avg_rating DESC LIMIT ?';
            $params[] = $limit;

            $guides = $db->query($sql, $params);
            response($guides);
        }
    }
}

// ============================================================================
// CATCH-ALL 404
// ============================================================================
response(['error' => 'Endpoint not found'], 404);
?>
