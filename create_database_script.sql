CREATE SCHEMA radar;
USE radar;

CREATE TABLE `color` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `gender` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

CREATE TABLE `transport` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(125) NOT NULL,
  `email` varchar(125) NOT NULL,
  `password` varchar(125) NOT NULL,
  `birth` date DEFAULT NULL,
  `gender_id` int(11) DEFAULT NULL,
  `color_id` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `active` bit(1) DEFAULT b'1',
  `tries` int(11) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  KEY `gender_user_idx` (`gender_id`),
  KEY `color_user_idx` (`color_id`),
  CONSTRAINT `color_user` FOREIGN KEY (`color_id`) REFERENCES `color` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `gender_user` FOREIGN KEY (`gender_id`) REFERENCES `gender` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `incident` (
  `id` int(11) NOT NULL,
  `date` date NOT NULL,
  `num_criminals` int(11) DEFAULT NULL,
  `violence` bit(1) DEFAULT NULL,
  `num_victims` int(11) DEFAULT NULL,
  `police_report` varchar(255) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `victims_transport_id` int(11) DEFAULT NULL,
  `criminals_transport_id` int(11) DEFAULT NULL,
  `armed` int(11) DEFAULT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `objects_taken` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_idx` (`user_id`),
  KEY `incident_transport_idx` (`victims_transport_id`),
  KEY `incident_robber_transport_idx` (`criminals_transport_id`),
  CONSTRAINT `incident_robber_transport` FOREIGN KEY (`criminals_transport_id`) REFERENCES `transport` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `incident_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `incident_user_transport` FOREIGN KEY (`victims_transport_id`) REFERENCES `transport` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `service` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `state` varchar(125) NOT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `email` varchar(125) DEFAULT NULL,
  `site` varchar(125) DEFAULT NULL,
  `name` varchar(125) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `state_UNIQUE` (`state`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

CREATE TABLE `street` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `latitude` double NOT NULL,
  `longitude` double NOT NULL,
  PRIMARY KEY (`id`),
  KEY `street_user_idx` (`user_id`),
  CONSTRAINT `street_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;


