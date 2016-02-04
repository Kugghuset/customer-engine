
/*
Inserts the npss in bulk from the file provided in the file.
*/

SET XACT_ABORT ON

BEGIN TRAN

-- Drop the TempNPS if it exists
IF (Object_ID('TempNPS', 'U') IS NOT NULL)
BEGIN
    DROP TABLE [dbo].[TempNPS]
END

-- Create temp table
CREATE TABLE [dbo].[TempNPS] (
    [rawNpsDate] varchar(256) NULL -- will be converted later on
  , [npsTel] varchar(256) NULL
  , [npsScore] varchar(256) NULL
  , [npsComment] varchar(max) NULL
)

-- filepath i set in JavaScript
BULK
INSERT [dbo].[TempNPS]
FROM '{ filepath }'
WITH
(
    FIRSTROW = 2 -- Skip the column name row
  , FIELDTERMINATOR = ';'
  , ROWTERMINATOR = '\n'
  , DATAFILETYPE = 'widechar' -- This part is super important for åäö
  , CODEPAGE = 'RAW' -- Supposedly this one too
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

INSERT INTO [Tickety].[dbo].[NPS] (
    [npsDate]
  , [npsTel]
  , [npsScore]
  , [npsComment]
)
SELECT
    [npsDate]
  , [npsTel]
  , [npsScore]
  , [npsComment]
FROM (
    MERGE [Tickety].[dbo].[NPS] AS [Target]
    USING [dbo].[TempNPS] AS [Source]
    ON
        -- Match on the npsTel and the date only of the npsDate
        [Target].[npsTel] = [Source].[npsTel]
    AND CAST([Target].[npsDate] AS date) = CAST([Source].[npsDate] AS date)
    
    WHEN MATCHED AND (
        [Target].[npsScore] != [Source].[npsScore]
     OR [Target].[npsComment] != [Source].[npsComment]
     OR [Target].[isLocal] = 1
    )
    THEN UPDATE SET
        [Target].[npsScore] = [Source].[npsScore]
      , [Target].[npsComment] = [Source].[npsComment]
      , [Target].[isLocal] = NULL
      , [Target].[dateChanged] = GETUTCDATE()

    WHEN NOT MATCHED BY TARGET
        THEN INSERT (
            [npsDate]
          , [npsTel]
          , [npsScore]
          , [npsComment]
        )
        VALUES (
            [Source].[npsDate]
          , [Source].[npsTel]
          , [Source].[npsScore]
          , [Source].[npsComment]
        )

    OUTPUT $action AS [Action], [Source].*
)    AS [MergeOutput]
 WHERE [MergeOutput].[Action] = NULL


-- Drop the temp table
DROP TABLE [dbo].[TempNPS]

COMMIT TRAN