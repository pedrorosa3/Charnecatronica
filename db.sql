
/*
CREATE TABLE Morada (
    ID SERIAL PRIMARY KEY,
    Pais VARCHAR(100),
    Localidade VARCHAR(100),
    Latitude FLOAT,
    Longitude FLOAT,
    Freguesia VARCHAR(100),
    Rua VARCHAR(255),
    CodigoPostal VARCHAR(20),
    Concelho VARCHAR(100),
    Numero INT,
    Distrito VARCHAR(100)
);

CREATE TABLE Pessoa (
    ID SERIAL PRIMARY KEY,
    NIF INT UNIQUE,
    NIC INT UNIQUE,
    Nome VARCHAR(255),
    Genero VARCHAR(20) CHECK (Genero IN ('Masculino', 'Feminino', 'Outro')),
    Telemovel INT UNIQUE,
    Email VARCHAR(255) UNIQUE,
    Password VARCHAR(255),
    DataDeNascimento DATE,
    MoradaID INT REFERENCES Morada(ID)
);

CREATE TABLE Loja (
    NIPC BIGINT PRIMARY KEY,
    Nome VARCHAR(255),
    NumeroTelefone INT,
    Email VARCHAR(255) UNIQUE,
    MoradaID INT REFERENCES Morada(ID)
);

CREATE TABLE Cliente (
    ID SERIAL PRIMARY KEY,
    PessoaID INT REFERENCES Pessoa(ID)
);

CREATE TABLE Empregado (
    NumInterno SERIAL PRIMARY KEY,
    LojaNIPC BIGINT REFERENCES Loja(NIPC),
    PessoaID INT REFERENCES Pessoa(ID)
);

CREATE TABLE Doador (
    ID SERIAL PRIMARY KEY,
    PessoaID INT REFERENCES Pessoa(ID)
);

CREATE TABLE Organizador (
    ID SERIAL PRIMARY KEY,
    PessoaID INT REFERENCES Pessoa(ID)
);

CREATE TABLE Pecas (
    ID SERIAL PRIMARY KEY,
    Tipo VARCHAR(255),
    Preco FLOAT
);

CREATE TABLE Ficha_de_Equipamento (
    Cod_barras VARCHAR(50) PRIMARY KEY,
    Marca VARCHAR(100),
    Modelo VARCHAR(100),
    Tipo VARCHAR(100),
    Preco_base FLOAT,
    Ano_lancamento INT,
    PecasID INT REFERENCES Pecas(ID)
);

CREATE TABLE equipamentos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    preco DECIMAL(10,2),
    avaliacao FLOAT,
    reviews VARCHAR(50),
    imagem VARCHAR(255)
);



CREATE TABLE Compra (
    ID SERIAL PRIMARY KEY,
    Data DATE,
    Preco FLOAT,
    ClienteID INT REFERENCES Cliente(ID),
    EmpregadoID INT REFERENCES Empregado(NumInterno),
    LojaNIPC BIGINT REFERENCES Loja(NIPC),
    EquipamentoID INT REFERENCES equipamentos(ID)
);

CREATE TABLE Venda (
    NumeroVenda SERIAL PRIMARY KEY,
    Data DATE,
    Tipo VARCHAR(50),
    CustoTransporte FLOAT,
    LojaNIPC BIGINT REFERENCES Loja(NIPC),
    ClienteID INT REFERENCES Cliente(ID),
    EmpregadoID INT REFERENCES Empregado(NumInterno),
    EquipamentoID INT REFERENCES Equipamento(ID)
);

CREATE TABLE Doacao (
    IDDoacao SERIAL PRIMARY KEY,
    Data DATE,
    DoadorID INT REFERENCES Doador(ID),
    LojaNIPC BIGINT REFERENCES Loja(NIPC),
    EmpregadoID INT REFERENCES Empregado(NumInterno),
    EquipamentoID INT REFERENCES Equipamento(ID),
    ProjetoBeneficenciaID INT,
    CompraID INT REFERENCES Compra(ID)
);

CREATE TABLE Reparacao (
    ID SERIAL PRIMARY KEY,
    DataEntregaAoCliente DATE,
    NumPedidoOrcamento FLOAT,
    DescNaoFunciona TEXT,
    OrcamentoReparacao FLOAT,
    ClienteID INT REFERENCES Cliente(ID),
    EmpregadoID INT REFERENCES Empregado(NumInterno),
    EquipamentoID INT REFERENCES Equipamento(ID),
    LojaNIPC BIGINT REFERENCES Loja(NIPC),
    CompraID INT REFERENCES Compra(ID)
);

CREATE TABLE ProjetoBeneficencia (
    ID SERIAL PRIMARY KEY,
    Nome VARCHAR(255),
    Descricao TEXT,
    DataLimite DATE,
    QuantidadeEquipamentos INT,
    OrganizadorID INT REFERENCES Organizador(ID),
    LojaNIPC BIGINT REFERENCES Loja(NIPC),
    FichaEquipamentoCodBarras VARCHAR(50) REFERENCES Ficha_de_Equipamento(Cod_barras)
);

CREATE TABLE Interesse (
    ID SERIAL PRIMARY KEY,
    Data DATE,
    ClienteID INT REFERENCES Cliente(ID),
    FichaEquipamentoCodBarras VARCHAR(50) REFERENCES Ficha_de_Equipamento(Cod_barras),
    LojaNIPC BIGINT REFERENCES Loja(NIPC)
);


*/



