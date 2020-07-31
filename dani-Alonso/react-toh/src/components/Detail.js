import React from 'react';
import heroMock from '../Assets/heroMock';
class HeroDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			heroName: '',
			heroId: null
		};
		this.onFieldChange = this.onFieldChange.bind(this);
	}

	componentDidMount() {
		const pathHeroId = this.getIdFromPathName();
		const heroSearch = this.getHeroById(pathHeroId);
		this.setState({
			heroName: heroSearch.name,
			heroId: heroSearch.id
		});
	}

	getIdFromPathName() {
		const pathHeroId = this.props.match.params.heroId;
		return pathHeroId;
	}

	getHeroById(id) {
		return heroMock.find((hero) => hero.id === id);
	}

	onFieldChange(myEvent) {
		this.setState({
			[myEvent.target.name]: myEvent.target.value
		});
	}

	render() {
		return (
			<form>
				<h2>{this.state.heroName} details</h2>

				<p>id: {this.state.heroId}</p>
				<label htmlFor="heroName">
					name:
					<input
						name="heroName"
						placeholder="Hero name"
						value={this.state.heroName}
						onChange={this.onFieldChange}
					/>
				</label>
			</form>
		);
	}
}
export default HeroDetail;