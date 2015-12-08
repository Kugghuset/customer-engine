/*
Creates the Category table and populates it with data
*/

IF (OBJECT_ID('Category', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[Category] (
    [categoryId] bigint IDENTITY(1, 1) PRIMARY  KEY NOT NULL,
    [categoryName] varchar(256) NULL,
    [disabled] bit null
  )
  
  INSERT INTO [dbo].[Category] (
    [categoryName]
  )
  VALUES
    ('E-handel'),
    ('Faktura'),
    ('Inlösen'),
    ('Information'),
    ('Beställning'),
    ('Terminal')
END
ELSE
  
  -- Add disabled field if it doesn't exist and set possible old entries as disabled
  IF NOT EXISTS(SELECT * FROM sys.columns
                WHERE Name = N'disabled'
                AND Object_ID = Object_ID(N'Category'))
  BEGIN
    ALTER TABLE [dbo].[Category]
    ADD [disabled] bit NOT NULL DEFAULT 1
    
    ALTER TABLE [dbo].[Category]
    ALTER COLUMN [disabled] bit NULL
  END
  
  -- Add new rows if they're non-existant
  IF NOT EXISTS(SELECT *
                FROM [dbo].[Category]
                WHERE [categoryName] = 'Inlösen')
  BEGIN
    INSERT INTO [dbo].[Category] (
      [categoryName]
    )
    VALUES
      ('E-handel'),
      ('Faktura'),
      ('Inlösen'),
      ('Information'),
      ('Beställning'),
      ('Terminal') 
  END