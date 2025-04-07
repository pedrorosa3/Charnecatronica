DROP TABLE IF EXISTS especificacoes;
DROP TABLE IF EXISTS imagens_equipamento;
DROP TABLE IF EXISTS Interesse;
DROP TABLE IF EXISTS ProjetoBeneficencia;
DROP TABLE IF EXISTS Reparacao;
DROP TABLE IF EXISTS Doacao;
DROP TABLE IF EXISTS Venda;
DROP TABLE IF EXISTS Compra;
DROP TABLE IF EXISTS equipamentos;
DROP TABLE IF EXISTS Ficha_de_Equipamento;
DROP TABLE IF EXISTS Pecas;
DROP TABLE IF EXISTS Organizador;
DROP TABLE IF EXISTS Doador;
DROP TABLE IF EXISTS Empregado;
DROP TABLE IF EXISTS Cliente;
DROP TABLE IF EXISTS Loja;
DROP TABLE IF EXISTS Pessoa;
DROP TABLE IF EXISTS Morada;

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
    Ano_lancamento INT
);

CREATE TABLE equipamentos (
    id SERIAL PRIMARY KEY,
    estado VARCHAR(50),
    preco DECIMAL(10,2),
    numero_sequencia_loja VARCHAR(100),         -- identificação interna da loja
    loja_nipc BIGINT REFERENCES Loja(NIPC),      -- referência à tabela Loja
    dataDeDisponibilizacao DATE,
    Cod_barras VARCHAR(50) REFERENCES Ficha_de_Equipamento(Cod_barras)
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
    EquipamentoID INT REFERENCES equipamentos(ID)
);

CREATE TABLE Doacao (
    IDDoacao SERIAL PRIMARY KEY,
    Data DATE,
    DoadorID INT REFERENCES Doador(ID),
    LojaNIPC BIGINT REFERENCES Loja(NIPC),
    EmpregadoID INT REFERENCES Empregado(NumInterno),
    EquipamentoID INT REFERENCES equipamentos(ID),
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
    EquipamentoID INT REFERENCES equipamentos(ID),
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
    FichaEquipamentoCodBarras VARCHAR(50) REFERENCES Ficha_de_Equipamento(Cod_barras),
    Imagem VARCHAR(500) 
);

CREATE TABLE Interesse (
    ID SERIAL PRIMARY KEY,
    Data DATE,
    ClienteID INT REFERENCES Cliente(ID),
    FichaEquipamentoCodBarras VARCHAR(50) REFERENCES Ficha_de_Equipamento(Cod_barras),
    LojaNIPC BIGINT REFERENCES Loja(NIPC)
);

CREATE TABLE imagens_equipamento (
  id SERIAL PRIMARY KEY,
  cod_barras VARCHAR(50) REFERENCES Ficha_de_Equipamento(Cod_barras) ON DELETE CASCADE,
  url TEXT NOT NULL
);

CREATE TABLE especificacoes (
  id SERIAL PRIMARY KEY,
  cod_barras VARCHAR(50) REFERENCES Ficha_de_Equipamento(Cod_barras) ON DELETE CASCADE,
  titulo TEXT,
  destaque BOOLEAN DEFAULT FALSE    
);


INSERT INTO Ficha_de_Equipamento (Cod_barras, Marca, Modelo, Tipo, Preco_base, Ano_lancamento)
VALUES 
('1111111111111', 'Apple', 'iPhone 15', 'Telemóveis', 699.99, 2023),
('1111111111112', 'Apple', 'iPhone 15 Pro Max', 'Telemóveis', 999.99, 2023),
('1111111111113', 'AOC', '240hz', 'Monitores', 399.99, 2022),
('1111111111114', 'ASUS', 'Portátil ASUS', 'Portáteis', 1199.99, 2021),
('1111111111115', 'Google', 'Pixel 7', 'Telemóveis', 799.99, 2023),
('1111111111116', 'Xiaomi', '13 Pro', 'Telemóveis', 699.99, 2023),
('1111111111117', 'Dell', 'XPS 15', 'Portáteis', 1799.99, 2022),
('1111111111118', 'HP', 'Spectre x360', 'Portáteis', 1399.99, 2022),
('1111111111119', 'Lenovo', 'ThinkPad X1 Carbon', 'Portáteis', 1599.99, 2022),
('1111111111120', 'Samsung', 'Smart Monitor M7', 'Monitores', 499.99, 2023),
('1111111111121', 'LG', 'UltraFine 5K', 'Monitores', 1299.99, 2021),
('1111111111122', 'BenQ', 'EX3501R', 'Monitores', 799.99, 2021),
('1111111111123', 'Asus', 'ROG Swift PG259QN', 'Monitores', 699.99, 2021),
('1111111111124', 'Apple', 'iPad Pro 12.9', 'Tablets', 1199.99, 2023),
('1111111111125', 'Samsung', 'Galaxy Tab S8', 'Tablets', 899.99, 2023),
('1111111111126', 'Microsoft', 'Surface Pro 9', 'Tablets', 1099.99, 2022),
('1111111111127', 'Amazon', 'Fire HD 10', 'Tablets', 199.99, 2020);

