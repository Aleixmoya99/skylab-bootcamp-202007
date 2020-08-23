const express = require('express');
// Encara que no cridem passport el requerim perquè ens passi user
require('passport');

const recipesRouter = express.Router();
const debug = require('debug')('app:recipesRoutes');

const { MongoClient, ObjectID } = require('mongodb');

function router(nav) {
	recipesRouter
		.route('/')
		.get((req, res) => {
			// mongodb
			const url = 'mongodb://localhost:27017';
			const dbName = 'organicMarket';
			const collectionName = 'recipes';
			let client;
			if (req.user && (req.user.admin || !req.user.admin)) {
				const admin = req.user.admin || 'off';

				(async function query() {
					try {
						client = await MongoClient.connect(url);

						const db = client.db(dbName);

						const collection = await db.collection(collectionName);

						const recipe = await collection.find().toArray();

						res.render('list', {
							nav,
							title: 'Products List',
							recipes: recipe,
							admin
						});
					} catch (error) {
						debug(error.stack);
					}
					client.close();
				})();
			} else {
				res.render('permissions', { nav });
			}
		})
		.post((req, res) => {
			const { product } = req.body;
			debug(req.body);
			const url = 'mongodb://localhost:27017';
			const dbName = 'organicMarket';
			const collectionName = 'recipes';
			let client;

			(async function deleteHeroFromList() {
				try {
					client = await MongoClient.connect(url);
					debug('Connection to db established...');
					const db = client.db(dbName);
					const collection = db.collection(collectionName);
					const { title } = req.body;
					const filter = { title };
					await collection.deleteOne(filter);
					res.redirect('/list');
				} catch (error) {
					debug(error.stack);
				}
			})();
		});
	recipesRouter.route('/addcart').post((req, res) => {
		const { product } = req.body;
		const { user } = req.user;

		const url = 'mongodb://localhost:27017';
		const dbName = 'organicMarket';
		const collectionName = 'users';
		let client;

		(async function addProductToCart() {
			try {
				client = await MongoClient.connect(url);

				const db = client.db(dbName);

				const collection = db.collection(collectionName);

				const a = await collection.updateOne(
					{ user },
					{ $push: { cart: product } }
				);
				console.log(a.ops);
			} catch (error) {
				debug(error.stack);
			}
			client.close();

			res.redirect('/list');
		})();
	});

	recipesRouter.route('/create').post((req, res) => {
		const url = 'mongodb://localhost:27017';
		const dbName = 'organicMarket';
		let client;
		(async function query() {
			try {
				const newProduct = {
					title: req.body.name,
					type: null,
					description: null,
					filename: null,
					height: null,
					width: null,
					price: req.body.item_price,
					rating: null
				};
				client = await MongoClient.connect(url);
				debug('Connect sucesfully');
				const db = client.db(dbName);

				const response = await db.collection('recipes').insertOne(newProduct);
				res.json(response);
			} catch (error) {
				debug(error);
			}
			client.close();
		})();
		res.redirect('/list');
	});
	recipesRouter
		.route('/:title')
		.get((req, res) => {
			const url = 'mongodb://localhost:27017';
			const dbName = 'organicMarket';
			let client;
			const { title } = req.params;
			if (req.user && (req.user.admin || !req.user.admin)) {
				const admin = req.user.admin || 'off';

				(async function query() {
					try {
						client = await MongoClient.connect(url);

						const db = client.db(dbName);

						const collection = await db.collection('recipes');
						const filterRecipe = await collection.findOne({ title });
						debug(filterRecipe);

						res.render('detail', {
							nav,
							title: 'Product details!',
							recipe: filterRecipe,
							admin
						});
					} catch (error) {
						debug(error);
					}
					client.close();
				})();
			} else {
				res.render('permissions', { nav });
			}
		})
		.post((req, res) => {
			const url = 'mongodb://localhost:27017';
			const dbName = 'organicMarket';
			const collectionName = 'recipes';

			let client;

			(async function recipeForm() {
				try {
					/* 					res.redirect('/list/:title/modify');
					 */

					client = await MongoClient.connect(url);

					const db = client.db(dbName);
					const collection = await db.collection(collectionName);
					const modifyRecipe = await collection.updateOne();
				} catch (error) {
					debug(error);
				}
				client.close();
			})();
		});
	/* 	recipesRouter.route('/:title/modify').get((req, res) => {
		const url = 'mongodb://localhost:27017';
		const dbName = 'organicMarket';
		let client;
		const { title } = req.params;
		console.log('REQ.PARAMS ======>', req.params);
		if (req.user && (req.user.admin || !req.user.admin)) {
			const admin = req.user.admin || 'off';
			(async function query() {
				try {
					client = await MongoClient.connect(url);

					const db = client.db(dbName);

					const collection = await db.collection('recipes');
					const filterRecipe = await collection.findOne({ title });
					debug(filterRecipe);
					res.render('detailToModify', {
						nav,
						title: 'Modify Product',
						recipe: filterRecipe,
						admin
					});
				} catch (error) {
					debug(error);
				}
			})();
		} else {
			res.render('permissions', { nav });
		}
	}); */

	return recipesRouter;
}

module.exports = router;
