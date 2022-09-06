import { useContext } from "react";
import useFetch from "./useFetch";

import { ApiUrlContext } from "../context/apiUrl.context";

import i_user from "../interface/user.interface"

function userBacktoFront(user: any)
{
	const ret_user: i_user = (user ? {
		id: user.id,
		access_token: user.access_token,
		name: user.name,
		// profile pic
		profilePicPath: "profile_picture/default.png",
		xp: user.xp,
		elo: user.elo,
		win: user.win,
		lose: user.lose,
		matchHistory: user.matchHistory,
		friendsId: user.friendsId
	} : {});

	return (ret_user);
}

function useReqUser(query: number | string)
{
	const { apiUrl } = useContext(ApiUrlContext);
	const { data, loading, error } = useFetch(
		apiUrl + "/user/" + (typeof query === 'number' ? query : "name/" + query), 'get');

	const reqUser: i_user = userBacktoFront(data);
	return ({ reqUser, loading, error });
}

function useReqUsers()
{
	const { apiUrl } = useContext(ApiUrlContext);
	const { data, loading, error } = useFetch(apiUrl + "/user/", 'get');
	let reqUsers: i_user[] = [];

	if (!loading && !error && data)
		for (let i = 0; i < data.length; i++)
			reqUsers.push(userBacktoFront(data[i]));
	return ({ reqUsers, loading, error });
}

function useReqUsersWithDefault()
{
	const { apiUrl } = useContext(ApiUrlContext);
	const { data, loading, error } = useFetch(apiUrl + "/user/all", 'get');
	let reqUsers: i_user[] = [];

	if (!loading && !error && data)
		for (let i = 0; i < data.length; i++)
			reqUsers.push(userBacktoFront(data[i]));
	return ({ reqUsers, loading, error });
}

export { userBacktoFront, useReqUser, useReqUsers, useReqUsersWithDefault }