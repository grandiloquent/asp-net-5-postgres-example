#

## 安装

## 创建数据库

```
CREATE DATABASE psycho
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Chinese (Simplified)_People''s Republic of China.936'
    LC_CTYPE = 'Chinese (Simplified)_People''s Republic of China.936'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
```

```
CREATE TABLE IF NOT EXISTS videos
(
    "id" serial PRIMARY KEY,
    "title" text NOT NULL,
    "url" text NOT NULL,
    "thumbnail" text NOT NULL,
    "publish_date" text,
    "duration" integer NOT NULL,
    "create_at" integer,
    "update_at" integer
)
```

```
ALTER TABLE videos ADD CONSTRAINT unique_url UNIQUE (url);
ALTER TABLE videos ALTER COLUMN title SET NOT NULL;
```

- https://www.postgresql.org/docs/current/locale.html
- https://www.postgresql.org/docs/13/manage-ag-tablespaces.html

## Npgsql

```
dotnet add package Npgsql --version 6.0.0-rc.1
```

- https://github.com/npgsql/npgsql
- https://www.nuget.org/packages/Npgsql/6.0.0-rc.1
- https://github.com/npgsql/npgsql/issues/2779

```
git add . && git commit -m "更新" && git push
```





