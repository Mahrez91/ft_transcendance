import { ReactComponent as Back } from '../../icon/left-svgrepo-com.svg'

function PickPwdModal(props: { goBack: () => void, onClose: () => void, callback: (newId: number, oldId: number) => void })
{
	return (
		<div onMouseLeave={props.onClose} className='modal--pick'>
			<div>
				<button style={{ position: "absolute", top: "1rem", left: "1rem" }} onClick={() => props.goBack()}><Back /></button>
				<span style={{ fontSize: "1.5rem", fontWeight: "bolder" }}>password</span>
			</div>
		</div>
	);
	// don't forget to call callback after the password is set/changed
}

export default PickPwdModal;
