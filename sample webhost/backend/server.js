const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "selfdrivedb"
});

// Function to check if email already exists in the database
const checkExistingEmail = (email, mobile) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE email = ? OR mobile=?', [email, mobile], (error, results) => {
      if (error) {
        console.error('Error checking existing email:', error);
        return reject(error);
      }

      resolve(results.length > 0);
    });
  });
};

app.post('/post', async (req, res) => {
  const { name, email, mobile } = req.body;
  try {
    const existingEmail = await checkExistingEmail(email, mobile);
    if (existingEmail) {
      res.send("User already exists");
    } else {
      const postDataQuery = "INSERT INTO users (name, email, mobile) VALUES (?, ?, ?)";
      db.query(postDataQuery, [name, email, mobile], (err, result) => {
        if (err) {
          console.log(err);
        }
        res.send(result);
      });
    }
  } catch (error) {
    console.error('Error checking existing email:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(5000, () => {
  console.log("Server running at port 5000");
});
