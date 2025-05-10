<?php
header("Content-Type: application/json");

// Parámetros de conexión
$host = 'localhost';
$usuario = 'root';
$password = '';
$base_datos = 'aquamarine_resort_db';
$port = 3307;

// Conexión a la base de datos
$conn = new mysqli($host, $usuario, $password, $base_datos, $port);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Error de conexión"]);
    exit();
}

// Obtener el email desde el frontend
$email = isset($_GET['email']) ? $conn->real_escape_string($_GET['email']) : '';

if (empty($email)) {
    http_response_code(400);
    echo json_encode(["error" => "Email no proporcionado"]);
    exit();
}

// Consulta
$sql = "SELECT id, nombre_cliente, fecha_entrada, fecha_salida, personas, habitacion_tipo, fecha_creacion 
        FROM reservaciones 
        WHERE email_cliente = '$email'";
$result = $conn->query($sql);

$reservas = [];
while ($row = $result->fetch_assoc()) {
    $reservas[] = $row;
}

echo json_encode($reservas);

$conn->close();
?>
