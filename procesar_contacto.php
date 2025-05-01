<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Leer JSON enviado
$data = json_decode(file_get_contents('php://input'), true);

// Validar campos requeridos
if (!isset($data['nombre'], $data['email'], $data['mensaje'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Faltan campos obligatorios']);
    exit;
}

// Conexión a MySQL
$host = 'localhost';
$usuario = 'root';
$password = '';
$base_datos = 'aquamarine_resort_db';
$port = 3307;

$conn = new mysqli($host, $usuario, $password, $base_datos, $port);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al conectar a la base de datos']);
    exit;
}

// Insertar mensaje
$stmt = $conn->prepare("INSERT INTO mensajes_contacto (nombre, email, mensaje) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $data['nombre'], $data['email'], $data['mensaje']);
$success = $stmt->execute();

if ($success) {
    echo json_encode(['success' => true, 'message' => 'Mensaje guardado']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al guardar el mensaje']);
}

$stmt->close();
$conn->close();
