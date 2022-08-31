import { useEffect, useState } from "react";
import Error from "./request_answer_component/error.component";
import Loading from "./request_answer_component/loading.component";

function TestBackend()
{
	const [error, setError] = useState<{ message: string } | null>(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const [msg, setMsg] = useState("");

	// Note: the empty deps array [] means
	// this useEffect will run once
	// similar to componentDidMount()
	useEffect(() =>
	{
		fetch("http://localhost:3000")
			.then(response => response.json())
			.then(
				(data) =>
				{
					setIsLoaded(true);
					setMsg(data);
				},
				// Note: it's important to handle errors here
				// instead of a catch() block so that we don't swallow
				// exceptions from actual bugs in components.
				(error) =>
				{
					setIsLoaded(true);
					setError(error);
				}
			)
	}, [])

	if (error)
		return <Error msg={error.message} />;
	else if (!isLoaded)
		return <Loading />;
	else
	{
		return (
			<div>
				{msg}
				<br />
				<br />
				<div>
					<div>
						loading appearance: <Loading />
					</div>
					<br />
					<div>
						error appearance: <Error msg="message describing error" />
					</div>
				</div>
			</div>
		);
	}
}

export default TestBackend;