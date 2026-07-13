-- Atualiza tabela

ALTER TABLE [Gestor].[revendedor]
ADD 
    [nome] NVARCHAR(255),
    [quantidade_login] INT,
    [vencimento] DATE,
    [valor] DECIMAL(19, 2),
    [criado_em] DATETIME2,
    [atualizado_em] DATETIME2;