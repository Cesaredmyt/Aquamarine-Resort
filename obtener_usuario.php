<?php
session_start();
header("Content-Type: application/json");

if (!isset($_SESSION['usuario'])) {
    echo json_encode(["logueado" => false]);
    exit();
}

echo json_encode([
    "logueado" => true,
    "correo" => $_SESSION['usuario']['correo']
]);
?>
