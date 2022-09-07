import i_matchHistory from "./matchHistory.interface";

interface i_user
{
	id?: number;
	access_token?: string;
	name?: string;
	profilePicPath?: string;
	xp?: number;
	elo?: number;
	win?: number;
	lose?: number;
	matchHistory?: i_matchHistory[];
	friendsId?: number[];
	mutedId?: number[];
}

export default i_user;
