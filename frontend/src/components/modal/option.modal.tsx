import i_chan from "../../interface/chan.interface";
import i_user from "../../interface/user.interface";

import { ReactComponent as Quit } from '../../icon/exit-svgrepo-com.svg'
import { ReactComponent as Add } from '../../icon/add-friend-svgrepo-com.svg'
import { ReactComponent as Challenge } from '../../icon/sword-fight-svgrepo-com.svg'
import { ReactComponent as Mute } from '../../icon/volume-mute-fill-svgrepo-com.svg'
import { ReactComponent as AdminMute } from '../../icon/comment-alt-block-svgrepo-com.svg'
import { ReactComponent as AdminBan } from '../../icon/thor-hammer-svgrepo-com.svg'
import { ReactComponent as AdminAdd } from '../../icon/chevron-svgrepo-com.svg'
import { ReactComponent as Pwd } from '../../icon/icons8-key.svg'

function OptionModal(props: {
	user: i_user,
	chan: i_chan,
	is_admin: boolean,
	is_owner: boolean,
	options: {
		setShowAdd: (value: React.SetStateAction<boolean>) => void,
		setShowChallenge: (value: React.SetStateAction<boolean>) => void,
		setShowMute: (value: React.SetStateAction<boolean>) => void,
		setShowAdminAdd: (value: React.SetStateAction<boolean>) => void,
		setShowAdminBan: (value: React.SetStateAction<boolean>) => void,
		setShowAdminMute: (value: React.SetStateAction<boolean>) => void,
		setShowOwnerPwd: (value: React.SetStateAction<boolean>) => void,
	}
	onClose: () => void
})
{
	// need handle quiting
	return (
		<div onMouseLeave={props.onClose} className='modal--option'>
			<div>
				{props.chan.id !== 1 && <button onClick={() => props.options.setShowAdd(true)}><Add /></button>}
				{props.chan.id !== 1 && <button><Quit fill="#c00" /></button>}
			</div>
			<div>
				<button onClick={() => props.options.setShowChallenge(true)}><Challenge /></button>
				<button onClick={() => props.options.setShowMute(true)}><Mute fill="#c00" /></button>
			</div>
			<div>
				{props.is_admin && <button onClick={() => props.options.setShowAdminBan(true)}><AdminBan fill="#c00" /></button>}
				{props.is_admin && <button onClick={() => props.options.setShowAdminMute(true)}><AdminMute fill="#c00" /></button>}
			</div>
			<div>
				{props.is_admin && <button onClick={() => props.options.setShowAdminAdd(true)}><AdminAdd /></button>}
				{props.is_owner && <button onClick={() => props.options.setShowOwnerPwd(true)}><Pwd /></button>}
			</div>
		</div >
	);
}

export default OptionModal;
