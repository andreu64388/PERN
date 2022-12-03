import pool from "../database/db.js";
import nodemailer from "nodemailer";

class ProductController {
  async GetProducts(req, res) {
    try {
      const products = await pool.query("SELECT * FROM product");
      var product;

      const Path = "http://localhost:3001";
      for (let i = 0; i < products.rows.length; i++) {
        const CommentForProduct = await pool.query(
          "SELECT * FROM comment WHERE id_product = $1",
          [products.rows[i].id_product]
        );
        product = {
          id_product: products.rows[i].id_product.toString(),
          name: products.rows[i].name,
          img: `${Path}/${products.rows[i].category}/${products.rows[i].img}`,
          price: products.rows[i].price,
          category: products.rows[i].category,
          color: products.rows[i].color,
          years: products.rows[i].years,
          description: products.rows[i].description,
          sale: products.rows[i].sale,
          count: products.rows[i].count,
          count_in_shop: products.rows[i].count_in_shop,
          unique_property: products.rows[i].unique_property,
          comment: CommentForProduct.rows,
        };
        products.rows[i] = product;
      }
      res.json(products.rows);
    } catch (err) {
      res.json({
        message: "Invalid credentials",
      });
    }
  }
  async GetProduct(req, res) {
    try {
      const productID = req.params.id.slice(1);

      const product = await pool.query(
        "SELECT * FROM product WHERE id_product = $1",
        [productID]
      );
      const Path = "http://localhost:3001";
      const comment = await pool.query(
        "SELECT * FROM comment WHERE id_product = $1",
        [productID]
      );

      const productForSend = {
        id_product: product.rows[0].id_product,
        name: product.rows[0].name,
        img: `${Path}/${product.rows[0].category}/${product.rows[0].img}`,
        price: product.rows[0].price,
        category: product.rows[0].category,
        color: product.rows[0].color,
        years: product.rows[0].years,
        description: product.rows[0].description,
        sale: product.rows[0].sale,
        count: product.rows[0].count,
        count_in_shop: product.rows[0].count_in_shop,
        unique_property: product.rows[0].unique_property,
        comment: comment.rows,
      };
      res.json(productForSend);
    } catch (err) {
      res.json({ message: err.message });
    }
  }
  async AddToBasket(req, res) {
    try {
      const { id_product, id_person } = req.body;
      const count = 1;
      const check = await pool.query(
        "SELECT * FROM basket WHERE id_product = $1 AND id_person = $2",
        [id_product, id_person]
      );
      const basket_person = await pool.query(
        "SELECT * FROM basket WHERE id_person = $1 order by id_basket desc",
        [id_person]
      );

      if (check.rows.length === 0) {
        const basket = await pool.query(
          "INSERT INTO basket (id_product, id_person, count) VALUES ($1, $2, $3)",
          [id_product, id_person, count]
        );
      } else {
        for (let i = 0; i < basket_person.rows.length; i++) {
          if (
            basket_person.rows[i].id_product === id_product &&
            basket_person.rows[i].id_person === id_person &&
            basket_person.rows[i].id_basket === check.rows[0].id_basket
          ) {
            await pool.query(
              "UPDATE basket SET count = $1 WHERE id_product = $2 AND id_person = $3 AND id_basket = $4",
              [
                basket_person.rows[i].count + 1,
                id_product,
                id_person,
                check.rows[0].id_basket,
              ]
            );
          }
        }
      }
      const basket = await pool.query(
        "SELECT basket.id_basket, basket.id_product, basket.id_person, basket.count, product.name, product.img, product.price, product.category, product.color, product.years, product.description, product.sale, product.count_in_shop, product.unique_property FROM basket INNER JOIN product ON basket.id_product = product.id_product WHERE basket.id_person = $1 order by basket.id_basket desc",
        [id_person]
      );
      const Path = "http://localhost:3001";
      var product;
      for (let i = 0; i < basket.rows.length; i++) {
        product = {
          id_basket: basket.rows[i].id_basket,
          id_product: basket.rows[i].id_product,
          id_person: basket.rows[i].id_person,
          name: basket.rows[i].name,
          img: `${Path}/${basket.rows[i].category}/${basket.rows[i].img}`,
          price: basket.rows[i].price,
          category: basket.rows[i].category,
          color: basket.rows[i].color,
          years: basket.rows[i].years,
          description: basket.rows[i].description,
          sale: basket.rows[i].sale,
          count: basket.rows[i].count,
          count_in_shop: basket.rows[i].count_in_shop,
          unique_property: basket.rows[i].unique_property,
        };
        basket.rows[i] = product;
      }
      res.json(basket.rows);
    } catch (err) {
      res.json({ message: err.message });
    }
  }
  async GetBasket(req, res) {
    try {
      const person_id = req.params.id.slice(1);
      const basket = await pool.query(
        "SELECT basket.id_basket, basket.id_product, basket.id_person, basket.count, product.name, product.img, product.price, product.category, product.color, product.years, product.description, product.sale, product.count_in_shop, product.unique_property FROM basket INNER JOIN product ON basket.id_product = product.id_product WHERE basket.id_person = $1 order by id_basket desc",
        [person_id]
      );
      const Path = "http://localhost:3001";
      var product;
      for (let i = 0; i < basket.rows.length; i++) {
        product = {
          id_basket: basket.rows[i].id_basket,
          id_product: basket.rows[i].id_product,
          id_person: basket.rows[i].id_person,
          name: basket.rows[i].name,
          img: `${Path}/${basket.rows[i].category}/${basket.rows[i].img}`,
          price: basket.rows[i].price,
          category: basket.rows[i].category,
          color: basket.rows[i].color,
          years: basket.rows[i].years,
          description: basket.rows[i].description,
          sale: basket.rows[i].sale,
          count: basket.rows[i].count,
          count_in_shop: basket.rows[i].count_in_shop,
          unique_property: basket.rows[i].unique_property,
        };
        basket.rows[i] = product;
      }
      res.json(basket.rows);
    } catch (err) {
      res.json({ message: err.message });
    }
  }
  async DeleteAllBasket(req, res) {
    try {
      const { id_person } = req.body;
      const id = Number(id_person);
      const basket = await pool.query(
        "DELETE FROM basket WHERE id_person = $1",
        [id]
      );
      res.json({
        message: "Basket is empty" + id_person,
      });
    } catch (err) {
      res.json({ message: err.message });
    }
  }
  async DeleteFromBasket(req, res) {
    try {
      const { id_product, id_person, id_basket } = req.body;
      const basket_person = await pool.query(
        "SELECT * FROM basket WHERE id_person = $1",
        [id_person]
      );
      for (let i = 0; i < basket_person.rows.length; i++) {
        if (
          basket_person.rows[i].id_product === id_product &&
          basket_person.rows[i].id_person === id_person &&
          basket_person.rows[i].id_basket === id_basket
        ) {
          if (basket_person.rows[i].count === 1) {
            await pool.query(
              "DELETE FROM basket WHERE id_product = $1 AND id_person = $2",
              [id_product, id_person]
            );
          } else {
            await pool.query(
              "UPDATE basket SET count = $1 WHERE id_product = $2 AND id_person = $3",
              [basket_person.rows[i].count - 1, id_product, id_person]
            );
          }
        }
      }

      const basket = await pool.query(
        "SELECT basket.id_product, basket.id_person, basket.count, product.name, product.img, product.price, product.category, product.color, product.years, product.description, product.sale, product.count_in_shop, product.unique_property FROM basket INNER JOIN product ON basket.id_product = product.id_product WHERE basket.id_person = $1 order by id_basket desc",
        [id_person]
      );
      const Path = "http://localhost:3001";

      var product;
      for (let i = 0; i < basket.rows.length; i++) {
        product = {
          id_basket: basket.rows[i].id_basket,
          id_product: basket.rows[i].id_product,
          id_person: basket.rows[i].id_person,
          name: basket.rows[i].name,
          img: `${Path}/${basket.rows[i].category}/${basket.rows[i].img}`,
          price: basket.rows[i].price,
          category: basket.rows[i].category,
          color: basket.rows[i].color,
          years: basket.rows[i].years,
          description: basket.rows[i].description,
          sale: basket.rows[i].sale,
          count: basket.rows[i].count,
          count_in_shop: basket.rows[i].count_in_shop,
          unique_property: basket.rows[i].unique_property,
        };
        basket.rows[i] = product;
      }
      res.json(basket.rows);
    } catch (err) {
      res.json({ message: err.message });
    }
  }
  async AddOrder(req, res) {
    try {
      const isbuy = false;
      const { id_product, id_person, count, dateorders, mobile, gmail, place } =
        req.body;
      const buy = await pool.query(
        "INSERT INTO buy (id_product, id_person, count, dateorders, mobile, gmail, place, isbuy) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
        [id_product, id_person, count, dateorders, mobile, gmail, place, isbuy]
      );
      const order = await pool.query(
        "SELECT buy.id_buy,buy.isbuy, buy.id_product, buy.id_person, buy.count,buy.dateorders, product.name, product.img, product.price, product.category, product.color, product.years, product.description, product.sale, product.count_in_shop, product.unique_property FROM buy INNER JOIN product ON buy.id_product = product.id_product WHERE buy.id_person = $1",
        [id_person]
      );
      const Path = "http://localhost:3001";
      var product;
      for (let i = 0; i < order.rows.length; i++) {
        product = {
          id_buy: order.rows[i].id_buy,
          id_product: order.rows[i].id_product,
          id_person: order.rows[i].id_person,
          name: order.rows[i].name,
          img: `${Path}/${order.rows[i].category}/${order.rows[i].img}`,
          price: order.rows[i].price,
          category: order.rows[i].category,
          color: order.rows[i].color,
          years: order.rows[i].years,
          description: order.rows[i].description,
          sale: order.rows[i].sale,
          count: order.rows[i].count,
          count_in_shop: order.rows[i].count_in_shop,
          unique_property: order.rows[i].unique_property,
          dateorders: order.rows[i].dateorders,
          isbuy: order.rows[i].isbuy,
        };
        order.rows[i] = product;
        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "",
            pass: "lpw",
          },
        });
        const mailOptions = {
          from: "",
          to: gmail,
          subject: "Sending Email using Node.js",
          html: `<h1>Заказ</h1>
          <p>Имя: ${order.rows[i].name}</p>
          <p>Цена: ${order.rows[i].price}</p>
          <p>Количество: ${order.rows[i].count}</p>
          <p>Дата заказа: ${order.rows[i].dateorders}</p>
          <p>Мобильный телефон: ${mobile}</p>
          <p>Место доставки: ${place}</p>
          <p>Почта: ${gmail}</p>
          <img src="${order.rows[i].img}" alt="img" width="200px" height="200px" />`,
        };
        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
          } else {
            console.log("Email sent: " + info.response);
          }
        });
      }

      res.json(order.rows);
    } catch (err) {
      res.json({ message: err.message });
    }
  }
  async UpdateOrder(req, res) {
    try {
      const { id_buy, id_person } = req.body;
      const isbuy = true;
      const buy = await pool.query(
        "UPDATE buy SET isbuy = $1 WHERE id_buy = $2 AND id_person = $3",
        [isbuy, id_buy, id_person]
      );
      const order = await pool.query(
        "SELECT buy.id_buy,buy.isbuy, buy.id_product, buy.id_person, buy.count,buy.dateorders, product.name, product.img, product.price, product.category, product.color, product.years, product.description, product.sale, product.count_in_shop, product.unique_property FROM buy INNER JOIN product ON buy.id_product = product.id_product WHERE buy.id_person = $1",
        [id_person]
      );
      const Path = "http://localhost:3001";
      var product;
      for (let i = 0; i < order.rows.length; i++) {
        product = {
          id_buy: order.rows[i].id_buy,
          id_product: order.rows[i].id_product,
          id_person: order.rows[i].id_person,
          name: order.rows[i].name,
          img: `${Path}/${order.rows[i].category}/${order.rows[i].img}`,
          price: order.rows[i].price,
          category: order.rows[i].category,
          color: order.rows[i].color,
          years: order.rows[i].years,
          description: order.rows[i].description,
          sale: order.rows[i].sale,
          count: order.rows[i].count,
          count_in_shop: order.rows[i].count_in_shop,
          unique_property: order.rows[i].unique_property,
          dateorders: order.rows[i].dateorders,
          isbuy: order.rows[i].isbuy,
        };
        order.rows[i] = product;
      }
      res.json(order.rows);
    } catch (err) {
      res.json({ message: err.message });
    }
  }
  async GetOrders(req, res) {
    try {
      const id_person = req.params.id.slice(1);
      const buy = await pool.query(
        "SELECT buy.id_buy, buy.isbuy, buy.id_product, buy.id_person, buy.count,buy.dateorders, product.name, product.img, product.price, product.category, product.color, product.years, product.description, product.sale, product.count_in_shop, product.unique_property FROM buy INNER JOIN product ON buy.id_product = product.id_product WHERE buy.id_person = $1",
        [id_person]
      );
      const Path = "http://localhost:3001";
      var product;
      for (let i = 0; i < buy.rows.length; i++) {
        product = {
          id_buy: buy.rows[i].id_buy,
          id_product: buy.rows[i].id_product,
          id_person: buy.rows[i].id_person,
          name: buy.rows[i].name,
          img: `${Path}/${buy.rows[i].category}/${buy.rows[i].img}`,
          price: buy.rows[i].price,
          category: buy.rows[i].category,
          color: buy.rows[i].color,
          years: buy.rows[i].years,
          description: buy.rows[i].description,
          sale: buy.rows[i].sale,
          count: buy.rows[i].count,
          count_in_shop: buy.rows[i].count_in_shop,
          unique_property: buy.rows[i].unique_property,
          dateorders: buy.rows[i].dateorders,
          isbuy: buy.rows[i].isbuy,
        };
        buy.rows[i] = product;
      }
      res.json(buy.rows);
    } catch (err) {
      res.json({ message: err.message });
    }
  }
  async AddComment(req, res) {
    try {
      const {
        id_product,
        id_person,
        description,
        time,
        date,
        person_name,
        image,
      } = req.body;
      const comment = await pool.query(
        "INSERT INTO comment (id_product, id_person, description, time, date, person_name, image) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [
          id_product,
          id_person,
          description,
          new Date(time).getTime(),
          date,
          person_name,
          image,
        ]
      );
      const product = await pool.query(
        "SELECT * FROM product WHERE id_product = $1 ",
        [id_product]
      );

      const Path = "http://localhost:3001";
      const NewComment = await pool.query(
        "SELECT * FROM comment WHERE id_product = $1 ORDER BY time",
        [id_product]
      );

      const productForSend = {
        id_product: product.rows[0].id_product,
        name: product.rows[0].name,
        img: `${Path}/${product.rows[0].category}/${product.rows[0].img}`,
        price: product.rows[0].price,
        category: product.rows[0].category,
        color: product.rows[0].color,
        years: product.rows[0].years,
        description: product.rows[0].description,
        sale: product.rows[0].sale,
        count: product.rows[0].count,
        count_in_shop: product.rows[0].count_in_shop,
        unique_property: product.rows[0].unique_property,
        comment: NewComment.rows,
      };
      res.json(productForSend);
    } catch (err) {
      res.json({ message: err.message });
    }
  }
  async UpdateComment(req, res) {
    try {
      const { id_product, id_person, description, id_comment } = req.body;
      await pool.query(
        "UPDATE comment SET description = $1 WHERE id_product = $2 AND id_person = $3 AND id_comment = $4",
        [description, id_product, id_person, id_comment]
      );
      const product = await pool.query(
        "SELECT * FROM product WHERE id_product = $1",

        [id_product]
      );

      const Path = "http://localhost:3001";
      //сделать order by date
      const NewComment = await pool.query(
        "SELECT * FROM comment WHERE id_product = $1 ORDER BY time",
        [id_product]
      );
      const productForSend = {
        id_product: product.rows[0].id_product,
        name: product.rows[0].name,
        img: `${Path}/${product.rows[0].category}/${product.rows[0].img}`,
        price: product.rows[0].price,
        category: product.rows[0].category,
        color: product.rows[0].color,
        years: product.rows[0].years,
        description: product.rows[0].description,
        sale: product.rows[0].sale,
        count: product.rows[0].count,
        count_in_shop: product.rows[0].count_in_shop,
        unique_property: product.rows[0].unique_property,
        comment: NewComment.rows,
      };
      res.json(productForSend);
    } catch (err) {
      res.json({ message: err.message });
    }
  }
  async DeleteComment(req, res) {
    try {
      const { id_comment, id_product, id_person } = req.body;
      await pool.query(
        "DELETE FROM comment WHERE id_comment = $1 AND id_product = $2 AND id_person = $3",
        [id_comment, id_product, id_person]
      );
      const product = await pool.query(
        "SELECT * FROM product WHERE id_product = $1",
        [id_product]
      );
      const Path = "http://localhost:3001";
      const NewComment = await pool.query(
        "SELECT * FROM comment WHERE id_product = $1 ORDER BY time",
        [id_product]
      );
      const productForSend = {
        id_product: product.rows[0].id_product,
        name: product.rows[0].name,
        img: `${Path}/${product.rows[0].category}/${product.rows[0].img}`,
        price: product.rows[0].price,
        category: product.rows[0].category,
        color: product.rows[0].color,
        years: product.rows[0].years,
        description: product.rows[0].description,
        sale: product.rows[0].sale,
        count: product.rows[0].count,
        count_in_shop: product.rows[0].count_in_shop,
        unique_property: product.rows[0].unique_property,
        comment: NewComment.rows,
      };
      res.json(productForSend);
    } catch (err) {
      res.json({ message: err.message });
    }
  }
  async GetPersons(req, res) {
    try {
      const TopPersons = await pool.query(
        "SELECT  person.id_person, person.name, person.surname, sum(buy.count) AS count FROM person INNER JOIN buy ON person.id_person = buy.id_person GROUP BY person.id_person, person.name, person.surname"
      );
      var TopPersonsForSend = [];
      for (let i = 0; i < TopPersons.rows.length; i++) {
        const element = TopPersons.rows[i];

        TopPersonsForSend.push({
          id_person: element.id_person,
          name: element.name,
          surname: element.surname,
          count: element.count,
        });
      }
      res.json(TopPersonsForSend.slice(0, 5));
    } catch (err) {
      res.json({ message: err.message });
    }
  }
}
export default new ProductController();
