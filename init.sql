-- Crear tabla clientes
CREATE TABLE IF NOT EXISTS clientes (
  id INT NOT NULL AUTO_INCREMENT,
  fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  activo TINYINT NOT NULL DEFAULT 1,
  dpi VARCHAR(13) NOT NULL,
  saldo_total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  nombre VARCHAR(100) NOT NULL,
  telefono VARCHAR(20) NOT NULL,
  direccion TEXT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY IDX_38ba6656d393bff6d44f38c275 (dpi)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Crear tabla users
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) UNIQUE,
  role ENUM('admin', 'client') NOT NULL,
  is_first_login BOOLEAN DEFAULT TRUE,
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP NULL,
  last_login TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  active TINYINT DEFAULT 1,
  cliente_id INT,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- Crear tabla sessions
CREATE TABLE IF NOT EXISTS sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Crear tabla creditos
CREATE TABLE IF NOT EXISTS creditos (
  id INT NOT NULL AUTO_INCREMENT,
  cliente_id INT NOT NULL,
  descripcion_articulo TEXT NOT NULL,
  precio_venta DECIMAL(10,2) NOT NULL,
  plazo_meses INT NOT NULL,
  saldo_pendiente DECIMAL(10,2) NOT NULL,
  fecha_ultimo_pago TIMESTAMP NULL,
  tasa_interes DECIMAL(5,2) NOT NULL,
  fecha_credito TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  estado ENUM('ACTIVO','PAGADO','ATRASADO') NOT NULL DEFAULT 'ACTIVO',
  PRIMARY KEY (id),
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- Crear tabla pagos
CREATE TABLE IF NOT EXISTS pagos (
  id INT NOT NULL AUTO_INCREMENT,
  monto DECIMAL(10,2) NOT NULL,
  fecha_pago TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  comentario TEXT,
  credito_id INT NOT NULL,
  tipo_pago ENUM('EFECTIVO','TRANSFERENCIA') NOT NULL,
  estado ENUM('ACTIVO','ANULADO') NOT NULL DEFAULT 'ACTIVO',
  PRIMARY KEY (id),
  FOREIGN KEY (credito_id) REFERENCES creditos(id)
);

-- Crear tabla productos
CREATE TABLE IF NOT EXISTS productos (
  id INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  precio_base DECIMAL(10,2) NOT NULL,
  categoria VARCHAR(255) NOT NULL,
  comentario TEXT NOT NULL,
  activo TINYINT NOT NULL DEFAULT 1,
  PRIMARY KEY (id)
);

-- Crear vista resumen_creditos_cliente
CREATE OR REPLACE VIEW resumen_creditos_cliente AS
SELECT 
  c.id AS cliente_id,
  c.nombre,
  c.dpi,
  COUNT(cr.id) AS total_creditos,
  SUM(cr.saldo_pendiente) AS deuda_total,
  SUM(CASE WHEN cr.estado = 'ATRASADO' THEN 1 ELSE 0 END) AS creditos_atrasados
FROM clientes c
LEFT JOIN creditos cr ON c.id = cr.cliente_id
GROUP BY c.id, c.nombre, c.dpi;

-- Crear triggers
DELIMITER //

CREATE TRIGGER after_credito_insert AFTER INSERT ON creditos
FOR EACH ROW
BEGIN
    UPDATE clientes 
    SET saldo_total = (
        SELECT COALESCE(SUM(saldo_pendiente), 0)
        FROM creditos
        WHERE cliente_id = NEW.cliente_id
    )
    WHERE id = NEW.cliente_id;
END//

CREATE TRIGGER after_credito_update AFTER UPDATE ON creditos
FOR EACH ROW
BEGIN
    UPDATE clientes c
    SET saldo_total = (
        SELECT COALESCE(SUM(saldo_pendiente), 0)
        FROM creditos
        WHERE cliente_id = NEW.cliente_id
    )
    WHERE c.id = NEW.cliente_id;
END//

CREATE TRIGGER after_pago_insert AFTER INSERT ON pagos
FOR EACH ROW
BEGIN
    UPDATE creditos 
    SET saldo_pendiente = saldo_pendiente - NEW.monto,
        fecha_ultimo_pago = NEW.fecha_pago
    WHERE id = NEW.credito_id;
    
    UPDATE creditos 
    SET estado = 'PAGADO'
    WHERE id = NEW.credito_id 
    AND saldo_pendiente <= 0;
END//

CREATE TRIGGER after_pago_anulacion AFTER UPDATE ON pagos
FOR EACH ROW
BEGIN
    IF NEW.estado = 'ANULADO' AND OLD.estado = 'ACTIVO' THEN
        UPDATE creditos 
        SET saldo_pendiente = saldo_pendiente + OLD.monto,
            fecha_ultimo_pago = NOW()
        WHERE id = NEW.credito_id;
        
        UPDATE creditos
        SET estado = 'ACTIVO'
        WHERE id = NEW.credito_id
        AND estado = 'PAGADO';
    END IF;
END//

DELIMITER ;

-- Crear evento para verificar créditos atrasados
CREATE EVENT IF NOT EXISTS check_creditos_atrasados
ON SCHEDULE EVERY 1 DAY
STARTS CURRENT_TIMESTAMP
DO
  UPDATE creditos
  SET estado = 'ATRASADO'
  WHERE estado = 'ACTIVO'
  AND fecha_ultimo_pago IS NOT NULL
  AND fecha_ultimo_pago < DATE_SUB(NOW(), INTERVAL 30 DAY);

-- Crear índices
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_cliente_id ON users(cliente_id);