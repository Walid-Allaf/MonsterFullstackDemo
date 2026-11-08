import sql from "mssql";

let poolPromise: Promise<sql.ConnectionPool> | undefined;
export type Product = { id: number; name: string; description: string; image: string | null; created_at: string };

function getPool(): Promise<sql.ConnectionPool> {
  if (!poolPromise) {
    const required = ["DATABASE_SERVER", "DATABASE_USER", "DATABASE_PASSWORD", "DATABASE_NAME"] as const;
    for (const key of required) if (!process.env[key]) throw new Error(`Missing ${key}`);
    const config: sql.config = {
      server: process.env.DATABASE_SERVER!,
      port: Number(process.env.DATABASE_PORT || "1433"),
      user: process.env.DATABASE_USER!,
      password: process.env.DATABASE_PASSWORD!,
      database: process.env.DATABASE_NAME!,
      options: {
        encrypt: process.env.DATABASE_ENCRYPT !== "false",
        trustServerCertificate: process.env.DATABASE_TRUST_CERT === "true",
        enableArithAbort: true,
      },
      pool: { max: 3, min: 0, idleTimeoutMillis: 30000 },
      connectionTimeout: 8000,
      requestTimeout: 10000,
    };
    poolPromise = new sql.ConnectionPool(config).connect().catch((error) => {
      poolPromise = undefined;
      throw error;
    });
  }
  return poolPromise;
}

export async function listProducts(): Promise<Product[]> {
  const pool = await getPool();
  const result = await pool.request().query<Product>(
    "SELECT TOP (100) id, name, description, image, created_at FROM dbo.demo_products ORDER BY id DESC"
  );
  return result.recordset.map(({ id, name, description, image, created_at }) => ({
    id, name, description, image, created_at: new Date(created_at).toISOString(),
  }));
}

export async function addProduct(name: string, description: string, image: string | null): Promise<number> {
  const pool = await getPool();
  const result = await pool.request()
    .input("name", sql.NVarChar(160), name)
    .input("description", sql.NVarChar(3000), description)
    .input("image", sql.VarChar(100), image)
    .query<{ id: number }>(
      "INSERT INTO dbo.demo_products (name, description, image) OUTPUT INSERTED.id VALUES (@name, @description, @image)"
    );
  return result.recordset[0].id;
}

export async function deleteProduct(id: number): Promise<number> {
  const pool = await getPool();
  const result = await pool.request().input("id", sql.Int, id)
    .query("DELETE FROM dbo.demo_products WHERE id = @id");
  return result.rowsAffected[0] ?? 0;
}

export async function pingDb(): Promise<boolean> {
  const pool = await getPool();
  const result = await pool.request().query<{ ok: number }>("SELECT 1 AS ok");
  return result.recordset[0]?.ok === 1;
}