INSERT INTO Morada (Pais, Localidade, Latitude, Longitude, Freguesia, Rua, CodigoPostal, Concelho, Numero, Distrito) VALUES ('Portugal', 'Almeirim', -16.172379, -48.524686, 'Ville', 'Avenida Mia Vicente', '9600-133', 'Vila Real', 58, 'Vila Nova de Famalicão');
INSERT INTO Morada (Pais, Localidade, Latitude, Longitude, Freguesia, Rua, CodigoPostal, Concelho, Numero, Distrito) VALUES ('Portugal', 'Leiria', 30.5836345, 136.359605, 'Ville', 'R. Tavares', '5423-511', 'Chaves', 13, 'Pombal');
INSERT INTO Morada (Pais, Localidade, Latitude, Longitude, Freguesia, Rua, CodigoPostal, Concelho, Numero, Distrito) VALUES ('Portugal', 'Anadia', 33.325926, 107.885264, 'Ville', 'Avenida do Dr. Nuno Pinheiro Torres', '9593-103', 'Caniço', 141, 'Coimbra');
INSERT INTO Morada (Pais, Localidade, Latitude, Longitude, Freguesia, Rua, CodigoPostal, Concelho, Numero, Distrito) VALUES ('Portugal', 'Montemor-o-Novo', 31.711401, 161.280485, 'Ville', 'Largo Tiago Cruz', '1928-327', 'Miranda do Douro', 126, 'Paços de Ferreira');
INSERT INTO Morada (Pais, Localidade, Latitude, Longitude, Freguesia, Rua, CodigoPostal, Concelho, Numero, Distrito) VALUES ('Portugal', 'Lixa', -81.383158, -10.642433, 'Ville', 'Avenida de Cunha', '3767-242', 'Vila Real', 115, 'Ílhavo');
INSERT INTO Morada (Pais, Localidade, Latitude, Longitude, Freguesia, Rua, CodigoPostal, Concelho, Numero, Distrito) VALUES ('Portugal', 'Ílhavo', 17.213257, 14.345362, 'Ville', 'Praça Edgar Anjos', '2269-166', 'Valpaços', 72, 'Vila Nova de Gaia');
INSERT INTO Morada (Pais, Localidade, Latitude, Longitude, Freguesia, Rua, CodigoPostal, Concelho, Numero, Distrito) VALUES ('Portugal', 'Elvas', 54.141875, -36.749319, 'Ville', 'Travessa Matias', '7048-281', 'Torres Vedras', 53, 'Felgueiras');
INSERT INTO Morada (Pais, Localidade, Latitude, Longitude, Freguesia, Rua, CodigoPostal, Concelho, Numero, Distrito) VALUES ('Portugal', 'Fiães', 54.788454, 104.731459, 'Ville', 'Praça de Alves', '5430-391', 'Tarouca', 280, 'Vendas Novas');
INSERT INTO Morada (Pais, Localidade, Latitude, Longitude, Freguesia, Rua, CodigoPostal, Concelho, Numero, Distrito) VALUES ('Portugal', 'Esmoriz', 87.1005125, 75.165283, 'Ville', 'Alameda de Cunha', '4657-871', 'Lisboa', 45, 'Peso da Régua');
INSERT INTO Morada (Pais, Localidade, Latitude, Longitude, Freguesia, Rua, CodigoPostal, Concelho, Numero, Distrito) VALUES ('Portugal', 'Vila Nova de Gaia', -28.229047, 135.916382, 'Ville', 'Avenida Teixeira', '3105-183', 'Tarouca', 217, 'Vila Franca de Xira');


