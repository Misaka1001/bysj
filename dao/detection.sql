SET NAMES UTF8;
DROP DATABASE IF EXISTS detection;
CREATE DATABASE detection CHARSET=UTF8;
USE detection;
CREATE TABLE Lp(
    id INT PRIMARY KEY AUTO_INCREMENT,
    Lp INT(3),
    time BIGINT
);
CREATE TABLE Lux(
    id INT PRIMARY KEY AUTO_INCREMENT,
    luminance INT(3),
    time BIGINT
)