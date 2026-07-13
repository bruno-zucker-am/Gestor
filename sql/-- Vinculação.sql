-- Vinculação

UPDATE Gestor.Cliente
SET MasterId = 5
WHERE MasterId IS NULL;

UPDATE Gestor.Fornecedor
SET MasterId = 5
WHERE MasterId IS NULL;

UPDATE Gestor.Revendedor
SET MasterId = 5
WHERE MasterId IS NULL;