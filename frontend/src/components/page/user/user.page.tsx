import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';

import '../../../style/chan.css';
import '../../../style/user.css';

import i_user from '../../../interface/user.interface';

import { AuthContext } from '../../../context/auth.context';

import { ReactComponent as Friend } from '../../../icon/friend-svgrepo-com.svg'
import { ReactComponent as Edit } from '../../../icon/write-pencil-svgrepo-com.svg'

import { useReqUsers } from '../../../request/user.request';
import UserStats from './userstats.component';
import MatchHistory from './matchHistory.component';
import UserListById from './UserListById.component';
import NoMatch from '../nomatch.page';
import Loading from '../../request_answer_component/loading.component';
import Error from '../../request_answer_component/error.component';
import axios from 'axios';

function isUserInDb(username: string, users: i_user[]): i_user | null
{
	for (let i = 0; i < users.length; i++)
		if (users[i].name === username)
			return (users[i]);
	return (null);
}

function uploadFile(user_id: number | undefined, image: File | null)
{
	if (!user_id || !image)
		return;

	const formData = new FormData();
	formData.append("pp", image, image.name);

	console.log("formData: ", formData);

	axios.put("http://localhost:3000/user/pp/" + user_id, formData).then(
		(res) => { console.log(res); },
		(error) => { console.log(error); }
	);
};


function UserPage()
{
	const { reqUsers, loading, error } = useReqUsers();
	const { user } = useContext(AuthContext);
	const [image, setImage] = useState<any | null>(null);
	const p_username = useParams().username;
	let userToLoad: i_user | null = null;

	if (loading)
		return (<div className='back'><Loading /></div>);
	else if (error)
		return (<div className='back'><Error msg={error.message} /></div>);
	else if (p_username)
		userToLoad = isUserInDb(p_username, reqUsers);
	else
	{
		if (!user || !user.id)
			return (<NoMatch />);
		for (let i = 0; i < reqUsers.length; i++)
			if (reqUsers[i].id === user.id)
				userToLoad = reqUsers[i];
	}
	if (!userToLoad)
		return (<NoMatch />);

	console.log("image: ", image);

	return (
		<div className='user--page' >
			<div style={{ width: "34vw", height: "100%", display: "flex", flexDirection: "column", margin: "0 1rem 0 0" }}>
				<div className='card card--border user--page--pic--title' style={{ marginBottom: "2rem" }} >
					<div style={{ margin: "0.5rem 0 0.5rem 0" }}>
						<img className='img' style={{ height: "23vw", width: "23vw" }}
							src={(image ? URL.createObjectURL(image) : userToLoad.profilePicPath)} alt="profile" />
						{(!p_username || p_username === userToLoad.name)
							&& <div className='input--file'>
								<input type='file' style={{ zIndex: "99" }} onChange={(e) =>
								{
									uploadFile((user ? user.id : undefined), (e.target.files ? e.target.files[0] : null));
									setImage((e.target.files ? e.target.files[0] : null));
								}} />
								<Edit className='input--file--icon' />
							</div>
						}
					</div>
					<div className='user--page-title truncate'>{userToLoad.name}</div>
				</div>
				<div className='card card--alt' style={{ height: "100%" }}>
					<UserStats user={userToLoad} />
				</div>
			</div>
			<div className='card card--alt' style={{ width: "41vw", height: "100%", margin: "0 2rem 0 -0.3rem", overflowY: "scroll" }}>
				<MatchHistory username={userToLoad.name} users={reqUsers} />
			</div>
			<div style={{ width: "25vw", margin: "-1rem 0 -2rem 0", padding: "0.3rem 0 2rem 0", overflowX: "hidden" }}>
				<div style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "0.7rem 1rem 0 0" }}>
					<Friend style={{ width: "3rem", height: "3rem" }} />
					<div style={{ margin: "0 1rem 0 1rem" }} />
					<span style={{ color: "#000", fontFamily: "var(--alt-font)", fontSize: "2rem" }}>
						(<span style={{ color: "var(--color-number)" }}>{(userToLoad.friendsId ? userToLoad.friendsId.length : 0)}</span>)
					</span>
				</div>
				<UserListById friendsId={userToLoad.friendsId} reqUsers={reqUsers} />
			</div>
		</div >
	);
}

export default UserPage;