INSERT INTO Pessoa (NIF, NIC, Nome, Genero, Telemovel, Email, Password, DataDeNascimento, MoradaID) VALUES (242068763, 86644106, 'Luciana-Érica Monteiro', 'Masculino', 964190206, 'eduardobarbosa@sapo.pt', 'p6aN%flo^R_1', '1960-11-29', 1);
INSERT INTO Pessoa (NIF, NIC, Nome, Genero, Telemovel, Email, Password, DataDeNascimento, MoradaID) VALUES (154318806, 97529405, 'Alexandra Baptista-Faria', 'Masculino', 921160949, 'nmorais@sapo.pt', 'a7kLJwzT!29M', '2005-02-24', 4);
INSERT INTO Pessoa (NIF, NIC, Nome, Genero, Telemovel, Email, Password, DataDeNascimento, MoradaID) VALUES (436730606, 17672593, 'Nuno Morais', 'Masculino', 943745717, 'nascimentodinis@araujo.net', '&1&aTS7hB7)Z', '1985-06-08', 9);
INSERT INTO Pessoa (NIF, NIC, Nome, Genero, Telemovel, Email, Password, DataDeNascimento, MoradaID) VALUES (766964667, 85563727, 'Brian Nogueira', 'Outro', 924304543, 'sergioaraujo@hotmail.com', 'n4Fza!mA^v)o', '1972-10-13', 1);
INSERT INTO Pessoa (NIF, NIC, Nome, Genero, Telemovel, Email, Password, DataDeNascimento, MoradaID) VALUES (402533494, 91178885, 'Tomás Leal', 'Outro', 923663184, 'dferreira@gmail.com', '!jI7gbJ!_6sS', '1983-07-01', 4);
INSERT INTO Pessoa (NIF, NIC, Nome, Genero, Telemovel, Email, Password, DataDeNascimento, MoradaID) VALUES (236843584, 15614174, 'Joana Andrade', 'Outro', 934012171, 'martabarros@pacheco.pt', ')2r@gCHfpl7k', '1969-05-21', 9);
INSERT INTO Pessoa (NIF, NIC, Nome, Genero, Telemovel, Email, Password, DataDeNascimento, MoradaID) VALUES (314289692, 71780854, 'Helena Esteves', 'Feminino', 924960146, 'alicejesus@araujo.org', 'yMv(x1v7^8fB', '1993-06-27', 4);
INSERT INTO Pessoa (NIF, NIC, Nome, Genero, Telemovel, Email, Password, DataDeNascimento, MoradaID) VALUES (304095531, 44188276, 'Tiago Matias', 'Feminino', 910113499, 'beatriz15@silva.com', 'bCd4Qbjh0+In', '1995-07-14', 10);
INSERT INTO Pessoa (NIF, NIC, Nome, Genero, Telemovel, Email, Password, DataDeNascimento, MoradaID) VALUES (802984810, 53251559, 'Letícia Matos', 'Feminino', 955340576, 'kvicente@garcia.com', '$46No^IY2dHz', '2007-03-22', 1);
INSERT INTO Pessoa (NIF, NIC, Nome, Genero, Telemovel, Email, Password, DataDeNascimento, MoradaID) VALUES (556497252, 39372360, 'Sérgio Neto', 'Masculino', 941175415, 'fabiomendes@miranda.pt', 'K+p8Nr8j)5Ke', '1959-09-25', 7);
INSERT INTO Pessoa (NIF, NIC, Nome, Genero, Telemovel, Email, Password, DataDeNascimento, MoradaID) VALUES (248578017, 30244148, 'José do Cardoso', 'Feminino', 957406986, 'marquesamelia@nunes.pt', 'GiwnrUNv&0rG', '1987-06-23', 5);
INSERT INTO Pessoa (NIF, NIC, Nome, Genero, Telemovel, Email, Password, DataDeNascimento, MoradaID) VALUES (335602191, 46632757, 'Luísa Amaral', 'Masculino', 936095765, 'kvalente@sapo.pt', 't#b&9qRaCLCr', '1955-07-27', 4);
INSERT INTO Pessoa (NIF, NIC, Nome, Genero, Telemovel, Email, Password, DataDeNascimento, MoradaID) VALUES (904258674, 82399599, 'Ivo Domingues', 'Feminino', 953630431, 'amaralmartim@alves.net', 'T4diVWd(m#7@', '1981-03-29', 2);
INSERT INTO Pessoa (NIF, NIC, Nome, Genero, Telemovel, Email, Password, DataDeNascimento, MoradaID) VALUES (867741192, 36619372, 'Paulo Sá', 'Masculino', 965738718, 'tavaresvioleta@sousa.com', 'JFPDrm*x)n0L', '1996-02-29', 7);
INSERT INTO Pessoa (NIF, NIC, Nome, Genero, Telemovel, Email, Password, DataDeNascimento, MoradaID) VALUES (967797300, 82232344, 'Luana Matias', 'Masculino', 965414110, 'marcos14@sapo.pt', 'b7OSOEt8WrT$', '1987-07-01', 6);


