<?php
header('Content-Type: application/json');

// 1. Leer los datos JSON enviados desde el frontend
$data = json_decode(file_get_contents('php://input'), true);

// 2. Validar campos obligatorios
if (
    !isset(
    $data['nombre_cliente'],
    $data['email_cliente'],
    $data['fecha_entrada'],
    $data['fecha_salida'],
    $data['personas']
)
) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Faltan datos obligatorios']);
    exit;
}

// 3. Datos de conexión (adaptado a tu configuración)
$host = 'localhost';
$usuario = 'root';
$password = '';
$base_datos = 'aquamarine_resort_db';
$port = 3307;

// 4. Conexión a la base de datos
$conn = new mysqli($host, $usuario, $password, $base_datos, $port);

// Verificar conexión
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error de conexión: ' . $conn->connect_error]);
    exit;
}

// 5. Insertar datos con prepared statement
$stmt = $conn->prepare("
  INSERT INTO reservaciones (
    nombre_cliente, email_cliente, fecha_entrada,
    fecha_salida, personas, habitacion_tipo, fecha_creacion
  ) VALUES (?, ?, ?, ?, ?, ?, ?)
");

$stmt->bind_param(
    "ssssiss",
    $data['nombre_cliente'],
    $data['email_cliente'],
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