CREATE TABLE equipamentos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    preco DECIMAL(10,2),
    avaliacao FLOAT,
    reviews VARCHAR(50),
    imagem VARCHAR(255)
);

INSERT INTO equipamentos (nome, categoria, preco, avaliacao, reviews, imagem) VALUES
('Iphone 15', 'Telemóveis', 699.99, 4.0, '1.2k Reviews', '/images/iphone15.jpg'),
('Iphone 15 Pro Max', 'Telemóveis', 999.99, 5.0, '1.2k Reviews', '/images/iphone15ProMax.jpg'),
('Monitor AOC 240hz', 'Monitores', 399.99, 3.0, '1.2k Reviews', '/images/monitorAOC.jpg'),
('Portátil ASUS', 'Portáteis', 1199.99, 5.0, '1.2k Reviews', '/images/portatilASUS.jpg'),
('Google Pixel 7', 'Telemóveis', 799.99, 4.6, '850 Reviews', '/images/pixel7.jpg'),
('Xiaomi 13 Pro', 'Telemóveis', 699.99, 4.3, '700 Reviews', '/images/xiaomi13Pro.jpg'),
('Dell XPS 15', 'Portáteis', 1799.99, 4.8, '2.1k Reviews', '/images/dellXPS15.jpg'),
('HP Spectre x360', 'Portáteis', 1399.99, 4.6, '1.5k Reviews', '/images/hpSpectre.jpg'),
('Lenovo ThinkPad X1 Carbon', 'Portáteis', 1599.99, 4.7, '1.8k Reviews', '/images/lenovoThinkPad.jpg'),
('Samsung Smart Monitor M7', 'Monitores', 499.99, 4.4, '600 Reviews', '/images/samsungM7.jpg'),
('LG UltraFine 5K', 'Monitores', 1299.99, 4.5, '500 Reviews', '/images/lgUltraFine.jpg'),
('BenQ EX3501R', 'Monitores', 799.99, 4.3, '700 Reviews', '/images/benQEX3501R.jpg'),
('Asus ROG Swift PG259QN', 'Monitores', 699.99, 4.9, '850 Reviews', '/images/asusROGSwift.jpg'),
('Apple iPad Pro 12.9', 'Tablets', 1199.99, 4.8, '2k Reviews', '/images/ipadPro12.jpeg'),
('Samsung Galaxy Tab S8', 'Tablets', 899.99, 4.5, '1.4k Reviews', '/images/galaxyTabS8.jpg'),
('Microsoft Surface Pro 9', 'Tablets', 1099.99, 4.7, '1.3k Reviews', '/images/surfacePro9.jpg'),
('Amazon Fire HD 10', 'Tablets', 199.99, 4.1, '1k Reviews', '/images/amazonFireHD.jpg');