INSERT INTO Loja (NIPC, Nome, NumeroTelefone, Email, MoradaID) VALUES (696115913, 'Loja 1', 242255732, 'trodrigues@melo.com', 6);
INSERT INTO Loja (NIPC, Nome, NumeroTelefone, Email, MoradaID) VALUES (199915275, 'Loja 2', 249491631, 'aliciasa@goncalves.pt', 10);
INSERT INTO Loja (NIPC, Nome, NumeroTelefone, Email, MoradaID) VALUES (694287057, 'Loja 3', 281259135, 'anita85@tavares.pt', 5);

INSERT INTO equipamentos (estado, preco, numero_sequencia_loja, loja_nipc, dataDeDisponibilizacao, Cod_barras)
VALUES
('novo', 699.99, '0001', 696115913, '2024-03-16', '1111111111111'),
('novo', 999.99, '0002', 199915275, '2024-02-25', '1111111111112'),
('novo', 399.99, '0003', 694287057, '2024-01-10', '1111111111113'),
('usado', 1199.99, '0004', 696115913, '2024-01-05', '1111111111114'),
('novo', 799.99, '0005', 199915275, '2024-03-10', '1111111111115'),
('novo', 699.99, '0006', 694287057, '2024-03-12', '1111111111116'),
('usado', 1799.99, '0007', 696115913, '2024-02-15', '1111111111117'),
('usado', 1399.99, '0008', 199915275, '2024-02-20', '1111111111118'),
('usado', 1599.99, '0009', 694287057, '2024-02-28', '1111111111119'),
('novo', 499.99, '0010', 696115913, '2024-03-05', '1111111111120'),
('usado', 1299.99, '0011', 199915275, '2024-01-22', '1111111111121'),
('novo', 799.99, '0012', 694287057, '2024-01-28', '1111111111122'),
('novo', 699.99, '0013', 696115913, '2024-02-02', '1111111111123'),
('novo', 1199.99, '0014', 199915275, '2024-03-15', '1111111111124'),
('novo', 899.99, '0015', 694287057, '2024-03-07', '1111111111125'),
('novo', 1099.99, '0016', 696115913, '2024-03-09', '1111111111126'),
('usado', 199.99, '0017', 199915275, '2024-01-18', '1111111111127');

INSERT INTO Cliente (PessoaID) VALUES (1);
INSERT INTO Cliente (PessoaID) VALUES (2);
INSERT INTO Cliente (PessoaID) VALUES (3);
INSERT INTO Cliente (PessoaID) VALUES (4);
INSERT INTO Cliente (PessoaID) VALUES (5);


INSERT INTO Empregado (PessoaID, LojaNIPC) VALUES (6, 696115913);
INSERT INTO Empregado (PessoaID, LojaNIPC) VALUES (7, 199915275);
INSERT INTO Empregado (PessoaID, LojaNIPC) VALUES (8, 694287057);
INSERT INTO Empregado (PessoaID, LojaNIPC) VALUES (9, 696115913);
INSERT INTO Empregado (PessoaID, LojaNIPC) VALUES (10, 199915275);


