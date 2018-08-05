var express = require('express');
var router = express.Router();
var models = require('../models')

/* GET  listing. */
router.get('/custom_url_exists', function(req, res, next) {
	if(req.query.custom){
		models.Url.findAll({where: {shortened: req.query.custom}}).then((result)=>{
			if(result.length == 0){
				res.json({
					isExists: true,
				})
			} else {
				res.json({
					isExists: false,
				})
			}
		})
	}
});

const generateRandString = () => {
	return Math.random().toString(36).substring(3);	
}

router.post('/shorten_url', function(req, res, next){
	if(req.body.custom){
		models.Url.findAll({where: {shortened: req.body.custom}}).then((result)=>{
			if(result.length == 0){
				models.Url.create({shortened: req.body.custom, original: req.body.url}).then((result) => {
					res.json({
						createdUrl: `${req.host}/${req.body.custom}`,
						message: `Shortened URL ${req.host}/${req.body.custom} created`,
						status: 'success'
					})
				})
			} else {
				res.json({
					createdUrl: null,
					message: `Shortened URL ${req.host}/${req.body.custom} is already exists`,
					status: 'error'
				}) 
			}
		})
	} else {
		const randstring = generateRandString()
		models.Url.findAll({where: {shortened: randstring}}).then(result =>{
			if(result.length == 0){
				models.Url.create({shortened: randstring, original: req.body.url});
				res.json({
					createdUrl: `${req.host}/${randstring}`,
					message: `Shortened URL ${req.host}/${randstring} created`
				});
			}
		})
	}
})


module.exports = router;
