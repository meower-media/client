<script>
	import PFP from "../lib/PFP.svelte";

	import {ulist} from "../lib/stores.js";
	import * as clm from "../lib/clmanager.js";
	
	import {onMount} from "svelte";
	export let member = "";

	let pfp = 0

	// TODO: make bridged tag a setting

	/**
	 * Initialize this post's user profile - gets profile info from the cache or fetches it.
	 */
	function initPostUser() {
		clm.meowerRequest({
			cmd: "direct",
			val: {
				cmd: "get_profile",
				val: member,
			},
			listener: "get_profileGC_" + member,
		}).then(val => {
			// Ding dong! The data has arrived.
			pfp = val.payload.pfp_data
		}).catch(e => {
			alert("Error while loading member: "+member+", "+e)
			pfp = -2
		})
	};
	onMount(initPostUser);
</script>

<div id="Member">
	<div class="member-pfp">
		<PFP
			icon={pfp}
			alt="{member}'s profile picture"
			online={$ulist.includes(member)}
		></PFP>
	</div>
	<p class="member-name">{member}</p>
</div>

<style>

    .member-name {
        top: -0.1em;
        left: 30%;
        text-align: left;
        position: absolute;
        width: 65%;
        text-overflow: clip;
        overflow: hidden;
    }

    .member-pfp {
        top: -0.5em;
        right: 66%;
		transform: scale(0.5);
        text-align: center;
        position: absolute;
    }
</style>