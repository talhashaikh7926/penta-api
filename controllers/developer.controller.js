var mongoose = require('mongoose');
var RoleClaim = require('./../models/roleClaim.model');
var Role = require('./../models/role.model');
var CustomError = require('./../models/customError.model');
exports.addClaims = async (req, res, next) => {
    await Role.findOne({ _id: req.body.roleId }, (err, role) => {
        if (err) {
            return next(new CustomError(err, 'RoleNotFound'));
        }
        if(role){

            var roleClaim = new RoleClaim();
            roleClaim.claimType = req.body.claimType;
            roleClaim.claimValue = req.body.claimValue;
            role.roleClaims.push(roleClaim);
            role.save(function (error, result) {
                if (error) {
                    return next(new CustomError(error, 'Failure'));
                }
                res.status(201).send({ result });
            });
        }
        else{
            return next(new CustomError(err, 'RoleNotFound'));
        }
    });

}
exports.deleteClaims = async (req, res, next) => {
    Role.findByIdAndUpdate(req.body.roleId,
        { $pull: { roleClaims: { 'claimValue': req.body.claimValue } } },
        { safe: true, upsert: true }, function (err, claim) {
            if (err) {
                return next(new CustomError(err, 'Failure'));
            }
            res.status(200).send({ claim });
        });
}
exports.addRole = async (req, res, next) => {
    var role = new Role({
        name: req.body.roleName,
        description: req.body.description,
        roleClaims: req.body.roleClaims
    });

   await role.save(function(err,result){
        if (err) {
            return next(new CustomError(err, 'Failure'));
        }
        res.status(201).send({result});
    });
}