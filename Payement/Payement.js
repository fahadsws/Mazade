require('dotenv').config();
var paypal = require('paypal-rest-sdk');
const pool = require('../DB/Database')

async function Payement(req,res){

   const {pay} = req.query
   const {by} = req.query
   const {final} = req.query


    paypal.configure({
        'mode': 'sandbox',
        'client_id': process.env.PAYEMENT_CLIENT_ID,
        'client_secret': process.env.PAYEMENT_CLIENT_SECRET
      });

    try{

        const amount = parseFloat(pay);
        if (isNaN(amount) || amount <= 0) {
            res.status(400).json({ message: "Invalid payment amount" });
            return;
        }

     // Payement 

     var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": `http://192.168.0.161:8000/api/sucess?pay=${amount.toFixed(2)}&by=${by}&final=${final}`,
            "cancel_url": "http://192.168.0.161:8000/api/cancled"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "item",
                    "sku": "item",
                    "price": `${amount.toFixed(2)}`,
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": `${amount.toFixed(2)}`
            },
            "description": "This is the payment description."
        }]
    };
    
    
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            console.log("Create Payment Response");
            // console.log(payment);
            res.redirect(payment.links[1].href)
        }
    });



    }catch(e){

        res.status(500).json({message : "Internal server error"})

    }

}

module.exports = Payement