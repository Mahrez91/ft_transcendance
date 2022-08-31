import { useEffect, useState } from "react";
import axios from "axios";
import { Socket } from "socket.io-client";

import i_user from "../../../interface/user.interface";
import i_chan from "../../../interface/chan.interface";
import i_msg from "../../../interface/msg.interface";

import { ReactComponent as Option } from '../../../icon/single-select-svgrepo-com.svg'

import Backdrop from "../../modal/backdrop";
import OptionModal from "../../modal/chan.option.modal";
import PickUserModal from "../../modal/pick.user.modal";
import PickPwdModal from "../../modal/pick.pwd.modal";
import Msgs from "./msg.component";

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

function get_direct_chan_name(users: i_user[])
{
	if (users.length !== 2 || !users[0].id || !users[1].id)
		return ("");
	if (users[0].id < users[1].id)
		return (users[0].name + " ⇋ " + users[1].name);
	return (users[1].name + " ⇋ " + users[0].name);
}

function Chat(props: { socket: Socket, chan: i_chan, all_users: i_user[], users: i_user[], user: i_user, is_admin: boolean, is_owner: boolean })
{
	const [msg, setMsg] = useState("");
	let msgs = (props.chan.msg ? props.chan.msg : []);
	const [msgsSocket, setMsgsSocket] = useState<i_msg[]>([]);
	const [incomingMsg, setIcomingMsg] = useState<i_msg | null>(null);

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

	if (incomingMsg)
	{
		if (parseInt(incomingMsg.chanId!) === props.chan.id)
			setMsgsSocket(current => [...current, incomingMsg]);
		setIcomingMsg(null);
	}

	if (msgsSocket.length > 0 && +msgsSocket[0].chanId! !== props.chan.id!)
		setMsgsSocket([]);

	useEffect(() =>
	{
		props.socket.on('chatToClient', (msg: i_msg) =>
		{
			console.log("received at:", msg.chanId, msg);
			setIcomingMsg(msg);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	function msgUpdateHandle(event: React.KeyboardEvent<HTMLInputElement>)
	{
		setMsg(event.target.value);
	};

	function msgSendHandle(event: React.KeyboardEvent<HTMLInputElement>)
	{
		if (!props.chan.id || !props.user.id || !props.user.name)
			return;
		if (event.key === 'Enter' && msg.length > 0)
		{
			event.preventDefault();
			const date = new Date();
			let s_msg: i_msg = {
				userId: props.user.id,
				username: props.user.name,
				msg: msg,
				sendAt: date
			}
			axios.post("http://localhost:3000/chan/msg/" + props.chan.id, s_msg).catch(err => console.log(err));
			s_msg.chanId = props.chan.id.toString();
			props.socket.emit('chatToServer', s_msg);
			setMsg("");
		}
	}

	return (
		<div>
			<div className='card card--alt card--chat' >
				<div className='card chan--title'>
					<div className='truncate'>- {props.chan.type === 'direct' ? get_direct_chan_name(props.users) : props.chan.name} -</div>
					<button onClick={() => { setShowOption(true) }}>
						<Option />
					</button>
				</div>
				<Msgs id={props.user.id} msgs={[...msgs, ...msgsSocket]} />
				<input className='card--input input--chat' type='type' placeholder=' 💬'
					onChange={msgUpdateHandle} value={msg} onKeyDown={msgSendHandle} />
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
			{showAdd && <PickUserModal chanId={props.chan.id} users={userNotInChan(props.chan.usersId, props.all_users)} type='add'
				goBack={() => { setShowAdd(false); setShowOption(true); }} onClose={() => { setShowAdd(false); setShowOption(false); }} />}
			{showChallenge && <PickUserModal chanId={props.chan.id} users={props.users} type='challenge'
				goBack={() => { setShowChallenge(false); setShowOption(true); }} onClose={() => { setShowChallenge(false); setShowOption(false); }} />}
			{showMute && <PickUserModal chanId={props.chan.id} users={props.users} type='mute'
				goBack={() => { setShowMute(false); setShowOption(true); }} onClose={() => { setShowMute(false); setShowOption(false); }} />}
			{props.is_admin && showAdminAdd && <PickUserModal chanId={props.chan.id} users={userNotAdmin(props.chan.adminsId, props.users)} type='admin add'
				goBack={() => { setShowAdminAdd(false); setShowOption(true); }} onClose={() => { setShowAdminAdd(false); setShowOption(false); }} />}
			{props.is_admin && showAdminBan && <PickUserModal chanId={props.chan.id} users={userNotAdmin(props.chan.adminsId, props.users)} type='admin ban'
				goBack={() => { setShowAdminBan(false); setShowOption(true); }} onClose={() => { setShowAdminBan(false); setShowOption(false); }} />}
			{props.is_admin && showAdminMute && <PickUserModal chanId={props.chan.id} users={userNotAdmin(props.chan.adminsId, props.users)} type='admin mute'
				goBack={() => { setShowAdminMute(false); setShowOption(true); }} onClose={() => { setShowAdminMute(false); setShowOption(false); }} />}
			{props.is_owner && showOwnerPwd && <PickPwdModal
				goBack={() => { setShowOwnerPwd(false); setShowOption(true); }} onClose={() => { setShowOwnerPwd(false); setShowOption(false); }} />}
		</div>
	);
}

export default Chat;
