DROP TABLE IF EXISTS pecasASubstituir CASCADE;
DROP TABLE IF EXISTS especificacoes CASCADE;
DROP TABLE IF EXISTS imagensEquipamento CASCADE;
DROP TABLE IF EXISTS interesse CASCADE;
DROP TABLE IF EXISTS projetoBeneficencia CASCADE;
DROP TABLE IF EXISTS reparacao CASCADE;
DROP TABLE IF EXISTS doacao CASCADE;
DROP TABLE IF EXISTS venda_equipamento CASCADE;
DROP TABLE IF EXISTS venda CASCADE;
DROP TABLE IF EXISTS compra CASCADE;
DROP TABLE IF EXISTS equipamentos CASCADE;
DROP TABLE IF EXISTS fichaDeEquipamento CASCADE;
DROP TABLE IF EXISTS pecas CASCADE;
DROP TABLE IF EXISTS organizador CASCADE;
DROP TABLE IF EXISTS doador CASCADE;
DROP TABLE IF EXISTS empregado CASCADE;
DROP TABLE IF EXISTS cliente CASCADE;
DROP TABLE IF EXISTS loja CASCADE;
DROP TABLE IF EXISTS pessoa CASCADE;
DROP TABLE IF EXISTS morada CASCADE;


CREATE TABLE morada (
    id SERIAL PRIMARY KEY,
    pais VARCHAR(100),
    localidade VARCHAR(100),
    latitude FLOAT,
    longitude FLOAT,
    freguesia VARCHAR(100),
    rua VARCHAR(255),
    codigoPostal VARCHAR(20),
    concelho VARCHAR(100),
    numero INT,
    distrito VARCHAR(100)
);

CREATE TABLE pessoa (
    id SERIAL PRIMARY KEY,
    nif INT UNIQUE,
    nic INT UNIQUE,
    nome VARCHAR(255),
    genero VARCHAR(20) CHECK (genero IN ('Masculino', 'Feminino', 'Outro')),
    telemovel INT UNIQUE,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    dataDeNascimento DATE,
    moradaId INT REFERENCES morada(id)
);

CREATE TABLE loja (
    nipc BIGINT PRIMARY KEY,
    nome VARCHAR(255),
    numeroTelefone INT,
    email VARCHAR(255) UNIQUE,
    moradaId INT REFERENCES morada(id),
    horaabertura TIME NOT NULL,
    horafecho TIME NOT NULL
);

CREATE TABLE cliente (
    id SERIAL PRIMARY KEY,
    pessoaId INT REFERENCES pessoa(id)
);

CREATE TABLE empregado (
    numInterno SERIAL PRIMARY KEY,
    lojaNipc BIGINT REFERENCES loja(nipc),
    pessoaId INT REFERENCES pessoa(id)
);

CREATE TABLE doador (
    id SERIAL PRIMARY KEY,
    pessoaId INT REFERENCES pessoa(id)
);

CREATE TABLE organizador (
    id SERIAL PRIMARY KEY,
    pessoaId INT REFERENCES pessoa(id)
);

CREATE TABLE pecas (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(255),
    preco FLOAT
);

CREATE TABLE fichaDeEquipamento (
    codBarras VARCHAR(50) PRIMARY KEY,
    marca VARCHAR(100),
    modelo VARCHAR(100),
    tipo VARCHAR(100),
    precoBase FLOAT,
    anoLancamento INT
);

CREATE TABLE equipamentos (
    id SERIAL PRIMARY KEY,
    estadovenda VARCHAR(50),
    estado VARCHAR(50),
    preco DECIMAL(10,2),
    numeroSequenciaLoja VARCHAR(100),
    lojaNipc BIGINT REFERENCES loja(nipc),
    dataDeDisponibilizacao DATE,
    codBarras VARCHAR(50) REFERENCES fichaDeEquipamento(codBarras)
);

CREATE TABLE compra (
    id SERIAL PRIMARY KEY,
    estadoCompra VARCHAR(50),
    data DATE,
    preco FLOAT,
    clienteId INT REFERENCES cliente(id),
    empregadoId INT REFERENCES empregado(numInterno),
    lojaNipc BIGINT REFERENCES loja(nipc),
    estado VARCHAR(50),
    metodoPagamento VARCHAR(50),
    codBarras VARCHAR(50) REFERENCES fichaDeEquipamento(codBarras)
);

