/*
Inserts the npss in bulk from the file provided in the file.
*/

SET XACT_ABORT ON

BEGIN TRAN

DECLARE @Dates Table (
  [npsDate] datetime2 NULL
)
INSERT INTO @Dates
SELECT [npsDate]
FROM [tickety].[dbo].[NPS]
GROUP BY [npsDate]

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
  FIRSTROW = 3, -- Skip the column name row
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
SET [npsDate] = CASE
  WHEN [rawNpsDate] IS NOT NULL THEN CONVERT(datetime2, [rawNpsDate], 103)
  ELSE ''
END

-- Insert into NPS
INSERT INTO [dbo].[NPS] (
  [npsDate],
  [npsTel],
  [npsScore],
  [npsComment]
)
SELECT [npsDate], [npsTel], [npsScore], [npsComment]
FROM [dbo].[TempNPS]
WHERE [npsDate] NOT IN (SELECT * FROM @Dates)

-- Drop the temp table
DROP TABLE [dbo].[TempNPS]

COMMIT TRAN