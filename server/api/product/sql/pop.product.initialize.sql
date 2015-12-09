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
  
  INSERT INTO [dbo].[Product] (
    [productName],
    [productCountry]
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

IF NOT EXISTS(SELECT * FROM [dbo].[Product]
              WHERE [productName] = 'Nordic Growth Capital')
  BEGIN
    DROP TABLE [dbo].[Product]
    
    CREATE TABLE [dbo].[Product] (
    [productId] bigint IDENTITY(1, 1) PRIMARY  KEY NOT NULL,
    [productName] varchar(256) NULL,
    [productCountry] varchar(256) NULL
    )
  
    INSERT INTO [dbo].[Product] (
      [productName]
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
