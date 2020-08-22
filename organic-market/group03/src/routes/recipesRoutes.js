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
		console.log('REQ.BODY =>   ', req.body);
		console.log('REQ.USER =>   ', req.user);

		const url = 'mongodb://localhost:27017';
		const dbName = 'organicMarket';
		let collectionName = 'recipes';
		let client;

		(async function addCart() {
			try {
				// Buscamos la id del producto a añadir
				client = await MongoClient.connect(url);

				const db = client.db(dbName);

				const idProduct = await db.collection(collectionName).findOne({
					_id: new ObjectID(product)
				});
				console.log('============>', product);

				console.log('********', idProduct);

				// Buscamos el user al que añadir el producto
				collectionName = 'users';
				const { _id } = req.user;
				console.log('USERRRRR =======>', product);

				console.log('idProduct => ', idProduct);
				console.log('_id => ', _id);
				// Añadimos a cart lo que tenia más el producto que queremos añadir

				let { cart } = req.user.cart;
				cart = { ...cart, idProduct };
				await db
					.collection(collectionName)
					.updateOne({ _id }, { $set: { cart } });

				debug(cart);
			} catch (error) {
				debug(error.stack);
			}
		})();
		console.log('REQ.USER ACTUALIZED =>   ', req.user);

		res.redirect('/list');
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
	recipesRouter.route('/:title').get((req, res) => {
		const url = 'mongodb://localhost:27017';
		const dbName = 'organicMarket';
		let client;
		const { title } = req.params;
		(async function query() {
			try {
				client = await MongoClient.connect(url);

				const db = client.db(dbName);

				const collection = await db.collection('recipes');
				const filterRecipe = await collection.findOne({ title });
				debug(filterRecipe);

				res.render('detail', {
					nav,
					title: 'Detail',

					recipe: filterRecipe
				});
			} catch (error) {
				debug(error);
			}
			client.close();
		})();
	});

	return recipesRouter;
}

module.exports = router;
