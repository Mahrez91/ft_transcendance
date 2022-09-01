import { useState } from "react";

import i_user from "../../../interface/user.interface";

import Backdrop from "../../modal/backdrop";
import ProfileModal from "../../modal/profile.modal";

function Users(props: { users: i_user[] })
{
	let ret: JSX.Element[] = [];

	for (let i = 0; i < props.users.length; i++)
	{ ret.push(<UserBtn key={i} user={props.users[i]} />); }

	return (
		<div>
			{ret}
		</div>
	);
}

function UserBtn(props: { user: i_user })
{
	const [showProfile, setShowProfile] = useState(false);

	function resetAllStateHandle(): void
	{
		setShowProfile(false);
	}

	return (
		<div>
			<button className='card card--border card--btn' style={{ marginLeft: "4px" }} onClick={() => { setShowProfile(true) }}>
				<img className='img img--card--user' src={props.user.profilePicPath} alt="profile" />
				<span className='span--card--user truncate'>{props.user.name}</span>
			</button>
			{showProfile && <Backdrop onClick={resetAllStateHandle} />}
			{showProfile && <ProfileModal user={props.user} onClose={() => { setShowProfile(false) }} />}
		</div >
	);
}

export { Users, UserBtn };
