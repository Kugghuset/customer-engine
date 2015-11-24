/*
Creates the SubCategoryBlob table
*/

IF (OBJECT_ID('SubCategory', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[SubCategory] (
    [subCategoryId] bigint IDENTITY(1, 1) PRIMARY KEY NOT NULL,
    [subCategoryName] varchar(256) NULL,
    [categoryId] bigint NULL -- parent
  )
END
