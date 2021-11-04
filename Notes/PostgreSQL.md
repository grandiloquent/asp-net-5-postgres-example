#



## 创建数据库

```
CREATE DATABASE psycho
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'zh_CN.utf8'
    LC_CTYPE = 'zh_CN.utf8'
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

```
CREATE EXTENSION pg_trgm;

create or replace function textsend_i (text) returns bytea as
$$

  select textsend($1);

$$
language sql strict immutable;

CREATE INDEX trgm_idx_videos_title ON videos USING GIN(text(textsend_i(title)) gin_trgm_ops);

SELECT title FROM videos WHERE text(textsend_i(title)) ~ ltrim(text(textsend_i('美女')), '\x') limit 20;

select title from videos where title ~ ''

ALTER TABLE users;
ADD COLUMN chinese_name_bytea VARCHAR;
UPDATE users SET chinese_name_bytes = textsend(chinese_name);
CREATE INDEX trgm_idx_users_chinese_name_bytea ON users USING GIN(chinese_name_bytea gin_trgm_ops);

```

UPDATE videos
SET url = regexp_replace(url, '&(page|viewtype)=.+', '')
WHERE url ~ '&(page|viewtype)=.+'
returning id;

## 查询

select *
from videos where title = '又长又直的大白腿小骚货片段1';

select * FROM videos
WHERE id = ANY(ARRAY(SELECT id
FROM (SELECT row_number() OVER (PARTITION BY url),id
FROM videos where views is null) x
WHERE x.row_number > 1)) ;

Select id, title, url, thumbnail, publish_date, duration, type,views
FROM videos
ORDER BY case when views is null then 1 else 0 end, views DESC
LIMIT 40 OFFSET 0

Select id,title,url,thumbnail,update_at,duration,type
FROM videos
WHERE text(textsend_i(title)) ~ ltrim(text(textsend_i('表妹')), '\x')
ORDER BY url,update_at
LIMIT 20 OFFSET 40

select * from videos where update_at < 1000000000000 limit 1

select *
from videos
WHERE url ~ '&(page|viewtype)=.+'

## 索引

alter table videos
add constraint unique_url
unique (url);

create unique index unique_url
on videos (url);

alter table videos drop constraint unique_url;

## 更新

UPDATE videos SET url = regexp_replace(url,'&(page|viewtype)=.+','')
WHERE id = 11223

UPDATE videos SET url = regexp_replace(url,'&(page|viewtype)=.+','')
WHERE url ~ '^https://91porn\.com'

update videos
set create_at = create_at * 1000 + (random() * 1000 + 1)
where id = 11051;

update videos
set create_at = create_at * 1000 + (random() * 1000 + 1),update_at = update_at * 1000 + (random() * 1000 + 1)
where update_at < 1000000000000;

## 删除

DELETE FROM videos
WHERE id = ANY(ARRAY(SELECT id
FROM (SELECT row_number() OVER (PARTITION BY url),id
FROM videos) x
WHERE x.row_number > 1)) ;

delete from videos
where exists(select 1
from videos t2
where t2.url = videos.url
and t2.views > videos.views
);

## 函数

CREATE OR REPLACE FUNCTION nor() RETURNS void AS
$$
DECLARE
ids integer ARRAY;
x   integer;
has integer;
BEGIN
ids := array(select id
from videos
WHERE url ~ '&(page|viewtype)=.+');
foreach x in array ids
loop
has := (select count(id)
from videos
where url = (select regexp_replace(url, '&(page|viewtype)=.+', '') from videos where id = x));
raise notice '%',has;
if has > 0 then
delete from videos where id = x;
else
UPDATE videos
SET url = regexp_replace(url, '&(page|viewtype)=.+', '')
WHERE id = x;
end if;
end loop;
END;
$$ LANGUAGE plpgsql;


# Rails Fuzzy Match
## 纠错算法
### 英文纠错
- 拼写错误
- 错别字

Levenshtein, n-gram  
[pg_trgm](https://www.postgresql.org/docs/9.4/static/pgtrgm.html)     
`select similarity('yue mian ke ji', 'yu mian ke ji')`  
[fuzzystrmatch](https://www.postgresql.org/docs/9.5/static/fuzzystrmatch.html)  
`SELECT levenshtein('yue mian ke ji', 'yu mian ke ji');`

soundex, Metaphone  
[pg_similarity](https://github.com/eulerto/pg_similarity)  
[fuzzymatch](https://www.postgresql.org/docs/9.4/static/fuzzystrmatch.html)   
`select soundex('too'), soundex('two'),difference('too', 'two');`  
[达观数据搜索引擎的Query自动纠错技术和架构详解](http://www.52nlp.cn/%E8%BE%BE%E8%A7%82%E6%95%B0%E6%8D%AE%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E7%9A%84query%E8%87%AA%E5%8A%A8%E7%BA%A0%E9%94%99%E6%8A%80%E6%9C%AF%E5%92%8C%E6%9E%B6%E6%9E%84%E8%AF%A6%E8%A7%A3)



### 中文纠错
- 中文词语比较短，编辑距离的候选词太多
- 一般多是同音字 全城热恋 全城热炼 会租车 惠租车 薪人薪事
- 别名 阅面科技 阅面readface， 魔镜在线 魔镜online 魔镜科技，玻璃博士 玻璃doctor

#### 纠错逻辑

1. 查看是否有错
- `name like %query% exists`
2. 拼音 name_pinyin like %query_pinyin%
- `客机(ke ji) --> 奇艺科技(qi yi ke ji) --> extract 科技(ke ji) by pinyin`
- `月面科技(yue mian ke ji) --> 阅面科技(yue mian ke ji) --> extract 阅面科技(yue mian ke ji) by pinyin`
- 候选词太多，order by updated_at.
- 字典直接获取，smlar 的字典 table 不支持多余 column，重建 table 损耗比较大

3. 拼音 similarity(name_pinyin, query_pinyin)
- 候选词太多，order by similarity
- `玉面科技(yu mian ke ji) -> 阅面科技(yue mian ke ji)`
- `特赞(te zan) -> 特脏(te zang)`
- 参数比较难控制， 默认0.3

4. 分词权重匹配
- 候选词太多， 权重相似度排序
- 魔镜在线(魔镜 在线) 魔镜科技(魔镜 科技)
- zhparser, smlar

## Postgres&&中文分词

### postgres分词流程

`string -> parser -> tokens -> dictionary -> lexemes`

1. dictionary: simple, synonym, thesaurus, ispell
2. parsers `select * from pg_ts_parser`
+ parser configuration
  `\dF`
+ token types
  `select * from ts_token_type('zhparser');`
+ map token to dictionary
  ```
  ALTER TEXT SEARCH CONFIGURATION name 
  ADD MAPPING FOR token_type [, ... ] WITH dictionary_name [, ... ]
  ```

3. 常用的 function 和 operator
+ `to_tsvector()`, `ts_debug()`, `to_tsquery()`, `ts_parse()`, `ts_lexize()`
+ `to_tsvector('fat cats ate rats') @@ to_tsquery('cat & rat')`
+ 一个完整的例子

  ```
  SELECT ts_rank(array[0.1, 0.2, 0.4, 1.0],
             setweight(to_tsvector('zhparser','六国灭亡，秦始皇统一了天下。蜀山的树木被伐光了，阿房宫才盖起来。阿房宫占地三百多里，楼阁高耸，遮天蔽日。'),'A'),
             to_tsquery('zhparser','秦始皇 & 蜀山 & 阿旁宫'));
  ```

### 中文分词

常见分词方法

1. 字典 字串符匹配
2. 统计 [HMM](http://www.52nlp.cn/itenyh%E7%89%88-%E7%94%A8hmm%E5%81%9A%E4%B8%AD%E6%96%87%E5%88%86%E8%AF%8D%E4%B8%80%EF%BC%9A%E6%A8%A1%E5%9E%8B%E5%87%86%E5%A4%87)


#### 安装 zhparser
zhparser 底层调用 scws 提供的 lib， scws 基于词典的机械式分词，正向匹配，类似的还有 pg_jieba 调用 cppjieba 提供的 lib

1. 安装 scws   
   参考[官方文档](http://www.xunsearch.com/scws/docs.php#instscws)
1. 下载源码
   `wget http://www.xunsearch.com/scws/down/scws-1.2.3.tar.bz2`
