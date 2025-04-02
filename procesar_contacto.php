<?php
$conexion = new mysqli("localhost", "root", "", "aquamarine");

// Verifica conexión
if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

// Captura datos
$nombre = $_POST["name"];
$email = $_POST["email"];
$mensaje = $_POST["message"];

// Inserta datos
$sql = "INSERT INTO mensajes_contacto (nombre, email, mensaje) VALUES ('$nombre', '$email', '$mensaje')";

if ($conexion->query($sql) === TRUE) {
    echo "¡Mensaje enviado correctamente!";
} else {
    echo "Error: " . $conexion->error;
}

$conexion->close();
?>
