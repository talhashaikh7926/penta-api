const Mailer = require('../../service/mailer');
//const Registration = require('../../models/registration.model');
const constants = require('../../helpers/constants');
var log4js = require('log4js');
const logger = log4js.getLogger('webApi');
module.exports = function(agenda) {
 /*   agenda.define('signup-emails', function(job, done) {
        try  {
            
        // if(job.attrs.data.type == constants.Partner)
        // {
        //   Mailer.emailSender('./helpers/templates/partner-request.html',job.attrs.data.email,'Thank you',{ userName: job.attrs.data.fullName });
        // }
        // else if(job.attrs.data.type == constants.Client){
        //   Mailer.emailSender('./helpers/templates/client-request.html',job.attrs.data.email,'Thank you',{ userName: job.attrs.data.fullName });
        // }
        Mailer.emailSender('./helpers/templates/request.html',job.attrs.data.email,'Thank you',{ userName: job.attrs.data.fullName });
        Registration.findOne({ officialEmail: job.attrs.data.email }, (err, registration) => {
            if(err){
                logger.error(new CustomError('Error occured while fetching registration request for sending email \r\n' +err )); 
            }
            if(registration){
                registration.emailSent = true;
                registration.save((err,result) => {
                    if(err){
                        logger.error(new CustomError('Error occured while updating registration request after successfully sent an email \r\n' +err )); 
                    } 
                    done();                   
                });
            }
        });
    }
    catch(error)  {
    console.log(error);
    logger.error(error);
    }
    });

*/


    agenda.define('forget-password-emails', function(job, done) {

        var replacement = {
            tokenForReset: process.env.JWT_AUDIENCE+"/recover-account/"+job.attrs.data.token,
          }
        Mailer.emailSender('./helpers/templates/password-recovery.html', job.attrs.data.email, 'Recover your account', replacement);
        done();
    });


    agenda.define('test-email',function(job,done)
    {
      from = process.env.EMAIL;
      Mailer.emailSender('./helpers/templates/testing-email.html',job.attrs.data.email, from ,'Testing Email',{ userName: job.attrs.data.fullName }); 
      done();
    });

    agenda.define('send-mail',function(job,done)
    {
      from = process.env.EMAIL;
      Mailer.emailSender('./helpers/templates/send-mail.html',job.attrs.data.email,from ,job.attrs.data.Subject,{ subject: job.attrs.data.Subject,
        message: job.attrs.data.Message }); 
      done();
    });

    agenda.define('pass-change',function(job,done)
    {
      from = process.env.EMAIL;
      Mailer.emailSender('./helpers/templates/change-password.html',job.attrs.data.email,from ,'Change Password',{ userName: job.attrs.data.fullName }); 
      done();
    });

    
    agenda.define('new-user',function(job,done)
    {
      from = process.env.EMAIL;
      Mailer.emailSender('./helpers/templates/user-email.html',job.attrs.data.email,from ,'User Created',{
        fullName: job.attrs.data.fullName,
        password : job.attrs.data.password,
        role :  job.attrs.data.role,
        email :job.attrs.data.email,
      });
        
      done();
    });


    agenda.define('lead-email',function(job,done)
    {
      
      Mailer.emailSender('./helpers/templates/lead-email.html',job.attrs.data.email,job.attrs.data.fromEmail , ' QUOTATION FOR '+ job.attrs.data.contentWeight + ' KG ; '+ job.attrs.data.origin +' - '+ job.attrs.data.destination,
       { quotation: job.attrs.data.quotation,
         contentDescription: job.attrs.data.contentDescription ,
         clearanceCharges: job.attrs.data.clearanceCharges ,
         clearanceInstructions: job.attrs.data.clearanceInstructions ,
         fullname : job.attrs.data.fullName ,
         contentWeight :job.attrs.data.contentWeight,
         origin :job.attrs.data.origin,
         destination : job.attrs.data.destination,
         clearanceInstructionsText :  job.attrs.data.clearanceInstructionsText,
         emailText :  job.attrs.data.emailText,
         currencyText : job.attrs.data.currencyText


       }); 
      done();
    });



    





    


    

    

   

  


};


