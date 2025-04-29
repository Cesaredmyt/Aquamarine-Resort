<?php
header('Content-Type: application/json');

$host = 'localhost';
$usuario = 'root';
$password = '';
$base_datos = 'aquamarine_resort_db';
$port = 3307;


$conn = new mysqli($host, $usuario, $password, $base_datos, $port);


if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error de conexión: ' . $conn->connect_error]);
    exit;
}

// 3. Consulta para traer habitaciones disponibles
$sql = "SELECT * FROM habitaciones WHERE disponible = 1";
$result = $conn->query($sql);

// 4. Verificar resultados
$habitaciones = [];

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $habitaciones[] = $row;
    }
}

// 5. Devolver resultado
echo json_encode($habitaciones);

// 6. Cerrar conexión
$conn->close();
?>
