import renderer from 'react-test-renderer';
import React from 'react';
import App from './App';

describe('App snapshot', () => {
	const tree = renderer.create(<App />);
	it('Should match', () => {
		expect(tree.toJSON()).toMatchSnapshot();
	});
});
