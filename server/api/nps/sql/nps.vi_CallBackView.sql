


SELECT
    [T].[ticketId] AS [ticketId]
  , SUBSTRING([NPS].[npsTel], 2, LEN([NPS].[npsTel]) - 1) AS [tel]
  , [P].[personId] AS [personId]
  , [P].[name] AS [personName]
  , [P].[email] AS [personEmail]
  , [T].[isReseller] AS [isReseller]
  , [T].[summary] AS [summary]
  , [T].[transferred] AS [transferred]
  , [T].[status]
  , [T].[countryShort] AS [countryShort]
  , [T].[countryFull] AS [countryFull]
  , CASE
      WHEN [NPS].[npsTel] LIKE '+45%' THEN 'DK'
      WHEN [NPS].[npsTel] LIKE '+47%' THEN 'NO'
      WHEN [NPS].[npsTel] LIKE '+358%' THEN 'FI'
      ELSE 'SE'
    END AS [groupingCountry]
  , [T].[customerId] AS  [customerId]
  , [C].[customerNumber] AS [customerNumber]
  , [C].[orgName] AS [customerName]
  , [C].[orgNr] AS [customerRegistrationNumber]
  , [T].[userId] AS [userId]
  , [U].[name] AS [userName]
  , [U].[email] AS [userEmail]
  , [T].[ticketDate] AS [ticketDateOpened]
  , [T].[ticketDateClosed] AS [ticketDateClosed]
  , [T].[dateUpdated] AS [ticketDateUpdated]
  , [Ca].[categoryId] AS [categoryId]
  , [Ca].[categoryName] AS [categoryName]
  , [SCa].[subcategoryId] AS [subcategoryId]
  , [SCa].[subcategoryName] AS [subcategoryName]
  , [DCa].[descriptorId] AS [desriptorId]
  , [DCa].[descriptorName] AS [descriptorName]
  , [D].[departmentId] AS [departmentId]
  , [D].[departmentName] AS [departmentName]
  , [tD].[departmentId] AS [transferredDepartmentId]
  , [tD].[departmentName] AS [transferredDepartmentName]
  , [Pr].[productId] AS [productId]
  , [Pr].[productName] AS [productName]
  , [Pr].[country] AS [productCountry]
FROM [dbo].[NPSSurveyResult] AS [NPS]

LEFT JOIN [dbo].[Ticket] AS [T]
ON [T].[ticketId] = [NPS].[ticketId]

LEFT JOIN [dbo].[Person] AS [P]
ON [P].[personId] = [T].[personId]

LEFT JOIN [dbo].[Customer] AS [C]
ON [T].[customerId] = [C].[customerId]

LEFT JOIN [dbo].[User] AS [U]
ON [T].[userId] = [U].[userId]

LEFT JOIN [dbo].[CategoryBlob] AS [CaB]
ON [CaB].[ticketId] = [T].[ticketId]

LEFT JOIN [dbo].[Category] AS [Ca]
ON [Ca].[categoryId] = [CaB].[categoryId]

LEFT JOIN [dbo].[Subcategory] AS [SCa]
ON [SCa].[subcategoryId] = [CaB].[subcategoryId]

LEFT JOIN [dbo].[Descriptor] AS [DCa]
ON [DCa].[descriptorId] = [CaB].[descriptorId]

LEFT JOIN [dbo].[Department] AS [D]
ON [D].[departmentId] = [T].[departmentId]

LEFT JOIN [dbo].[Department] AS [tD]
ON [tD].[departmentId] = [T].[transferredDepartmentId]

LEFT JOIN [dbo].[Product] AS [Pr]
ON [Pr].[productId] = [T].[productId]

WHERE [npsScore] IS NOT NULL

