"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var fs = require("fs");
var mongoose = require("mongodb");
mongoose.Promise = global.Promise;
var assert = require("assert");
var MongoClient = mongoose.MongoClient;
var comment = require("../models/comment").comment;
var bodyParser = require("body-parser");
var url = "mongodb://localhost/comments";
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/", express.static(path.join(__dirname, "..", "client", "todo")));
app.get("/api/comments", function (req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        assert.equal(null, err);
        db.collection("comment")
            .find()
            .toArray(function (err, result) {
            assert.equal(null, err);
            res.end(JSON.stringify(result));
            db.close();
        });
    });
});
app.post("/api/comment", function (req, res) {
    var todo = req.body;
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        assert.equal(null, err);
        db.collection("comment").insert(todo, function (err, result) {
            assert.equal(null, err);
        });
        db.collection("comment")
            .find()
            .toArray(function (err, result) {
            assert.equal(null, err);
            res.end(JSON.stringify(result));
            db.close();
        });
    });
});
app.get("/api/comment/:id", function (req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        assert.equal(null, err);
        db.collection("comment").remove({ id: parseInt(req.params.id) }, function (err, result) {
            assert.equal(null, err);
            // db.close();
            db.collection("comment")
                .find()
                .toArray(function (err, result) {
                assert.equal(null, err);
                res.end(JSON.stringify(result));
                db.close();
            });
        });
    });
});
app.put("/api/changeComment", function (req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        assert.equal(null, err);
        db.collection("comment").update({ id: parseInt(req.body.id) }, { $set: { completed: req.body.completed } }, function (err, result) {
            assert.equal(null, err);
            db.collection("comment")
                .find()
                .toArray(function (err, result) {
                assert.equal(null, err);
                res.end(JSON.stringify(result));
                db.close();
            });
        });
    });
});
app.get("/api/allchanged", function (req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        assert.equal(null, err);
        db.collection("comment").update({ id: parseInt(req.body.id) }, { $set: { completed: req.body.completed } }, function (err, result) {
            assert.equal(null, err);
        });
        db.collection("comment")
            .find()
            .toArray(function (err, result) {
            assert.equal(null, err);
            var sum = result.length;
            db.collection("comment")
                .find({ completed: true })
                .toArray(function (err, result) {
                assert.equal(null, err);
                var complete = result.length;
                if (complete >= 0 && complete < sum) {
                    db.collection("comment").update({ completed: false }, { $set: { completed: true } }, { multi: true }, function (err, result) {
                        assert.equal(null, err);
                        db.collection("comment")
                            .find()
                            .toArray(function (err, result) {
                            assert.equal(null, err);
                            res.end(JSON.stringify(result));
                            db.close();
                        });
                    });
                }
                else {
                    db.collection("comment").update({ completed: true }, { $set: { completed: false } }, { multi: true }, function (err, result) {
                        assert.equal(null, err);
                        db.collection("comment")
                            .find()
                            .toArray(function (err, result) {
                            assert.equal(null, err);
                            res.end(JSON.stringify(result));
                            db.close();
                        });
                    });
                }
            });
        });
    });
});
app.get("/api/clearcomments", function (req, res) {
    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        assert.equal(null, err);
        db.collection("comment").remove({ completed: true }, function (err, result) {
            assert.equal(null, err);
            db.collection("comment")
                .find()
                .toArray(function (err, result) {
                assert.equal(null, err);
                res.end(JSON.stringify(result));
                db.close();
            });
        });
    });
});
var server = app.listen(8000, "localhost", function () {
    console.log("服务器已启动，地址是：http://localhost:8000");
});
