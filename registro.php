<?php
header('Content-Type: application/json');

$host = 'localhost';
$usuario = 'root';
$password = '';
$base_datos = 'aquamarine_resort_db';
$port = 3306;

$conn = new mysqli($host, $usuario, $password, $base_datos, $port);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Error de conexión."]);
    exit();
}

// Obtener datos del formulario
$nombre = trim($_POST['nombre']);
$ap_paterno = trim($_POST['ap_paterno']);
$ap_materno = trim($_POST['ap_materno']);
$correo = trim($_POST['correo']);
$telefono = trim($_POST['telefono']);
$password = $_POST['password'];
$confirm_password = $_POST['confirm_password'];

// Validaciones básicas
if ($password !== $confirm_password) {
    echo json_encode(["success" => false, "message" => "Las contraseñas no coinciden."]);
    exit();
}

if (strlen($password) < 6) {
    echo json_encode(["success" => false, "message" => "La contraseña debe tener al menos 6 caracteres."]);
    exit();
}

// Verificar si el correo ya existe
$stmt = $conn->prepare("SELECT id FROM usuarios WHERE correo = ?");
$stmt->bind_param("s", $correo);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "El correo ya está registrado."]);
    exit();
}
$stmt->close();

// Encriptar contraseña
$hashed_password = password_hash($password, PASSWORD_DEFAULT);

// Insertar usuario
$stmt = $conn->prepare("INSERT INTO usuarios (nombre, ap_paterno, ap_materno, correo, telefono, contrasena) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssssss", $nombre, $ap_paterno, $ap_materno, $correo, $telefono, $hashed_password);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Usuario registrado correctamente."]);
} else {
    echo json_encode(["success" => false, "message" => "Error al registrar usuario."]);
}

$stmt->close();
$conn->close();
?>