CREATE TABLE venda (
    numeroVenda SERIAL PRIMARY KEY,
    data DATE NOT NULL,
    tipo VARCHAR(50),
    custoTransporte FLOAT,
    lojaNipc BIGINT REFERENCES loja(nipc),
    clienteId INT REFERENCES cliente(id),
    empregadoId INT REFERENCES empregado(numInterno),
    estadoVenda VARCHAR(50) DEFAULT 'Pago'
);



CREATE TABLE venda_equipamento (
    id SERIAL PRIMARY KEY,
    numeroVenda INT REFERENCES venda(numeroVenda) ON DELETE CASCADE,
    equipamentoId INT REFERENCES equipamentos(id),
    quantidade INT DEFAULT 1,
    precoUnitario FLOAT
);

CREATE TABLE doacao (
    idDoacao SERIAL PRIMARY KEY,
    data DATE,
    doadorId INT REFERENCES doador(id),
    lojaNipc BIGINT REFERENCES loja(nipc),
    empregadoId INT REFERENCES empregado(numInterno),
    equipamentoId INT REFERENCES equipamentos(id),
    projetoBeneficenciaId INT,
    compraId INT REFERENCES compra(id)
);

CREATE TABLE reparacao (
    id SERIAL PRIMARY KEY,
    dataRececaoEquipamento DATE,
    dataEntregaAoCliente DATE,
    numPedidoOrcamento FLOAT,
    descNaoFunciona TEXT,
    estado VARCHAR(999),
    orcamentoReparacao FLOAT,
    clienteId INT REFERENCES cliente(id),
    empregadoId INT REFERENCES empregado(numInterno),
    codBarras VARCHAR(50) REFERENCES fichaDeEquipamento(codBarras),
    lojaNipc BIGINT REFERENCES loja(nipc),
    compraId INT REFERENCES compra(id),
    CONSTRAINT unique_orcamento_por_loja UNIQUE (lojaNipc, numPedidoOrcamento)
);

CREATE TABLE projetoBeneficencia (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255),
    descricao TEXT,
    dataLimite DATE,
    quantidadeEquipamentos INT,
    organizadorId INT REFERENCES organizador(id),
    lojaNipc BIGINT REFERENCES loja(nipc),
    fichaEquipamentoCodBarras VARCHAR(50) REFERENCES fichaDeEquipamento(codBarras),
    imagem VARCHAR(500)
);

CREATE TABLE interesse (
    id SERIAL PRIMARY KEY,
    data DATE,
    clienteId INT REFERENCES cliente(id),
    fichaEquipamentoCodBarras VARCHAR(50) REFERENCES fichaDeEquipamento(codBarras),
    lojaNipc BIGINT REFERENCES loja(nipc)
);

CREATE TABLE imagensEquipamento (
    id SERIAL PRIMARY KEY,
    codBarras VARCHAR(50) REFERENCES fichaDeEquipamento(codBarras) ON DELETE CASCADE,
    url TEXT NOT NULL
);

CREATE TABLE especificacoes (
    id SERIAL PRIMARY KEY,
    codBarras VARCHAR(50) REFERENCES fichaDeEquipamento(codBarras) ON DELETE CASCADE,
    titulo TEXT,
    destaque BOOLEAN DEFAULT FALSE
);

CREATE TABLE pecasASubstituir (
    id SERIAL PRIMARY KEY,
    estadoEquipamento TEXT,
    reparacaoId INT REFERENCES reparacao(id),
    peca TEXT NOT NULL,
    custo FLOAT NOT NULL
);


