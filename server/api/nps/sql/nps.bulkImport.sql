/*
Inserts the npss in bulk from the file provided in the file.
*/

-- Only import stuff if there're no responses already
IF NOT EXISTS(SELECT * FROM [dbo].[NPS])
BEGIN
  
  -- Drop the TempNPS if it exists
  IF (Object_ID('TempNPS', 'U') IS NOT NULL)
  BEGIN
    DROP TABLE [dbo].[TempNPS]
  END
  
  -- Create temp table
  CREATE TABLE [dbo].[TempNPS] (
    [rawNpsDate] varchar(256) NULL, -- will be converted later on
    [npsTel] varchar(256) NULL,
    [npsScore] varchar(256) NULL,
    [npsComment] varchar(max) NULL,
  )
  
  -- filepath i set in JavaScript
  BULK
  INSERT [dbo].[TempNPS]
  FROM '{ filepath }'
  WITH
  (
    FIRSTROW = 2, -- Skip the column name row
    FIELDTERMINATOR = ';',
    ROWTERMINATOR = '\n',
    DATAFILETYPE = 'widechar', -- This part is super important for åäö
    CODEPAGE = 'RAW' -- Supposedly this one too
  )
  
  -- Add the response field
  ALTER TABLE [dbo].[TempNPS]
  ADD [npsDate] datetime2 NULL
  
  -- -- Convert the dates
  UPDATE [dbo].[TempNPS]
  SET [npsDate] = CONVERT(datetime2, [rawNpsDate], 103)
  
  -- Insert into NPS
  INSERT INTO [dbo].[NPS] (
    [npsDate],
    [npsTel],
    [npsScore],
    [npsComment]
  )
  SELECT [npsDate], [npsTel], [npsScore], [npsComment]
  FROM [dbo].[TempNPS]
  
  -- Drop the temp table
  DROP TABLE [dbo].[TempNPS]

END
