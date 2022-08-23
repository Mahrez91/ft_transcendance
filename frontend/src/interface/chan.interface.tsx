interface i_chan
{
	id?: number;
	name?: string;
	usersId?: number[];
	ownerId?: number;
	adminsId?: number[];
	type?: 'public' | 'private' | 'protected' | 'direct';
	hash?: string;
	// msg
	mutedId?: number[];
	bannedId?: number[];
}

export default i_chan;
