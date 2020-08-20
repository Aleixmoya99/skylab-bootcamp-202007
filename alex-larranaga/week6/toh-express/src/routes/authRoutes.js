const express = require('express');
const debug = require('debug')('app:authRoutes');
const { MongoClient } = require('mongodb');

// NOS INSTALAMOS PAQUETES PASSPORT, COOKIE-PARSER, Y EXPRESS-SESSION
const authRoutes = express.Router();

function router(nav) {
	authRoutes
		.route('/signin')
		.get((req, res) => {
			res.render('./auth/signin', { nav });
		})
		.post((req, res) => {
			const url = 'mongodb://localhost:27017';
			const dbName = 'heroes';
			let client = null;
			(async function query() {
				try {
					client = await MongoClient.connect(url);
					debug('Connection established...');
					const db = await client.db(dbName);
					const collection = await db.collection('users');
					const userExist = await collection.findOne(req.body);
					if (userExist) {
						res.redirect('/heroes');
					} else {
						res.send('user does not exist');
					}
				} catch (error) {
					debug(error.stack);
				}
			})();
		});
	authRoutes
		.route('/signof')
		.get((req, res) => {
			res.render('./auth/signof', { nav });
		})
		.post((req, res) => {
			res.send('POST SIGN OFF WORKS');
		});
	authRoutes
		.route('/signup')
		.get((req, res) => {
			res.render('./auth/signup', { nav });
		})
		.post((req, res) => {
			const url = 'mongodb://localhost:27017';
			const dbName = 'heroes';
			let client = null;
			(async function query() {
				try {
					client = await MongoClient.connect(url);
					debug('Connection established...');
					const db = await client.db(dbName);
					const collection = await db.collection('users');
					const userExist = await collection.findOne(req.body); //CHECK FOR BOTH USER & PASSWORD
					if (!userExist) {
						await collection.insertOne(req.body);
						res.redirect('/heroes');
					} else {
						res.json({ error: 'USER_EXIST', message: 'User already exist.' });
					}
				} catch (error) {
					debug(error.stack);
				}
			})();
		});
	authRoutes.route('/profile').get((req, res) => {
		res.send('PROFILE WORKS!');
	});
	return authRoutes;
}

module.exports = router;