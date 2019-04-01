import * as express from "express";
import { resolve } from "dns";
import * as path from "path";

var fs = require("fs");
var mongoose = require("mongodb");
mongoose.Promise = global.Promise;
var assert = require("assert");
var MongoClient = mongoose.MongoClient;
var comment = require("../models/comment").comment;
var bodyParser = require("body-parser");
var url = "mongodb://localhost/comments";

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname, "..", "client", "todo")));
app.get("/api/comments", (req, res) => {
  MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
    assert.equal(null, err);
    db.collection("comment")
      .find()
      .toArray((err, result) => {
        assert.equal(null, err);
        res.end(JSON.stringify(result));
        db.close();
      });
  });
});
app.post("/api/comment", (req, res) => {
  const todo = req.body;
  MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
    assert.equal(null, err);
    db.collection("comment").insert(todo, (err, result) => {
      assert.equal(null, err);
    });
    db.collection("comment")
      .find()
      .toArray((err, result) => {
        assert.equal(null, err);
        res.end(JSON.stringify(result));
        db.close();
      });
  });
});

app.get("/api/comment/:id", (req, res) => {
  MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
    assert.equal(null, err);
    db.collection("comment").remove(
      { id: parseInt(req.params.id) },
      (err, result) => {
        assert.equal(null, err);
        // db.close();
        db.collection("comment")
          .find()
          .toArray((err, result) => {
            assert.equal(null, err);
            res.end(JSON.stringify(result));
            db.close();
          });
      }
    );
  });
});
app.put("/api/changeComment", (req, res) => {
  MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
    assert.equal(null, err);
    db.collection("comment").update(
      { id: parseInt(req.body.id) },
      { $set: { completed: req.body.completed } },
      (err, result) => {
        assert.equal(null, err);
        db.collection("comment")
          .find()
          .toArray((err, result) => {
            assert.equal(null, err);
            res.end(JSON.stringify(result));
            db.close();
          });
      }
    );
  });
});
app.get("/api/allchanged", (req, res) => {
  MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
    assert.equal(null, err);
    db.collection("comment").update(
      { id: parseInt(req.body.id) },
      { $set: { completed: req.body.completed } },
      (err, result) => {
        assert.equal(null, err);
      }
    );
    db.collection("comment")
      .find()
      .toArray((err, result) => {
        assert.equal(null, err);
        var sum = result.length;
        db.collection("comment")
          .find({ completed: true })
          .toArray((err, result) => {
            assert.equal(null, err);
            var complete = result.length;
            if (complete >= 0 && complete < sum) {
              db.collection("comment").update(
                { completed: false },
                { $set: { completed: true } },
                { multi: true },
                (err, result) => {
                  assert.equal(null, err);
                  db.collection("comment")
                    .find()
                    .toArray((err, result) => {
                      assert.equal(null, err);
                      res.end(JSON.stringify(result));
                      db.close();
                    });
                }
              );
            } else {
              db.collection("comment").update(
                { completed: true },
                { $set: { completed: false } },
                { multi: true },
                (err, result) => {
                  assert.equal(null, err);
                  db.collection("comment")
                    .find()
                    .toArray((err, result) => {
                      assert.equal(null, err);
                      res.end(JSON.stringify(result));
                      db.close();
                    });
                }
              );
            }
          });
      });
  });
});
app.get("/api/clearcomments", (req, res) => {
  MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
    assert.equal(null, err);
    db.collection("comment").remove({ completed: true }, (err, result) => {
      assert.equal(null, err);
      db.collection("comment")
        .find()
        .toArray((err, result) => {
          assert.equal(null, err);
          res.end(JSON.stringify(result));
          db.close();
        });
    });
  });
});
const server = app.listen(8000, "localhost", () => {
  console.log("服务器已启动，地址是：http://localhost:8000");
});
