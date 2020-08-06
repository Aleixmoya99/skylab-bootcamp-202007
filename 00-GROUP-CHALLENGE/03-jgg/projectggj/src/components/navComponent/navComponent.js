import React, { useState } from 'react';
import './navComponent.css';
import { globalSearch } from '../../actions/actions';

function NavComponent(props) {
	const [search, setSearch] = useState('');
	const [, , , , filter, name] = window.location.href.split('/');

	function handleChange(event, setValueCallback) {
		event.preventDefault();
		setValueCallback(event.target.value);
		globalSearch(event.target.value, filter, name);
	}

	return (
		<nav className="navbar navbar-expand-sm navbar-dark bg-dark">
			<a className="navbar-brand" href="/">
				<img
					src="https://i.pinimg.com/originals/a5/f9/a2/a5f9a2eb5c0bfb1f66988696e1f31334.png"
					width="30"
					alt="Dragon Ball One Start"
					loading="lazy"
				/>
			</a>
			<button
				className="navbar-toggler"
				type="button"
				data-toggle="collapse"
				data-target="#global-area__menu"
				aria-controls="global-area__menu"
				aria-expanded="false"
				aria-label="Toggle navigation"
			>
				<span className="navbar-toggler-icon"></span>
			</button>

			<div className="collapse navbar-collapse" id="global-area__menu">
				<ul className="navbar-nav mr-auto">
					<li className="nav-item">
						<a className="nav-link" href="/login">
							Login
						</a>
					</li>
					<li className="nav-item active">
						<a className="nav-link" href="/">
							Home <span className="sr-only">(current)</span>
						</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" href="/planet">
							Planets
						</a>
					</li>
					<li className="nav-item">
						<a className="nav-link" href="/saga">
							Sagas
						</a>
					</li>
					<li className="nav-item">
						<a className="nav-link nav__button--game" href="/game/Machine">
							Game
						</a>
					</li>
				</ul>
				<form className="form-inline my-2 my-md-0">
					<input
						value={search}
						onChange={(event) => handleChange(event, setSearch)}
						className="form-control"
						type="text"
						placeholder="Dragon search..."
					/>
				</form>
			</div>
		</nav>
	);
}

export default NavComponent;
