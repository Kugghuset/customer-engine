/*
Inserts the customers in bulk from the file in assets, which is specifide in JavaScript code.
*/

-- Only run the insert if there are no Customers
IF NOT EXISTS (SELECT * FROM [dbo].[Customer])
BEGIN
  
  -- Drop TempCustomer if it's defined already
  IF (OBJECT_ID('TempCustomer', 'U') IS NOT NULL)
  BEGIN
    DROP TABLE [dbo].[TempCustomer]
  END

  -- Create temp table
  CREATE TABLE [dbo].[TempCustomer] (
    [customerNumber] varchar(256) NULL,
    [orgName] varchar(256) NULL,
    [orgNr] varchar(256) NULL,
  )
  
  -- filepath is set in JavaScript code
  BULK
  INSERT [dbo].[TempCustomer]
  FROM '{ filepath }'
  WITH
  (
    FIELDTERMINATOR = ',',
    ROWTERMINATOR = '\n',
    DATAFILETYPE = 'widechar',
    CODEPAGE = 'RAW'
  )
  
  -- Trim leading and trailing whitespace as it's unwanted
  UPDATE [dbo].[TempCustomer]
  SET [customerNumber] = RTRIM(LTRIM([customerNumber])),
      [orgName] = RTRIM(LTRIM([orgName])),
      [orgNr] = RTRIM(LTRIM([orgNr]))
    
  -- Add customerId to simplify editing removal of column name row
  ALTER TABLE [dbo].[TempCustomer]
  ADD [customerId] bigint IDENTITY(1, 1) PRIMARY KEY NOT NULL
  
  -- Delete column name row
  DELETE FROM [dbo].[TempCustomer]
  WHERE [customerId] = 1
  
  -- Insert the customers
  INSERT INTO [dbo].[Customer] (
    [customerNumber],
    [orgName],
    [orgNr]
  )
  SELECT [customerNumber], [orgName], [orgNr]
  FROM [dbo].[TempCustomer]
  
  -- Remove temp table
  DROP TABLE [dbo].[TempCustomer]

END