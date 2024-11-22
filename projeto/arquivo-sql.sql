CREATE DATABASE ECONOMIZEJA;
USE ECONOMIZEJA;

CREATE TABLE Usuario (
    ID_Usuario INT PRIMARY KEY auto_increment,
    Nome VARCHAR(50),
    Email VARCHAR(100),
    Senha VARCHAR(100),
    CPF CHAR(11),
    Telefone CHAR(11)
);

CREATE TABLE Motoboy (
    ID_Motoboy INT PRIMARY KEY auto_increment,
    Nome VARCHAR(50),
    Email VARCHAR(100),
    Senha VARCHAR(100),
    CPF CHAR(11),
    Placa VARCHAR(10),
    CNH CHAR(11),
    Telefone CHAR(11)
);

CREATE TABLE Estabelecimentos (
    ID_Estabelecimento INT AUTO_INCREMENT PRIMARY KEY,
    CNPJ VARCHAR(14) NOT NULL, 
    Nome_Empresa VARCHAR(100) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE, 
    Senha VARCHAR(100) NOT NULL,
    Telefone VARCHAR(11) NOT NULL, 
    Cidade VARCHAR(30) NOT NULL,
    Endereco VARCHAR(30) NOT NULL
);



CREATE TABLE Produtos (
    ID_Produtos INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(115),
    Descricao TEXT,
    Nicho VARCHAR(50),
    Preco DECIMAL(10, 2),
    Imagem VARCHAR(255)
);

CREATE TABLE Pedido (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    ID_Cliente INT,
    Data_Pedido DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Produtos_Pedidos (
    ID_Produtos_Pedidos INT AUTO_INCREMENT PRIMARY KEY,
    ID_Pedido INT, 
    ID_Produtos INT,
    Quantidade INT,
    FOREIGN KEY (ID_Pedido) REFERENCES Pedido(ID), 
    FOREIGN KEY (ID_Produtos) REFERENCES Produtos(ID_Produtos)   
);




