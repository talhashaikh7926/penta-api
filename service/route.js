const express = require('express');

const registrationController = require('./../controllers/registration.controller');
const loginController = require('./../controllers/login.controller');
const roleController =  require('./../controllers/role.controller');
const developer = require('./../controllers/developer.controller');
const consigneeController = require('./../controllers/consignee.controller');
const manifestController = require('./../controllers/manifest.controller');
const uploadfileController = require('./../controllers/uploadfile.controller');
const orderController = require('./../controllers/order.controller');
const userController =  require('./../controllers/user.controller');
const rateController = require('./../controllers/rate.controller');
const categoryController = require('./../controllers/category.controller');
const shipperController = require('./../controllers/shipper.controller');
const reportingController = require('./../controllers/reporting.controller');
const countryController = require('./../controllers/country.controller');

const router = express.Router();


// Registration Controller  routes
router.post('/api/register' , registrationController.register);
router.post('/api/verifyToken', registrationController.verifyToken);
router.get('/api/checkAPI' ,registrationController.checkapi);
router.post('/api/login' , loginController.login);

router.post('/api/roles',    roleController.addRole);
router.get('/api/roles',     roleController.getAllRoles);
router.put('/api/roles/:id', roleController.updateRoleByID);
router.delete('/api/roles/:id' ,  roleController.deleteRoleByID);
router.get('/api/system-permissions',   roleController.getSystemPermissions);
router.get('/api/roles/permissions/:id', roleController.getPermissionsByRoleID);
router.get('/api/roles/:id', roleController.getRoleByRoleID);


router.post('/api/developer/claim', developer.addClaims);
router.delete('/api/developer/claim', developer.deleteClaims);
router.post('/api/developer/role' , developer.addRole);


// Consignee Controller routes
router.get('/api/consignee', consigneeController.getAllConsignee);
router.get('/api/consignee/:id', consigneeController.getConsigneeByConsigneeID);    
router.post('/api/consignee', consigneeController.addConsignee);
router.delete('/api/consignee/:id', consigneeController.deleteConsigneeID);
router.put('/api/consignee/:id', consigneeController.updateConsigneeByID);
router.get('/api/consignee/getconsignee/:name', consigneeController.getConsigneeByName);
router.post('/api/consignee/assignSaleperson/:id' ,consigneeController.assignSaleperson);
router.put('/api/consignee/status/:id', consigneeController.updateStatusByConsigneeID);


// Manifest controllers routes
router.post('/api/manifest', manifestController.addManifest);
router.get('/api/manifest', manifestController.getAllManifest);
router.get('/api/manifest/:id', manifestController.getManifestByID);
router.get('/api/manifestlist', manifestController.getAllManifestFile);
router.put('/api/manifestlist/:id', manifestController.updateManifestFile);
router.get('/api/manifestlist/:id', manifestController.getManifestFileByID);


//Upload Shipper/Consignee routes
router.post('/api/uploadss', uploadfileController.addFiles);


// order controllers routes
router.post('/api/order' ,orderController.addOrder);
//router.post('/api/order/:id' ,orderController.reminderMail);
router.get('/api/order' ,orderController.getAllOrder);
router.delete('/api/order/:id' ,orderController.deleteOrderByID);
router.get('/api/order/:id', orderController.getOrderByOrderID);
router.put('/api/order/:id', orderController.updateOrder);

router.post('/api/order/pickup/:id' ,orderController.addPickup);
router.post('/api/order/status/:id' ,orderController.orderStatus);
router.post('/api/order/assignCounterpart/:id' ,orderController.assignCounterpart);
router.post('/api/order/arrangePickup' ,orderController.arrangePickup);


// user controllers routes assignSaleperson
router.get('/api/user/counterpart/:city' ,userController.getAllCounterpart);
router.get('/api/user/saleperson' ,userController.getAllSalesUser);
router.get('/api/user' ,userController.getAllUsers);
router.get('/api/user/:id' ,userController.getUsersByUserID);
router.put('/api/user/:id', userController.updateUserByID);
router.post('/api/user', userController.createUser);
router.delete('/api/user/:id' ,userController.deleteUserByID);
router.post('/api/user/change-password', userController.updatePassword);



// rate controllers routes
router.post('/api/rate/update' ,rateController.addPercent);

router.post('/api/rate' ,rateController.addRate);
router.get('/api/rate' ,rateController.getAllRate);
router.delete('/api/rate/:id' ,rateController.deleteRateByID);
router.get('/api/rate/:id', rateController.getRateByRateID);
router.put('/api/rate/:id', rateController.updateRate);
router.get('/api/rate/zone/:id', rateController.getRateByID);
router.get('/api/rate/weight/:country', rateController.getAllWeightByCountry);
router.get('/api/rate/r/:type', rateController.getRateByType);
router.get('/api/rate/t/:weight', rateController.getTypeByWeight);





//router.get('/api/generate' ,orderController.generateAirwaybillNumber);

// Country Controllers routes
router.get('/api/country' ,countryController.getAllCountry);
router.get('/api/zone' ,countryController.getAllZones);
router.get('/api/zone/country/:c' ,countryController.getAllcountryByZone);



// Category controllers routes
router.get('/api/category' ,categoryController.getAllCategory);
router.get('/api/category/:id' ,categoryController.getCategoryByID);
router.put('/api/category/:id', categoryController.updateCategoryByID);
router.post('/api/category', categoryController.createCategory);
router.delete('/api/category/:id' ,categoryController.deleteCategoryByID);


// Shipper controllers routes
router.get('/api/shipper' ,shipperController.getAllShipper);
router.get('/api/shipper/:id' ,shipperController.getShipperByID);
router.put('/api/shipper/:id', shipperController.updateShipperByID);
router.post('/api/shipper', shipperController.createShipper);
router.delete('/api/shipper/:id' ,shipperController.deleteShipperByID);
router.get('/api/shipper/getshipper/:name', shipperController.getShipperByName);



// Reporting controllers routes
router.get('/api/salepersonreport' ,reportingController.getAllSale);
router.get('/api/shipperreport' ,reportingController.getAllShipperSale);
router.get('/api/consigneereport' ,reportingController.getAllConsigneeSale);

module.exports = router;