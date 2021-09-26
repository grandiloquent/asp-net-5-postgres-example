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

- https://www.postgresql.org/docs/current/locale.html
- https://www.postgresql.org/docs/13/manage-ag-tablespaces.html

## Npgsql

```
dotnet add package Npgsql --version 6.0.0-rc.1
```

- https://github.com/npgsql/npgsql
- https://www.nuget.org/packages/Npgsql/6.0.0-rc.1
- https://github.com/npgsql/npgsql/issues/2779






