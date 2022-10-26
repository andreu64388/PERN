/*

------------------------Shop---------------------
---person(
id_person
name
surname
password
)

product(
id_product,
name,
price,
description,
image,
category,
color,
comment_id,
years
sale,
count 
)

comment(
id_comment,
id_person,
id_product,
description,
)
*/
CREATE DATABASE shop;


create table person(
id_person serial PRIMARY KEY,
name varchar(50) not null,
surname varchar(50) not null,
password text not null,
image varchar (50) DEFAULT 'default.jpg'
);

CREATE TABLE product(
id_product  serial PRIMARY KEY,
name varchar(50) not null,
price INTEGER not null,
description varchar(100) not null,
img VARCHAR(50) ,
category varchar(50) not null,
color varchar(50) not null,
years INTEGER not null,
sale INTEGER,
count INTEGER not null,
count_in_shop INTEGER not NULL,
unique_property varchar(50)
);

CREATE table basket (
id_basket serial PRIMARY KEY,
id_person INTEGER not null,
id_product INTEGER not null,
count INTEGER not null,
FOREIGN KEY (id_person) REFERENCES person(id_person),
FOREIGN KEY (id_product) REFERENCES product(id_product)
);

   CREATE TABLE buy(
   id_buy serial PRIMARY KEY,
   id_person INTEGER not null,
   id_product INTEGER not null,
   count INTEGER not null,
   dateorders timestamp not null,
   isbuy BOOLEAN not null,
   mobile varchar(50) ,
   gmail varchar(50) ,
   place varchar(50) ,
   FOREIGN KEY (id_person) REFERENCES person(id_person),
   FOREIGN KEY (id_product) REFERENCES product(id_product)
   );




INSERT INTO product (name,price,description,img,category,color,years,sale,count,count_in_shop,unique_property)
values ('Samsung s21 ultra',399,'Samsung s21 ultra','Phone1.jpg','Phone','SaddleBrown',2021,10,1,10,'samsung'),
('Iphone 12 Pro Max',799,'Iphone 12 pro max is a special product','Phone2.png','Phone','Black',2020,5,1,10,'apple'),
('Xiaomi Redmi Note 10 Pro',299,'Xiaomi Redmi Note 10 Pro is a special product','Phone3.jpg','Phone','Gray',2022,10,1,10,'xiaomi'),
('Realme 8 Pro',199,'Realme 8 Pro is a special product','Phone4.png','Phone','Gray',2019,0,1,10,'realme'),
('Readmi 5g pro', 449,'Readmi 5g pro is a special product','Phone5.jpg','Phone','blue',2020,30,1,10,'xiaomi');
INSERT INTO product (name,price,description,img,category,color,years,sale,count,count_in_shop,unique_property)
VALUES ('Nike T-Shirt',90,'Nike T-Shirt is a buatiful T-Shirt','Shirt1.jpg','Clothes','MidnightBlue',2012,0,1,10,'T-shirt'),
('Addidas T-Shirt',200,'Addidas T-Shirt is a buatiful T-Shirt','Shirt2.jpg','Clothes','Black',2020,20,1,10,'T-shirt'),
('Trousers addidas',100,'Trousers addidas is a buatiful T-Shirt','Trousers1.jpg','Clothes','Black',2015,0,1,10,'Trousers'),
('Trousers Nike',120,'Trousers Nike is a buatiful T-Shirt','Trousers2.jpg','Clothes','Gray',2016,20,1,10,'Trousers'),
('Shorts Nike',40,'Shorts Nike is a buatiful Shorts','Shorts1.jpeg','Clothes','Black',2020,0,1,10,'Shorts'),
('Shorts Addidas',50,'Shorts Nike is a buatiful Shorts','Shorts2.jpg','Clothes','Black',2017,3,1,10,'Shorts');

INSERT INTO product (name,price,description,img,category,color,years,sale,count,count_in_shop,unique_property)
VALUES('Toys bear',50,'Toys car is a buatiful Toys bear','Toys1.jpg','Toys','Brown',2019,0,1,10,'Bear'),
('Toys bear',44 , 'Toys car is a buatiful Toys bear','Toys2.jpg','Toys','Brown',2019,0,1,10,'Bear'),

INSERT INTO product (name,price,description,img,category,color,years,sale,count,count_in_shop,unique_property)
VALUES('Toys bear',90, 'Toys bear is a buatiful Toys ','Toys3.jpg','Toys','White',2022,13,1,10,'Bear');

INSERT INTO product (name,price,description,img,category,color,years,sale,count,count_in_shop,unique_property)
VALUES('Ball for football',50,'Ball for football is a buatiful Ball for football','Toys4.jpg','Toys','White',2019,0,1,10,'Ball'),
('Ball for basketball',44 , 'Ball for basketball is a buatiful Ball for basketball','Toys6.jpg','Toys','White',2019,0,1,10,'Ball'),
('Ball for volleyball',90, 'Ball for volleyball is a buatiful Ball for volleyball','Toys5.jpg','Toys','White',2022,13,1,10,'Ball');

UPDATE product SET color = '#cda25f' where img = 'Toys1.jpg';
UPDATE product SET color = '#8b4c29' where img = 'Toys2.jpg';
UPDATE product SET color = '#ef7c23' where img = 'Toys4.jpg';
UPDATE product SET color = '#ecc61d' where img = 'Toys6.jpg';

INSERT INTO product (name,price,description,img,category,color,years,sale,count,count_in_shop,unique_property)
VALUES('Toys bear',90, 'Toys bear is a buatiful Toys ','Toys3.jpg','Toys','White',2022,13,1,10,'Bear');
INSERT INTO product (name,price,description,img,category,color,years,sale,count,count_in_shop,unique_property)
VALUES('Ball for football',50, 'Ball for football is a buatiful Ball for football','Toys4.jpg','Toys','White',2022,13,1,10,'Bear');

delete from product WHERE img = 'Toys1.jpg';

DELETE from product where name = 'Toys car';
      CREATE TABLE comment(
   id_comment serial PRIMARY KEY ,
   id_person INTEGER not null,
   id_product INTEGER not null,
   time VARCHAR(50) not null,
   date VARCHAR(50) not null,
   person_name VARCHAR(50) not null,
   description text not null,
   image varchar (50),
   FOREIGN KEY (id_person) REFERENCES person(id_person),
   FOREIGN KEY (id_product) REFERENCES product(id_product)
   );
   
-------------------------------------------------------
create table orders (
id_order serial PRIMARY KEY,
id_person INTEGER not null,
id_product INTEGER not null,
count INTEGER not null,
email VARCHAR(50) ,
phone VARCHAR(50) ,
address VARCHAR(50),
country VARCHAR(50) ,
house VARCHAR(50) ,
FOREIGN KEY (id_person) REFERENCES person(id_person),
FOREIGN KEY (id_product) REFERENCES product(id_product)
DateOrders date not null
);



