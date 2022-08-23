import { Link } from "react-router-dom";
import CreateDefaultUser from "../../request/user.create.default";
import TestBackend from "../test.backend";

function Home()
{
	return (
		<div style={{ backgroundColor: "#96c471", color: "#fff", textAlign: "center", paddingTop: "5rem" }}>
			home page
			<div style={{ color: "red" }}>🚧 WIP 🚧</div>
			<br />
			<br />
			<br />
			<div style={{ paddingRight: "12rem" }}>
				<Link to='/login' className='btn'>login page</Link>
			</div>
			<br />
			<br />
			<br />
			<br />
			<TestBackend />

			<CreateDefaultUser />
		</div>
	);
}

export default Home;
