const nodemailer = require('nodemailer')

exports.autoMail = async (to, subject, html) => {
  //Nodemailer TRANSPORTER
  // console.log(text,html)
  const transporter = nodemailer.createTransport({
    host: process.env.EHOST,
    service: "gmail",
    port: 587,
    secure: true,
    auth: {
      user: 'eventplus2023@gmail.com',
      pass: 'vxqbtrgrhuvuilaj'
      // user: process.env.EMAIL,
      // pass: process.env.EPASS
    }
  })
  //Nodemailer OPTIONS
  
  var mailOptions = {
    from: '"Event PLus Team" <eventplus2023@gmail.com>',
    to: to,
    subject: subject,
    html: html
};
  
  
  //Sending EMAIL
  await transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(`Cannot send email >>> ${err.message}`);
      
    } else {
      console.log(`Email sent successfully: ${info.response}`);
    }
  })
}

exports.generateSlots=async()=>{
 
    
  
      
  let arr = [];
  let todayDate = new Date();
  
  for (let i = 9; i < 17; i++) {
    todayDate.setHours(i);
    for (let j = 0; j < 2; j++) {
      let f = 30 * j;
      todayDate.setMinutes(f);
  
      let timeString = todayDate.toLocaleTimeString([], { hour12: true, hour: '2-digit', minute: '2-digit' });
      arr.push(timeString);
    }
  }
  
  console.log(arr);
  return arr;
  
 
}