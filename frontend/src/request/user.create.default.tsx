import axios from 'axios';

function CreateDefaultUser()
{
	// if no user with id == 1
	// create default user with id 1

	axios.get("http://localhost:3000/user/").then(res =>
	{
		console.log(res);
		if (res.data.length === 0)
		{
			axios.post("http://localhost:3000/user/name/default").catch(err =>
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