INSERT INTO Doador (PessoaID) VALUES (11);
INSERT INTO Doador (PessoaID) VALUES (12);


INSERT INTO Organizador (PessoaID) VALUES (13);
INSERT INTO Organizador (PessoaID) VALUES (14);


INSERT INTO Pecas (Tipo, Preco) VALUES ('fugit', 163.35);
INSERT INTO Pecas (Tipo, Preco) VALUES ('inventore', 148.65);
INSERT INTO Pecas (Tipo, Preco) VALUES ('explicabo', 111.88);
INSERT INTO Pecas (Tipo, Preco) VALUES ('eveniet', 194.89);

INSERT INTO Pecas (Tipo, Preco) VALUES ('cumque', 81.92);
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

INSERT INTO imagens_equipamento (cod_barras, url)
VALUES 
  ('1111111111111', '/images/iphone15.jpg'),
  ('1111111111111', '/images/iphone15_2.jpeg'),
  ('1111111111111', '/images/iphone15_3.jpeg'),
  ('1111111111111', '/images/iphone15_4.jpeg'),
  ('1111111111111', '/images/iphone15_5.jpeg'),
  ('1111111111112', '/images/iphone15ProMax.jpg'),
  ('1111111111113', '/images/monitorAOC.jpg'),
  ('1111111111114', '/images/portatilASUS.jpg'),
    ('1111111111115', '/images/pixel7.jpg'),
    ('1111111111116', '/images/xiaomi13Pro.jpg'),
    ('1111111111117', '/images/dellXPS15.jpg'),
    ('1111111111118', '/images/hpSpectre.jpg'),
    ('1111111111119', '/images/lenovoThinkPad.jpg'),
    ('1111111111120', '/images/samsungM7.jpg'),
    ('1111111111121', '/images/lgUltraFine.jpg'),
    ('1111111111122', '/images/benQEX3501R.jpg'),
    ('1111111111123', '/images/asusROGSwift.jpg'),
    ('1111111111124', '/images/ipadPro12.jpeg'),
    ('1111111111125', '/images/galaxyTabS8.jpg'),
    ('1111111111126', '/images/surfacePro9.jpg'),
    ('1111111111127', '/images/amazonFireHD.jpg');


INSERT INTO especificacoes (cod_barras, titulo, destaque) VALUES
('1111111111111', '15,5 cm (6.1") 2556 x 1179 pixels Ceramic Shield', false),
('1111111111111', 'Apple A18', false),
('1111111111111', '256 GB', false),
('1111111111111', '5G Dual SIM NanoSIM + eSIM', false),
('1111111111111', 'Wi-Fi 7 (802.11be) Bluetooth 5.3 Near Field Communication (NFC)', false),
('1111111111111', 'Câmara dupla 48 MP 12 MP', false),
('1111111111111', 'Íão-lítio Carregamento wireless', false),
('1111111111111', 'iOS 18', false);


-- ESPECIFICAÇÕES DE TELEMÓVEIS

-- iPhone 15
INSERT INTO especificacoes (cod_barras, titulo, destaque) VALUES
('1111111111111', 'Ecrã 6.1" Super Retina XDR OLED', true),
('1111111111111', 'Apple A16 Bionic', false),
('1111111111111', '256 GB Armazenamento', false),
('1111111111111', 'Sistema de Câmara Dupla 48MP + 12MP', false),
('1111111111111', 'Face ID, 5G, iOS 17', false);

-- iPhone 15 Pro Max
INSERT INTO especificacoes (cod_barras, titulo, destaque) VALUES
('1111111111112', 'Ecrã 6.7" ProMotion OLED 120Hz', true),
('1111111111112', 'Apple A17 Pro', false),
('1111111111112', '512 GB Armazenamento', false),
('1111111111112', 'Câmara tripla com zoom ótico 5x', false),
('1111111111112', 'Titanium Frame, iOS 17', false);

