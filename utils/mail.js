const nodemailer=require('nodemailer')

module.exports=async(email,subject,html)=>{
	try{
		const transporter = nodemailer.createTransport({
      	service:'gmail',
      	auth: {
          		user: 'contact.astro.test@gmail.com',
          		pass: 'lpanrzysxnmdzqwz'
     	 	},
		});
		//const passs=`${email}`
		//console.log(passs)
		await transporter.sendMail({
		from:'contact.astro.test@gmail.com',
		to:email,
		subject:subject,
		html:html
		});
		console.log('Email Send Successfully')
	}
	catch(err){
	console.log(err)
	}
}