INSERT INTO fichaDeEquipamento (codBarras, marca, modelo, tipo, precoBase, anoLancamento)
VALUES 
('1111111111111', 'Apple', 'iPhone 15', 'Telemóveis', 699.99, 2023),
('1111111111112', 'Apple', 'iPhone 15 Pro Max', 'Telemóveis', 999.99, 2023),
('1111111111113', 'AOC', '240hz', 'Monitores', 399.99, 2022),
('1111111111114', 'ASUS', 'Portátil ASUS', 'Portáteis', 1199.99, 2021),
('1111111111115', 'Google', 'Pixel 7', 'Telemóveis', 799.99, 2023),
('1111111111116', 'Xiaomi', '13 Pro', 'Telemóveis', 699.99, 2023),
('1111111111117', 'Dell', 'XPS 15', 'Portáteis', 1799.99, 2022),
('1111111111118', 'HP', 'Spectre x360', 'Portáteis', 1399.99, 2022),
('1111111111119', 'LeNovo', 'ThinkPad X1 Carbon', 'Portáteis', 1599.99, 2022),
('1111111111120', 'Samsung', 'Smart Monitor M7', 'Monitores', 499.99, 2023),
('1111111111121', 'LG', 'UltraFine 5K', 'Monitores', 1299.99, 2021),
('1111111111122', 'BenQ', 'EX3501R', 'Monitores', 799.99, 2021),
('1111111111123', 'Asus', 'ROG Swift PG259QN', 'Monitores', 699.99, 2021),
('1111111111124', 'Apple', 'iPad Pro 12.9', 'Tablets', 1199.99, 2023),
('1111111111125', 'Samsung', 'Galaxy Tab S8', 'Tablets', 899.99, 2023),
('1111111111126', 'Microsoft', 'Surface Pro 9', 'Tablets', 1099.99, 2022),
('1111111111127', 'Amazon', 'Fire HD 10', 'Tablets', 199.99, 2020);

-- Almeirim
INSERT INTO morada (Pais, Localidade, Latitude, Longitude, Freguesia, Rua, CodigoPostal, Concelho, Numero, Distrito)
VALUES ('Portugal', 'Almeirim', 39.207558, -8.625919, 'Ville', 'Avenida Mia Vicente', '9600-133', 'Vila Real', 58, 'Vila Nova de Famalicão');

-- Leiria
INSERT INTO morada (Pais, Localidade, Latitude, Longitude, Freguesia, Rua, CodigoPostal, Concelho, Numero, Distrito)
VALUES ('Portugal', 'Leiria', 39.74362, -8.80705, 'Ville', 'R. Tavares', '5423-511', 'Chaves', 13, 'Pombal');

-- Anadia
INSERT INTO morada (Pais, Localidade, Latitude, Longitude, Freguesia, Rua, CodigoPostal, Concelho, Numero, Distrito)
VALUES ('Portugal', 'Anadia', 40.4371, -8.4386, 'Ville', 'Avenida do Dr. Nuno Pinheiro Torres', '9593-103', 'Caniço', 141, 'Coimbra');

-- Montemor-o-Novo
INSERT INTO morada (Pais, Localidade, Latitude, Longitude, Freguesia, Rua, CodigoPostal, Concelho, Numero, Distrito)
VALUES ('Portugal', 'Montemor-o-Novo', 38.64812, -8.21455, 'Ville', 'Largo Tiago Cruz', '1928-327', 'Miranda do Douro', 126, 'Paços de Ferreira');

-- Lixa
INSERT INTO morada (Pais, Localidade, Latitude, Longitude, Freguesia, Rua, CodigoPostal, Concelho, Numero, Distrito)
VALUES ('Portugal', 'Lixa', 41.2946, -8.1476, 'Ville', 'Avenida de Cunha', '3767-242', 'Vila Real', 115, 'Ílhavo');

-- Ílhavo
INSERT INTO morada (Pais, Localidade, Latitude, Longitude, Freguesia, Rua, CodigoPostal, Concelho, Numero, Distrito)
VALUES ('Portugal', 'Ílhavo', 40.6040, -8.6689, 'Ville', 'Praça Edgar Anjos', '2269-166', 'Valpaços', 72, 'Vila Nova de Gaia');

-- Elvas
INSERT INTO morada (Pais, Localidade, Latitude, Longitude, Freguesia, Rua, CodigoPostal, Concelho, Numero, Distrito)
VALUES ('Portugal', 'Elvas', 38.8811, -7.1628, 'Ville', 'Travessa Matias', '7048-281', 'Torres Vedras', 53, 'Felgueiras');

-- Fiães
INSERT INTO morada (Pais, Localidade, Latitude, Longitude, Freguesia, Rua, CodigoPostal, Concelho, Numero, Distrito)
VALUES ('Portugal', 'Fiães', 40.99446, -8.52537, 'Ville', 'Praça de Alves', '5430-391', 'Tarouca', 280, 'Vendas Novas');

-- Esmoriz
INSERT INTO morada (Pais, Localidade, Latitude, Longitude, Freguesia, Rua, CodigoPostal, Concelho, Numero, Distrito)
VALUES ('Portugal', 'Esmoriz', 40.95773, -8.62753, 'Ville', 'Alameda de Cunha', '4657-871', 'Lisboa', 45, 'Peso da Régua');

