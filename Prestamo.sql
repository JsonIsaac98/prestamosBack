-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         8.0.30 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Volcando estructura para evento prestamos.check_creditos_atrasados
DELIMITER //
CREATE EVENT `check_creditos_atrasados` ON SCHEDULE EVERY 1 DAY STARTS '2025-01-04 13:57:48' ON COMPLETION NOT PRESERVE ENABLE DO BEGIN
    UPDATE creditos
    SET estado = 'ATRASADO'
    WHERE estado = 'ACTIVO'
    AND fecha_ultimo_pago IS NOT NULL
    AND fecha_ultimo_pago < DATE_SUB(NOW(), INTERVAL 30 DAY);
END//
DELIMITER ;

-- Volcando estructura para tabla prestamos.clientes
CREATE TABLE IF NOT EXISTS `clientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha_registro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `activo` tinyint NOT NULL DEFAULT '1',
  `dpi` varchar(13) NOT NULL,
  `saldo_total` decimal(10,2) NOT NULL DEFAULT '0.00',
  `nombre` varchar(100) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `direccion` text NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_38ba6656d393bff6d44f38c275` (`dpi`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla prestamos.clientes: ~0 rows (aproximadamente)
INSERT INTO `clientes` (`id`, `fecha_registro`, `activo`, `dpi`, `saldo_total`, `nombre`, `telefono`, `direccion`) VALUES
	(1, '2025-01-04 20:17:07', 1, '1234567890124', 0.00, 'Yeison Gomez', '48555522', 'Barrio la libertad'),
	(2, '2025-01-06 00:27:21', 1, '4879555455454', 0.00, 'Carmen Gamez', '34534534', 'Caquil'),
	(3, '2025-01-06 00:45:30', 1, '4884845454541', 0.00, 'Abner Ralios', '65465465', 'Alla');

-- Volcando estructura para tabla prestamos.creditos
CREATE TABLE IF NOT EXISTS `creditos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cliente_id` int NOT NULL,
  `descripcion_articulo` text NOT NULL,
  `precio_venta` decimal(10,2) NOT NULL,
  `plazo_meses` int NOT NULL,
  `saldo_pendiente` decimal(10,2) NOT NULL,
  `fecha_ultimo_pago` timestamp NULL DEFAULT NULL,
  `tasa_interes` decimal(5,2) NOT NULL,
  `fecha_credito` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `estado` enum('ACTIVO','PAGADO','ATRASADO') NOT NULL DEFAULT 'ACTIVO',
  PRIMARY KEY (`id`),
  KEY `FK_c7fc008cb8acdeb47f47d637894` (`cliente_id`),
  CONSTRAINT `FK_c7fc008cb8acdeb47f47d637894` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla prestamos.creditos: ~4 rows (aproximadamente)
INSERT INTO `creditos` (`id`, `cliente_id`, `descripcion_articulo`, `precio_venta`, `plazo_meses`, `saldo_pendiente`, `fecha_ultimo_pago`, `tasa_interes`, `fecha_credito`, `estado`) VALUES
	(1, 1, 'Anillo de oro 14k 10gr', 6000.00, 3, 0.00, '2025-01-04 22:11:36', 0.00, '2025-01-04 20:37:16', 'PAGADO'),
	(2, 1, 'PULSERA DE ORO 14K, PESO DE 15GRAMOS', 1500.00, 2, 0.00, '2025-01-05 23:54:02', 0.00, '2024-11-24 22:06:23', 'PAGADO'),
	(4, 2, 'Cadena de plata ', 2000.00, 1, 0.00, '2025-01-06 00:46:37', 0.00, '2025-01-06 00:45:04', 'PAGADO'),
	(5, 3, 'Dije de zapato ', 500.00, 1, 0.00, '2025-01-06 01:42:59', 0.00, '2025-01-06 00:45:49', 'PAGADO');

-- Volcando estructura para tabla prestamos.pagos
CREATE TABLE IF NOT EXISTS `pagos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `monto` decimal(10,2) NOT NULL,
  `fecha_pago` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `comentario` text,
  `credito_id` int NOT NULL,
  `tipo_pago` enum('EFECTIVO','TRANSFERENCIA') NOT NULL,
  `estado` enum('ACTIVO','ANULADO') NOT NULL DEFAULT 'ACTIVO',
  PRIMARY KEY (`id`),
  KEY `FK_8c34288e56baf98358b27dff18e` (`credito_id`),
  CONSTRAINT `FK_8c34288e56baf98358b27dff18e` FOREIGN KEY (`credito_id`) REFERENCES `creditos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla prestamos.pagos: ~13 rows (aproximadamente)
INSERT INTO `pagos` (`id`, `monto`, `fecha_pago`, `comentario`, `credito_id`, `tipo_pago`, `estado`) VALUES
	(1, 2000.00, '2025-01-04 20:38:38', 'Primer pago', 1, 'EFECTIVO', 'ACTIVO'),
	(2, 2000.00, '2025-01-04 22:11:24', 'Segundo pago', 1, 'EFECTIVO', 'ACTIVO'),
	(3, 2000.00, '2025-01-04 22:11:36', 'Tercer pago', 1, 'EFECTIVO', 'ACTIVO'),
	(4, 500.00, '2025-01-05 23:53:24', 'Primer pago de la pulsera', 2, 'EFECTIVO', 'ACTIVO'),
	(5, 1000.00, '2025-01-05 23:54:02', 'segundo pago', 2, 'TRANSFERENCIA', 'ACTIVO'),
	(7, 2000.00, '2025-01-06 00:46:37', 'primer pago cadena', 4, 'TRANSFERENCIA', 'ACTIVO'),
	(8, 200.00, '2025-01-06 00:47:13', '', 5, 'EFECTIVO', 'ANULADO'),
	(9, 100.00, '2025-01-06 00:47:26', '', 5, 'TRANSFERENCIA', 'ANULADO'),
	(10, 200.00, '2025-01-06 00:47:35', '', 5, 'EFECTIVO', 'ANULADO'),
	(11, 300.00, '2025-01-06 01:14:10', '', 5, 'EFECTIVO', 'ANULADO'),
	(12, 200.00, '2025-01-06 01:23:06', '', 5, 'EFECTIVO', 'ANULADO'),
	(13, 300.00, '2025-01-06 01:42:34', '', 5, 'EFECTIVO', 'ANULADO'),
	(14, 200.00, '2025-01-06 01:37:28', '', 5, 'EFECTIVO', 'ACTIVO'),
	(15, 300.00, '2025-01-06 01:42:59', '', 5, 'EFECTIVO', 'ACTIVO');

-- Volcando estructura para tabla prestamos.productos
CREATE TABLE IF NOT EXISTS `productos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text NOT NULL,
  `precio_base` decimal(10,2) NOT NULL,
  `categoria` varchar(255) NOT NULL,
  `comentario` text NOT NULL,
  `activo` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla prestamos.productos: ~0 rows (aproximadamente)

-- Volcando estructura para vista prestamos.resumen_creditos_cliente
-- Creando tabla temporal para superar errores de dependencia de VIEW
CREATE TABLE `resumen_creditos_cliente` (
	`cliente_id` INT(10) NOT NULL,
	`nombre` VARCHAR(100) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`dpi` VARCHAR(13) NOT NULL COLLATE 'utf8mb4_0900_ai_ci',
	`total_creditos` BIGINT(19) NOT NULL,
	`deuda_total` DECIMAL(32,2) NULL,
	`creditos_atrasados` DECIMAL(23,0) NULL
) ENGINE=MyISAM;

-- Volcando estructura para disparador prestamos.after_credito_insert
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `after_credito_insert` AFTER INSERT ON `creditos` FOR EACH ROW BEGIN
    UPDATE `clientes` 
    SET `saldo_total` = (
        SELECT COALESCE(SUM(`saldo_pendiente`), 0)
        FROM `creditos`
        WHERE `cliente_id` = NEW.`cliente_id`
    )
    WHERE `id` = NEW.`cliente_id`;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Volcando estructura para disparador prestamos.after_credito_update
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `after_credito_update` AFTER UPDATE ON `creditos` FOR EACH ROW BEGIN
    UPDATE clientes c
    SET saldo_total = (
        SELECT COALESCE(SUM(saldo_pendiente), 0)
        FROM creditos
        WHERE cliente_id = NEW.cliente_id
    )
    WHERE c.id = NEW.cliente_id;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Volcando estructura para disparador prestamos.after_pago_anulacion
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `after_pago_anulacion` AFTER UPDATE ON `pagos` FOR EACH ROW BEGIN
    IF NEW.`estado` = 'ANULADO' AND OLD.`estado` = 'ACTIVO' THEN
        -- Revertir el saldo pendiente en el crédito
        UPDATE `creditos` 
        SET `saldo_pendiente` = `saldo_pendiente` + OLD.`monto`,
            `fecha_ultimo_pago` = NOW()  -- Actualiza la fecha del último pago en créditos
        WHERE `id` = NEW.`credito_id`;
        
        -- Actualizar el estado del crédito de PAGADO a ACTIVO si corresponde
        UPDATE `creditos`
        SET `estado` = 'ACTIVO'
        WHERE `id` = NEW.`credito_id`
        AND `estado` = 'PAGADO';
    END IF;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Volcando estructura para disparador prestamos.after_pago_insert
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
DELIMITER //
CREATE TRIGGER `after_pago_insert` AFTER INSERT ON `pagos` FOR EACH ROW BEGIN
    -- Actualizar saldo pendiente en créditos
    UPDATE creditos 
    SET saldo_pendiente = saldo_pendiente - NEW.monto,
        fecha_ultimo_pago = NEW.fecha_pago
    WHERE id = NEW.credito_id;
    
    -- Si el saldo pendiente llega a 0, marcar como PAGADO
    UPDATE creditos 
    SET estado = 'PAGADO'
    WHERE id = NEW.credito_id 
    AND saldo_pendiente <= 0;
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

-- Volcando estructura para vista prestamos.resumen_creditos_cliente
-- Eliminando tabla temporal y crear estructura final de VIEW
DROP TABLE IF EXISTS `resumen_creditos_cliente`;
CREATE ALGORITHM=UNDEFINED SQL SECURITY DEFINER VIEW `resumen_creditos_cliente` AS select `c`.`id` AS `cliente_id`,`c`.`nombre` AS `nombre`,`c`.`dpi` AS `dpi`,count(`cr`.`id`) AS `total_creditos`,sum(`cr`.`saldo_pendiente`) AS `deuda_total`,sum((case when (`cr`.`estado` = 'ATRASADO') then 1 else 0 end)) AS `creditos_atrasados` from (`clientes` `c` left join `creditos` `cr` on((`c`.`id` = `cr`.`cliente_id`))) group by `c`.`id`,`c`.`nombre`,`c`.`dpi`;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
