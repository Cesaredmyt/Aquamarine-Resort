<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['id_usuario'])) {
  echo json_encode(["error" => "No logueado"]);
  exit();
}

require_once 'conexcion.php';

$id = $_SESSION['id_usuario'];

$sql = "SELECT nombre, ap_paterno, ap_materno, correo, telefono FROM usuarios WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

if ($usuario = $result->fetch_assoc()) {
  echo json_encode($usuario);
} else {
  echo json_encode(["error" => "Usuario no encontrado"]);
}

$stmt->close();
$conn->close();
?>
