/*
Merges the vi_DimCustomers table in Tickety into the Customer table in Tickety.
Any modified rows will be updated and any new rows will be inserted.
This will also update locally created rows:
  - Rows matched by customerNumber will update orgName and orgNr, and set isLocal to NULL
  - Rows matched by orgNr and orgName with a NULL value of customerNumber
    will be assigned the first match with customerNumber, and isLocal will be set to NULL
  - Rows which are matched entirely will only have isLocal set to NULL

TODO: Uncomment and modify [Source].[isLocal] to actual names.

*/


SET XACT_ABORT ON

BEGIN TRAN

IF EXISTS(SELECT * FROM tickety.sys.views
          WHERE Name = N'vi_DimCustomers')
BEGIN

  -- Update entries where there's no customerNumber,
  -- but both orgName and orgNr matches their equivalent in vi_DimCustomers.
  -- It also makes sure the match doesn't already exist in the DB.
  UPDATE [Tickety].[dbo].[Customer]
  SET
    [Tickety].[dbo].[Customer].[customerNumber] = [Source].[CustomerNr],
    [Tickety].[dbo].[Customer].[dateChanged] = GETUTCDATE(),
    [Tickety].[dbo].[Customer].[isLocal] = NULL

  FROM [Tickety].[dbo].[vi_DimCustomers] AS [Source]
  WHERE
          [Tickety].[dbo].[Customer].[customerNumber] IS NULL
      AND [Source].[CustomerName] = [Tickety].[dbo].[Customer].[orgName]
      AND [Source].[CompanyRegistrationNr] = [Tickety].[dbo].[Customer].[orgNr]
      AND NOT EXISTS(SELECT * FROM [Tickety].[dbo].[Customer]
                    WHERE [Tickety].[dbo].[Customer].[customerNumber] = CAST([Source].[CustomerNr] AS varchar(255)))
      -- AND [Source].[EndDate] IS NULL -- Only use the active row, the row name is probably different.

  -- Updates or inserts the other customers.
  -- New customers will be inserted and existing customers which have changed either
  -- their orgName or orgNr will update the customer which should convert local customers.
  INSERT INTO [Tickety].[dbo].[Customer] (
    [orgName],
    [orgNr],
    [customerNumber]
  )
  SELECT
    [CustomerName],
    [CompanyRegistrationNr],
    CAST([CustomerNr] AS varchar(255))
  FROM (
    MERGE [Tickety].[dbo].[Customer] AS [Target]
    -- Use a sub query to work with SCB
    -- as it allows for filtering the results
    USING (SELECT *
           FROM [Tickety].[dbo].[vi_DimCustomers]
          --  WHERE [EndDate] IS NULL -- Might need to be changed
          ) AS [Source]
      ON  [Target].[customerNumber] = CAST([Source].[CustomerNr] AS varchar(255))
    
    -- Matches customers which updated and/or different from
    -- the customer in Tickety.
    WHEN MATCHED AND (
          [Target].[orgName] != [Source].[CustomerName]
      OR  [Target].[orgNr] != [Source].[CompanyRegistrationNr]
      OR  [Target].[orgNr] IS NULL
      OR  [Target].[isLocal] = 1
    )
    -- Updated or otherwise different customers will be updated.
    THEN UPDATE SET
      [Target].[orgName] = [Source].[CustomerName],
      [Target].[orgNr] = [Source].[CompanyRegistrationNr],
      [Target].[dateChanged] = GETUTCDATE(),
      [Target].[isLocal] = NULL
  
  WHEN NOT MATCHED BY TARGET
    THEN INSERT (
      [customerNumber],
      [orgNr],
      [orgName]
    )
    VALUES (
      CAST([Source].[CustomerNr] AS varchar(255)),
      [Source].[CompanyRegistrationNr],
      [Source].[CustomerName]
    )

    OUTPUT $action AS [Action], [Source].*
  ) AS [MergeOuput]
    WHERE [MergeOuput].[Action] = NULL

END

COMMIT TRAN
