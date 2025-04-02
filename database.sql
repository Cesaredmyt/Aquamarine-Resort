CREATE DATABASE aquamarine;
USE aquamarine;

CREATE TABLE mensajes_contacto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    email VARCHAR(100),
    mensaje TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reservaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100),
    fecha_entrada DATE,
    fecha_salida DATE,
    personas INT,
    fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