-- Vila Nova de Gaia
INSERT INTO morada (Pais, Localidade, Latitude, Longitude, Freguesia, Rua, CodigoPostal, Concelho, Numero, Distrito)
VALUES ('Portugal', 'Vila Nova de Gaia', 41.1336, -8.61742, 'Ville', 'Avenida Teixeira', '3105-183', 'Tarouca', 217, 'Vila Franca de Xira');

INSERT INTO morada (
    pais, localidade, latitude, longitude, freguesia, rua, codigoPostal, concelho, numero, distrito
) VALUES (
    'Portugal', 'Charneca da Caparica', 38.6150, -9.1920, 'Charneca de Caparica e Sobreda', 'Rua da Ponderosa', '2820-567', 'Almada', 10, 'Setúbal'
);

INSERT INTO morada (
    pais, localidade, latitude, longitude, freguesia, rua, codigoPostal, concelho, numero, distrito
) VALUES (
    'Portugal', 'Monte da Caparica', 38.6621, -9.2030, 'Caparica e Trafaria', 'Avenida Timor Lorosae', '2825-321', 'Almada', 45, 'Setúbal'
);

INSERT INTO morada (
    pais, localidade, latitude, longitude, freguesia, rua, codigoPostal, concelho, numero, distrito
) VALUES (
    'Portugal', 'Charneca da Caparica', 38.6192, -9.1836, 'Charneca de Caparica e Sobreda', 'Rua da Gama Barros', '2820-256', 'Almada', 25, 'Setúbal'
);


INSERT INTO pessoa (nif, nic, nome, genero, telemovel, email, password, dataDeNascimento, moradaId) VALUES (242068763, 86644106, 'Luciana-Érica Monteiro', 'Masculino', 964190206, 'eduardobarbosa@sapo.pt', 'p6aN%flo^R_1', '1960-11-29', 1);
INSERT INTO pessoa (nif, nic, nome, genero, telemovel, email, password, dataDeNascimento, moradaId) VALUES (154318806, 97529405, 'Alexandra Baptista-Faria', 'Masculino', 921160949, 'nmorais@sapo.pt', 'a7kLJwzT!29M', '2005-02-24', 4);
INSERT INTO pessoa (nif, nic, nome, genero, telemovel, email, password, dataDeNascimento, moradaId) VALUES (436730606, 17672593, 'Nuno Morais', 'Masculino', 943745717, 'nascimentodinis@araujo.net', '&1&aTS7hB7)Z', '1985-06-08', 9);
INSERT INTO pessoa (nif, nic, nome, genero, telemovel, email, password, dataDeNascimento, moradaId) VALUES (766964667, 85563727, 'Brian Nogueira', 'Outro', 924304543, 'sergioaraujo@hotmail.com', 'n4Fza!mA^v)o', '1972-10-13', 1);
INSERT INTO pessoa (nif, nic, nome, genero, telemovel, email, password, dataDeNascimento, moradaId) VALUES (402533494, 91178885, 'Tomás Leal', 'Outro', 923663184, 'dferreira@gmail.com', '!jI7gbJ!_6sS', '1983-07-01', 4);
INSERT INTO pessoa (nif, nic, nome, genero, telemovel, email, password, dataDeNascimento, moradaId) VALUES (236843584, 15614174, 'Joana Andrade', 'Outro', 934012171, 'martabarros@pacheco.pt', ')2r@gCHfpl7k', '1969-05-21', 9);
INSERT INTO pessoa (nif, nic, nome, genero, telemovel, email, password, dataDeNascimento, moradaId) VALUES (314289692, 71780854, 'Helena Esteves', 'Feminino', 924960146, 'alicejesus@araujo.org', 'yMv(x1v7^8fB', '1993-06-27', 4);
INSERT INTO pessoa (nif, nic, nome, genero, telemovel, email, password, dataDeNascimento, moradaId) VALUES (304095531, 44188276, 'Tiago Matias', 'Feminino', 910113499, 'beatriz15@silva.com', 'bCd4Qbjh0+In', '1995-07-14', 10);
INSERT INTO pessoa (nif, nic, nome, genero, telemovel, email, password, dataDeNascimento, moradaId) VALUES (802984810, 53251559, 'Letícia Matos', 'Feminino', 955340576, 'kvicente@garcia.com', '$46No^IY2dHz', '2007-03-22', 1);
INSERT INTO pessoa (nif, nic, nome, genero, telemovel, email, password, dataDeNascimento, moradaId) VALUES (556497252, 39372360, 'Sérgio Neto', 'Masculino', 941175415, 'fabiomendes@miranda.pt', 'K+p8Nr8j)5Ke', '1959-09-25', 7);
INSERT INTO pessoa (nif, nic, nome, genero, telemovel, email, password, dataDeNascimento, moradaId) VALUES (248578017, 30244148, 'José do Cardoso', 'Feminino', 957406986, 'marquesamelia@nunes.pt', 'GiwnrUNv&0rG', '1987-06-23', 5);
INSERT INTO pessoa (nif, nic, nome, genero, telemovel, email, password, dataDeNascimento, moradaId) VALUES (335602191, 46632757, 'Luísa Amaral', 'Masculino', 936095765, 'kvalente@sapo.pt', 't#b&9qRaCLCr', '1955-07-27', 4);
INSERT INTO pessoa (nif, nic, nome, genero, telemovel, email, password, dataDeNascimento, moradaId) VALUES (904258674, 82399599, 'Ivo Domingues', 'Feminino', 953630431, 'amaralmartim@alves.net', 'T4diVWd(m#7@', '1981-03-29', 2);
INSERT INTO pessoa (nif, nic, nome, genero, telemovel, email, password, dataDeNascimento, moradaId) VALUES (867741192, 36619372, 'Paulo Sá', 'Masculino', 965738718, 'tavaresvioleta@sousa.com', 'JFPDrm*x)n0L', '1996-02-29', 7);
INSERT INTO pessoa (nif, nic, nome, genero, telemovel, email, password, dataDeNascimento, moradaId) VALUES (967797300, 82232344, 'Luana Matias', 'Masculino', 965414110, 'marcos14@sapo.pt', 'b7OSOEt8WrT$', '1987-07-01', 6);

