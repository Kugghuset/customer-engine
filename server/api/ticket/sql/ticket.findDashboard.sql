
/*

DECLARE @top BigInt = 20
DECLARE @offset BigInt = 0
DECLARE @userId BigInt = 1

*/

/********************
 * Main query start
 *******************/

SELECT
    [T].[ticketId]
  , [T].[isReseller]
  , [T].[summary]
  , [T].[transferred]
  , [T].[status]
  , [T].[ticketDate]
  , [T].[ticketDateClosed]
  , [T].[dateUpdated]

  , [T].[countryShort] AS [country.short]
  , [T].[countryFull] AS [country.full]

  , [C].[customerId] AS [customer.customerId]
  , [C].[customerNumber] AS [customer.customerNumber]
  , [C].[orgName] AS [customer.orgName]
  , [C].[orgNr] AS [customer.orgNr]

  , [U].[userId] AS [user.userId]
  , [U].[email] AS [user.email]
  , [U].[name] AS [user.name]

  , [C1].[categoryId] AS [category.categoryId]
  , [C1].[categoryName] AS [category.categoryName]
  , [C2].[subcategoryId] AS [subcategory.subcategoryId]
  , [C2].[subcategoryName] AS [subcategory.subcategoryName]
  , [C3].[descriptorId] AS [descriptor.descriptorId]
  , [C3].[descriptorName] AS [descriptor.descriptorName]

  , [D].[departmentId] AS [department.departmentId]
  , [D].[departmentName] AS [department.departmentName]

  , [TP].[departmentId] AS [transferredDepartment.departmentId]
  , [TP].[departmentName] AS [transferredDepartment.departmentName]

  , [Pr].[productId] AS [product.productId]
  , [Pr].[productName] AS [product.productName]
  , [Pr].[country] AS [product.country]

  , [Pe].[personId] AS [person.personId]
  , [Pe].[name] AS [person.name]
  , [Pe].[email] AS [person.email]
  , [Pe].[tel] AS [person.tel]
  , [Pe].[altTel] AS [person.altTel]

FROM [dbo].[Ticket] AS [T]

-- Join in customers
LEFT JOIN [dbo].[Customer] AS [C]
ON [C].[customerId] = [T].[customerId]

-- Join in users
LEFT JOIN [dbo].[User] AS [U]
ON [U].[userId] = [T].[userId]

-- Join in categories
LEFT JOIN [dbo].[CategoryBlob] AS [CB]
ON [CB].[ticketId] = [T].[ticketId]

LEFT JOIN [dbo].[Category] AS [C1]
ON [C1].[categoryId] = [CB].[categoryId]

LEFT JOIN [dbo].[Subcategory] AS [C2]
ON [C2].[subcategoryId] = [CB].[subcategoryId]

LEFT JOIN [dbo].[Descriptor] AS [C3]
ON [C3].[descriptorId] = [CB].[descriptorId]

-- Join in departments
LEFT JOIN [dbo].[Department] AS [D]
ON [D].[departmentId] = [T].[departmentId]

-- Join in transferred department
LEFT JOIN [dbo].[Department] AS [TP]
ON [TP].[departmentId] = [T].[transferredDepartmentId]

-- Join in products
LEFT JOIN [dbo].[Product] AS [Pr]
ON [Pr].[productId] = [T].[productId]

-- Join in person (contact person)
LEFT JOIN [dbo].[Person] AS [Pe]
ON [Pe].[personId] = [T].[personId]

-- Filtering, sorting and pagination
WHERE [T].[userId] = @userId

ORDER BY [T].[ticketDate] {{ sort_order }}, [T].[ticketId] {{ sort_order }}

OFFSET @offset ROWS FETCH NEXT @top ROWS ONLY


/********************
 * Main query end
 *******************/

/********************
 * Status query start
 *******************/

DECLARE @statuses TABLE (
  [status] VarChar(255) NULL
)

INSERT INTO @statuses ([status])
VALUES
    ('Open')
  , ('Pending')
  , ('Closed')
  , ('ClosedTransferred')

SELECT
   [S].[status]
  , CASE
      WHEN MAX(ticketId) IS NULL THEN 0
      ELSE COUNT([T].[transferred])
    END AS [statusCount]
FROM @statuses AS [S]

LEFT JOIN (
  SELECT
      CASE
        WHEN [status] = 'Closed' AND ISNULL([transferred], 0) = 1 THEN 'ClosedTransferred'
        ELSE [status]
      END AS [status]
    , ISNULL([transferred], 0) AS [transferred]
    , [ticketId]
  FROM [dbo].[Ticket]
  WHERE [userId] = @userId
) AS [T]
ON [S].[status] = [T].[status]

GROUP BY [S].[status], [T].[transferred]

/********************
 * Status query end
 *******************/


/********************
 * Total count query start
 *******************/

SElECT COUNT(*) AS [totalCount]
FROM [dbo].[Ticket]
WHERE [userId] = @userId

/********************
 * Total count query end
 *******************/

