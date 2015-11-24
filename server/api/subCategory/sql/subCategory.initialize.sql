/*
Creates the SubCategoryBlob table
*/

IF (OBJECT_ID('SubCategoryBlob', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[SubCategoryBlob] (
    [subCategoryId] bigint IDENTITY(1, 1) PRIMARY KEY NOT NULL,
    [subCategoryName] varchar(256) NULL,
    [categoryId] bigint NULL -- parent
  )
END
