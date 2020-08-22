const express = require('express');
const debug = require('debug')('app:appRoute');
const { MongoClient, ObjectID } = require('mongodb');
const MONGO = require('../../public/mongoConstants');

const appRoute = express.Router();

function router(nav) {
	appRoute.route('/').get((req, res) => {
		res.send('IT WORKS');
	});

	appRoute
		.route('/cart')
		.get((req, res) => {
			let client = null;
			let finalPrice = 0;

			(async function mongo() {
				try {
					client = await MongoClient.connect(MONGO.url);
					const db = client.db(MONGO.dbName);
					const collection = db.collection(MONGO.usersCollection);

					let { cart } = await collection.findOne({ username: 'gerard' });

					cart.forEach((item) => {
						const quantity = item.quantity;
						const totalPrice = item.price * quantity;
						item.totalPrice = totalPrice;
						finalPrice += totalPrice;
					});

					res.render('cart', {
						cart,
						finalPrice,
						nav,
						title: 'Shopping cart'
					});
				} catch (error) {
					debug(error.stack);
				} finally {
					client.close();
				}
			})();
		})
		.post((req, res) => {
			//const user = req.user
			const username = 'gerard';
			let client = null;
			let { _id } = req.body;
			(async function mongo() {
				try {
					client = await MongoClient.connect(MONGO.url);
					const db = client.db(MONGO.dbName);
					const collection = db.collection(MONGO.usersCollection);

					const { cart } = await collection.findOne({ username });

					await collection.update({ username }, { $pull: { cart: { _id } } });

					//delete item

					res.redirect('/user/cart');
				} catch (error) {
					debug(error.stack);
				} finally {
					client.close();
				}
			})();
		});

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
