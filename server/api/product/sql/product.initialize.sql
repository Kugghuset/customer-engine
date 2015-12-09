/*
Creates the Product table
*/

IF (OBJECT_ID('Product', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[Product] (
    [productId] bigint IDENTITY(1, 1) PRIMARY  KEY NOT NULL,
    [productName] varchar(256) NULL,
    [productCountry] varchar(256) NULL
  )
END
