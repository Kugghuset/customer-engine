/*
Inserts the customers in bulk from the file in assets, which is specifide in JavaScript code.
*/

-- Only run the insert if there are no Customers and BamboraDW doesn't exist.
IF (NOT EXISTS (SELECT * FROM [dbo].[Customer]))
              AND (DB_ID(N'BamboraDW') IS NULL)
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
    FIRSTROW = 2, -- Skip the column name row
    FIELDTERMINATOR = ';',
    ROWTERMINATOR = '\n',
    DATAFILETYPE = 'widechar', -- This part is super important for åäö
    CODEPAGE = 'RAW' -- Supposedly this one too
  )
  
  -- Trim leading and trailing whitespace as it's unwanted
  UPDATE [dbo].[TempCustomer]
  SET [customerNumber] = RTRIM(LTRIM([customerNumber])),
      [orgName] = RTRIM(LTRIM([orgName])),
      [orgNr] = RTRIM(LTRIM([orgNr]))
    
  -- Insert the customers
  INSERT INTO [dbo].[Customer] (
    [customerNumber],
    [orgName],
    [orgNr]
  )
  SELECT [customerNumber], [orgName], [orgNr]
  FROM [dbo].[TempCustomer]
  -- Filter out rows where both orgName is the string 'NULL'
  WHERE [orgName] != 'NULL'
  
  -- Remove temp table
  DROP TABLE [dbo].[TempCustomer]
  
END