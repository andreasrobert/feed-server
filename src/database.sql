CREATE DATABASE pernstack;

-- CREATE TABLE todo(
--   todo_id SERIAL PRIMARY KEY,
--   description VARCHAR(255)
-- );

CREATE TABLE test1(
  id SERIAL PRIMARY KEY,
  username varchar(255) not null,
  created DATE default now() not null
);

CREATE TABLE posts(
  id serial primary key,
  title text not null,
  body text default '...',
  created_at timestamp default now() not null;
  creator_id int references users(id) not null
);

CREATE TABLE comments(
  id SERIAL PRIMARY KEY,
  comment text not null,
    -- created_at DATE,
  post_id int references posts(id) not null,
  user_id int references users(id) not null
);

create table points(   -- multiple time
  id SERIAL PRIMARY KEY,
  post_id int references posts(id),
  user_id int references users(id)
)


create table points(  -- one time
   user_id int references users(id) not null,
   post_id int references posts(id) not null,
   primary key (user_id, post_id) -- composite key
);




select u.username, c.id, c.comment, c.created_at  from comments c
inner join users u on u.id = c.user_id where post_id='1';

select u.username, p.id, p.title, p.body, p.created_at from posts p
inner join users u on u.id = p.creator_id where p.id='1';


select c.post_id, u.username, p.id, p.title, p.body, p.created_at from posts p 
inner join users u on u.id = p.creator_id 
full outer join comments c on c.post_id = p.id
GROUP BY u.id

select po.post_id, u.username, p.id, p.title, p.body, p.created_at from posts p
inner join users u on u.id = p.creator_id 
full outer join points po on po.post_id = p.id


-- most comments
select u.username, p.id, p.title, p.body, p.created_at , count(c.post_id) from posts p 
inner join users u on u.id = p.creator_id
full outer join comments c on c.post_id = p.id
group by u.username, p.id, p.title, p.body, p.created_at
order by count(c.post_id) desc;

--least comments
select u.username, p.id, p.title, p.body, p.created_at , count(c.post_id) from posts p 
inner join users u on u.id = p.creator_id
full outer join comments c on c.post_id = p.id
group by u.username, p.id, p.title, p.body, p.created_at
order by count(c.post_id), p.id asc;

-- most upvotes
select u.username, p.id, p.title, p.body, p.created_at , count(po.post_id) from posts p 
inner join users u on u.id = p.creator_id
full outer join points po on po.post_id = p.id
group by u.username, p.id, p.title, p.body, p.created_at 
order by count(po.post_id) desc;





select c.post_id, p.title ,  count(*) from comments c 
full outer join posts p on p.id = c.post_id
group by c.post_id, p.title ;

