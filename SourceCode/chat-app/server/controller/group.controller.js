var db = require('../model/db.js');

let GroupName = "`Group`";


// get all group adminitrator
// send userId
module.exports.MyGroups = async function(req, res) {
    let userId = req.body;
    let sql = `Select * from ` + GroupName + ` Where OwnerId = ${userId.Id}`;
    let results = await db.promise().query(sql);
    res.send(results[0])
}

// get all group joined
// send userId
module.exports.Index = async function(req,res) {
    let userId = req.body.Id;
    let GROUP = '`Group`';
    let sql = ``;
    sql = ` Select Group.Id,Group.Name from GroupUser
            Inner join ${GROUP}  on GroupUser.GroupId = Group.Id
            where GroupUser.UserId = ${userId}`;
    console.log(sql)
    let results = await db.promise().query(sql);
    console.log(results[0])
    res.status(200).send(results[0]);
}

// create group
// send object group{db}
module.exports.AddOrUpdate = async function(req, res) {
    let group = req.body;
    if (group != undefined) {
        let sql = ``;
        if (group.Id == 0) {
            sql = `insert into ` +  GroupName  + `(Code, Name, OwnerId, CreateDate, Status) value('${ group.Code }', N'${ group.Name }', ${ group.OwnerId }, '${ new Date().toJSON().slice(0, 10) }', ${ true })`;
            var _ = await db.promise().query(sql)
            let result= await  AddUserToGroup("`Group`",group.OwnerId,res);
            res.send(result);
        } 
        else {
            sql = `update ` + `${ GroupName }` + `set Code = '${group.Code}', Name = N'${group.Name}', Status = ${ group.Status } where Id = ${ group.Id }`;
            db.query(sql, function(err, result) {
                res.status(200).send(true)
            })
        }
        
    } 
    else {
        res.status(401).send(false)
    }
}
async function  AddUserToGroup(tableName,UserId){
    let sql = `select * from `+tableName +` order by Id desc`;
    var result = await db.promise().query(sql);
    let arr = result[0];
    let groupId =  arr[0]["Id"];
    return await CreateUserInGroup(groupId,UserId)
}
async function CreateUserInGroup(groupId,userId){
    let sql =  `insert into groupuser (GroupId,UserId,Name,RoleId,CreateDate,Status) 
                        value(${groupId},${userId},'Administator',0,'${new Date().toJSON().slice(0, 10) }',${true})`;
    console.log(sql)
    var query = await db.promise().query(sql);
    let check = query[0]["affectedRows"];   
    return (check==1?true:false);
}
// delete
// send object {Id : ?}
module.exports.Delete = function(req, res) {
    let user = req.body;
    if (user != undefined) {
        let sql = ``;
        if (user.Id != 0) {
            sql = `delete from ` +`${ GroupName }` + `where Id = $ { user.Id }`;
            db.query(sql, function(err, result) {
                if (err) throw err;
                res.status(200).send(true);
            })
        }
    } else {
        res.status(200).send(false)
    }
}