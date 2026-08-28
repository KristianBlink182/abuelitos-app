-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         8.4.3 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Volcando estructura para tabla abuelitos_peru.abuelitos
CREATE TABLE IF NOT EXISTS `abuelitos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_completo` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `edad` int NOT NULL,
  `dni` varchar(8) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `foto_url` text COLLATE utf8mb4_unicode_ci,
  `historia_biografia` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `necesidades_urgentes` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `departamento` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provincia` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `distrito` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `caserio` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'activo',
  `autoridad_id` int DEFAULT NULL,
  `bodega_id` int DEFAULT NULL,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `foto_vivienda_1` text COLLATE utf8mb4_unicode_ci,
  `foto_vivienda_2` text COLLATE utf8mb4_unicode_ci,
  `foto_vivienda_3` text COLLATE utf8mb4_unicode_ci,
  `dolencias_salud` text COLLATE utf8mb4_unicode_ci,
  `medicamentos` text COLLATE utf8mb4_unicode_ci,
  `carencias_materiales` text COLLATE utf8mb4_unicode_ci,
  `video_url` text COLLATE utf8mb4_unicode_ci,
  `meta_mensual` decimal(10,2) DEFAULT '120.00',
  PRIMARY KEY (`id`),
  KEY `autoridad_id` (`autoridad_id`),
  KEY `bodega_id` (`bodega_id`),
  CONSTRAINT `abuelitos_ibfk_1` FOREIGN KEY (`autoridad_id`) REFERENCES `autoridades` (`id`) ON DELETE SET NULL,
  CONSTRAINT `abuelitos_ibfk_2` FOREIGN KEY (`bodega_id`) REFERENCES `bodegas` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla abuelitos_peru.abuelitos: ~3 rows (aproximadamente)
INSERT INTO `abuelitos` (`id`, `nombre_completo`, `edad`, `dni`, `foto_url`, `historia_biografia`, `necesidades_urgentes`, `departamento`, `provincia`, `distrito`, `caserio`, `estado`, `autoridad_id`, `bodega_id`, `creado_en`, `foto_vivienda_1`, `foto_vivienda_2`, `foto_vivienda_3`, `dolencias_salud`, `medicamentos`, `carencias_materiales`, `video_url`, `meta_mensual`) VALUES
	(1, 'Don Pascual Huaranca', 82, '02341298', 'http://localhost:3000/uploads/1787693793123-723575268.png', 'Don Pascual vive solo en una choza de adobe y paja en las alturas del Caserío Huayllay. Sufre de fuertes dolores articulares por el frío y se sustenta recogiendo leña seca. No tiene hijos cerca ni cuenta con pensión.', 'Víveres de primera necesidad (arroz, avena, aceite, atún) y frazadas térmicas para la temporada de heladas.', 'Cusco', 'Calca', 'Calca', 'Caserío Huayllay', 'activo', 1, 1, '2026-08-25 21:30:05', 'http://localhost:3000/uploads/1787781256094-184278521.png', 'http://localhost:3000/uploads/1787781256097-922573798.png', 'http://localhost:3000/uploads/1787781256099-231442090.png', 'Artrosis severa en rodillas, hipertensión arterial y principio de desnutrición.', 'Losartán 50mg (diario), Paracetamol 500mg (para dolores articulares) y suplementos vitamínicos.', 'Cama con colchón de 1.5 plazas (actualmente duerme sobre cartón en el suelo), 2 frazadas térmicas gruesas para heladas y bastón de apoyo.', 'https://assets.mixkit.co/videos/preview/mixkit-senior-couple-looking-at-a-tablet-41484-large.mp4', 120.00),
	(2, 'Doña Santosa Ramos Mayhua', 79, '23891045', 'http://localhost:3000/uploads/1787693851949-282019493.png', 'Mamá Santosa vive en el anexo de Ccasapata. Perdió casi toda la visión de su ojo derecho y camina con dificultad con apoyo de un bastón de palo. Depende de la solidaridad de sus vecinos para conseguir agua y leña.', 'Alimentos no perecibles (menestras, quinua, avena), leche evaporada y abrigo.', 'Amazonas', 'Chachapoyas', 'Chachapoyas', 'Anexo Ccasapata', 'activo', 2, 2, '2026-08-25 21:30:05', 'http://localhost:3000/uploads/1787785830541-144787663.png', 'http://localhost:3000/uploads/1787785830543-733489471.png', 'http://localhost:3000/uploads/1787785830545-457762351.png', 'Pérdida casi total de visión en ojo derecho por catarata avanzada y osteoporosis.', 'Gotas lubricantes oftálmicas (Lágrimas artificiales), Calcio con Vitamina D y analgésicos.', 'Silla de ruedas o andador de aluminio, pañales de adulto mayor talla G y cobertor de lana.', 'https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-smiling-elderly-woman-41486-large.mp4', 80.00),
	(3, 'Don Eusebio Choquehuanca', 85, '01892341', 'http://localhost:3000/uploads/1787693867306-802404670.png', 'Don Eusebio vive en una vivienda rústica en el altiplano puneño a más de 3,800 msnm. Por su avanzada edad y bronquios crónicos ya no puede trabajar en el campo ni pastear ganado.', 'Canasta básica de víveres mensual, pastillas para el dolor pulmonar, aceite y té filtrante.', 'Puno', 'El Collao', 'Ilave', 'Comunidad Chijichaya', 'activo', 3, 3, '2026-08-25 21:30:05', NULL, NULL, NULL, 'Bronquios crónicos y enfisema pulmonar agravado por el frío del altiplano (-5°C).', 'Salbutamol en inhalador, jarabe expectorante y pastillas para el dolor pulmonar.', 'Cama abrigada, casaca térmica de pluma, botas para el barro y termo para agua caliente.', NULL, 150.00);

-- Volcando estructura para tabla abuelitos_peru.ajustes_web
CREATE TABLE IF NOT EXISTS `ajustes_web` (
  `id` int NOT NULL,
  `tagline` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `titulo` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `foto_banner_url` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `color_fondo` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT '#1E232B',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla abuelitos_peru.ajustes_web: ~1 rows (aproximadamente)
INSERT INTO `ajustes_web` (`id`, `tagline`, `titulo`, `foto_banner_url`, `color_fondo`) VALUES
	(1, 'CONECTANDO CORAZONES, TRANSFORMANDO VIDAS:', 'Apadrina una Sonrisa en el Perú Profundo', 'http://localhost:3000/uploads/1787780895552-201597153.jpg', '#1E232B');

-- Volcando estructura para tabla abuelitos_peru.autoridades
CREATE TABLE IF NOT EXISTS `autoridades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_completo` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dni` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cargo` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `caserio_comunidad` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `distrito` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provincia` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `departamento` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(15) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dni` (`dni`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla abuelitos_peru.autoridades: ~3 rows (aproximadamente)
INSERT INTO `autoridades` (`id`, `nombre_completo`, `dni`, `cargo`, `caserio_comunidad`, `distrito`, `provincia`, `departamento`, `telefono`, `creado_en`) VALUES
	(1, 'Donato Quispe Mamani', '45892134', 'Teniente Gobernador', 'Caserío Huayllay', 'Calca', 'Calca', 'Cusco', '984123456', '2026-08-25 21:30:05'),
	(2, 'Cirilo Palomino Ramos', '23948102', 'Agente Municipal', 'Anexo Ccasapata', 'Churcampa', 'Churcampa', 'Huancavelica', '966812345', '2026-08-25 21:30:05'),
	(3, 'Juan Carlos Mamani Ticona', '01298475', 'Presidente Comunal', 'Comunidad Chijichaya', 'Ilave', 'El Collao', 'Puno', '951432198', '2026-08-25 21:30:05');

-- Volcando estructura para tabla abuelitos_peru.bodegas
CREATE TABLE IF NOT EXISTS `bodegas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_comercio` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dueno_nombre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dni_dueno` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono_yape_plin` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `banco` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numero_cuenta` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `direccion_referencia` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `caserio_comunidad` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `distrito` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provincia` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `departamento` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `usuario` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `estado` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'activo',
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario` (`usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla abuelitos_peru.bodegas: ~3 rows (aproximadamente)
INSERT INTO `bodegas` (`id`, `nombre_comercio`, `dueno_nombre`, `dni_dueno`, `telefono_yape_plin`, `banco`, `numero_cuenta`, `direccion_referencia`, `caserio_comunidad`, `distrito`, `provincia`, `departamento`, `creado_en`, `usuario`, `password`, `estado`) VALUES
	(1, 'Bodega Doña María', 'María Condori', '23984512', '984765432', 'Banco de la Nación', '04-012-456789', 'Plaza Principal frente a la capilla', 'Caserío Huayllay', 'Calca', 'Calca', 'Cusco', '2026-08-25 21:30:05', 'bodega_huayllay', '123', 'activo'),
	(2, 'Comercial Don Teófilo', 'Teófilo Huamán', '10984523', '966453210', 'Banco de la Nación', '04-033-982145', 'Camino Real a 50m del local comunal', 'Anexo Ccasapata', 'Churcampa', 'Churcampa', 'Huancavelica', '2026-08-25 21:30:05', 'bodega_ccasapata', '123', 'activo'),
	(3, 'Bodega La Frontera', 'Rosa Quispe', '40912834', '951782341', 'Banco de la Nación', '04-088-341982', 'Avenida Principal Chijichaya', 'Comunidad Chijichaya', 'Ilave', 'El Collao', 'Puno', '2026-08-25 21:30:05', 'bodega_chijichaya', '123', 'activo');

-- Volcando estructura para tabla abuelitos_peru.donaciones
CREATE TABLE IF NOT EXISTS `donaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `abuelito_id` int NOT NULL,
  `donante_nombre` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `donante_telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `monto` decimal(10,2) NOT NULL,
  `codigo_operacion` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `foto_voucher_url` text COLLATE utf8mb4_unicode_ci,
  `estado` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT 'pendiente',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla abuelitos_peru.donaciones: ~4 rows (aproximadamente)
INSERT INTO `donaciones` (`id`, `abuelito_id`, `donante_nombre`, `donante_telefono`, `monto`, `codigo_operacion`, `fecha`, `foto_voucher_url`, `estado`) VALUES
	(1, 1, 'Carlos Gutiérrez', '998877665', 50.00, 'YAPE-894120', '2026-08-25 21:30:05', NULL, 'confirmada'),
	(2, 1, 'Familia Morales', '987123456', 40.00, 'PLIN-120485', '2026-08-25 21:30:05', NULL, 'confirmada'),
	(3, 2, 'Lucía Mendoza', '976543210', 80.00, 'YAPE-554190', '2026-08-25 21:30:05', NULL, 'confirmada'),
	(4, 3, 'Anónimo Solidario', '', 100.00, 'YAPE-991204', '2026-08-25 21:30:05', NULL, 'confirmada');

-- Volcando estructura para tabla abuelitos_peru.entregas
CREATE TABLE IF NOT EXISTS `entregas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `abuelito_id` int NOT NULL,
  `foto_comprobante_url` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text COLLATE utf8mb4_unicode_ci,
  `fecha_entrega` date NOT NULL,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `abuelito_id` (`abuelito_id`),
  CONSTRAINT `entregas_ibfk_1` FOREIGN KEY (`abuelito_id`) REFERENCES `abuelitos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla abuelitos_peru.entregas: ~0 rows (aproximadamente)

-- Volcando estructura para tabla abuelitos_peru.favoritos
CREATE TABLE IF NOT EXISTS `favoritos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_donante_id` int NOT NULL,
  `abuelito_id` int NOT NULL,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `fav_unica` (`usuario_donante_id`,`abuelito_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla abuelitos_peru.favoritos: ~1 rows (aproximadamente)
INSERT INTO `favoritos` (`id`, `usuario_donante_id`, `abuelito_id`, `creado_en`) VALUES
	(1, 1, 1, '2026-08-27 18:59:56');

-- Volcando estructura para tabla abuelitos_peru.mensajes_aliento
CREATE TABLE IF NOT EXISTS `mensajes_aliento` (
  `id` int NOT NULL AUTO_INCREMENT,
  `abuelito_id` int NOT NULL,
  `nombre_donante` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ciudad` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mensaje` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla abuelitos_peru.mensajes_aliento: ~0 rows (aproximadamente)

-- Volcando estructura para tabla abuelitos_peru.usuarios_donantes
CREATE TABLE IF NOT EXISTS `usuarios_donantes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_completo` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `telefono` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcando datos para la tabla abuelitos_peru.usuarios_donantes: ~1 rows (aproximadamente)
INSERT INTO `usuarios_donantes` (`id`, `nombre_completo`, `email`, `password`, `telefono`, `creado_en`) VALUES
	(1, 'Christian', 'mxpxserver@gmail.com', '12345', '', '2026-08-27 18:55:51');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
