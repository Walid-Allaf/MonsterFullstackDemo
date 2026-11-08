# MonsterASP.NET — Next.js Full Stack + SQL Server + Images demo

Next.js App Router demo, one project with public catalog, `/admin` dashboard, SQL Server (`mssql`), file uploads, and `/api/health`. Intended only as a hosting proof of concept, **not production ready**.

## Local setup (Windows)

1. Install SQL Server Express and SSMS. Create `MonsterFullstackDemo` and a SQL-authenticated user `monster_app` mapped to the database with `db_datareader` and `db_datawriter` roles (without using `sa` from the app).
2. **In SSMS, while connected as Windows administrator, open `schema.sql`, execute it** to create `dbo.demo_products`. The app user intentionally does not have schema modification permission.
3. In SQL Server Configuration Manager enable TCP/IP for SQLEXPRESS, clear TCP Dynamic Ports and configure IPAll TCP Port to `1433`, restart `SQL Server (SQLEXPRESS)`. Confirm the port is listening locally. Do not expose port 1433 to the Internet. A named instance is accessed via `DATABASE_SERVER=127.0.0.1` plus port, not `localhost\\SQLEXPRESS` in the Node app.
4. Copy `.env.example` to `.env.local` and fill in the **real** SQL password and strong admin/session secrets. `DATABASE_TRUST_CERT=true` is for local self-signed SQL Server certificates only; use validated TLS in production where available.
5. Run `npm install`, then `npm run dev`. Open `http://localhost:3000/api/health`; expect `database:true` (200). Then visit `/admin`, log in, upload image and add product, then view `/`.
6. Run `npm run check` and `npm run build` before deployment.

### Database connection troubleshooting

- `database:false`: Check Windows service `SQL Server (SQLEXPRESS)`, IPAll TCP 1433, TCP Dynamic Ports blank, that `127.0.0.1:1433` is listening, SQL Server login, `DATABASE_*` values, whether SQL login authentication (Mixed Mode) was enabled, and `dbo.demo_products` created using `schema.sql`.
- You can test the TCP port in PowerShell: `Test-NetConnection 127.0.0.1 -Port 1433`.
- Error about invalid object `demo_products`: execute `schema.sql` in SSMS as a database administrator.
- Never put `.env.local`, passwords, or uploads into Git.

## MonsterASP.NET Free proof of concept

1. Create Free website and **SQL Server** database on MonsterASP.NET. Use the hosting control panel to confirm whether the free plan allows creating and connecting to the database from a Node.js application; quotas and runtime compatibility must be checked.
2. Execute the contents of `schema.sql` against the hosted database **after changing the first `USE MonsterFullstackDemo` to the actual hosted database name**. Run it with a database user allowed to create a table.
3. Set `DATABASE_SERVER`, `DATABASE_PORT`, `DATABASE_NAME`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_ENCRYPT`, and `DATABASE_TRUST_CERT` based on Monster's SQL Server connection details. These may require a specific port and encryption settings; do not copy local settings blindly. Set admin/session secrets too.
4. Push source to GitHub and deploy as a Node.js SSR app, making sure Next.js build and run work on the free plan. Free 256MB RAM may not suffice for Next.js.
5. Configure writable **persistent** `UPLOAD_DIR`, protected from Git deploy overwrite and included in off-site backups. **Verify** persistence after restart and redeployment before depending on it.
6. Check `/api/health`, create an item under `/admin`, upload an image, and verify it displays on `/`. Repeat after restart and redeploy.

## Notes

- Unlike the original MySQL demo, SQL schema creation is **manual** so the app user needs only read/write permissions.
- API POST/DELETE operations use parameterized SQL queries.
- Uploaded images are served via `/api/images/[name]` and kept outside the repo build directory when possible.
- Simple environment-based admin login is **for testing only**. For production add proper account management, hashed passwords, CSRF protection, login rate limits, safe image processing and quotas, audit logs, backups and restoration testing.
