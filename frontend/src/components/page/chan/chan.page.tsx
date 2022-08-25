import { useState } from 'react';

import { InitChan, useReqChans } from '../../../request/chan.request';
import { useReqUsers } from '../../../request/user.request';

import '../../../style/chan.css';

import Chans from './chan.component';
import Loading from '../../request_answer_component/loading.component';
import Error from '../../request_answer_component/error.component';
import i_chan from '../../../interface/chan.interface';
import axios from 'axios';

function ChanReq(props: { chans: i_chan[] | null, to_chan: number, callback: (id: number) => void })
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
						<Chans chans={(props.chans ? props.chans : reqChans.reqChans)} users={reqUsers.reqUsers}
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

	function callback(id: number)
	{
		axios.get("http://localhost:3000/chan/").then(res =>
		{
			setChans(res.data);
			setSelectedChan(id);
		}).catch(err => console.log(err));
	}

	return (<ChanReq chans={chans} to_chan={selectedChan} callback={callback} />);
}

export default ChanPage;
