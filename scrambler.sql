-- MySQL dump 10.13  Distrib 5.7.17, for macos10.12 (x86_64)
--
-- Host: localhost    Database: scrambler
-- ------------------------------------------------------
-- Server version	5.7.21-0ubuntu0.16.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `level`
--

DROP TABLE IF EXISTS `level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `level` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `level` int(11) DEFAULT NULL,
  `desc` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `level`
--

LOCK TABLES `level` WRITE;
/*!40000 ALTER TABLE `level` DISABLE KEYS */;
INSERT INTO `level` VALUES (1,1,'easy'),(2,2,'medium'),(3,3,'hard');
/*!40000 ALTER TABLE `level` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `score`
--

DROP TABLE IF EXISTS `score`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `score` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `score` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `score`
--

LOCK TABLES `score` WRITE;
/*!40000 ALTER TABLE `score` DISABLE KEYS */;
INSERT INTO `score` VALUES (1,40,NULL),(2,10,NULL),(3,10,'2018-03-06 14:42:03'),(4,10,'2018-03-06 14:43:51'),(5,10,'2018-03-06 14:50:04'),(6,10,'2018-03-06 19:13:43'),(7,5,'2018-03-06 19:21:06'),(8,10,'2018-03-06 19:35:00'),(9,10,'2018-03-06 19:35:41'),(10,20,'2018-03-06 19:38:38'),(11,30,'2018-03-06 19:41:26'),(12,60,'2018-03-06 19:47:46');
/*!40000 ALTER TABLE `score` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `words`
--

DROP TABLE IF EXISTS `words`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `words` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `words` varchar(45) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=125 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `words`
--

LOCK TABLES `words` WRITE;
/*!40000 ALTER TABLE `words` DISABLE KEYS */;
INSERT INTO `words` VALUES (1,'ape',1),(2,'baboon',2),(3,'badger',3),(4,'bat',1),(5,'beagle',2),(6,'bear',1),(7,'chameleon',3),(8,'caterpillar',3),(9,'chipmunk',2),(10,'bee',1),(11,'beetle',2),(12,'bison',1),(13,'bobcat',2),(14,'buffalo',2),(15,'bull',1),(16,'bulldog',2),(17,'butterfly',2),(18,'camel',1),(19,'canary',1),(21,'catfish',2),(22,'chameleon',3),(23,'clam',1),(24,'cheetah',2),(26,'chicken',2),(28,'cobra',1),(29,'cock',1),(30,'cockatoo',2),(31,'cockle',1),(32,'crane',1),(33,'crocodile',2),(34,'crow',1),(35,'cuscus',2),(36,'deer',1),(37,'dolphin',2),(38,'donkey',1),(39,'dragonfly',3),(40,'duck',1),(41,'eagle',2),(42,'elephant',3),(43,'falcon',2),(44,'fish',1),(45,'flamingo',3),(46,'frog',1),(47,'gibbon',3),(48,'giraffe',2),(49,'goat',1),(50,'goldfish',3),(51,'goose',2),(52,'gorilla',3),(53,'grasshopper',3),(54,'grouse',1),(55,'guinea',1),(56,'hamster',3),(57,'hawk',1),(58,'hedgehog',2),(59,'horse',1),(60,'hyena',1),(61,'iguana',1),(62,'jaguar',1),(63,'jellyfish',2),(64,'kangaroo',3),(65,'kitten',2),(66,'koala',1),(67,'ladybird',2),(68,'lamb',1),(69,'leech',2),(70,'magpie',1),(71,'mammoth',2),(72,'monkey',1),(73,'mouse',1),(74,'mosquito',1),(75,'mussel',2),(76,'octopus',1),(77,'orangutan',2),(78,'ostrich',2),(79,'otter',1),(80,'owl',1),(81,'oyster',1),(82,'panda',1),(83,'panther',2),(84,'parrot',2),(85,'peacock',3),(86,'pelican',2),(87,'penguin',2),(88,'pig',1),(89,'pigeon',2),(90,'polar',1),(91,'rabbit',2),(92,'rat',1),(93,'raven',1),(94,'rhinoceros',3),(95,'salmon',2),(96,'sardine',2),(97,'scorpion',3),(98,'seahorse',3),(99,'seal',1),(100,'shark',2),(101,'sheep',2),(102,'shrimp',2),(103,'snail',2),(104,'snake',1),(105,'starfish',2),(106,'spider',2),(107,'squid',1),(108,'squirrel',2),(109,'swallow',3),(110,'swan',1),(111,'tapir',1),(112,'tiger',1),(113,'tortoise',3),(114,'tuna',1),(115,'turkey',1),(116,'turtle',1),(117,'walrus',1),(118,'wasp',1),(119,'wasp',1),(120,'weasel',2),(121,'whale',1),(122,'wolf',1),(123,'worm',1),(124,'zebra',3);
/*!40000 ALTER TABLE `words` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-03-07  2:49:13
