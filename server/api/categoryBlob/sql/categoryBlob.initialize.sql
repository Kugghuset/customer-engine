/*
Creates the CategoryBlob table
*/

IF (OBJECT_ID('CategoryBlob', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[CategoryBlob] (
    [categoryBlobId] bigint IDENTITY(1, 1) PRIMARY  KEY NOT NULL,
    [ticketId] bigint NOT NULL,
    [categoryId] bigint NULL,
    [subCategoryId] bigint NULL,
    [descriptorId] bigint NULL
  )
END
