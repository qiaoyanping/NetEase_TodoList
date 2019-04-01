var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var commentScheMa = new Schema({
 id: String,
 content: String,
 completed: Boolean
}); //  定义了评论的模型
exports.comment = mongoose.model('comment', commentScheMa);