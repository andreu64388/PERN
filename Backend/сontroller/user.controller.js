import pool from "../database/db.js";
import jwt from "jsonwebtoken";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

class UserController {
  async Register(req, res) {
    try {
      const { name, surname, password } = req.body;
      const isUser = await pool.query("SELECT * FROM person WHERE name = $1", [
        name,
      ]);

      if (isUser.rows.length > 0) {
        return res.json({ message: "User already exists" });
      }

      if (password.length < 5) {
        return res.json({ message: "Password must be at least 6 characters" });
      }

      if (name.length < 3) {
        return res.json({ message: "Name must be at least 3 characters" });
      }
      const token = jwt.sign({ name: name }, "secret");

      if (!req.files) {
        const user = await pool.query(
          "INSERT INTO person (name, surname, password) VALUES ($1, $2, $3) RETURNING *",
          [name, surname, password]
        );
        return res.json({
          user: user.rows[0],
          token: token,
          message: "User registered successfully",
        });
      } else {
        const filename = Date.now().toString() + req.files.image.name;
        const __dirname = dirname(fileURLToPath(import.meta.url));
        req.files.image.mv(
          path.join(__dirname, "..", "uplouds", "User", filename),
          (err) => {
            if (err) {
              console.log(err);
            }
          }
        );

        const user = await pool.query(
          "INSERT INTO person (name, surname, password, image) VALUES ($1, $2, $3, $4) RETURNING *",
          [name, surname, password, filename]
        );

        return res.json({
          user: user.rows[0],
          token: token,
          message: `User registered successfully`,
        });
      }
    } catch (err) {
      res.json({
        message: err.message,
      });
    }
  }

  async Login(req, res) {
    try {
      const { name, password } = req.body;
      const user = await pool.query("SELECT * FROM person WHERE name = $1", [
        name,
      ]);

      if (!user) {
        return res.json({ message: "User not found" });
      }

      if (user.rows[0].password !== password) {
        return res.json({ message: "Password is incorrect" });
      }
      const NewUser = await pool.query("SELECT * FROM person WHERE name = $1", [
        name,
      ]);

      const token = jwt.sign({ name: user.rows[0].name }, "secret");
      return res.json({
        user: NewUser.rows[0],
        token: token,
        message: "User logged in successfully",
      });
    } catch (err) {
      res.json({
        message: "User not found",
      });
    }
  }

  async GetMe(req, res) {
    try {
      const user = await pool.query("SELECT name FROM person WHERE name = $1", [
        req.userData,
      ]);

      if (!user) {
        return res.json({ message: "User not found" });
      }
      const NewUser = await pool.query("SELECT * FROM person WHERE name = $1", [
        req.userData,
      ]);

      const token = jwt.sign({ name: user.name }, "secret");
      res.json({
        user: NewUser.rows[0],
        token: token,
        message: "",
      });
    } catch (err) {
      res.json({ message: err.message });
    }
  }

  async UpdateImage(req, res) {
    try {
      const { id_person } = req.body;
      const filename = Date.now().toString() + req.files.image.name;
      const __dirname = dirname(fileURLToPath(import.meta.url));
      req.files.image.mv(
        path.join(__dirname, "..", "uplouds", "User", filename),
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
      if (!req.files) {
        return res.json({ message: "Image not found" });
      }
      const user = await pool.query(
        "UPDATE person SET image = $1 WHERE id_person = $2 RETURNING *",
        [filename, id_person]
      );
      return res.json({
        user: user.rows[0],
        message: "Image updated successfully",
      });
    } catch (err) {
      res.json({ message: err.message });
    }
  }

  async UpdateSurname(req, res) {
    const { id_person, surname } = req.body;
    try {
      const user = await pool.query(
        "UPDATE person SET surname = $1 WHERE id_person = $2 RETURNING *",
        [surname, id_person]
      );

      if (!user) {
        return res.json({ message: "User not found" });
      }
      const token = jwt.sign({ name: user.rows[0].name }, "secret");
      const isUsed = await pool.query(
        "SELECT * FROM person WHERE surname = $1",
        [surname]
      );
      return res.json({
        user: user.rows[0],
        token: token,
        message: "Surname updated successfully",
      });
    } catch (err) {
      res.json({
        message: "Invalid credentials",
      });
    }
  }
  async UpdatePassword(req, res) {
    const { id_person, password, newPassword } = req.body;
    try {
      const FindUser = await pool.query(
        "SELECT * FROM person WHERE id_person = $1",
        [id_person]
      );
      if (FindUser.rows[0].password !== password) {
        return res.json({
          message: "Password is incorrect",
          user: FindUser.rows[0],
        });
      } else if (newPassword.length < 5) {
        return res.json({
          message: "Password must be at least 6 characters",
          user: FindUser.rows[0],
        });
      } else {
        const user = await pool.query(
          "UPDATE person SET password = $1 WHERE id_person = $2 RETURNING *",
          [newPassword, id_person]
        );
        return res.json({
          user: user.rows[0],
          message: "Password updated successfully",
        });
      }
    } catch (err) {
      res.json({
        message: "Invalid credentials",
      });
    }
  }

  async DeleteUser(req, res) {
    const { id_person } = req.body;
    try {
      const user = await pool.query(
        "DELETE FROM person WHERE id_person = $1 RETURNING *",
        [id_person]
      );
      return json({
        message: "User deleted successfully",
      });
    } catch (err) {
      res.json({
        message: "Invalid credentials",
      });
    }
  }
  async getUsers(req, res) {
    try {
      const users = await pool.query("SELECT * FROM person");
      return res.json(users.rows);
    } catch (err) {
      res.json({
        message: "Invalid credentials",
      });
    }
  }
}
export default new UserController();
