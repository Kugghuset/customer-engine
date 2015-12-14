/*
Finds tickets by somethign and joins it. The something is determined by a where_clause set in JavaScript
*/

SELECT
  [A].[ticketId],
  [A].[name],
  [A].[email],
  [A].[tel],
  [A].[altTel],
  [A].[isReseller],
  -- [Q].[personId] AS [person.personId],
  -- [Q].[name] AS [person.name],
  -- [Q].[email] AS [person.email],
  -- [Q].[tel] AS [person.tel],
  -- [Q].[altTel] AS [person.altTel],
  -- [Q].[isReseller] AS [person.isReseller],
  [A].[summary],
  [A].[transferred],
  [A].[status],
  [A].[country] AS [country.short],
  [A].[customerId] AS [customer.customerId],
  [F].[customerNumber] AS [customer.customerNumber],
  [F].[orgName] AS [customer.orgName],
  [F].[orgNr] AS [customer.orgNr],
  [A].[userId] AS [user.userId],
  [U].[email] AS [user.email],
  [U].[name] AS [user.name],
  [A].[ticketDate],
  [A].[ticketDateClosed],
  [A].[dateUpdated],
  [B].[categoryId] AS [category.categoryId],
  [C].[categoryName] AS [category.categoryName],
  [B].[subcategoryId] AS [subcategory.subcategoryId],
  [D].[categoryId] AS [subcategory.categoryId],
  [D].[subcategoryName] AS [subcategory.subcategoryName],
  [B].[descriptorId] AS [descriptor.descriptorId],
  [E].[descriptorName] AS [descriptor.descriptorName],
  [E].[subcategoryId] AS [descriptor.subcategoryId],
  [G].[departmentId] AS [department.departmentId],
  [G].[departmentName] AS [department.departmentName],
  [H].[departmentId] AS [transferredDepartment.departmentId],
  [H].[departmentName] AS [transferredDepartment.departmentName],
  [A].[productId] AS [product.productId],
  [P].[productName] AS [product.productName],
  [P].[country] AS [product.country]
FROM [dbo].[Ticket] AS [A]

-- Joins the categoryBlob, which is only used for joining the different levels of categories
LEFT JOIN [dbo].[CategoryBlob] AS [B]
ON [A].[ticketId] = [B].[ticketId]

-- Joins the category
LEFT JOIN [dbo].[Category] AS [C]
ON [B].[categoryId] = [C].[categoryId]

-- Joins the subcategory
LEFT JOIN [dbo].[Subcategory] AS [D]
ON [B].[subcategoryId] = [D].[subcategoryId]

-- Joins the descriptors
LEFT JOIN [dbo].[Descriptor] AS [E]
ON [B].[descriptorId] = [E].[descriptorId]

-- Joins the customerId
LEFT JOIN [dbo].[Customer] AS [F]
ON [A].[customerId] = [F].[customerId]

-- Joins the userId
LEFT JOIN [dbo].[User] AS [U]
ON [A].[userId] = [U].[userId]

-- Joins the departmentId
LEFT JOIN [dbo].[Department] AS [G]
ON [A].[departmentId] = [G].[departmentId]

-- Joins the departmentId
LEFT JOIN [dbo].[Department] AS [H]
ON [A].[transferredDepartmentId] = [H].[departmentId]

-- Joins the productId
LEFT JOIN [dbo].[Product] AS [P]
ON [A].[productId] = [P].[productId]

-- Joins the person, which includes contact info
-- LEFT JOIN [dbo].[Person] AS [Q]
-- ON [A].[personId] = [Q].[personId]

WHERE [A].{ where_clause } { other }
ORDER BY [A].[ticketDate] DESC