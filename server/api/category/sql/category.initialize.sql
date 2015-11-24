/*
Creates the Category table
*/

IF (OBJECT_ID('Category', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[Category] (
    [categoryId] bigint IDENTITY(1, 1) PRIMARY  KEY NOT NULL,
    [categoryName] varchar(256) NULL
  )
END
