import { InitChan, useReqChans } from '../../../request/chan.request';
import { useReqUsers } from '../../../request/user.request';

import '../../../style/chan.css';

import Chans from './chan.component';
import Loading from '../../request_answer_component/loading.component';
import Error from '../../request_answer_component/error.component';
import { useParams } from 'react-router-dom';

function ToChan()
{
	const p_id = useParams().id;

	return (<ChanPage id={(p_id ? +p_id : 1)} />);
}

function ChanPage(props: { id: number })
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
						<Chans chans={reqChans.reqChans} users={reqUsers.reqUsers} to_chan={props.id} />
					</div>
				)}
			</div>
		);
	}
}

export { ChanPage, ToChan };