INSERT INTO loja (nipc, nome, numeroTelefone, email, moradaId, horaabertura, horafecho)
VALUES (696115913, 'Charnecatrónica - Rua da Ponderosa', 242255732, 'trodrigues@melo.com', 11, '09:00:00', '18:00:00');

INSERT INTO loja (nipc, nome, numeroTelefone, email, moradaId, horaabertura, horafecho)
VALUES (199915275, 'Charnecatrónica - Avenida Timor Lorosae', 249491631, 'aliciasa@goncalves.pt', 12, '10:00:00', '19:00:00');

INSERT INTO loja (nipc, nome, numeroTelefone, email, moradaId, horaabertura, horafecho)
VALUES (694287057, 'Charnecatrónica - Rua da Gama Barros', 281259135, 'anita85@tavares.pt', 13, '08:30:00', '17:30:00');


INSERT INTO equipamentos (estadoVenda, estado, preco, numeroSequenciaLoja, lojaNipc, dataDeDisponibilizacao, codBarras)
VALUES
('À venda', 'Novo', 699.99, '0001', 696115913, '2024-03-16', '1111111111111'),
('À venda', 'Muito usado', 999.99, '0002', 199915275, '2024-02-25', '1111111111112'),
('À venda', 'Novo', 399.99, '0003', 694287057, '2024-01-10', '1111111111113'),
('À venda', 'Semi-novo', 1199.99, '0004', 696115913, '2024-01-05', '1111111111114'),
('À venda', 'Muito usado', 799.99, '0005', 199915275, '2024-03-10', '1111111111115'),
('À venda', 'Novo', 699.99, '0006', 694287057, '2024-03-12', '1111111111116'),
('À venda', 'Usado', 1799.99, '0007', 696115913, '2024-02-15', '1111111111117'),
('À venda', 'Semi-novo', 1399.99, '0008', 199915275, '2024-02-20', '1111111111118'),
('À venda', 'Usado', 1599.99, '0009', 694287057, '2024-02-28', '1111111111119'),
('À venda', 'Novo', 499.99, '0010', 696115913, '2024-03-05', '1111111111120'),
('À venda', 'Usado', 1299.99, '0011', 199915275, '2024-01-22', '1111111111121'),
('À venda', 'Novo', 799.99, '0012', 694287057, '2024-01-28', '1111111111122'),
('À venda', 'Semi-novo', 699.99, '0013', 696115913, '2024-02-02', '1111111111123'),
('À venda', 'Novo', 1199.99, '0014', 199915275, '2024-03-15', '1111111111124'),
('À venda', 'Semi-novo', 899.99, '0015', 694287057, '2024-03-07', '1111111111125'),
('À venda', 'Muito usado', 1099.99, '0016', 696115913, '2024-03-09', '1111111111126'),
('À venda', 'Usado', 199.99, '0017', 199915275, '2024-01-18', '1111111111127');