2. 解压缩  
   ` tar xvjf scws-1.2.3.tar.bz2`
3. 编译  
   ` cd scws-1.2.3`
   `./configure --prefix=/usr/local/scws #Mac需要sudo，或者可以换其他路径`  
   `make` `make install`

2. 安装 zhparser
1. 下载源码  
   `git clone https://github.com/amutu/zhparser.git`
2. 安装zhparser  
   `SCWS_HOME=/usr/local make && make install`

3. 配置
- postgres.conf

    ```
    include = 'zhparser.conf'  
    include = 'smlar.conf'  
    ```
- zhparser.conf

    ```
    zhparser.punctuation_ignore = t #忽略标点  
    zhparser.seg_with_duality = t #二元  
    zhparser.dict_in_memory = t  
    zhparser.multi_short = f #短词  
    zhparser.multi_duality = t  
    zhparser.multi_zmain = f  #重要单字  
    zhparser.multi_zall = f  #全部单字  
    ```  
- chinese.stop

  `pg_config --sharedir`

4. migration

    ```
    if PostgresService.extension_exist('smlar', 'zhparser')
      enable_extension :zhparser
      execute <<-SQL
      CREATE TEXT SEARCH DICTIONARY simple_dict (
              TEMPLATE = simple,
              STOPWORDS = chinese
      );
      CREATE TEXT SEARCH CONFIGURATION zhparser (PARSER = zhparser);
      ALTER TEXT SEARCH CONFIGURATION zhparser ADD MAPPING FOR a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z WITH simple;
      SQL
    end
    ```
