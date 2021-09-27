#

## 安装

1. `sudo dnf install https://download.postgresql.org/pub/repos/yum/reporpms/EL-8-x86_64/pgdg-redhat-repo-latest.noarch.rpm`
2. `sudo dnf -qy module disable postgresql`
3. `sudo dnf repolist`
4. `sudo yum search postgresql13`
5. `sudo dnf install postgresql13 postgresql13-server`
6. `sudo /usr/pgsql-13/bin/postgresql-13-setup initdb`
7. `sudo ls /var/lib/pgsql/13/data/`
8. `sudo systemctl enable --now postgresql-13`
9. `systemctl status postgresql-13`
10. `sudo vi /var/lib/pgsql/13/data/postgresql.conf`

        listen_addresses = '*'

    ESC :w ESC :x

11. `sudo vi /var/lib/pgsql/13/data/pg_hba.conf`

        host    all             all              0.0.0.0/0                       md5
        host    all             all              ::/0                            md5
    
12. `sudo -u postgres psql`
    
        ALTER USER postgres PASSWORD 'myPassword';
    
13. `systemctl restart postgresql-13`

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





