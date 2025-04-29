<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['id_usuario'])) {
  echo json_encode(["success" => false, "message" => "Usuario no autenticado."]);
  exit();
}

require_once 'conexcion.php';

// Obtener datos del body
$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
  echo json_encode(["success" => false, "message" => "Datos no recibidos."]);
  exit();
}

// Separar nombre completo
$partesNombre = explode(' ', $data['nombre_completo'], 3);
$nombre = $partesNombre[0] ?? '';
$ap_paterno = $partesNombre[1] ?? '';
$ap_materno = $partesNombre[2] ?? '';

$correo = $data['correo'];
$telefono = $data['telefono'];
$id = $_SESSION['id_usuario'];

$sql = "UPDATE usuarios SET nombre=?, ap_paterno=?, ap_materno=?, correo=?, telefono=? WHERE id=?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("sssssi", $nombre, $ap_paterno, $ap_materno, $correo, $telefono, $id);

if ($stmt->execute()) {
  echo json_encode(["success" => true]);
} else {
  echo json_encode(["success" => false, "message" => "No se pudo actualizar"]);
}

$stmt->close();
$conn->close();
?>
