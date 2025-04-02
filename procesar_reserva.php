<?php
$conexion = new mysqli("localhost", "root", "", "aquamarine");

if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}

$nombre = $_POST["nombre"];
$entrada = $_POST["entrada"];
$salida = $_POST["salida"];
$personas = $_POST["personas"];

$sql = "INSERT INTO reservaciones (nombre, fecha_entrada, fecha_salida, personas) 
        VALUES ('$nombre', '$entrada', '$salida', '$personas')";

if ($conexion->query($sql) === TRUE) {
    echo "¡Reserva realizada!";
} else {
    echo "Error: " . $conexion->error;
}

$conexion->close();
?>
