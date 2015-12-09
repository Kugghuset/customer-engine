/*
Creates the Product table
*/

IF (OBJECT_ID('Product', 'U') IS NULL)
BEGIN
  CREATE TABLE [dbo].[Product] (
    [productId] bigint IDENTITY(1, 1) PRIMARY  KEY NOT NULL,
    [productName] varchar(256) NULL,
    [country] varchar(256) NULL
  )
  
  INSERT INTO [dbo].[Product] (
    [productName],
    [country]
  )
  VALUES
    ('Acceptance', 'SE'),
    ('Device Rental', 'SE'),
    ('Device Purchase', 'SE'),
    ('Combo Acceptance and Device', 'SE'),
    ('Bambora One', 'SE'),
    ('Bambora One Flex', 'SE'),
    ('Nordic Growth Capital', 'SE'),
    ('SEB Rental', 'SE')

END 

-- Setup dummy data.
IF NOT EXISTS(SELECT * FROM [dbo].[Product]
              WHERE [productName] = 'Nordic Growth Capital')
  BEGIN
    DROP TABLE [dbo].[Product]
    
    CREATE TABLE [dbo].[Product] (
    [productId] bigint IDENTITY(1, 1) PRIMARY  KEY NOT NULL,
    [productName] varchar(256) NULL,
    [country] varchar(256) NULL
    )
  
    INSERT INTO [dbo].[Product] (
      [productName],
      [country]
    )
    VALUES
      ('Acceptance', 'SE'),
      ('Device Rental', 'SE'),
      ('Device Purchase', 'SE'),
      ('Combo Acceptance and Device', 'SE'),
      ('Bambora One', 'SE'),
      ('Bambora One Flex', 'SE'),
      ('Nordic Growth Capital', 'SE'),
      ('SEB Rental', 'SE')
    
  END

-- Modify productCountry to country if country doesn't exist.
  IF NOT EXISTS(SELECT * FROM sys.columns
                WHERE Name = N'country'
                AND Object_ID = Object_ID(N'Product'))
  BEGIN
      EXEC sp_rename 'Product.productCountry', 'country', 'COLUMN'
  END