-- Google Pixel 7
INSERT INTO especificacoes (cod_barras, titulo, destaque) VALUES
('1111111111115', 'Ecrã OLED 6.3" FHD+ 90Hz', true),
('1111111111115', 'Google Tensor G2', false),
('1111111111115', '128 GB Armazenamento', false),
('1111111111115', 'Câmara dupla 50MP + 12MP', false),
('1111111111115', 'Android 13, IP68', false);

-- Xiaomi 13 Pro
INSERT INTO especificacoes (cod_barras, titulo, destaque) VALUES
('1111111111116', 'Ecrã AMOLED 6.73" WQHD+ 120Hz', true),
('1111111111116', 'Snapdragon 8 Gen 2', false),
('1111111111116', '256 GB + 12 GB RAM', false),
('1111111111116', 'Câmara tripla Leica 50MP', false),
('1111111111116', 'Carga rápida 120W', false);

-- PORTÁTEIS

-- ASUS Portátil
INSERT INTO especificacoes (cod_barras, titulo, destaque) VALUES
('1111111111114', 'Ecrã 15.6" Full HD', true),
('1111111111114', 'Intel Core i7 11ª Gen', false),
('1111111111114', '16 GB RAM / 512 GB SSD', false),
('1111111111114', 'GPU NVIDIA GeForce MX450', false),
('1111111111114', 'Windows 11', false);

-- Dell XPS 15
INSERT INTO especificacoes (cod_barras, titulo, destaque) VALUES
('1111111111117', 'Ecrã 15.6" 4K+ InfinityEdge', true),
('1111111111117', 'Intel Core i9', false),
('1111111111117', '32 GB RAM / 1 TB SSD', false),
('1111111111117', 'NVIDIA RTX 3050 Ti', false),
('1111111111117', 'Windows 11 Pro', false);

-- HP Spectre x360
INSERT INTO especificacoes (cod_barras, titulo, destaque) VALUES
('1111111111118', 'Ecrã Touch 13.5" OLED', true),
('1111111111118', 'Intel Evo i7 12ª Gen', false),
('1111111111118', '16 GB RAM / 1 TB SSD', false),
('1111111111118', 'Modo Tablet 360°', false),
('1111111111118', 'Windows 11 Home', false);

-- Lenovo ThinkPad X1 Carbon
INSERT INTO especificacoes (cod_barras, titulo, destaque) VALUES
('1111111111119', 'Ecrã 14" IPS WUXGA', true),
('1111111111119', 'Intel vPro i7 12ª Gen', false),
('1111111111119', '16 GB RAM / 512 GB SSD', false),
('1111111111119', 'Teclado resistente a derrames', false),
('1111111111119', 'Windows 11 Pro', false);

-- MONITORES

-- AOC 240Hz
INSERT INTO especificacoes (cod_barras, titulo, destaque) VALUES
('1111111111113', '24" FHD IPS 240Hz 0.5ms', true),
('1111111111113', 'Tecnologia G-Sync e FreeSync', false),
('1111111111113', 'Entrada DisplayPort + HDMI', false);

-- Samsung Smart Monitor M7
INSERT INTO especificacoes (cod_barras, titulo, destaque) VALUES
('1111111111120', '32" 4K UHD Smart Monitor', true),
('1111111111120', 'Tizen OS com apps integradas', false),
('1111111111120', 'Compatível com DeX e AirPlay', false);

-- LG UltraFine 5K
INSERT INTO especificacoes (cod_barras, titulo, destaque) VALUES
('1111111111121', '27" 5K Retina Display', true),
('1111111111121', 'Thunderbolt 3 + USB-C', false),
('1111111111121', '99% DCI-P3 Color Gamut', false);

-- BenQ EX3501R
INSERT INTO especificacoes (cod_barras, titulo, destaque) VALUES
('1111111111122', '35" UltraWide Curvo QHD', true),
('1111111111122', 'HDR10, 100Hz', false),
('1111111111122', 'Tecnologia Eye-Care', false);

-- Asus ROG Swift PG259QN
INSERT INTO especificacoes (cod_barras, titulo, destaque) VALUES
('1111111111123', '24.5" Full HD 360Hz 1ms', true),
('1111111111123', 'G-Sync Premium', false),
('1111111111123', 'Design gaming ergonómico', false);

-- TABLETS

