import useFetch from "./useFetch";

import i_chan from "../interface/chan.interface";

import Error from "../components/request_answer_component/error.component";
import Loading from "../components/request_answer_component/loading.component";

import { ChanPage } from "../components/page/chan/chan.page";

function chanBacktoFront(chan: any)
{
	const ret_chan: i_chan = (chan ? {
		id: chan.id,
		name: chan.name,
		usersId: chan.usersId,
		ownerId: chan.ownerId,
		adminsId: chan.adminsId,
		type: chan.type,
		// msg
		bannedId: chan.bannedId,
		mutedId: chan.mutedId
	} : {});

	return (ret_chan);
}

function useReqChan(query: number | string)
{
	const { data, loading, error } = useFetch(
		"http://localhost:3000/chan/" + (typeof query === 'number' ? query : "name/" + query), 'get');

	const reqChan: i_chan = chanBacktoFront(data);
	return ({ reqChan, loading, error });
}

function useReqChans()
{
	const { data, loading, error } = useFetch("http://localhost:3000/chan/", 'get');
	let reqChans: i_chan[] = [];

	if (!loading && !error && data)
		for (let i = 0; i < data.length; i++)
			reqChans.push(chanBacktoFront(data[i]));
	return ({ reqChans, loading, error });
}

function InitChan()
{
	const { data, loading, error } = useFetch("http://localhost:3000/chan/init", 'get');

	if (loading)
		return (<div className='back'><Loading /></div>);
	else if (error)
		return (<div className='back'><Error msg={error.message} /></div>);
	else
	{
		console.log(data);
		return (<ChanPage id={1} />);
	}
}

export { chanBacktoFront, useReqChan, useReqChans, InitChan }