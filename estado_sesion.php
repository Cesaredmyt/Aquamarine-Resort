<?php
session_start();
header('Content-Type: application/json');

if (isset($_SESSION['id_usuario'])) {
    echo json_encode([
        "logueado" => true,
        "nombre" => $_SESSION['nombre_usuario'],
        "correo" => $_SESSION['correo_usuario']
    ]);
} else {
    echo json_encode([
        "logueado" => false
    ]);
}
?>

