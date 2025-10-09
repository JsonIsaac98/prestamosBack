-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 08-10-2025 a las 23:12:08
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `mydatabase`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias_joya`
--

CREATE TABLE `categorias_joya` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio_gramo` decimal(10,2) NOT NULL,
  `activo` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias_joya`
--

INSERT INTO `categorias_joya` (`id`, `nombre`, `descripcion`, `precio_gramo`, `activo`, `created_at`, `updated_at`) VALUES
(1, 'Oro', 'Oro de 10k', 650.00, 1, '2025-08-21 17:43:00', '2025-08-21 17:43:00'),
(2, 'Plata', 'Plata italiana 925', 50.00, 1, '2025-08-30 23:06:01', '2025-08-30 23:06:01');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `direccion` text NOT NULL,
  `dpi` varchar(13) NOT NULL,
  `saldo_total` decimal(10,2) NOT NULL DEFAULT 0.00,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `activo` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id`, `nombre`, `telefono`, `direccion`, `dpi`, `saldo_total`, `fecha_registro`, `activo`) VALUES
(1, 'yeison', '48791596', 'Barrio la democracia', '3392694801412', 0.00, '2025-08-21 17:40:09', 1),
(2, 'Abner Ralios', '44444444', 'de aqui', '9999999999999', 0.00, '2025-08-23 16:46:54', 1),
(3, 'Isaac', '72348957', 'QUiche', '4985723897458', 0.00, '2025-08-30 22:50:01', 1),
(16, 'Manuel', '55667788', 'testda', '', 0.00, '2025-09-06 17:32:56', 1),
(20, 'juan luis', '88888888', 'sete', '3452345234523', 0.00, '2025-09-06 18:14:01', 1),
(21, 'Nayeli', '50505020', 'Caquil', '', 0.00, '2025-09-06 18:35:30', 1),
(22, 'juan manuel', '66778899', 'joyabaj', '', 0.00, '2025-10-08 17:07:42', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `creditos`
--

CREATE TABLE `creditos` (
  `id` int(11) NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `descripcion_articulo` text NOT NULL,
  `precio_venta` decimal(10,2) NOT NULL,
  `plazo_meses` int(11) NOT NULL,
  `saldo_pendiente` decimal(10,2) NOT NULL,
  `fecha_credito` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_ultimo_pago` timestamp NULL DEFAULT NULL,
  `estado` enum('ACTIVO','PAGADO','ATRASADO') NOT NULL DEFAULT 'ACTIVO',
  `tasa_interes` decimal(5,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `creditos`
--

INSERT INTO `creditos` (`id`, `cliente_id`, `descripcion_articulo`, `precio_venta`, `plazo_meses`, `saldo_pendiente`, `fecha_credito`, `fecha_ultimo_pago`, `estado`, `tasa_interes`) VALUES
(1, 1, 'test', 6500.00, 1, 0.00, '2025-08-21 19:55:55', NULL, 'PAGADO', 5.00),
(2, 1, 'test14 credito', 16250.00, 1, 0.00, '2025-08-22 04:44:08', NULL, 'PAGADO', 0.00),
(3, 1, 'test15 cred', 9750.00, 1, 0.00, '2025-08-22 05:04:37', NULL, 'PAGADO', 0.00),
(4, 1, 'test cred 15', 6500.00, 1, 0.00, '2025-08-22 05:10:06', NULL, 'PAGADO', 0.00),
(5, 2, 'test', 6501.30, 1, 0.00, '2025-08-23 17:18:23', NULL, 'PAGADO', 0.00),
(6, 2, 'test 24 cred', 6500.00, 1, 0.00, '2025-08-24 14:36:51', NULL, 'PAGADO', 0.00),
(7, 1, 're', 3250.00, 1, 0.00, '2025-08-24 14:39:09', NULL, 'PAGADO', 0.00),
(8, 2, 'test', 6500.00, 1, 0.00, '2025-08-24 14:49:56', NULL, 'PAGADO', 0.00),
(9, 3, 'Pulsera de oro de 10 gramos', 6500.00, 1, 5500.00, '2025-08-30 22:54:23', NULL, 'ACTIVO', 0.00),
(10, 1, 'pulsera oro 5gramos', 3250.00, 1, 0.00, '2025-08-30 22:56:13', NULL, 'PAGADO', 0.00),
(11, 1, 'Venta de anillo de plata de 10 gramos y cadena de oro de 5 gramos', 3750.00, 1, 3750.00, '2025-08-30 23:09:15', NULL, 'ACTIVO', 0.00),
(12, 21, 'Anillo de oro de 10g', 6500.00, 11, 6500.00, '2025-09-06 18:36:32', NULL, 'ACTIVO', 0.00),
(13, 22, 'venta de anillo de plata 30GRM', 1500.00, 3, 500.00, '2025-10-08 17:10:35', NULL, 'ACTIVO', 0.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_credito_joyas`
--

CREATE TABLE `detalle_credito_joyas` (
  `id` int(11) NOT NULL,
  `credito_id` int(11) NOT NULL,
  `inventario_id` int(11) NOT NULL,
  `gramos_vendidos` decimal(10,3) NOT NULL,
  `precio_venta_gramo` decimal(10,2) NOT NULL,
  `subtotal_calculado` decimal(10,2) NOT NULL COMMENT 'Precio calculado matemáticamente',
  `subtotal_final` decimal(10,2) NOT NULL COMMENT 'Precio final después del ajuste manual',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_credito_joyas`
--

INSERT INTO `detalle_credito_joyas` (`id`, `credito_id`, `inventario_id`, `gramos_vendidos`, `precio_venta_gramo`, `subtotal_calculado`, `subtotal_final`, `created_at`) VALUES
(4, 1, 1, 10.000, 650.00, 6500.00, 6500.00, '2025-08-21 19:55:55'),
(5, 2, 1, 25.000, 650.00, 16250.00, 16250.00, '2025-08-22 04:44:08'),
(6, 3, 1, 15.000, 650.00, 9750.00, 9750.00, '2025-08-22 05:04:37'),
(7, 4, 1, 10.000, 650.00, 6500.00, 6500.00, '2025-08-22 05:10:06'),
(8, 5, 1, 10.002, 650.00, 6501.30, 6501.30, '2025-08-23 17:18:23'),
(9, 6, 1, 10.000, 650.00, 6500.00, 6500.00, '2025-08-24 14:36:51'),
(11, 8, 1, 10.000, 650.00, 6500.00, 6500.00, '2025-08-24 14:49:56'),
(12, 9, 1, 10.000, 650.00, 6500.00, 6500.00, '2025-08-30 22:54:23'),
(13, 10, 1, 5.000, 650.00, 3250.00, 3250.00, '2025-08-30 22:56:13'),
(14, 11, 2, 10.000, 50.00, 500.00, 500.00, '2025-08-30 23:09:15'),
(15, 11, 1, 5.000, 650.00, 3250.00, 3250.00, '2025-08-30 23:09:15'),
(16, 12, 1, 10.000, 650.00, 6500.00, 6500.00, '2025-09-06 18:36:32'),
(17, 13, 2, 30.000, 50.00, 1500.00, 1500.00, '2025-10-08 17:10:35');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_venta_joyas`
--

CREATE TABLE `detalle_venta_joyas` (
  `id` int(11) NOT NULL,
  `venta_id` int(11) NOT NULL,
  `inventario_id` int(11) NOT NULL,
  `gramos_vendidos` decimal(8,3) NOT NULL,
  `precio_venta_gramo` decimal(10,2) NOT NULL,
  `subtotal_calculado` decimal(10,2) NOT NULL,
  `subtotal_final` decimal(10,2) NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalle_venta_joyas`
--

INSERT INTO `detalle_venta_joyas` (`id`, `venta_id`, `inventario_id`, `gramos_vendidos`, `precio_venta_gramo`, `subtotal_calculado`, `subtotal_final`, `created_at`) VALUES
(1, 4, 1, 50.000, 0.00, 0.00, 0.00, '2025-08-21 13:55:33.435959'),
(2, 5, 1, 5.000, 0.00, 0.00, 0.00, '2025-08-21 13:56:08.900328'),
(3, 6, 1, 35.000, 0.00, 0.00, 0.00, '2025-08-21 16:23:19.999996'),
(4, 7, 1, 50.000, 32500.00, 1625000.00, 32500.00, '2025-08-21 16:30:12.790827'),
(5, 8, 1, 20.000, 13000.00, 13000.00, 13000.00, '2025-08-21 16:36:05.894586'),
(6, 9, 1, 10.000, 6500.00, 6500.00, 6500.00, '2025-08-21 21:34:57.239995'),
(7, 10, 1, 9.997, 6498.05, 6498.05, 6498.05, '2025-08-21 21:36:42.034374'),
(8, 11, 1, 10.003, 6501.95, 6501.95, 6501.95, '2025-08-21 21:37:32.982177'),
(9, 12, 1, 25.000, 16250.00, 16250.00, 16250.00, '2025-08-21 22:01:00.636134'),
(10, 13, 1, 25.000, 16250.00, 16250.00, 16250.00, '2025-08-21 22:58:18.189863'),
(11, 14, 1, 10.000, 6500.00, 6500.00, 6500.00, '2025-08-21 23:05:05.167346'),
(12, 15, 1, 19.998, 12998.70, 12998.70, 12998.70, '2025-08-21 23:15:53.337573'),
(13, 16, 1, 10.000, 6500.00, 6500.00, 6500.00, '2025-08-21 23:17:00.664449'),
(14, 17, 1, 10.000, 6500.00, 6500.00, 6500.00, '2025-08-23 11:26:32.393332'),
(15, 18, 1, 10.000, 6500.00, 6500.00, 6500.00, '2025-08-23 11:27:10.274297'),
(16, 19, 1, 10.000, 6500.00, 6500.00, 6500.00, '2025-08-24 08:34:35.878806'),
(17, 20, 1, 10.000, 6500.00, 6500.00, 6500.00, '2025-08-24 08:50:17.223961'),
(23, 26, 2, 10.000, 500.00, 500.00, 500.00, '2025-09-06 11:02:17.754556');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario_joyas`
--

CREATE TABLE `inventario_joyas` (
  `id` int(11) NOT NULL,
  `categoria_id` int(11) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `gramos_total` decimal(10,3) NOT NULL,
  `gramos_disponible` decimal(10,3) NOT NULL,
  `fecha_ingreso` timestamp NOT NULL DEFAULT current_timestamp(),
  `costo_adquisicion` decimal(10,2) NOT NULL,
  `activo` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `inventario_joyas`
--

INSERT INTO `inventario_joyas` (`id`, `categoria_id`, `descripcion`, `gramos_total`, `gramos_disponible`, `fecha_ingreso`, `costo_adquisicion`, `activo`, `created_at`, `updated_at`) VALUES
(1, 1, 'Compra de oro de 10k ', 500.000, 70.000, '2025-08-21 17:43:55', 175000.00, 1, '2025-08-21 17:43:55', '2025-09-06 18:36:32'),
(2, 2, 'Compra de plata italiana', 200.000, 150.000, '2025-08-30 23:06:49', 25.00, 1, '2025-08-30 23:06:49', '2025-10-08 17:10:35');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario_stock`
--

CREATE TABLE `inventario_stock` (
  `id` int(11) NOT NULL,
  `categoria_id` int(11) NOT NULL,
  `gramos_total` decimal(10,3) NOT NULL DEFAULT 0.000,
  `gramos_disponible` decimal(10,3) NOT NULL DEFAULT 0.000,
  `gramos_vendido` decimal(10,3) NOT NULL DEFAULT 0.000,
  `costo_promedio` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updated_at` datetime(6) NOT NULL DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos_inventario`
--

CREATE TABLE `movimientos_inventario` (
  `id` int(11) NOT NULL,
  `categoria_id` int(11) NOT NULL,
  `tipo_movimiento` enum('COMPRA','VENTA','AJUSTE') NOT NULL,
  `gramos` decimal(10,3) NOT NULL,
  `costo_unitario` decimal(10,2) DEFAULT NULL,
  `costo_total` decimal(10,2) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `referencia_id` int(11) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT current_timestamp(6)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `movimientos_inventario`
--

INSERT INTO `movimientos_inventario` (`id`, `categoria_id`, `tipo_movimiento`, `gramos`, `costo_unitario`, `costo_total`, `descripcion`, `referencia_id`, `created_at`) VALUES
(1, 1, 'VENTA', 50.000, 650.00, 32500.00, 'Venta joya', 4, '2025-08-21 13:55:33.454000'),
(2, 1, 'VENTA', 5.000, 650.00, 3250.00, 'Venta joya', 5, '2025-08-21 13:56:08.906591'),
(3, 1, 'VENTA', 35.000, 650.00, 22750.00, 'Venta joya', 6, '2025-08-21 16:23:20.011657'),
(4, 1, 'VENTA', 50.000, 650.00, 32500.00, 'Venta joya', 7, '2025-08-21 16:30:12.801922'),
(5, 1, 'VENTA', 20.000, 650.00, 13000.00, 'Venta joya', 8, '2025-08-21 16:36:05.903056'),
(6, 1, 'VENTA', 10.000, 650.00, 6500.00, 'Venta joya', 9, '2025-08-21 21:34:57.255944'),
(7, 1, 'VENTA', 9.997, 650.00, 6498.05, 'Venta joya', 10, '2025-08-21 21:36:42.041059'),
(8, 1, 'VENTA', 10.003, 650.00, 6501.95, 'Venta joya', 11, '2025-08-21 21:37:32.994837'),
(9, 1, 'VENTA', 25.000, 650.00, 16250.00, 'Venta joya', 12, '2025-08-21 22:01:00.641790'),
(10, 1, 'VENTA', 25.000, 650.00, 16250.00, 'Venta joya', 13, '2025-08-21 22:58:18.199382'),
(11, 1, 'VENTA', 10.000, 650.00, 6500.00, 'Venta joya', 14, '2025-08-21 23:05:05.180684'),
(12, 1, 'VENTA', 19.998, 650.00, 12998.70, 'Venta joya', 15, '2025-08-21 23:15:53.347774'),
(13, 1, 'VENTA', 10.000, 650.00, 6500.00, 'Venta joya', 16, '2025-08-21 23:17:00.670302'),
(14, 1, 'VENTA', 10.000, 650.00, 6500.00, 'Venta joya', 17, '2025-08-23 11:26:32.407912'),
(15, 1, 'VENTA', 10.000, 650.00, 6500.00, 'Venta joya', 18, '2025-08-23 11:27:10.279136'),
(16, 1, 'VENTA', 10.000, 650.00, 6500.00, 'Venta joya', 19, '2025-08-24 08:34:35.893352'),
(17, 1, 'VENTA', 10.000, 650.00, 6500.00, 'Venta joya', 20, '2025-08-24 08:50:17.234595'),
(18, 2, 'VENTA', 10.000, 50.00, 500.00, 'Venta joya', 26, '2025-09-06 11:02:17.767988');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `id` int(11) NOT NULL,
  `credito_id` int(11) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha_pago` timestamp NOT NULL DEFAULT current_timestamp(),
  `tipo_pago` enum('EFECTIVO','TRANSFERENCIA') NOT NULL,
  `comentario` text DEFAULT NULL,
  `estado` enum('ACTIVO','ANULADO') NOT NULL DEFAULT 'ACTIVO'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pagos`
--

INSERT INTO `pagos` (`id`, `credito_id`, `monto`, `fecha_pago`, `tipo_pago`, `comentario`, `estado`) VALUES
(1, 1, 6500.00, '2025-08-22 17:01:59', 'EFECTIVO', 'pago completo', 'ACTIVO'),
(2, 1, 70.00, '2025-08-22 18:02:20', 'EFECTIVO', '', 'ANULADO'),
(3, 1, 20.00, '2025-08-22 18:19:13', 'EFECTIVO', '', 'ACTIVO'),
(4, 1, 500.00, '2025-08-22 18:37:44', 'EFECTIVO', 'PAGO PARCIAL', 'ACTIVO'),
(5, 1, 6000.00, '2025-08-22 18:38:27', 'EFECTIVO', '', 'ACTIVO'),
(6, 4, 500.00, '2025-08-22 18:40:53', 'EFECTIVO', '', 'ACTIVO'),
(7, 4, 3000.00, '2025-08-22 18:44:03', 'EFECTIVO', 'TEST', 'ACTIVO'),
(8, 3, 750.00, '2025-08-22 18:48:28', 'EFECTIVO', '', 'ACTIVO'),
(9, 3, 250.00, '2025-08-22 18:52:52', 'EFECTIVO', '', 'ACTIVO'),
(10, 4, 100.00, '2025-08-22 18:53:05', 'EFECTIVO', '', 'ACTIVO'),
(11, 4, 100.00, '2025-08-22 18:55:16', 'EFECTIVO', '', 'ACTIVO'),
(12, 4, 100.00, '2025-08-22 18:55:46', 'EFECTIVO', '', 'ACTIVO'),
(13, 4, 200.00, '2025-08-22 18:59:04', 'EFECTIVO', '', 'ACTIVO'),
(14, 8, 6500.00, '2025-08-24 16:00:54', 'EFECTIVO', '', 'ACTIVO'),
(15, 7, 3250.00, '2025-08-24 16:01:06', 'EFECTIVO', '', 'ACTIVO'),
(16, 6, 6500.00, '2025-08-24 16:01:18', 'EFECTIVO', '', 'ACTIVO'),
(17, 5, 6501.30, '2025-08-24 16:01:29', 'EFECTIVO', '', 'ACTIVO'),
(18, 4, 2500.00, '2025-08-24 16:01:38', 'EFECTIVO', '', 'ACTIVO'),
(19, 3, 8750.00, '2025-08-24 16:01:48', 'EFECTIVO', '', 'ACTIVO'),
(20, 2, 10000.00, '2025-08-24 16:02:11', 'EFECTIVO', '', 'ACTIVO'),
(21, 2, 6250.00, '2025-08-24 16:02:37', 'EFECTIVO', '', 'ACTIVO'),
(22, 10, 3250.00, '2025-08-30 22:58:13', 'EFECTIVO', 'Pago total del credito', 'ANULADO'),
(23, 10, 3250.00, '2025-08-30 23:01:57', 'TRANSFERENCIA', 'Pago en transferencia', 'ACTIVO'),
(24, 9, 1000.00, '2025-08-30 23:12:59', 'EFECTIVO', 'primer pago', 'ACTIVO'),
(25, 13, 1000.00, '2025-10-08 17:18:48', 'EFECTIVO', 'primer pago', 'ACTIVO');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` enum('admin','client') NOT NULL DEFAULT 'client',
  `is_first_login` tinyint(4) NOT NULL DEFAULT 1,
  `cliente_id` int(11) DEFAULT NULL,
  `password_reset_token` varchar(255) DEFAULT NULL,
  `password_reset_expires` timestamp NULL DEFAULT NULL,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `active` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `role`, `is_first_login`, `cliente_id`, `password_reset_token`, `password_reset_expires`, `last_login`, `created_at`, `updated_at`, `active`) VALUES
(1, 'admin', '$2b$10$C6SJDe6AcPKOUdGROpCmgegdZEG3aN45T8H4xITLJlSZIra6JAYCm', 'yeison@gmail.com', 'admin', 0, 1, NULL, NULL, NULL, '2025-08-21 17:39:15', '2025-09-06 18:14:29', 1),
(2, 'yeison', '123456', 'yei@gmail.com', 'client', 1, NULL, NULL, NULL, NULL, '2025-08-22 16:59:09', '2025-08-22 16:59:09', 1),
(3, 'yeison_isaac', '123456', 'yei12@gma.com', 'client', 1, NULL, NULL, NULL, NULL, '2025-08-30 23:12:30', '2025-08-30 23:17:48', 1),
(4, '55667788', '$2b$10$nL1RtNxpLbJNE/4NQIQrCO4Q4IMAmSYKNv9eB4Mh47NDfSJS5Fzkm', '55667788@clientes.local', 'client', 1, 16, NULL, NULL, NULL, '2025-09-06 17:32:56', '2025-09-06 18:31:53', 1),
(5, '88888888', '$2b$10$G.U9olIqHmJVJICvq7afdeu5cZlrVkgaHWnSH5onTpn0Y7TbcgQqS', '88888888@clientes.com', 'client', 0, 20, NULL, NULL, NULL, '2025-09-06 18:14:01', '2025-09-06 18:16:56', 1),
(6, '50505020', '$2b$10$udjEnaj9aQUPvmkFIxQm7.xSvgLwya5H8wy3wkttSczyODei2XOmy', '50505020@clientes.com', 'client', 0, 21, NULL, NULL, NULL, '2025-09-06 18:35:31', '2025-09-06 18:37:55', 1),
(7, '66778899', '$2b$10$7qzi5Vb0oCkctQSik6rkNOxFqdpzJ9PH4T9UuEpks4fjN/5dvYYKK', '66778899@clientes.com', 'client', 0, 22, NULL, NULL, NULL, '2025-10-08 17:07:43', '2025-10-08 17:19:13', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `id` int(11) NOT NULL,
  `cliente_id` int(11) NOT NULL,
  `credito_id` int(11) DEFAULT NULL,
  `descripcion_articulo` text NOT NULL,
  `precio_venta` decimal(10,2) NOT NULL,
  `fecha_venta` timestamp(6) NOT NULL DEFAULT current_timestamp(6),
  `comentario` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`id`, `cliente_id`, `credito_id`, `descripcion_articulo`, `precio_venta`, `fecha_venta`, `comentario`) VALUES
(1, 1, NULL, 'compra de cadena de oro de 10k de 100 gramos al contado', 65000.00, '2025-08-21 18:09:05.565000', NULL),
(2, 1, NULL, 'compra de cadena de oro de 10k de 100 gramos al contado', 32500.00, '2025-08-21 18:26:43.134000', NULL),
(3, 1, NULL, 'compra de cadena de oro de 10k de 100 gramos al contado', 32500.00, '2025-08-21 18:29:49.588000', NULL),
(4, 1, NULL, 'compra de cadena de oro de 10k de 100 gramos al contado', 0.00, '2025-08-21 19:55:33.422189', NULL),
(5, 1, NULL, 'test2', 0.00, '2025-08-21 19:56:08.877770', NULL),
(6, 1, NULL, 'testing', 0.00, '2025-08-21 22:23:19.978596', NULL),
(7, 1, NULL, 'test55', 0.00, '2025-08-21 22:30:12.767323', NULL),
(8, 1, NULL, 'Test venta55', 0.00, '2025-08-21 22:36:05.872599', NULL),
(9, 1, NULL, 'test10', 9.00, '2025-08-22 03:34:57.228052', NULL),
(10, 1, NULL, 'test11', 80.00, '2025-08-22 03:36:42.010549', NULL),
(11, 1, NULL, 'test12', 6501.95, '2025-08-22 03:37:32.977589', NULL),
(12, 1, NULL, 'test13', 16250.00, '2025-08-22 04:01:00.632264', NULL),
(13, 1, NULL, 'test14', 16250.00, '2025-08-22 04:58:18.182087', NULL),
(14, 1, NULL, 'test15 conta', 6500.00, '2025-08-22 05:05:05.146263', NULL),
(15, 1, NULL, 'tesststsst', 12998.70, '2025-08-22 05:15:53.312826', NULL),
(16, 1, NULL, 'aaaa', 6500.00, '2025-08-22 05:17:00.643847', NULL),
(17, 1, NULL, 'test', 6500.00, '2025-08-23 17:26:32.386053', NULL),
(18, 2, NULL, 'test venta abner', 6500.00, '2025-08-23 17:27:10.270488', NULL),
(19, 2, NULL, 'test 24', 6500.00, '2025-08-24 14:34:35.866886', NULL),
(20, 1, NULL, 'test', 6500.00, '2025-08-24 14:50:17.208195', NULL),
(26, 1, NULL, 'test venta', 500.00, '2025-09-06 17:02:17.742198', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias_joya`
--
ALTER TABLE `categorias_joya`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `creditos`
--
ALTER TABLE `creditos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_c7fc008cb8acdeb47f47d637894` (`cliente_id`);

--
-- Indices de la tabla `detalle_credito_joyas`
--
ALTER TABLE `detalle_credito_joyas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_1f24fae4ab551c79ed87e81d083` (`credito_id`),
  ADD KEY `FK_118f7e5ece5872d7cbc05edfdf4` (`inventario_id`);

--
-- Indices de la tabla `detalle_venta_joyas`
--
ALTER TABLE `detalle_venta_joyas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_b7151386172a8b33c6bc9605205` (`venta_id`),
  ADD KEY `FK_fb020bb258091bcbd85770f9658` (`inventario_id`);

--
-- Indices de la tabla `inventario_joyas`
--
ALTER TABLE `inventario_joyas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_acfa336e73da7c0f2e585735283` (`categoria_id`);

--
-- Indices de la tabla `inventario_stock`
--
ALTER TABLE `inventario_stock`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `REL_cfec81e2e4707bd1c70b0afe71` (`categoria_id`);

--
-- Indices de la tabla `movimientos_inventario`
--
ALTER TABLE `movimientos_inventario`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_b9d172dd349388e081b9a518ab3` (`categoria_id`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_8c34288e56baf98358b27dff18e` (`credito_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_fe0bb3f6520ee0469504521e71` (`username`),
  ADD UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`),
  ADD UNIQUE KEY `REL_ec5662bf3e5f573472c6e1ca60` (`cliente_id`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_6a9b8170c731e6ca2449ea27c52` (`cliente_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias_joya`
--
ALTER TABLE `categorias_joya`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `creditos`
--
ALTER TABLE `creditos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `detalle_credito_joyas`
--
ALTER TABLE `detalle_credito_joyas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `detalle_venta_joyas`
--
ALTER TABLE `detalle_venta_joyas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `inventario_joyas`
--
ALTER TABLE `inventario_joyas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `inventario_stock`
--
ALTER TABLE `inventario_stock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `movimientos_inventario`
--
ALTER TABLE `movimientos_inventario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `creditos`
--
ALTER TABLE `creditos`
  ADD CONSTRAINT `FK_c7fc008cb8acdeb47f47d637894` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `detalle_credito_joyas`
--
ALTER TABLE `detalle_credito_joyas`
  ADD CONSTRAINT `FK_118f7e5ece5872d7cbc05edfdf4` FOREIGN KEY (`inventario_id`) REFERENCES `inventario_joyas` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_1f24fae4ab551c79ed87e81d083` FOREIGN KEY (`credito_id`) REFERENCES `creditos` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `detalle_venta_joyas`
--
ALTER TABLE `detalle_venta_joyas`
  ADD CONSTRAINT `FK_b7151386172a8b33c6bc9605205` FOREIGN KEY (`venta_id`) REFERENCES `ventas` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_fb020bb258091bcbd85770f9658` FOREIGN KEY (`inventario_id`) REFERENCES `inventario_joyas` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `inventario_joyas`
--
ALTER TABLE `inventario_joyas`
  ADD CONSTRAINT `FK_acfa336e73da7c0f2e585735283` FOREIGN KEY (`categoria_id`) REFERENCES `categorias_joya` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `inventario_stock`
--
ALTER TABLE `inventario_stock`
  ADD CONSTRAINT `FK_cfec81e2e4707bd1c70b0afe71e` FOREIGN KEY (`categoria_id`) REFERENCES `categorias_joya` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `movimientos_inventario`
--
ALTER TABLE `movimientos_inventario`
  ADD CONSTRAINT `FK_b9d172dd349388e081b9a518ab3` FOREIGN KEY (`categoria_id`) REFERENCES `categorias_joya` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `FK_8c34288e56baf98358b27dff18e` FOREIGN KEY (`credito_id`) REFERENCES `creditos` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `FK_ec5662bf3e5f573472c6e1ca609` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD CONSTRAINT `FK_6a9b8170c731e6ca2449ea27c52` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
