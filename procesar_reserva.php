<?php
header('Content-Type: application/json');
session_start();

// 0. Verificar que haya sesión activa
if (!isset($_SESSION['usuario'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'No autorizado. Debes iniciar sesión.']);
    exit;
}

// 1. Leer los datos JSON enviados desde el frontend
$data = json_decode(file_get_contents('php://input'), true);

// 2. Validar campos obligatorios
if (
    !isset(
        $data['fecha_entrada'],
        $data['fecha_salida'],
        $data['personas']
    )
) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Faltan datos obligatorios']);
    exit;
}

// 3. Obtener nombre y correo desde la sesión
$nombre = $_SESSION['usuario']['nombre'];
$correo = $_SESSION['usuario']['correo'];

// 4. Datos de conexión (adaptado a tu configuración)
$host = 'localhost';
$usuario = 'root';
$password = '';
$base_datos = 'aquamarine_resort_db';
$port = 3307;

// 5. Conexión a la base de datos
$conn = new mysqli($host, $usuario, $password, $base_datos, $port);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error de conexión: ' . $conn->connect_error]);
    exit;
}

// 6. Preparar e insertar la reservación
$stmt = $conn->prepare("
    INSERT INTO reservaciones (
        nombre_cliente, email_cliente, fecha_entrada,
        fecha_salida, personas, habitacion_tipo, fecha_creacion
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "ssssiss",
    $nombre,
    $correo,
    $data['fecha_entrada'],
    $data['fecha_salida'],
    $data['personas'],
    $data['habitacion_tipo'],
    $data['fecha_creacion']
);

$success = $stmt->execute();

if ($success) {
    echo json_encode(['success' => true, 'message' => 'Reservación guardada correctamente']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al guardar reservación']);
}

$stmt->close();
$conn->close();
?>