5. 测试

  ```
  SET zhparser.seg_with_duality TO f;
  SET zhparser.multi_duality TO f;
  SELECT * FROM ts_debug('zhparser','分词技术哪家强， 中国山东找蓝翔');
  SELECT * FROM ts_debug('zhparser','阅面科技');
  ```

  ```
  SET zhparser.seg_with_duality TO t;
  SET zhparser.multi_duality TO t;
  SELECT * FROM ts_debug('zhparser','扁担长板凳宽');
  SELECT * FROM ts_debug('zhparser','阅面科技');
  ```

### 权重匹配
TF-IDF(term frequency, inverse document frequency), 包含 term t 的 document 数量越少， t 越有代表性

#### smlar

1. 安装 smlar

    ```
    git clone git://sigaev.ru/smlar.git  
    cd smlar  
    export USE_PGXS=1  
    make  
    make install  
    ```

2. 配置 smlar
- smlar.conf

  ```
  smlar.persistent_cache true   
  smlar.stattable 'company_name_corpuses'  
  smlar.type 'tfidf'  
  smlar.idf_plus_one true  
  smlar.tf_method 'const'  
  smlar.threshold 0.5  
  ```

3. 创建语料库
+ 每一个 company.name 和 company.desc 最为一个 document
+ 使用 zhparse 分词，记录到数据库中统计

3. 测试

  ```
  select smlar(tsvector2textarray(to_tsvector('zhparser','阅面科技')), tsvector2textarray(to_tsvector('zhparser','阅面 readface')));
  select smlar(tsvector2textarray(to_tsvector('zhparser','阅面科技')), tsvector2textarray(to_tsvector('zhparser','烽火科技')));
  select smlar(tsvector2textarray(to_tsvector('zhparser','阅面科技')), tsvector2textarray(to_tsvector('zhparser','芝麻科技')));
  ```

### 搜索优化

如果每次分词并且按照权重比较，查询会很耗费时间，所以还要加上对应的 index

1. like && ilike  pg_trgm

    ```
    drop index index_companies_on_name_pinyin;
    explain analyze select * from companies where name_pinyin like '%ke-ji%';
    create index index_companies_on_name_pinyin on companies using gin(name_pinyin gin_trgm_ops);
    explain analyze select * from companies where name_pinyin like '%ke-ji%';
    ```

2. expression index

    ```
    drop index index_sml_companies_on_name;
    explain analyze SELECT  "companies"."name" FROM "companies" WHERE (tsvector2textarray(to_tsvector('zhparser',companies.name)) % array['readface','阅面']) ORDER BY smlar(tsvector2textarray(to_tsvector('zhparser',companies.name)),array['readface','阅面']);
    create index index_sml_companies_on_name_pinyin on companies using gin(tsvector2textarray(to_tsvector('zhparser'::regconfig, name::text)) _text_sml_ops);
    explain analyze SELECT  "companies"."name" FROM "companies" WHERE (tsvector2textarray(to_tsvector('zhparser',companies.name)) % array['readface','阅面']) ORDER BY smlar(tsvector2textarray(to_tsvector('zhparser',companies.name)),array['readface','阅面']);
    ```
   

