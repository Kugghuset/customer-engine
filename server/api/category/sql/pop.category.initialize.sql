/*
Creates the Category table and populates it with data
*/

IF (OBJECT_ID('Category', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[Category] (
      [categoryId] bigint IDENTITY(1, 1) PRIMARY  KEY NOT NULL
    , [categoryName] varchar(256) NULL
    , [disabled] bit null
  )
END

-- Ensure the correct coloumns are used by simple removing all others
IF (NOT EXISTS(SELECT * FROM sys.columns
              WHERE Name = N'disabled'
              AND Object_ID = Object_ID(N'Category'))
    OR NOT EXISTS(SELECT * FROM [dbo].[Category]
                WHERE [categoryName] = 'Inlösen'))
BEGIN
  DROP TABLE [dbo].[Category]
END


