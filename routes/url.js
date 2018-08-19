let express = require('express');
let router = express.Router();
let models = require('../models')
let app = require('../app.js')

router.get('/is_exists', function(req, res, next) {
	if(req.query.custom){
		models.Url.find({where: {custom: req.query.custom}})
		.then((result)=>{
			app.logger.info(`Existence of the ${req.query.custom}: ${!!result}`)
			if(!result){
				res.json({
					isExists: false,
				})
			} else {
				res.json({
					isExists: true,
				})
			}
		})
		.catch(reason => {
			app.logger.fatal(reason.stack)
		})
	}
});

const generateRandString = () => {
	return Math.random().toString(36).substring(3);	
}

router.post('/shorten_url', function(req, res, next){
	if(req.body.custom && /^[a-z0-9_-]+$/i.test(req.body.custom)){
		models.Url.findAll({where: {custom: req.body.custom}})
		.then(result =>{
			if(result.length == 0){
				models.Url.create({custom: req.body.custom, original: req.body.original})
				.then(result => {
					const message = `Shortened URL ${req.host}/${req.body.custom} created`;
					app.logger.info(message);
					res.json({
						createdUrl: `${req.host}/${req.body.custom}`,
						message: message,
						status: 'success'
					})
				})
			} else {
				const message = `Shortened URL ${req.host}/${req.body.custom} is already exists`;
				app.logger.info(message);
				res.json({
					createdUrl: null,
					message: message,
					status: 'error'
				}) 
			}
		})
		.catch(reason => {
			app.logger.fatal(reason.stack)
		})
	} else if(req.body.custom && !/^[a-z0-9_-]+$/i.test(req.body.custom)) {
		const message = `Supplied shortened URL ${req.body.custom} is invalid`;
		app.logger.info(message);
		res.json({
			createdUrl: null,
			message: message,
			status: 'error'	
		}) 
	} else {
		const randstring = generateRandString()
		models.Url.findAll({where: {custom: randstring}})
		.then(result =>{
			if(result.length == 0){
				models.Url.create({custom: randstring, original: req.body.original})
				.then(result => {
					const message = `Shortened URL ${req.host}/${randstring} created`;
					app.logger.info(message);
					res.json({
						createdUrl: `${req.host}/${randstring}`,
						message: message,
						status: 'success'
					});
				})
				.catch(reason => {
					const message = `Cannot create a shortened URL`;
					app.logger.info(message);
					res.json({
						message: message,
						status: 'error'
					});
					app.logger.fatal(reason.stack)
				});
				
			}
		})
		.catch(reason => {
			app.logger.fatal(reason.stack)
		})
	}
})

module.exports = router;
