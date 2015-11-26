/*
Creates the Category table and populates it with data
*/

IF (OBJECT_ID('Category', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[Category] (
    [categoryId] bigint IDENTITY(1, 1) PRIMARY  KEY NOT NULL,
    [categoryName] varchar(256) NULL
  )
  
  INSERT INTO [dbo].[Category] (
    [categoryName]
  )
  VALUES
  ('Acquiring'),
  ('E-Commerce'),
  ('Invoice'),
  ('Contact information'),
  ('Terminations'),
  ('Terminal'),
  ('Orders'),
  ('BAX'),
  ('Unknown')
END
