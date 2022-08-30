import { useEffect, useState } from 'react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client'

import { InitChan, useReqChans } from '../../../request/chan.request';
import { useReqUsers } from '../../../request/user.request';

import '../../../style/chan.css';

import i_chan from '../../../interface/chan.interface';

import Chans from './chan.component';
import Loading from '../../request_answer_component/loading.component';
import Error from '../../request_answer_component/error.component';

function ChanReq(props: { socket: Socket, chans: i_chan[] | null, to_chan: number, callback: (newId: number, oldId: number) => void })
{
	const reqChans = useReqChans();
	const reqUsers = useReqUsers();

	if (reqChans.loading || reqUsers.loading)
		return (<div className='back'><Loading /></div>);
	else if (reqChans.error)
		return (<div className='back'><Error msg={reqChans.error.message} /></div>);
	else if (reqUsers.error)
		return (<div className='back'><Error msg={reqUsers.error.message} /></div>);
	else
	{
		return (
			<div>
				{reqChans.reqChans.length === 0 ? (
					<InitChan />
				) : (
					<div>
						<Chans socket={props.socket} chans={(props.chans ? props.chans : reqChans.reqChans)} users={reqUsers.reqUsers}
							to_chan={props.to_chan} callback={props.callback} />
					</div>
				)}
			</div>
		);
	}
}

function ChanPage()
{
	const [selectedChan, setSelectedChan] = useState(1);
	const [chans, setChans] = useState<i_chan[] | null>(null);
	const [socket] = useState(io("http://backend:3000/chat"));

	useEffect(() =>
	{
		socket.emit('newConnection');
		socket.emit('joinRoom', selectedChan);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	function callback(newId: number, oldId: number)
	{
		axios.get("http://backend:3000/chan/").then(res =>
		{
			socket.emit('joinRoom', newId.toString());
			socket.emit('leaveRoom', oldId.toString());

			setChans(res.data);
			setSelectedChan(newId);
		}).catch(err => console.log(err));
	}

	return (<ChanReq socket={socket} chans={chans} to_chan={selectedChan} callback={callback} />);
}

export default ChanPage;
