import i_user from "../../interface/user.interface";

import { ReactComponent as Back } from '../../icon/left-svgrepo-com.svg'
import { useContext } from "react";
import { AuthContext } from "../../context/auth.context";

function PickUser(props: { user: i_user })
{
	return (
		<div className='pick--user'>
			<img className='img' style={{ height: "3rem", width: "3rem" }}
				src={props.user.profilePicPath} alt="profile" />
			<div className='truncate' style={{ marginTop: "0.8rem" }}>
				{props.user.name}
			</div>
		</div >
	);
}

function PickUsers(props: { users: i_user[] }): JSX.Element
{
	const { user } = useContext(AuthContext);

	if (!user)
		return (<div />);

	let ret: JSX.Element[] = [];

	for (let i = 0; i < props.users.length; i++)
		if (props.users[i].id !== user.id)
			ret.push(<PickUser key={i} user={props.users[i]} />);

	return (<div>{ret}</div>);
}

function PickUserModal(props: {
	users: i_user[],
	text: string,
	goBack: () => void
	onClose: () => void
})
{
	return (
		<div onMouseLeave={props.onClose} className='modal--pick'>
			<div>
				<button style={{ position: "absolute", top: "1rem", left: "1rem" }} onClick={() => props.goBack()}><Back /></button>
				<span style={{ fontSize: "1.5rem", fontWeight: "bolder" }}>{props.text}</span>
			</div>
			<div style={{ marginTop: "1rem" }}>
				<PickUsers users={props.users} />
			</div>
		</div>
	);
}

export default PickUserModal;
