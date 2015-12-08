/*
Creates the Descriptor table
*/

IF (OBJECT_ID('Descriptor', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[Descriptor] (
    [descriptorId] bigint IDENTITY(1, 1) PRIMARY KEY NOT NULL,
    [descriptorName] varchar(256),
    [subcategoryId] bigint NULL, -- parent
    [disabled] bit NULL
  )
END

-- Ensure the correct coloumns are used by simple removing all others
IF (NOT EXISTS(SELECT * FROM sys.columns
              WHERE Name = N'disabled'
              AND Object_ID = Object_ID(N'Descriptor'))
    OR NOT EXISTS(SELECT * FROM [dbo].[Descriptor]
                WHERE [descriptorName] = 'Inlösenavtal'))
BEGIN
  DROP TABLE [dbo].[Descriptor]
END

IF (OBJECT_ID('Descriptor', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[Descriptor] (
    [descriptorId] bigint IDENTITY(1, 1) PRIMARY KEY NOT NULL,
    [descriptorName] varchar(256),
    [subcategoryId] bigint NULL, -- parent
    [disabled] bit NULL
  )
  
  INSERT INTO [dbo].[Descriptor] (
    [descriptorName],
    [subcategoryId]
  )
  VALUES
    ---> Transaktion 
    ('Rättning -Felaktigt nyckel', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Transaktion')),
    ('Felaktikt -TOF', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Transaktion')),
    ('Felaktigt -Kontonummer', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Transaktion')),
    
    ---> Felmeddelanden/Tekniska problem
    ('Communication Error', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Felmeddelanden/Tekniska problem')),
    ('Printer problem', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Felmeddelanden/Tekniska problem')),
    ('Blå skärm', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Felmeddelanden/Tekniska problem')),
    ('Batteri/sladd', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Felmeddelanden/Tekniska problem')),
    ('Kassa/Kassakoppling', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Felmeddelanden/Tekniska problem')),
    ('Skalskydd', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Felmeddelanden/Tekniska problem')),
    
    ---> Parameterinställningar
    ('Licens', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Parameterinställningar')),
    ('Valuta', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Parameterinställningar')),
    ('Inlösenavtal', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Parameterinställningar')),
    
    ---> Reparationer
    ('Service & Repair', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Reparationer')),
    ('Ersättningsprodukt', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Reparationer')),
    ('DOA', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Reparationer')),
    ('Frågor', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Reparationer')),
    
    ---> Diverse
    ('Övrigt', (SELECT TOP 1 [subcategoryId] FROM [dbo].[Subcategory] WHERE [subcategoryName] = 'Diverse'))
END














---> Transaktion 
-- ('Rättning -Felaktigt nyckel'),
-- ('Felaktikt -TOF'),
-- ('Felaktigt -Kontonummer'),

---> Felmeddelanden/Tekniska problem
-- ('Communication Error'),
-- ('Printer problem'),
-- ('Blå skärm'),
-- ('Batteri/sladd'),
-- ('Kassa/Kassakoppling'),
-- ('Skalskydd'),

---> Parameterinställningar
-- ('Licens'),
-- ('Valuta'),
-- ('Inlösenavtal'),

---> Reparationer
-- ('Service & Repair'),
-- ('Ersättningsprodukt'),
-- ('DOA'),
-- ('Frågor'),

---> Diverse
-- ('Övrigt')
