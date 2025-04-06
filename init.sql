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


-- Creasr tabla categoria_joya
CREATE TABLE categorias_joya (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    precio_gramo DECIMAL(10,2) NOT NULL,
    activo TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabla para el inventario de joyas (control por gramos)
CREATE TABLE inventario_joyas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    categoria_id INT NOT NULL,
    descripcion TEXT,
    gramos_total DECIMAL(10,3) NOT NULL,
    gramos_disponible DECIMAL(10,3) NOT NULL,
    fecha_ingreso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    costo_adquisicion DECIMAL(10,2) NOT NULL,
    activo TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias_joya(id)
);

CREATE TABLE detalle_credito_joyas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    credito_id INT NOT NULL,
    inventario_id INT NOT NULL,
    gramos_vendidos DECIMAL(10,3) NOT NULL,
    precio_venta_gramo DECIMAL(10,2) NOT NULL,
    subtotal_calculado DECIMAL(10,2) NOT NULL COMMENT 'Precio calculado matemáticamente',
    subtotal_final DECIMAL(10,2) NOT NULL COMMENT 'Precio final después del ajuste manual',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (credito_id) REFERENCES creditos(id),
    FOREIGN KEY (inventario_id) REFERENCES inventario_joyas(id)
);

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

-- Vista de inventario disponible
CREATE VIEW vista_inventario_disponible AS
SELECT 
    i.id,
    c.nombre AS categoria,
    i.descripcion,
    i.gramos_total,
    i.gramos_disponible,
    c.precio_gramo,
    (i.gramos_disponible * c.precio_gramo) AS valor_estimado,
    i.fecha_ingreso,
    i.costo_adquisicion,
    ((i.gramos_disponible * c.precio_gramo) - i.costo_adquisicion) AS ganancia_potencial
FROM 
    inventario_joyas i
JOIN 
    categorias_joya c ON i.categoria_id = c.id
WHERE
    i.activo = 1 AND i.gramos_disponible > 0;

-- Vista de ventas por categoría
CREATE VIEW vista_ventas_por_categoria AS
SELECT 
    c.nombre AS categoria,
    COUNT(dcj.id) AS total_ventas,
    SUM(dcj.gramos_vendidos) AS total_gramos_vendidos,
    SUM(dcj.subtotal_final) AS total_ingresos,
    SUM(dcj.subtotal_calculado) AS total_ingresos_calculados,
    SUM(dcj.subtotal_calculado - dcj.subtotal_final) AS total_descuentos,
    AVG(dcj.precio_venta_gramo) AS precio_promedio_gramo
FROM 
    detalle_credito_joyas dcj
JOIN 
    inventario_joyas i ON dcj.inventario_id = i.id
JOIN 
    categorias_joya c ON i.categoria_id = c.id
GROUP BY 
    c.nombre;

-- Vista de detalle de créditos con productos
CREATE VIEW vista_detalle_creditos_joyas AS
SELECT 
    cr.id AS credito_id,
    cl.nombre AS cliente,
    cl.dpi,
    cr.fecha_credito,
    cr.plazo_meses,
    cr.estado,
    c.nombre AS categoria_joya,
    dcj.gramos_vendidos,
    dcj.precio_venta_gramo,
    dcj.subtotal_calculado,
    dcj.subtotal_final,
    cr.saldo_pendiente
FROM 
    creditos cr
JOIN 
    clientes cl ON cr.cliente_id = cl.id
JOIN 
    detalle_credito_joyas dcj ON cr.id = dcj.credito_id
JOIN 
    inventario_joyas i ON dcj.inventario_id = i.id
JOIN 
    categorias_joya c ON i.categoria_id = c.id
ORDER BY 
    cr.fecha_credito DESC;

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

DELIMITER //

CREATE PROCEDURE registrar_venta_joya(
    IN p_cliente_id INT,
    IN p_inventario_id INT,
    IN p_gramos_vendidos DECIMAL(10,3),
    IN p_plazo_meses INT,
    IN p_tasa_interes DECIMAL(5,2),
    IN p_descripcion_articulo TEXT,
    IN p_comentario TEXT,
    IN p_precio_final DECIMAL(10,2) COMMENT 'Precio final ajustado manualmente'
)
BEGIN
    DECLARE v_precio_gramo DECIMAL(10,2);
    DECLARE v_subtotal DECIMAL(10,2);
    DECLARE v_credito_id INT;
    DECLARE v_gramos_disponibles DECIMAL(10,3);
    DECLARE v_categoria_id INT;
    
    -- Iniciar transacción
    START TRANSACTION;
    
    -- Verificar si hay suficientes gramos disponibles
    SELECT 
        gramos_disponible, 
        categoria_id 
    INTO 
        v_gramos_disponibles, 
        v_categoria_id 
    FROM 
        inventario_joyas 
    WHERE 
        id = p_inventario_id;
    
    IF v_gramos_disponibles < p_gramos_vendidos THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No hay suficientes gramos disponibles en el inventario';
        ROLLBACK;
    END IF;
    
    -- Obtener precio por gramo de la categoría
    SELECT 
        precio_gramo 
    INTO 
        v_precio_gramo 
    FROM 
        categorias_joya 
    WHERE 
        id = v_categoria_id;
    
    -- Calcular subtotal matemático
    SET v_subtotal = p_gramos_vendidos * v_precio_gramo;
    
    -- Si no se proporciona un precio final, usar el calculado
    IF p_precio_final IS NULL OR p_precio_final = 0 THEN
        SET p_precio_final = v_subtotal;
    END IF;
    
    -- Crear nuevo crédito
    INSERT INTO creditos (
        cliente_id, 
        descripcion_articulo, 
        precio_venta, 
        plazo_meses, 
        saldo_pendiente, 
        tasa_interes, 
        fecha_credito, 
        estado
    ) VALUES (
        p_cliente_id, 
        p_descripcion_articulo, 
        p_precio_final, -- Usamos el precio final ajustado 
        p_plazo_meses, 
        p_precio_final, -- Saldo pendiente es igual al precio final
        p_tasa_interes, 
        CURRENT_TIMESTAMP, 
        'activo'
    );
    
    -- Obtener ID del crédito creado
    SET v_credito_id = LAST_INSERT_ID();
    
    -- Agregar detalle de crédito de joyas
    INSERT INTO detalle_credito_joyas (
        credito_id, 
        inventario_id, 
        gramos_vendidos, 
        precio_venta_gramo, 
        subtotal_calculado,
        subtotal_final
    ) VALUES (
        v_credito_id, 
        p_inventario_id, 
        p_gramos_vendidos, 
        v_precio_gramo, 
        v_subtotal,      -- Precio calculado matemáticamente
        p_precio_final   -- Precio final después del ajuste manual
    );
    
    -- Actualizar inventario
    UPDATE inventario_joyas 
    SET gramos_disponible = gramos_disponible - p_gramos_vendidos 
    WHERE id = p_inventario_id;
    
    -- Si el inventario llega a cero, marcarlo como inactivo
    IF (gramos_disponible - p_gramos_vendidos) <= 0 THEN
        UPDATE inventario_joyas SET activo = 0 WHERE id = p_inventario_id;
    END IF;
    
    -- Confirmar transacción
    COMMIT;
    
    -- Devolver el ID del crédito creado
    SELECT v_credito_id AS credito_id;
END //

DELIMITER ;

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