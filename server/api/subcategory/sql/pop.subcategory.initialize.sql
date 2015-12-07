/*
Creates the SubcategoryBlob table
*/

IF (OBJECT_ID('Subcategory', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[Subcategory] (
    [subcategoryId] bigint IDENTITY(1, 1) PRIMARY KEY NOT NULL,
    [subcategoryName] varchar(256) NULL,
    [categoryId] bigint NULL -- parent
  )
  
  INSERT INTO [dbo].[Subcategory] (
    [subcategoryName],
    [categoryId]
  )
  VALUES
    ('Change of adress', 1),
    ('Stickers', 1),
    ('Reservation', 1),
    ('Transaction', 1),
    ('Card acceptance', 1),
    ('Reports', 1),
    ('Change of company', 1),
    ('General problems/questions', 1),
    ('Deposit', 1),
    ('Transactions', 2),
    ('Account', 2),
    ('Change of adress', 3),
    ('Invoice questions', 3),
    ('Credit', 3),
    ('Reject payment', 3),
    ('Transactions', 6),
    ('Reports', 6),
    ('Repairs', 6),
    ('SW update', 6),
    ('Incompatible licence', 6),
    ('Technical issues', 6),
    ('Returns', 6),
    ('Device', 7),
    ('Bambora One', 7),
    ('Acceptance', 7),
    ('Application', 8),
    ('Activation', 8)
END
