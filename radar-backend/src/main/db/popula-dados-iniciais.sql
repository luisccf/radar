LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Ismael','1234','rafael@gmail.com',NULL),(2,'rafael','12345','rafael@gmail.com',NULL),(3,'lucas','834756','lucas@gmail.com',NULL),(4,'jonas','8d5e957f297893487bd98fa830fa6413','rafael@gmail.com',NULL),(5,'Flavio','74b87337454200d4d33f80c4663dc5e5','email@e',NULL),(6,'c','4a8a08f09d37b73795649038408b5f33','c@c',NULL),(7,'ismael2','86e8eb86c3ccec81f543375af7fcbb4d','ismael@gmail.com',NULL),(8,'abcde','827ccb0eea8a706c4c34a16891f84e7b','a@a',NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
