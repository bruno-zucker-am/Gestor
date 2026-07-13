-- Cria 

CREATE TABLE [Gestor].[administrador] (
    id INT PRIMARY KEY IDENTITY(1,1),
    usuario NVARCHAR(255) NOT NULL,
    senha NVARCHAR(255) NOT NULL
);

CREATE TABLE [Gestor].[master] (
    id INT PRIMARY KEY IDENTITY(1,1),
    usuario NVARCHAR(255) NOT NULL,
    senha NVARCHAR(255) NOT NULL
);


CREATE TABLE [Gestor].[revendedor] (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    nome NVARCHAR(255),
    quantidade_login INT,
    vencimento DATE,
    valor DECIMAL(19, 2),
    criado_em DATETIME2,
    atualizado_em DATETIME2
);

CREATE TABLE [Gestor].[cliente] (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    nome NVARCHAR(255),
    quantidade_acesso INT,
    vencimento DATE,
    valor DECIMAL(19, 2),
    criado_em DATETIME2,
    atualizado_em DATETIME2
);

CREATE TABLE [Gestor].[fornecedor] (
    id UNIQUEIDENTIFIER PRIMARY KEY,
    nome NVARCHAR(255),
    tipo_servico NVARCHAR(255),
    vencimento DATE,
    valor DECIMAL(19, 2),
    criado_em DATETIME2,
    atualizado_em DATETIME2
);
