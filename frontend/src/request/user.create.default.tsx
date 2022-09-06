import axios from 'axios';
import { useContext } from 'react';

import { ApiUrlContext } from '../context/apiUrl.context';

function CreateDefaultUser()
{
	const { apiUrl } = useContext(ApiUrlContext);

	// if no user with id == 1
	// create default user with id 1

	axios.get(apiUrl + "/user/").then(res =>
	{
		console.log(res);
		if (res.data.length === 0)
		{
			axios.post(apiUrl + "/user/name/default").catch(err =>
			{
				console.log(err);
			});
		}
	}).catch(err =>
	{
		console.log(err);
	});

	return (<div />);
}

export default CreateDefaultUser;