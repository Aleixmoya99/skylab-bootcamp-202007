const express = require('express');
const debug = require('debug')('app:appRoute');
const { MongoClient, ObjectID } = require('mongodb');
const MONGO = require('../../public/mongoConstants');

const appRoute = express.Router();

function router(nav) {
	appRoute.route('/').get((req, res) => {
		res.send('IT WORKS');
	});

	appRoute.route('/cart').get((req, res) => {
		const cart = [
			{
				_id: '5f3fc61e9a183552ccc8772d',
				title: 'Brown eggs',
				rating: 4,
				price: 10
			},
			{
				_id: '5f3fc61e9a183552ccc87729',
				title: 'Sweet fresh stawberry',
				rating: 5,
				price: 250
			},
			{
				_id: '5f3fc61e9a183552ccc87727',
				title: 'Green smoothie',
				rating: 4.5,
				price: 1200
			}
		];

		res.render('cart', {
			cart,
			nav,
			title: 'Shopping cart'
		});

		// const { _id } = req.user;
		// (async function mongo() {
		// 	try {
		// 		const client = await MongoClient.connect(MONGO.url);
		// 		const db = client.db(MONGO.dbName);
		// 		const collection = await db.collection(MONGO.usersCollection);
		// 		client.close();
		// 		const user = collection.find({ _id: new ObjectID(_id) });

		// 	} catch (error) {
		// 		debug(error.stack);
		// 	}
		// })();
	});
	appRoute.route('/list')
		.get((req, res) => {
			//const { _id } = req.user;
			let client;
			(async function mongo() {
				try {
					client = MongoClient.connect(MONGO.url);
					debug('**********************')
					debug(client)
					debug('**********************')
					const db = client.db(MONGO.dbName);
					const collection = db.collection(MONGO.usersCollection);
					debug(collection)

					const items = collection.find();
					debug(items)
				} catch (error) {
					throw error;
				} finally {
					client.close()
				}
				res.render('list', { items });
			})();
		})
		.post((req, res) => {
			const item = req.body.product;
			const user = req.user;
			let client;
			(async function mongo() {
				try {
					client = MongoClient.connect(MONGO.url);
					const db = client.db(MONGO.dbName);
					const collection = db.collection(MONGO.usersCollection);
					debug(collection)

					const items = collection.cart;
					debug(items)
				} catch (error) {
					throw error;
				} finally {
					client.close()
				}
				res.render('list', { items });
			})();
		})

	appRoute
		.route('/:productId')
		.all((req, res, next) => {
			let client;
			const id = req.params.productId;
			(async function query() {
				try {
					client = await MongoClient.connect(MONGO.url);
					debug('Connection stablished...');
					const db = client.db(MONGO.dbName);
					const collection = db.collection(MONGO.itemsCollection);
					const item = await collection.find({ _id: new ObjectID(id) }).toArray;
					[res.item] = item;
				} catch (error) {
					debug(error.stack);
				}
				client.close();
			})();
			next();
		})
		.get((req, res) => {
			res.send('hi im details');
			// res.render('detail', { nav, item: res.item });
		});

	return appRoute;
}

module.exports = router;