-- iPad Pro 12.9
INSERT INTO especificacoes (cod_barras, titulo, destaque) VALUES
('1111111111124', 'Ecrã Liquid Retina XDR 12.9"', true),
('1111111111124', 'Chip Apple M2', false),
('1111111111124', 'Apple Pencil 2ª Geração', false),
('1111111111124', '512 GB Armazenamento', false);

-- Galaxy Tab S8
INSERT INTO especificacoes (cod_barras, titulo, destaque) VALUES
('1111111111125', 'Ecrã LTPS LCD 11" 120Hz', true),
('1111111111125', 'Snapdragon 8 Gen 1', false),
('1111111111125', '8 GB RAM / 256 GB', false),
('1111111111125', 'S Pen incluída', false);

-- Surface Pro 9
INSERT INTO especificacoes (cod_barras, titulo, destaque) VALUES
('1111111111126', 'Ecrã 13" PixelSense Flow', true),
('1111111111126', 'Intel Core i5 / i7', false),
('1111111111126', '16 GB RAM / 512 GB SSD', false),
('1111111111126', 'Surface Slim Pen compatível', false);

-- Fire HD 10
INSERT INTO especificacoes (cod_barras, titulo, destaque) VALUES
('1111111111127', 'Ecrã Full HD 10.1"', true),
('1111111111127', 'Octa-core + 3GB RAM', false),
('1111111111127', '32 GB (expansível via microSD)', false),
('1111111111127', 'Alexa integrada', false);

/*
INSERT INTO ProjetoBeneficencia 
(Nome, Descricao, DataLimite, QuantidadeEquipamentos, OrganizadorID, LojaNIPC, FichaEquipamentoCodBarras, Imagem) 
VALUES
('Doação de Computadores para Escolas e Instituições Carenciadas', 
 'A loja pode recolher computadores usados, recondicioná-los e doá-los para escolas, bibliotecas ou centros comunitários que atendem crianças e jovens de baixa renda. Isso ajuda a reduzir a exclusão digital e a fornecer acesso à tecnologia para fins educacionais.', 
 '2022-12-31', 100, 1, 12345678901234, '12345', '/images/Instituicao-ensino.jpg'),

('Recolha e Reciclagem de Resíduos Eletrônicos', 
 'A loja pode criar um ponto de recolha de equipamentos eletrônicos antigos (teclados, monitores, baterias, etc.), garantindo que sejam reciclados de forma ambientalmente responsável. Parte dos equipamentos pode ser recondicionada e doada.', 
 '2023-06-30', 50, 2, 98765432109876, '67890', '/images/residuos-eletronicos.jpg'),

('Requalificação Digital para Trabalhadores Desempregados', 
 'Apoiar trabalhadores desempregados ou em transição de carreira a adquirirem novas competências digitais, aumentando suas oportunidades no mercado de trabalho.', 
 '2023-06-30', 50, 2, 98765432109876, '67890', '/images/requalificacao-trabalhadores.png'),

('Inclusão Digital para Idosos', 'Oferecer cursos e suporte para idosos aprenderem a utilizar computadores e smartphones, promovendo a inclusão digital e melhorando sua qualidade de vida.', 
    '2024-12-31', 30, 3, 12345678901234, '98765', '/images/inclusao-digital-idosos.jpg');

INSERT INTO Interesse (Data, ClienteID, FichaEquipamentoCodBarras, LojaNIPC)
VALUES 
('2021-11-01', 1, '12345', 12345678901234),
('2021-11-05', 2, '67890', 98765432109876);
*/

/*
INSERT INTO Morada (Pais, Localidade, Latitude, Longitude, Freguesia, Rua, CodigoPostal, Concelho, Numero, Distrito) 
VALUES ('Portugal', 'Lisboa', 38.7169, -9.1399, 'Santa Maria Maior', 'Rua Augusta', '1100-053', 'Lisboa', 10, 'Lisboa') 
RETURNING ID;


INSERT INTO Pessoa (NIF, NIC, Nome, Genero, Telemovel, Email, Password, DataDeNascimento, MoradaID)
VALUES 
(123456789, 987654321, 'João Silva', 'Masculino', 912345678, 'joao.silva@gmail.com', 'DB_PASSWORD_REMOVED', '1990-05-15', 1);

*/
