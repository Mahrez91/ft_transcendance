import { Link } from 'react-router-dom';
import { useContext, useState } from 'react';

import '../../style/chan.css'

import { AuthContext } from '../../context/auth.context';

import axios from 'axios';

import i_user from '../../interface/user.interface';

import { ReactComponent as ProfilePage } from '../../icon/profile-user-svgrepo-com.svg';
import { ReactComponent as AddFriend } from '../../icon/add-friend-svgrepo-com.svg';
import { ReactComponent as RemoveFriend } from '../../icon/delete-unfriend-svgrepo-com.svg';
import { ReactComponent as Heart } from '../../icon/heart-friend.svg';

import UserStats from '../page/user/userstats.component';
import { asyncReqUpdateUser } from '../../request/user.update.request';
import i_msg from '../../interface/msg.interface';

function ProfileModal(props: { user: i_user, onClose: () => void })
{
	const { user, setUser } = useContext(AuthContext);
	const [friend, setFriend] = useState((user && user.friendsId ? user.friendsId.includes(props.user.id!) : false));
	const [msg, setMsg] = useState("");

	const link_to_profile = "/user/" + props.user.name;

	function updateFriend(state: boolean)
	{
		if (!user || !user.id)
			return;
		asyncReqUpdateUser("http://localhost:3000/user/" + user.id, 'put',
			{ updateUserDto: { friendId: props.user.id! } }).then((res) =>
			{
				setFriend(state);
				setUser(res);
				console.log(res);
			}).catch(err =>
			{
				console.log(err);
			});
	}

	function msgUpdateHandle(event: React.KeyboardEvent<HTMLInputElement>)
	{
		setMsg(event.target.value);
	};

	function msgSendHandle(event: React.KeyboardEvent<HTMLInputElement>)
	{
		if (!props.user.id || !props.user.name || !user || !user.id || !user.name)
			return;
		if (event.key === 'Enter' && msg.length > 0)
		{
			event.preventDefault();
			const date = new Date();
			let s_msg: i_msg = {
				userId: user.id,
				username: user.name,
				msg: msg,
				sendAt: date
			}
			axios.post("http://localhost:3000/chan/msg/dm/" + props.user.id, s_msg).catch(err => console.log(err));
			setMsg("");
		}
	}

	return (
		<div className='modal--profile'>
			<div className='modal--profile--top--icon'>
				<Link to={link_to_profile}>
					<ProfilePage />
				</Link>
				{user && user.name !== props.user.name &&
					<div>
						{!friend ? (
							<button onClick={() => updateFriend(true)}>
								<AddFriend />
							</button>
						) : (
							<button onClick={() => updateFriend(false)}>
								<RemoveFriend />
							</button>
						)}
					</div>
				}
			</div>
			<div>
				<img className='img' style={{ marginTop: "-3rem", height: "30vh", width: "30vh" }} src={props.user.profilePicPath} alt="profile" />
				{user && user.name !== props.user.name && friend
					&& <Heart className='heart' onClick={() => updateFriend(false)} />}
			</div>
			<div>
				<h2 className='truncate' style={{ paddingTop: "1rem", paddingBottom: "1rem" }}>{props.user.name}</h2>
			</div>
			<div className='card card--alt' style={{ height: "22vh" }}>
				<UserStats user={props.user} />
			</div>
			<div>
				{user && user.name !== props.user.name &&
					<input className='card card--input' type='type' placeholder=' 💬'
						onChange={msgUpdateHandle} value={msg} onKeyDown={msgSendHandle} />}
			</div>
		</div >
	);
}

export default ProfileModal;