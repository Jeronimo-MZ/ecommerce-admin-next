-- UTILIZADOR
INSERT INTO UTILIZADOR (utilizador_cod, utilizador_nome, utilizador_email, utilizador_senha, utilizador_endereco, data_criacao, data_atualizacao)
VALUES
    (1, 'Jerónimo Matavel', 'mail@gmail.com', '$2b$12$wV6wShLGvK4t9hIzH3pNHOzy8b62qCQHLeiK6U3SzQYqtx/4ZNmfG', 'Maputo', '2023-10-26 22:55:21', '2023-10-26 22:55:21');

-- LOJA
INSERT INTO LOJA (loja_cod, loja_nome, loja_url, loja_moeda_usada, cod_utilizador, data_criacao, data_atualizacao)
VALUES
    (1, 'Mericos', 'https://mericos.store', 'USD', 1, '2023-10-26 22:56:29', '2023-10-26 22:56:29'),
    (5, 'Novo nome', 'http://localhost/novo', 'MZN', 1, '2023-10-27 00:54:19', '2023-10-29 12:08:56');

-- CAPA
INSERT INTO CAPA (capa_cod, capa_texto, capa_url_imagem, data_criacao, data_atualizacao, cod_loja)
VALUES
    (1, 'Explore o Mundo da Moda', 'https://res.cloudinary.com/de3dfy23q/image/upload/v1698396875/bl1qmp2svnl6bgxsjejd.jpg', '2023-10-27 01:57:37', '2023-10-27 08:55:09', 5);

-- TAMANHO
INSERT INTO TAMANHO (tam_cod, tam_nome, tam_abreviatura, data_criacao, data_atualizacao, cod_loja)
VALUES
    (1, 'Large', 'L', '2023-10-28 11:02:05', '2023-10-28 11:04:58', 5),
    (2, 'Médio', 'M', '2023-10-28 11:02:14', '2023-10-28 11:02:14', 5);

-- COR
INSERT INTO COR (cor_cod, cor_nome, cor_codigo_hexadecimal, data_criacao, data_atualizacao, cod_loja)
VALUES
    (1, 'Azul', '#1a5fb4', '2023-10-28 10:37:55', '2023-10-28 10:37:55', 5);

-- CATEGORIA
INSERT INTO CATEGORIA (cat_cod, cat_nome, cod_capa, data_criacao, data_atualizacao, cod_loja)
VALUES
    (1, 'Categoria 1', 1, '2023-10-27 10:19:38', '2023-10-27 10:19:38', 5);

-- PRODUTO
INSERT INTO PRODUTO (produto_cod, produto_nome, produto_preco, produto_quantidade_stock, cod_loja, cod_tamanho, cod_cor, cod_categoria, data_criacao, data_atualizacao)
VALUES
    (1, 'Produto', 100, 10, 5, 1, 1, 1, '2023-10-28 20:17:21', '2023-10-28 20:17:21'),
    (2, 'Meu WPM', 86, 5, 5, 1, 1, 1, '2023-10-28 20:20:59', '2023-10-29 09:42:43'),
    (6, 'Produto 6', 150, 250, 5, 1, 1, 1, '2023-10-29 08:38:45', '2023-10-29 08:38:45');

-- FOTO_PRODUTO
INSERT INTO FOTO_PRODUTO (fp_cod, cod_produto, ft_url_foto, data_criacao, data_atualizacao)
VALUES
    (6, 2, 'https://res.cloudinary.com/de3dfy23q/image/upload/v1698572386/np5omk0el0przmbg40h6.png', '2023-10-29 09:53:33', '2023-10-29 09:53:33'),
    (7, 2, 'https://res.cloudinary.com/de3dfy23q/image/upload/v1698572401/u22tcodtzfgzcteswm6v.png', '2023-10-29 09:53:33', '2023-10-29 09:53:33');

-- CLIENTE
INSERT INTO CLIENTE (cli_cod, cli_email, cli_nome, data_criacao, data_atualizacao, cod_loja)
VALUES
    (1, 'mail@gmail.com', 'Cliente 1', '2023-10-29 20:04:25', '2023-10-29 20:04:25', 5);

-- PEDIDO
INSERT INTO PEDIDO (ped_cod, ped_status, ped_endereco_entrega, ped_cod_transac, ped_data_pagamento, cod_cliente, data_criacao, data_atualizacao, cod_loja)
VALUES
    (1, 'PAGO', 'Maputo', '123', '2023-10-29 21:00:00', 1, '2023-10-29 20:05:06', '2023-10-29 20:05:06', 5);

-- ITEM_PEDIDO
INSERT INTO ITEM_PEDIDO (cod_pedido, cod_produto, item_preco_venda, item_quantidade, data_criacao, data_atualizacao)
VALUES
    (1, 1, 15000, 2, '2023-10-29 20:06:17', '2023-10-29 20:06:17'),
    (1, 2, 30000, 2, '2023-10-29 20:06:17', '2023-10-29 20:06:17');


-- PEDIDO
INSERT INTO PEDIDO (ped_cod, ped_status, ped_endereco_entrega, ped_cod_transac, ped_data_pagamento, cod_cliente, data_criacao, data_atualizacao, cod_loja)
VALUES
    (2, 'PENDENTE', NULL, NULL, NULL, NULL, '2023-10-29 21:10:00', '2023-10-29 21:10:00', 5);

-- ITEM_PEDIDO
INSERT INTO ITEM_PEDIDO (cod_pedido, cod_produto, item_preco_venda, item_quantidade, data_criacao, data_atualizacao)
VALUES
    (2, 1, 5000, 2, '2023-10-29 21:20:00', '2023-10-29 21:20:00'),
    (2, 2, 10000, 2, '2023-10-29 21:20:00', '2023-10-29 21:20:00');

INSERT INTO PEDIDO (ped_cod, ped_status, ped_endereco_entrega, ped_cod_transac, ped_data_pagamento, cod_cliente, data_criacao, data_atualizacao, cod_loja)
VALUES
    (3, 'PAGO', 'Maputo', '125', '2023-09-29 22:00:00', 1, '2023-09-29 22:00:00', '2023-09-29 22:00:00', 5);

INSERT INTO ITEM_PEDIDO (cod_pedido, cod_produto, item_preco_venda, item_quantidade, data_criacao, data_atualizacao)
VALUES
    (3, 1, 50000, 2, '2023-09-29 22:00:00', '2023-09-29 22:00:00');
