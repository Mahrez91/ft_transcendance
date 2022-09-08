import { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './style/root.css'
import './style/App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import i_user from './interface/user.interface';

import { AuthContext } from './context/auth.context';
import { ApiUrlContext } from './context/apiUrl.context';

import NavBar from './components/navbar.component';
import NoMatch from './components/page/nomatch.page';
import RequireAuth from './components/requireAuth.component';

import Home from './components/page/home.page';
import SignUp from './components/page/login/signup.component';
import ChanPage from './components/page/chan/chan.page';
import UserPage from './components/page/user/user.page';
import PongPage from './components/page/pong/pong.page';
import CreateDefaultUser from './request/user.create.default';
import PongView from './components/page/pong/pong.view';

function App()
{
	const [user, setUser] = useState<i_user | null>(null);
	const [apiUrl, setApiUrl] = useState("http://" + window.location.hostname + ":3000");

	const valueUser = useMemo(() => ({ user, setUser }), [user, setUser]);
	const valueApiUrl = useMemo(() => ({ apiUrl, setApiUrl }), [apiUrl, setApiUrl]);

	return (
		<Router>
			<NavBar />
			<ApiUrlContext.Provider value={valueApiUrl}>
				<AuthContext.Provider value={valueUser}>
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/login" element={<SignUp />} />
						<Route path="/view/:id" element={<RequireAuth><PongView goBack={() => { }}/></RequireAuth>} />
						<Route path="/play" element={<RequireAuth><PongPage /></RequireAuth>} />
						<Route path="/chan" element={<RequireAuth><ChanPage /></RequireAuth>} />
						<Route path="/user" element={<RequireAuth><UserPage /></RequireAuth>} />
						<Route path="/user/:username" element={<UserPage />} />
						<Route path="*" element={<NoMatch />} />
					</Routes>
				</AuthContext.Provider>
			</ApiUrlContext.Provider>
			<CreateDefaultUser />
		</Router>
	);
}

export default App;