INSERT INTO cliente (pessoaId) VALUES (1);
INSERT INTO cliente (pessoaId) VALUES (2);
INSERT INTO cliente (pessoaId) VALUES (3);
INSERT INTO cliente (pessoaId) VALUES (4);
INSERT INTO cliente (pessoaId) VALUES (5);

INSERT INTO empregado (pessoaId, lojaNipc) VALUES (6, 696115913);
INSERT INTO empregado (pessoaId, lojaNipc) VALUES (7, 199915275);
INSERT INTO empregado (pessoaId, lojaNipc) VALUES (8, 694287057);
INSERT INTO empregado (pessoaId, lojaNipc) VALUES (9, 696115913);
INSERT INTO empregado (pessoaId, lojaNipc) VALUES (10, 199915275);


INSERT INTO doador (pessoaId) VALUES (11);
INSERT INTO doador (pessoaId) VALUES (12);

INSERT INTO organizador (pessoaId) VALUES (13);
INSERT INTO organizador (pessoaId) VALUES (14);

INSERT INTO pecas (tipo, preco) VALUES ('fugit', 163.35);
INSERT INTO pecas (tipo, preco) VALUES ('inventore', 148.65);
INSERT INTO pecas (tipo, preco) VALUES ('explicabo', 111.88);
INSERT INTO pecas (tipo, preco) VALUES ('eveniet', 194.89);
INSERT INTO pecas (tipo, preco) VALUES ('cumque', 81.92);

INSERT INTO cliente (pessoaId)
VALUES 
(1),
(2);

INSERT INTO empregado (lojaNipc, pessoaId)
VALUES 
(199915275, 1),
(696115913, 2);

INSERT INTO doador (pessoaId)
VALUES 
(1),
(2);

INSERT INTO organizador (pessoaId)
VALUES 
(1),
(2);

INSERT INTO pecas (tipo, preco)
VALUES 
('Bateria', 50.0),
('Tela', 100.0);

INSERT INTO compra (data, estadoCompra, preco, clienteId, empregadoId, lojaNipc, estado, metodoPagamento, codBarras)
VALUES 
('2021-11-01','Por vender', 999.99, 1, 1, 199915275, 'Novo', 'MbWay', '1111111111111'),
('2021-11-10','Por vender', 799.99, 2, 2, 696115913, 'Usado', 'MbWay', '1111111111111');

INSERT INTO venda (data, tipo, custoTransporte, lojaNipc, clienteId, empregadoId, estadoVenda)
VALUES 
('2021-12-01', 'Venda Direta', 10.0, 199915275, 1, 1, 'Entregue'),
('2021-12-10', 'Venda Direta', 15.0, 696115913, 2, 2, 'Pago');


INSERT INTO doacao (data, doadorId, lojaNipc, empregadoId, equipamentoId, projetoBeneficenciaId, compraId)
VALUES 
('2021-11-05', 1, 199915275, 1, 1, 1, 1),
('2021-11-12', 2, 696115913, 2, 2, 2, 2);




INSERT INTO imagensEquipamento (codBarras, url)
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
  ('1111111111119', '/images/leNovoThinkPad.jpg'),
  ('1111111111120', '/images/samsungM7.jpg'),
  ('1111111111121', '/images/lgUltraFine.jpg'),
  ('1111111111122', '/images/benQEX3501R.jpg'),
  ('1111111111123', '/images/asusROGSwift.jpg'),
  ('1111111111124', '/images/ipadPro12.jpeg'),
  ('1111111111125', '/images/galaxyTabS8.jpg'),
  ('1111111111126', '/images/surfacePro9.jpg'),
  ('1111111111127', '/images/amazonFireHD.jpg');

