CREATE DATABASE pernstack;

-- CREATE TABLE todo(
--   todo_id SERIAL PRIMARY KEY,
--   description VARCHAR(255)
-- );

CREATE TABLE users(
  id SERIAL PRIMARY KEY,
  username varchar(255) not null,
  password text not null
);

CREATE TABLE posts(
  id serial primary key,
  title text not null,
  body text default '...',
  -- created_at DATE,
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