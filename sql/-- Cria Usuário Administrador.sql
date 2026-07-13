-- Cria Usuário Administrador

IF NOT EXISTS (SELECT 1 FROM [Gestor].[administrador] WHERE usuario = 'ZUCKERADM')
BEGIN
    INSERT INTO [Gestor].[administrador] (usuario) 
    VALUES ('ZUCKERADM');
END
GO