-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: teenup
-- ------------------------------------------------------
-- Server version	8.0.42-0ubuntu0.24.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `students`
--

DROP TABLE IF EXISTS `students`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `students` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `version` bigint NOT NULL,
  `current_grade` varchar(50) NOT NULL,
  `dob` date NOT NULL,
  `gender` enum('F','M','O') NOT NULL,
  `name` varchar(100) NOT NULL,
  `parent_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_student_parent` (`parent_id`),
  CONSTRAINT `fk_student_parent` FOREIGN KEY (`parent_id`) REFERENCES `parents` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `students`
--

LOCK TABLES `students` WRITE;
/*!40000 ALTER TABLE `students` DISABLE KEYS */;
INSERT INTO `students` VALUES (1,'2025-08-13 10:22:40.894633','2025-08-13 10:22:40.894633',0,'Grade 7','2012-02-07','F','Đàm Thị Thảo',1),(2,'2025-08-13 10:23:36.723237','2025-08-13 10:23:36.723237',0,'Grade 4','2015-02-07','M','Đàm Mạnh Thương',1),(3,'2025-08-13 14:06:02.356335','2025-08-13 14:06:02.356335',0,'Grade 4','2015-02-07','M','Đàm Mạnh Thương',1),(4,'2025-08-14 05:05:54.907806','2025-08-14 05:05:54.907806',0,'Grade 3','2020-05-05','M','Bui van Dung',1),(5,'2025-08-14 06:58:01.987108','2025-08-14 06:58:01.987108',0,'Grade 5','2025-08-05','F','Bùi  Thị Hằng',1),(6,'2025-08-14 07:10:44.007818','2025-08-14 07:10:44.007818',0,'Grade 2','2025-08-05','M','Đàm Văn Chung',3),(7,'2025-08-14 07:24:43.117777','2025-08-14 07:24:43.117777',0,'Grade 11','2025-08-05','F','Mai Quốc Khánh',3),(8,'2025-08-14 07:43:47.164806','2025-08-14 07:43:47.164806',0,'Grade 4','2025-08-04','F','Vô Thiên Tu',2),(9,'2025-08-14 07:50:51.342385','2025-08-14 07:50:51.342385',0,'Grade 7','2025-08-04','F','Vi Tiểu Bảo',2);
/*!40000 ALTER TABLE `students` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-15  9:21:49