INSERT INTO Loja (NIPC, Nome, NumeroTelefone, Email, MoradaID)
VALUES 
(12345678901234, 'Loja Exemplo Lisboa', 213456789, 'loja.lisboa@exemplo.com', 1),
(98765432109876, 'Loja Exemplo Porto', 228765432, 'loja.porto@exemplo.com', 2);

INSERT INTO Cliente (PessoaID)
VALUES 
(1),
(2);

INSERT INTO Empregado (LojaNIPC, PessoaID)
VALUES 
(12345678901234, 1),
(98765432109876, 2);

INSERT INTO Doador (PessoaID)
VALUES 
(1),
(2);

INSERT INTO Organizador (PessoaID)
VALUES 
(1),
(2);

INSERT INTO Pecas (Tipo, Preco)
VALUES 
('Bateria', 50.0),
('Tela', 100.0);

INSERT INTO Ficha_de_Equipamento (Cod_barras, Marca, Modelo, Tipo, Preco_base, Ano_lancamento, PecasID)
VALUES 
('12345', 'Apple', 'iPhone 12', 'Smartphone', 999.99, 2020, 1),
('67890', 'Samsung', 'Galaxy S21', 'Smartphone', 899.99, 2021, 2);


INSERT INTO Compra (Data, Preco, ClienteID, EmpregadoID, LojaNIPC, EquipamentoID)
VALUES 
('2021-11-01', 999.99, 1, 1, 12345678901234, 1),
('2021-11-10', 799.99, 2, 2, 98765432109876, 2);

INSERT INTO Venda (Data, Tipo, CustoTransporte, LojaNIPC, ClienteID, EmpregadoID, EquipamentoID)
VALUES 
('2021-12-01', 'Venda Direta', 10.0, 12345678901234, 1, 1, 1),
('2021-12-10', 'Venda Direta', 15.0, 98765432109876, 2, 2, 2);

INSERT INTO Doacao (Data, DoadorID, LojaNIPC, EmpregadoID, EquipamentoID, ProjetoBeneficenciaID, CompraID)
VALUES 
('2021-11-05', 1, 12345678901234, 1, 1, 1, 1),
('2021-11-12', 2, 98765432109876, 2, 2, 2, 2);

INSERT INTO Reparacao (DataEntregaAoCliente, NumPedidoOrcamento, DescNaoFunciona, OrcamentoReparacao, ClienteID, EmpregadoID, EquipamentoID, LojaNIPC, CompraID)
VALUES 
('2021-11-20', 1001, 'Tela rachada', 120.0, 1, 1, 1, 12345678901234, 1),
('2021-12-01', 1002, 'Bateria descarregada', 50.0, 2, 2, 2, 98765432109876, 2);


INSERT INTO ProjetoBeneficencia (Nome, Descricao, DataLimite, QuantidadeEquipamentos, OrganizadorID, LojaNIPC, FichaEquipamentoCodBarras)
VALUES 
('Projeto A', 'Doação de equipamentos para escolas', '2022-12-31', 100, 1, 12345678901234, '12345'),
('Projeto B', 'Reparação de equipamentos para ONGs', '2023-06-30', 50, 2, 98765432109876, '67890');

INSERT INTO Interesse (Data, ClienteID, FichaEquipamentoCodBarras, LojaNIPC)
VALUES 
('2021-11-01', 1, '12345', 12345678901234),
('2021-11-05', 2, '67890', 98765432109876);


/*
INSERT INTO Morada (Pais, Localidade, Latitude, Longitude, Freguesia, Rua, CodigoPostal, Concelho, Numero, Distrito) 
VALUES ('Portugal', 'Lisboa', 38.7169, -9.1399, 'Santa Maria Maior', 'Rua Augusta', '1100-053', 'Lisboa', 10, 'Lisboa') 
RETURNING ID;


INSERT INTO Pessoa (NIF, NIC, Nome, Genero, Telemovel, Email, Password, DataDeNascimento, MoradaID)
VALUES 
(123456789, 987654321, 'João Silva', 'Masculino', 912345678, 'joao.silva@gmail.com', 'DB_PASSWORD_REMOVED', '1990-05-15', 1);

*/