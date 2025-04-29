<?php
session_start();
header('Content-Type: application/json');

$host = 'localhost';
$usuario = 'root';
$password = '';
$base_datos = 'aquamarine_resort_db';
$port = 3306;

$conn = new mysqli($host, $usuario, $password, $base_datos, $port);

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Error de conexión a la base de datos."]);
    exit();
}

// Obtener datos del formulario
$correo = trim($_POST['correo']);
$contrasena = $_POST['password'];

// Buscar al usuario
$stmt = $conn->prepare("SELECT id, nombre, correo, contrasena FROM usuarios WHERE correo = ?");
$stmt->bind_param("s", $correo);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "Correo no registrado."]);
    exit();
}

$usuario = $resultado->fetch_assoc();

// Verificar contraseña
if (!password_verify($contrasena, $usuario['contrasena'])) {
    echo json_encode(["success" => false, "message" => "Contraseña incorrecta."]);
    exit();
}

// Todo correcto: iniciar sesión
$_SESSION['id_usuario'] = $usuario['id'];
$_SESSION['nombre_usuario'] = $usuario['nombre'];
$_SESSION['correo_usuario'] = $usuario['correo'];

echo json_encode(["success" => true, "message" => "Inicio de sesión exitoso."]);

$stmt->close();
$conn->close();
?>
