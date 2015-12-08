/*
Creates the SubcategoryBlob table
*/

IF (OBJECT_ID('Subcategory', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[Subcategory] (
    [subcategoryId] bigint IDENTITY(1, 1) PRIMARY KEY NOT NULL,
    [subcategoryName] varchar(256) NULL,
    [categoryId] bigint NULL, -- parent
    [disabled] bit NULL
  )
END
