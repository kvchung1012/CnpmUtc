var db = require('../model/db.js');

module.exports.GetMessage = async function(req, res) {
    let groupId = req.body.groupId;
    console.log(groupId);
    let sql = `select * from GroupUserMessage 
               join Users on GroupUserMessage.userId = Users.Id
               where GroupUserMessage.GroupId = ${groupId}`;
    console.log(sql);
    let messages = await db.promise().query(sql);

    sql = `select * from GroupUser
            join Users on GroupUser.UserId = Users.Id
            where GroupUser.GroupId = ${groupId}`
    console.log(sql);
    let users = await db.promise().query(sql);
    let value = {
        messages: messages[0],
        users: users[0]
    };
    res.status(200).send(value);
}