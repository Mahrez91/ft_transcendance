import axios from "axios";
import { useContext } from "react";

import { AuthContext } from "../../context/auth.context";

import i_user from "../../interface/user.interface";

import { ReactComponent as Back } from '../../icon/left-svgrepo-com.svg'

function PickUser(props: {
	user: i_user,
	chanId: number,
	type: 'add' | 'challenge' | 'mute' | 'admin add' | 'admin ban' | 'admin mute',
	onClose: () => void
})
{
	if (!props.user.id)
		return (<div />);

	function request()
	{
		if (!props.user.id)
			return;
		switch (props.type)
		{
			case 'add':
				axios.post("http://localhost:3000/chan/add/" + props.chanId, { userId: props.user.id }).catch(err => console.log(err));
				break;
		}
		props.onClose();
	}

	return (
		<button className='pick--user' onClick={request}>
			<img className='img' style={{ height: "3rem", width: "3rem" }}
				src={props.user.profilePicPath} alt="profile" />
			<div className='truncate' style={{ marginTop: "0.8rem" }}>
				{props.user.name}
			</div>
		</button>
	);
}

function PickUsers(props: {
	users: i_user[],
	chanId: number,
	type: 'add' | 'challenge' | 'mute' | 'admin add' | 'admin ban' | 'admin mute',
	onClose: () => void
}): JSX.Element
{
	const { user } = useContext(AuthContext);

	if (!user)
		return (<div />);

	let ret: JSX.Element[] = [];

	for (let i = 0; i < props.users.length; i++)
		if (props.users[i].id !== user.id)
			ret.push(<PickUser key={i} user={props.users[i]} chanId={props.chanId} type={props.type} onClose={props.onClose} />);

	return (<div>{ret}</div>);
}

function PickUserModal(props: {
	users: i_user[],
	chanId: number | undefined,
	type: 'add' | 'challenge' | 'mute' | 'admin add' | 'admin ban' | 'admin mute',
	goBack: () => void
	onClose: () => void
})
{
	if (!props.chanId)
		return (<div />);

	return (
		<div onMouseLeave={props.onClose} className='modal--pick'>
			<div>
				<button style={{ position: "absolute", top: "1rem", left: "1rem" }} onClick={() => props.goBack()}><Back /></button>
				<span style={{ fontSize: "1.5rem", fontWeight: "bolder" }}>{props.type}</span>
			</div>
			<div style={{ marginTop: "1rem" }}>
				<PickUsers users={props.users} chanId={props.chanId} type={props.type} onClose={props.onClose} />
			</div>
		</div>
	);
}

export default PickUserModal;