INSERT INTO especificacoes (codBarras, titulo, destaque) VALUES
('1111111111111', '15,5 cm (6.1") 2556 x 1179 pixels Ceramic Shield', false),
('1111111111111', 'Apple A18', false),
('1111111111111', '256 GB', false),
('1111111111111', '5G Dual SIM NanoSIM + eSIM', false),
('1111111111111', 'Wi-Fi 7 (802.11be) Bluetooth 5.3 Near Field Communication (NFC)', false),
('1111111111111', 'Câmara dupla 48 MP 12 MP', false),
('1111111111111', 'Íão-lítio Carregamento wireless', false),
('1111111111111', 'iOS 18', false),

-- iPhone 15
('1111111111111', 'Ecrã 6.1" Super Retina XDR OLED', true),
('1111111111111', 'Apple A16 Bionic', false),
('1111111111111', '256 GB Armazenamento', false),
('1111111111111', 'Sistema de Câmara Dupla 48MP + 12MP', false),
('1111111111111', 'Face ID, 5G, iOS 17', false),

-- iPhone 15 Pro Max
('1111111111112', 'Ecrã 6.7" ProMotion OLED 120Hz', true),
('1111111111112', 'Apple A17 Pro', false),
('1111111111112', '512 GB Armazenamento', false),
('1111111111112', 'Câmara tripla com zoom ótico 5x', false),
('1111111111112', 'Titanium Frame, iOS 17', false),

-- Google Pixel 7
('1111111111115', 'Ecrã OLED 6.3" FHD+ 90Hz', true),
('1111111111115', 'Google Tensor G2', false),
('1111111111115', '128 GB Armazenamento', false),
('1111111111115', 'Câmara dupla 50MP + 12MP', false),
('1111111111115', 'Android 13, IP68', false),

-- Xiaomi 13 Pro
('1111111111116', 'Ecrã AMOLED 6.73" WQHD+ 120Hz', true),
('1111111111116', 'Snapdragon 8 Gen 2', false),
('1111111111116', '256 GB + 12 GB RAM', false),
('1111111111116', 'Câmara tripla Leica 50MP', false),
('1111111111116', 'Carga rápida 120W', false),

-- ASUS Portátil
('1111111111114', 'Ecrã 15.6" Full HD', true),
('1111111111114', 'Intel Core i7 11ª Gen', false),
('1111111111114', '16 GB RAM / 512 GB SSD', false),
('1111111111114', 'GPU NVIDIA GeForce MX450', false),
('1111111111114', 'Windows 11', false),

-- Dell XPS 15
('1111111111117', 'Ecrã 15.6" 4K+ InfinityEdge', true),
('1111111111117', 'Intel Core i9', false),
('1111111111117', '32 GB RAM / 1 TB SSD', false),
('1111111111117', 'NVIDIA RTX 3050 Ti', false),
('1111111111117', 'Windows 11 Pro', false),

-- HP Spectre x360
('1111111111118', 'Ecrã Touch 13.5" OLED', true),
('1111111111118', 'Intel Evo i7 12ª Gen', false),
('1111111111118', '16 GB RAM / 1 TB SSD', false),
('1111111111118', 'Modo Tablet 360°', false),
('1111111111118', 'Windows 11 Home', false),

-- LeNovo ThinkPad X1 Carbon
('1111111111119', 'Ecrã 14" IPS WUXGA', true),
('1111111111119', 'Intel vPro i7 12ª Gen', false),
('1111111111119', '16 GB RAM / 512 GB SSD', false),
('1111111111119', 'Teclado resistente a derrames', false),
('1111111111119', 'Windows 11 Pro', false),

-- Monitores
('1111111111113', '24" FHD IPS 240Hz 0.5ms', true),
('1111111111113', 'Tecnologia G-Sync e FreeSync', false),
('1111111111113', 'Entrada DisplayPort + HDMI', false),

('1111111111120', '32" 4K UHD Smart Monitor', true),
('1111111111120', 'Tizen OS com apps integradas', false),
('1111111111120', 'Compatível com DeX e AirPlay', false),

('1111111111121', '27" 5K Retina Display', true),
('1111111111121', 'Thunderbolt 3 + USB-C', false),
('1111111111121', '99% DCI-P3 Color Gamut', false),

('1111111111122', '35" UltraWide Curvo QHD', true),
('1111111111122', 'HDR10, 100Hz', false),
('1111111111122', 'Tecnologia Eye-Care', false),

('1111111111123', '24.5" Full HD 360Hz 1ms', true),
('1111111111123', 'G-Sync Premium', false),
('1111111111123', 'Design gaming ergonómico', false),

