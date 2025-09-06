-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-09-2025 a las 22:11:16
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
CREATE DATABASE IF NOT EXISTS `mydatabase` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `mydatabase`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias_joya`
--

DROP TABLE IF EXISTS `categorias_joya`;
CREATE TABLE `categorias_joya` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `precio_gramo` decimal(10,2) NOT NULL,
  `activo` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

DROP TABLE IF EXISTS `clientes`;
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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `creditos`
--

DROP TABLE IF EXISTS `creditos`;
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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_credito_joyas`
--

DROP TABLE IF EXISTS `detalle_credito_joyas`;
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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle_venta_joyas`
--

DROP TABLE IF EXISTS `detalle_venta_joyas`;
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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario_joyas`
--

DROP TABLE IF EXISTS `inventario_joyas`;
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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario_stock`
--

DROP TABLE IF EXISTS `inventario_stock`;
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

DROP TABLE IF EXISTS `movimientos_inventario`;
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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

DROP TABLE IF EXISTS `pagos`;
CREATE TABLE `pagos` (
  `id` int(11) NOT NULL,
  `credito_id` int(11) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha_pago` timestamp NOT NULL DEFAULT current_timestamp(),
  `tipo_pago` enum('EFECTIVO','TRANSFERENCIA') NOT NULL,
  `comentario` text DEFAULT NULL,
  `estado` enum('ACTIVO','ANULADO') NOT NULL DEFAULT 'ACTIVO'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

DROP TABLE IF EXISTS `users`;
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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

DROP TABLE IF EXISTS `ventas`;
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `creditos`
--
ALTER TABLE `creditos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalle_credito_joyas`
--
ALTER TABLE `detalle_credito_joyas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detalle_venta_joyas`
--
ALTER TABLE `detalle_venta_joyas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `inventario_joyas`
--
ALTER TABLE `inventario_joyas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `inventario_stock`
--
ALTER TABLE `inventario_stock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `movimientos_inventario`
--
ALTER TABLE `movimientos_inventario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

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
