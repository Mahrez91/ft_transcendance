import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import axios from 'axios'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { textAlign } from '@mui/system';

import { AuthContext } from '../../../context/auth.context';

import i_user from '../../../interface/user.interface';

import { Users } from '../chan/user.component';
import { userBacktoFront } from '../../../request/user.request';
import { ApiUrlContext } from '../../../context/apiUrl.context';

async function requestUser(apiUrl: string, id: number): Promise<i_user | null>
{
	let user: i_user | null = null;

	await axios.get(apiUrl + "/user/" + id).then(res =>
	{
		console.log(res);
		user = userBacktoFront(res.data);
	}).catch(err =>
	{
		console.log(err);
	});

	return (user);
}

function Copyright(props: any)
{
	return (
		<Typography variant="body2" color="text.secondary" align="center" {...props}>
			{'Copyright © '}
			< Link color="inherit" href="https://mui.com/" >
				Your Website
			</Link > {' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography >
	);
}

const theme = createTheme();

export default function SignIn()
{
	const { apiUrl } = React.useContext(ApiUrlContext);
	const { user, setUser } = React.useContext(AuthContext);
	const navigate = useNavigate();

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>) =>
	{
		event.preventDefault();
		window.location.replace("https://api.intra.42.fr/oauth/authorize?client_id=cbd1064bd58ef5065a103fbd35e3b251f506b89d0f101660714907581d0c9bd9&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Flogin&response_type=code");
		//window.location.replace("https://api.intra.42.fr/oauth/authorize?client_id=d99b55c8716eb674d3a78116832e8a2bb2085c6706e5195a4f91f66a3739939b&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Flogin&response_type=code");
	};

	const getCode = async (event: React.FormEvent<HTMLFormElement>) =>
	{
		event.preventDefault();
		const access_token = new URLSearchParams(window.location.search).get('code');
		console.log(access_token);
		const b = await axios.post(apiUrl + "/user", { token: access_token });
		console.log(b);
	};

	const tmpCreateUser = async (username: string) =>
	{
		const post_answer = await axios.post(apiUrl + "/user/name/" + username);
		console.log(post_answer);
	}

	const [users_data, setUsersData] = React.useState<i_user[]>([]);

	const getUsers = async () =>
	{
		const get_answer = await axios.get(apiUrl + "/user/all");
		console.log(get_answer);
		let users: i_user[] = [];
		for (let i = 0; i < get_answer.data.length; i++)
			users.push(userBacktoFront(get_answer.data[i]));
		setUsersData(users);
	}

	const [id, setId] = React.useState(2);

	return (
		<div style={{ backgroundColor: "var(--background-color)", height: "calc(100vh - var(--nav-h))" }}>
			<ThemeProvider theme={theme}>
				<Container component="main" maxWidth="xs">
					<CssBaseline />
					<div style={{ paddingTop: "5rem", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
						<Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
							>
								Sign in
							</Button>
						</Box>
						<Box component="form" onSubmit={getCode} noValidate sx={{ mt: 1 }}>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
							>
								Get code
							</Button>
						</Box>
						<Box>
							{user ? (
								<Button
									type="submit"
									fullWidth
									variant="contained"
									sx={{ mt: 3, mb: 2 }}
									onClick={() => setUser(null)}
								>
									🚧 test logout 🚧
								</Button>
							) : (
								<div>
									<Button
										type="submit"
										variant="contained"
										sx={{ mt: 3, mb: 2 }}
										onClick={async () =>
										{
											const tmp: i_user | null = await requestUser(apiUrl, id);
											setUser(tmp);
											if (tmp)
												navigate("/");
										}}
									>
										🚧 test login 🚧
										<br />
										(will login to user id: )
									</Button>
									<input className='input--chat' style={{ width: "3rem", textAlign: "center" }}
										placeholder="id" onChange={(e) => setId(+e.target.value)} value={id} />
								</div>
							)}
						</Box>
						<div>
							<input className='input--chat' placeholder="🚧 create user 🚧" onKeyPress={(event) =>
							{
								if (event.key === 'Enter')
								{
									event.preventDefault();
									tmpCreateUser(event.target.value);
								}
							}} />
						</div>
						<Box>
							<Button
								type="submit"
								fullWidth
								variant="contained"
								sx={{ mt: 3, mb: 2 }}
								onClick={() => getUsers()}
							>
								🚧 get all users 🚧
							</Button>
						</Box>
						<div>
							number of users: {users_data.length}
							<Users users={users_data} />
						</div>
					</div>
					<Copyright style={{ position: "absolute", bottom: "0", right: "3rem" }} sx={{ mt: 8, mb: 4 }} />
				</Container>
			</ThemeProvider>
		</div >
	);
}