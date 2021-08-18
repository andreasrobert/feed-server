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
  points int,
  created_at DATE,
  creator_id int references users(id) not null
);

CREATE TABLE comments(
  id SERIAL PRIMARY KEY,
  comment text not null,
  created_at DATE,
  post_id int references posts(id),
  user_id int references users(id)
);

create table points(
  id SERIAL PRIMARY KEY,
  vote int,
  post_id int references posts(id),
  user_id int references users(id)
)


create table favorites(
   user_id int references users(id),
   post_id int references posts(id),
   primary key (user_id, post_id) -- composite key
);