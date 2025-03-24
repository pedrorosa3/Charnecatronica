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