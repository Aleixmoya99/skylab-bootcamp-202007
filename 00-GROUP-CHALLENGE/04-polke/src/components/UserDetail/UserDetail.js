import React, { useEffect, useState } from 'react';
import './UserDetail.css';
import '../../shared/generalStyles.css';
import useruserDetailStore from '../../stores/userDetailStore';
import userDetailStore from '../../stores/userDetailStore';
import { loadRepoList } from '../../actions/userDetailActions';
import RepoCard from '../RepoCard/RepoCard';
import UserInfo from './UserInfo/UserInfo';
import landingStore from '../../stores/landingStore';
import { FormControl, Button } from 'react-bootstrap';

function UserDetail() {
	const [repoList, setRepoList] = useState([]);
	const [userName, setUserName] = useState(null);
	const [isUserGitHub, setIsUserGitHub] = useState(false);

	useEffect(() => {
		userDetailStore.addChangeListener(onChange);
		setIsUserGitHub(landingStore.isUserGitHub());
		setUserName(landingStore.getGitHubUserName());
		if (userName) {
			loadRepoList(userName);
		}

		return () => userDetailStore.removeChangeListener(onChange);
	}, [repoList.length, userName]);

	function onChange() {
		setRepoList(userDetailStore.getRepoList());
	}

	const createRepoButton = <button className="create__button">New Repo</button>;

	const repoListLayout = (
		<div className="userdetail__container">
			<div className="topContent">
				<div className="userdetail__user-info">
					{userName && <UserInfo githubUserName={userName} />}
				</div>
				<div className="userdetail__repo-list">
					{repoList.map((repo) => {
						return <RepoCard repoInfoList={repo} />;
					})}
				</div>
			</div>
			<div className="userdetail__repo-creation">
				<div className="creation__left">
					{isUserGitHub ? createRepoButton : null}
				</div>
				<div className="creation__right"></div>
			</div>
		</div>
	);

	const searchBarLayout = (
		<div className="search__container">
			<p>
				Seems you're nog logged in with GitHub,
				<strong> but you can still search for any public repo</strong>
			</p>
			<FormControl
				type="text"
				placeholder="Repo URL..."
				className="mr-sm-2 search__input"
			/>
			<Button variant="outline-info" className="searchbar--button">
				Go
			</Button>
		</div>
	);

	return isUserGitHub ? repoListLayout : searchBarLayout;
}

export default UserDetail;