-- Tablets
('1111111111124', 'Ecrã Liquid Retina XDR 12.9"', true),
('1111111111124', 'Chip Apple M2', false),
('1111111111124', 'Apple Pencil 2ª Geração', false),
('1111111111124', '512 GB Armazenamento', false),

('1111111111125', 'Ecrã LTPS LCD 11" 120Hz', true),
('1111111111125', 'Snapdragon 8 Gen 1', false),
('1111111111125', '8 GB RAM / 256 GB', false),
('1111111111125', 'S Pen incluída', false),

('1111111111126', 'Ecrã 13" PixelSense Flow', true),
('1111111111126', 'Intel Core i5 / i7', false),
('1111111111126', '16 GB RAM / 512 GB SSD', false),
('1111111111126', 'Surface Slim Pen compatível', false),

('1111111111127', 'Ecrã Full HD 10.1"', true),
('1111111111127', 'Octa-core + 3GB RAM', false),
('1111111111127', '32 GB (expansível via microSD)', false),
('1111111111127', 'Alexa integrada', false);

INSERT INTO projetoBeneficencia (
  nome, descricao, dataLimite, quantidadeEquipamentos,
  organizadorId, lojaNipc, fichaEquipamentoCodBarras, imagem
) VALUES
('Doação de Computadores para Escolas e Instituições Carenciadas',
 'Este projeto visa a coleta de computadores usados junto às lojas, que serão submetidos a um processo rigoroso de recondicionamento, garantindo a plena funcionalidade dos equipamentos. Posteriormente, os dispositivos serão doados a escolas, bibliotecas e centros comunitários que atendem crianças, adolescentes e jovens em situação de vulnerabilidade socioeconômica. A iniciativa tem como objetivo primordial reduzir a exclusão digital, promovendo o acesso à tecnologia como ferramenta fundamental para o desenvolvimento educacional, a inclusão social e o fortalecimento da comunidade local.',
 '2022-12-31', 100, 1, 199915275, '1111111111126', '/images/Instituicao-ensino.jpg'),

('Recolha e Reciclagem de Resíduos Eletrônicos',
 'O presente projeto institui um sistema sustentável de recolha de equipamentos eletrônicos obsoletos e descartados, tais como teclados, monitores, baterias e demais periféricos. Estes resíduos serão encaminhados para reciclagem conforme as normas ambientais vigentes, assegurando a destinação correta e a minimização dos impactos ambientais decorrentes do descarte inadequado. Parte dos equipamentos recolhidos, após avaliação técnica, será submetida a processos de recondicionamento e reutilização, com o intuito de ampliar a oferta de recursos tecnológicos para doação a instituições necessitadas, promovendo, assim, a economia circular e a responsabilidade socioambiental.',
 '2023-06-30', 50, 2, 696115913, '1111111111122', '/images/residuos-eletronicos.jpg'),

('Requalificação Digital para Trabalhadores Desempregados',
 'Este programa é direcionado a trabalhadores em situação de desemprego ou em processo de transição profissional, oferecendo formação especializada em competências digitais contemporâneas. O curso contempla o desenvolvimento de habilidades técnicas e digitais essenciais para a inserção e competitividade no mercado de trabalho atual, incluindo o uso de softwares, ferramentas digitais e plataformas colaborativas. A iniciativa pretende aumentar as oportunidades de emprego e contribuir para a reinserção laboral através da capacitação contínua, fortalecendo a autonomia e a empregabilidade dos participantes.',
 '2023-06-30', 50, 2, 696115913, '1111111111124', '/images/requalificacao-trabalhadores.png'),

('Inclusão Digital para Idosos',
 'Este projeto tem como finalidade promover a inclusão digital da população idosa, por meio da oferta de cursos e suporte técnico personalizados para o uso de computadores, smartphones e outras tecnologias digitais. As atividades são elaboradas para facilitar o aprendizado e a familiarização com dispositivos eletrônicos, visando ampliar a autonomia, a comunicação e a participação social dos idosos. Ao promover a alfabetização digital, o projeto busca melhorar a qualidade de vida, estimular a saúde mental e proporcionar um maior acesso a serviços e informações essenciais na era digital.',
 '2024-12-31', 30, 3, 199915275, '1111111111123', '/images/inclusao-digital-idosos.jpg');
