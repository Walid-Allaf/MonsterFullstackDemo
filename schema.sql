USE MonsterFullstackDemo;
GO

IF OBJECT_ID(N'dbo.demo_products', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.demo_products (
        id INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
        name NVARCHAR(160) NOT NULL,
        description NVARCHAR(3000) NOT NULL,
        image VARCHAR(100) NULL,
        created_at DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
    );
END;
GO

-- Check the table exists:
SELECT TOP (10) id, name, description, image, created_at
FROM dbo.demo_products ORDER BY id DESC;
GO
