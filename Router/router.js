const express = require('express');
const router = express.Router();
const loginUser = require('../Controller/Auth/Login');
const register = require('../Controller/Auth/Register');
const middelware = require('../Middelware/TokenMidelware');
const addbid = require('../Controller/AllPostApi/AddBid');
const city = require('../Controller/AllGetAPi/City');
const cat = require('../Controller/AllGetAPi/Category');
const bids = require('../Controller/AllGetAPi/UsersBid');
const detail = require('../Controller/AllGetAPi/Detail');
const companybids = require('../Controller/AllGetAPi/CompanyBid');
const bid = require('../Controller/AllPostApi/SellerBid');
const price = require('../Controller/AllGetAPi/price');
const status = require('../Controller/AllGetAPi/UpdateStatus')
const canceledbid = require('../Controller/AllGetAPi/CanceledBid');
const filter = require('../Controller/AllGetAPi/CategryFilter');
const payment = require('../Payement/Payement');
const sucess = require('../Payement/Success');
const completed = require('../Controller/AllGetAPi/CompledBids');
const code = require('../Controller/AllPostApi/Code');
const review = require('../Controller/AllPostApi/AddReview');
const edit = require('../Controller/AllPostApi/EditProfile');
const changepass = require('../Controller/AllPostApi/ChangePass');
const dashboard = require('../Controller/AllGetAPi/CompanyDashboard');
const withdrawl = require('../Controller/AllPostApi/Withdrawl');
const userdashboard = require('../Controller/AllGetAPi/UserDashBoard');
const withdrawlhistory = require('../Controller/AllGetAPi/WithdrawlHistory');

// Khushbo Mam 
const payementhistory = require('../Controller/AllPostApi/PayementHistory');
const compnayinfo = require('../Controller/AllPostApi/CompanyInfo');



const compnaycancled = require('../Controller/AllGetAPi/CompanyCancledBid');
const compnaycompleted = require('../Controller/AllGetAPi/CompanyCompleted');











































router.post('/login', loginUser);
router.post('/register', register);
router.get('/city', city);
router.get('/category', cat);
router.get('/bids/:id', bids);
router.get('/detail/:id', detail);
router.get('/sellerbid/:id', companybids);
router.get('/lastprice/:id', price);
router.get('/status/:id/:status',status)
router.get('/canceledbid/:id',canceledbid)
router.get('/completed/:id',completed)

router.get('/filter', filter);
router.get('/dashboard/:id', dashboard);
router.get('/companycancledbid/:id', compnaycancled);
router.get('/companycomplted/:id', compnaycompleted);




router.post('/code', code);

router.post('/review', review);
router.post('/edit', edit);
router.post('/changepass', changepass);


// Khushbo Mam 
router.post('/paymenthistory', payementhistory);
router.post('/companyInfo', compnayinfo);










// Payement Gateway

router.get('/payement', payment);
router.get('/sucess', sucess);
router.get('/userdashboard/:id', userdashboard);
router.get('/withdrwalhistory/:id', withdrawlhistory);



router.post('/withdrawl', withdrawl);










router.post('/addbid', addbid);
router.post('/bid', bid);


















module.exports = router;
