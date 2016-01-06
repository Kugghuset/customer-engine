
IF DB_ID(N'BamboraDW') IS NOT NULL
BEGIN

  INSERT INTO [dbo].[Customer] (
    [orgName],
    [orgNr],
    [customerNumber]
  )
  SELECT
    [CustomerName], -- Subject to change
    [OrgNum], -- Subject to change
    [CustomerNr] -- Subject to change
  FROM (
    MERGE [tickety].[dbo].[Customer] AS [Target]
    USING [BamboraDW].[dbo].[DimCustomer] AS [Source]
      ON [Target].[customerNumber] = [Source].[CustomerNr] -- Either the key matches
      OR ( -- Or there's no key, but the name and orgNr matches
        [Target].[customerNumber] IS NULL
        AND [Source].[CustomerName] = [Target].[customerName]
        AND [Source].[OrgNum] = [Target].[orgNr]
      )
    WHEN MATCHED AND ( -- Match with CustomerNr
        [Target].[customerNumber] = [Source].[CustomerNr]
        AND [Source].[CustomerNr] IS NOT NULL
    AND (
          [Source].[CustomerName] != [Target].[customerName]
          OR [Source].[OrgNum] != [Target].[orgNr]
        )
    )
    THEN UPDATE SET
      [Target].[orgName] = [Source].[CustomerName],
      [Target].[orgNr] = [Source].[OrgNum],
      [Target].[dateUpdated] = GETUTCDATE()
    WHEN MATCHED AND (
      [Target].[customerNumber] IS NULL
      AND NOT EXISTS(SELECT * FROM [Target]
                    WHERE [Target].[customerNumber] = [Source].[CustomerNr])
    )
    THEN UPDATE SET
      [Target].[customerNumber] = [Source].[CustomerNr],
      [Target].[dateUpdated] = GETUTCDATE(),
      [Target].[isLocal] = 0
    WHEN NOT MATCHED BY TARGET
      THEN INSERT (
        [customerNumber],
        [orgNr],
        [orgName]
      )
      VALUES (
        [Source].[CustomerName],
        [Source].[OrgNum],
        [Source].[CustomerNr]
      )
    OUTPUT $action AS [Action], [Source].*
  ) AS [MergeOuput]
    WHERE [MergeOuput].[Action] = 'Update'
  
END