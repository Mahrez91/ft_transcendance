import { useState } from "react";

import i_user from "../../../interface/user.interface";
import i_chan from "../../../interface/chan.interface";

import { ReactComponent as Option } from '../../../icon/single-select-svgrepo-com.svg'

import Backdrop from "../../modal/backdrop";
import OptionModal from "../../modal/option.modal";
import PickUserModal from "../../modal/pick.user.modal";
import PickPwdModal from "../../modal/pick.pwd.modal";

function userNotInChan(users_id: number[] | undefined, users: i_user[]): i_user[]
{
	if (!users_id)
		return ([]);

	let ret: i_user[] = [];

	for (let i = 0; i < users.length; i++)
	{
		if (users[i].id && !users_id.includes(users[i].id!))
			ret.push(users[i]);
	}

	return (ret);
}

function userNotAdmin(admins_id: number[] | undefined, users: i_user[]): i_user[]
{
	if (!admins_id)
		return ([]);

	let ret: i_user[] = [];

	for (let i = 0; i < users.length; i++)
		if (users[i].id && !admins_id.includes(users[i].id!))
			ret.push(users[i]);

	return (ret);

}

function Chat(props: { chan: i_chan, all_users: i_user[], users: i_user[], user: i_user, is_admin: boolean, is_owner: boolean })
{
	const [showOption, setShowOption] = useState(false);
	const [showAdd, setShowAdd] = useState(false);
	const [showChallenge, setShowChallenge] = useState(false);
	const [showMute, setShowMute] = useState(false);
	const [showAdminAdd, setShowAdminAdd] = useState(false);
	const [showAdminBan, setShowAdminBan] = useState(false);
	const [showAdminMute, setShowAdminMute] = useState(false);
	const [showOwnerPwd, setShowOwnerPwd] = useState(false);

	function resetAllStateHandle(): void
	{
		setShowOption(false);
		setShowAdd(false);
		setShowChallenge(false);
		setShowMute(false);
		setShowAdminAdd(false);
		setShowAdminBan(false);
		setShowAdminMute(false);
		setShowOwnerPwd(false);
	}

	return (
		<div>
			<div className='card card--alt card--chat' >
				<div className='card chan--title'>
					<div className='truncate'>- {props.chan.name} -</div>
					<button onClick={() => { setShowOption(true) }}>
						<Option />
					</button>
				</div>
				<input className='card--input input--chat' type='text' placeholder=' 💬' />
			</div>

			{(showOption || showAdd || showChallenge || showMute || showAdminAdd || showAdminBan || showAdminMute || showOwnerPwd)
				&& <Backdrop onClick={resetAllStateHandle} />}
			{showOption && <OptionModal
				user={props.user}
				chan={props.chan}
				is_admin={props.is_admin}
				is_owner={props.is_owner}
				options={
					{
						setShowAdd,
						setShowChallenge,
						setShowMute,
						setShowAdminAdd,
						setShowAdminBan,
						setShowAdminMute,
						setShowOwnerPwd,
					}}
				onClose={() => { setShowOption(false) }}
			/>}
			{showAdd && <PickUserModal users={userNotInChan(props.chan.usersId, props.all_users)} text='add'
				goBack={() => { setShowAdd(false); setShowOption(true); }} onClose={() => { setShowAdd(false); setShowOption(false); }} />}
			{showChallenge && <PickUserModal users={props.users} text='challenge'
				goBack={() => { setShowChallenge(false); setShowOption(true); }} onClose={() => { setShowChallenge(false); setShowOption(false); }} />}
			{showMute && <PickUserModal users={props.users} text='mute'
				goBack={() => { setShowMute(false); setShowOption(true); }} onClose={() => { setShowMute(false); setShowOption(false); }} />}
			{props.is_admin && showAdminAdd && <PickUserModal users={userNotAdmin(props.chan.adminsId, props.users)} text='admin add'
				goBack={() => { setShowAdminAdd(false); setShowOption(true); }} onClose={() => { setShowAdminAdd(false); setShowOption(false); }} />}
			{props.is_admin && showAdminBan && <PickUserModal users={userNotAdmin(props.chan.adminsId, props.users)} text='admin ban'
				goBack={() => { setShowAdminBan(false); setShowOption(true); }} onClose={() => { setShowAdminBan(false); setShowOption(false); }} />}
			{props.is_admin && showAdminMute && <PickUserModal users={userNotAdmin(props.chan.adminsId, props.users)} text='admin mute'
				goBack={() => { setShowAdminMute(false); setShowOption(true); }} onClose={() => { setShowAdminMute(false); setShowOption(false); }} />}
			{props.is_owner && showOwnerPwd && <PickPwdModal
				goBack={() => { setShowOwnerPwd(false); setShowOption(true); }} onClose={() => { setShowOwnerPwd(false); setShowOption(false); }} />}
		</div>
	);
}

export default Chat;
