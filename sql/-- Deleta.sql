-- Deleta
--DELETE FROM ProjetosDB.Gestor.administrador WHERE id = '2';
--DELETE FROM ProjetosDB.Gestor.revendedor WHERE id = '50009';

DECLARE @sql NVARCHAR(MAX) = N'';

-- Gera o comando para deletar todas as tabelas do schema Gestor
SELECT @sql += 'DROP TABLE [Gestor].[' + TABLE_NAME + '];'
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = 'Gestor';

-- Executa a exclusão
EXEC sp_executesql @sql;