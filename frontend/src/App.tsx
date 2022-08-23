import { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import './style/root.css'
import './style/App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import i_user from './interface/user.interface';

import { AuthContext } from './context/auth.context';

import NavBar from './components/navbar.component';
import NoMatch from './components/page/nomatch.page';
import RequireAuth from './components/requireAuth.component';

import Home from './components/page/home.page';
import SignUp from './components/page/login/signup.component';
import { ChanPage, ToChan } from './components/page/chan/chan.page';
import UserPage from './components/page/user/user.page';
import PongPage from './components/page/pong/pong.page';

function App()
{
	const [user, setUser] = useState<i_user | null>(null);

	const value = useMemo(() => ({ user, setUser }), [user, setUser]);

	return (
		<Router>
			<NavBar />
			<AuthContext.Provider value={value}>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<SignUp />} />
					<Route path="/play" element={<RequireAuth><PongPage /></RequireAuth>} />
					<Route path="/chan" element={<RequireAuth><ChanPage id={1} /></RequireAuth> /*need to handle if is signup and update connected_user*/} />
					<Route path="/chan/:id" element={<RequireAuth><ToChan /></RequireAuth> /*need to handle if is signup and update connected_user*/} />
					<Route path="/user" element={<RequireAuth><UserPage /></RequireAuth>} />
					<Route path="/user/:username" element={<UserPage />} />
					<Route path="*" element={<NoMatch />} />
				</Routes>
			</AuthContext.Provider>
		</Router >
	);
}

export default App;
