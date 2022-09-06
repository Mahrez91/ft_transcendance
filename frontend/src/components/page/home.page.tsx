import { Link } from "react-router-dom";
import CreateDefaultUser from "../../request/user.create.default";
import TestBackend from "../test.backend";

function Home()
{
	return (
		<div style={{
			backgroundColor: "var(--background-color)", color: "#fff", height: "calc(100vh - var(--nav-h))",
			textAlign: "center", paddingTop: "5rem"
		}}>
			<div className='card card--border'
				style={{
					display: "flex", flexDirection: "column", justifyContent: "space-around",
					height: "75%", width: "60%", margin: "auto", padding: "5rem 0 5rem 0"
				}}>
				<div style={{ fontFamily: "var(--alt-font)", fontSize: "11rem", textShadow: "10px 10px 3px #0008" }}>pong</div>
				<div style={{ paddingRight: "12rem" }}>
					<Link to='/login' className='btn'>login page</Link>
				</div>
			</div>
			<br />
			<div style={{ color: "red" }}>🚧 WIP 🚧</div>
			<TestBackend />

			<CreateDefaultUser />
		</div >
	);
}

export default Home;
