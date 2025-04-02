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

-- Tabela principal de equipamentos
CREATE TABLE equipamentos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    preco DECIMAL(10,2),
    avaliacao FLOAT,
    reviews VARCHAR(50),
    imagem VARCHAR(255)
);

-- Tabelas que referenciam corretamente 'equipamentos'

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
INSERT INTO Ficha_de_Equipamento (Cod_barras, Marca, Modelo, Tipo, Preco_base, Ano_lancamento, PecasID) VALUES ('3518233749896', 'Barbosa', 'Modelo 0', 'Tablet', 1675.87, 2019, 3);
INSERT INTO Ficha_de_Equipamento (Cod_barras, Marca, Modelo, Tipo, Preco_base, Ano_lancamento, PecasID) VALUES ('3435240824005', 'Tavares', 'Modelo 1', 'Portátil', 1438.69, 2010, 2);
INSERT INTO Ficha_de_Equipamento (Cod_barras, Marca, Modelo, Tipo, Preco_base, Ano_lancamento, PecasID) VALUES ('2710947775203', 'Morais', 'Modelo 2', 'Tablet', 1971.92, 2023, 2);
INSERT INTO Ficha_de_Equipamento (Cod_barras, Marca, Modelo, Tipo, Preco_base, Ano_lancamento, PecasID) VALUES ('1167190229419', 'Borges Pacheco e Filhos', 'Modelo 3', 'Telemóvel', 822.24, 2017, 3);
INSERT INTO Ficha_de_Equipamento (Cod_barras, Marca, Modelo, Tipo, Preco_base, Ano_lancamento, PecasID) VALUES ('9993867749643', 'Ramos S/A', 'Modelo 4', 'Portátil', 803.34, 2013, 3);
INSERT INTO Ficha_de_Equipamento (Cod_barras, Marca, Modelo, Tipo, Preco_base, Ano_lancamento, PecasID) VALUES ('3341232812069', 'Sá', 'Modelo 5', 'Telemóvel', 1257.35, 2012, 5);
INSERT INTO Ficha_de_Equipamento (Cod_barras, Marca, Modelo, Tipo, Preco_base, Ano_lancamento, PecasID) VALUES ('9740344713495', 'Martins Batista S.A.', 'Modelo 6', 'Portátil', 410.46, 2016, 3);
INSERT INTO Ficha_de_Equipamento (Cod_barras, Marca, Modelo, Tipo, Preco_base, Ano_lancamento, PecasID) VALUES ('2421024994713', 'Sá', 'Modelo 7', 'Portátil', 1400.77, 2023, 1);
INSERT INTO Ficha_de_Equipamento (Cod_barras, Marca, Modelo, Tipo, Preco_base, Ano_lancamento, PecasID) VALUES ('4648877190651', 'Amaral', 'Modelo 8', 'Portátil', 1661.42, 2022, 3);
INSERT INTO Ficha_de_Equipamento (Cod_barras, Marca, Modelo, Tipo, Preco_base, Ano_lancamento, PecasID) VALUES ('1399049027871', 'Coelho', 'Modelo 9', 'Monitor', 608.71, 2013, 5);
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
 '2023-06-30', 50, 2, 98765432109876, '67890', '/images/requalificacao-trabalhadores.png');

('Inclusão Digital para Idosos', 'Oferecer cursos e suporte para idosos aprenderem a utilizar computadores e smartphones, promovendo a inclusão digital e melhorando sua qualidade de vida.', 
    '2024-12-31', 30, 3, 12345678901234, '98765', '/images/inclusao-digital-idosos.png');

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
