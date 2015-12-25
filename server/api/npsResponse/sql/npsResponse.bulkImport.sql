/*
Inserts the npsResponses in bulk from the file provided in the file.
*/

-- Only import stuff if there're no responses already
IF NOT EXISTS(SELECT * FROM [dbo].[NPSResponse])
BEGIN
  
  -- Drop the TempNPSResponse if it exists
  IF (Object_ID('TempNPSResponse', 'U') IS NOT NULL)
  BEGIN
    DROP TABLE [dbo].[TempNPSResponse]
  END
  
  -- Create temp table
  CREATE TABLE [dbo].[TempNPSResponse] (
    [rawNpsResponseDate] varchar(256) NULL, -- will be converted later on
    [npsResponseTel] varchar(256) NULL,
    [npsResponseScore] varchar(256) NULL,
    [npsResponseComment] varchar(max) NULL,
  )
  
  -- filepath i set in JavaScript
  BULK
  INSERT [dbo].[TempNPSResponse]
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
  ALTER TABLE [dbo].[TempNPSResponse]
  ADD [npsResponseDate] datetime2 NULL
  
  -- -- Convert the dates
  UPDATE [dbo].[TempNPSResponse]
  SET [npsResponseDate] = CONVERT(datetime2, [rawNpsResponseDate], 103)
  
  -- Insert into NPSResponse
  INSERT INTO [dbo].[NPSResponse] (
    [npsResponseDate],
    [npsResponseTel],
    [npsResponseScore],
    [npsResponseComment]
  )
  SELECT [npsResponseDate], [npsResponseTel], [npsResponseScore], [npsResponseComment]
  FROM [dbo].[TempNPSResponse]
  
  -- Drop the temp table
  DROP TABLE [dbo].[TempNPSResponse]

END
