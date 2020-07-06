-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le :  lun. 06 juil. 2020 à 15:41
-- Version du serveur :  5.7.26
-- Version de PHP :  7.1.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `deliveread`
--

-- --------------------------------------------------------

--
-- Structure de la table `commande`
--

DROP TABLE IF EXISTS `commande`;
CREATE TABLE IF NOT EXISTS `commande` (
  `id_Commande` int(255) NOT NULL AUTO_INCREMENT,
  `nom_Commande` varchar(50) NOT NULL,
  `date_commande` date NOT NULL,
  `reference` varchar(50) NOT NULL,
  `etat` varchar(50) NOT NULL,
  `id_userscommande` int(11) NOT NULL,
  PRIMARY KEY (`id_Commande`),
  KEY `fk_users_id_commande` (`id_userscommande`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

--
-- Déchargement des données de la table `commande`
--

INSERT INTO `commande` (`id_Commande`, `nom_Commande`, `date_commande`, `reference`, `etat`, `id_userscommande`) VALUES
(1, 'livreursula', '2002-03-13', 'F55625', 'Envoi', 30),
(2, 'livre naruto', '2006-03-03', 'X55625', 'Reception', 30),
(3, 'livre one piece', '2015-03-20', 'Y55625', 'Traitement', 30),
(4, 'livre bleach', '2020-03-05', 'W55625', 'Reception', 30);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
