<script>
    import Loading from "../Loading.svelte";
	import Modal from "../Modal.svelte";

	import {modalShown,modalPage} from "../stores.js";
    import { apiUrl } from "../urls";
	export let stats = "";

	async function getstats() {
		stats = await (await fetch(apiUrl + "statistics")).json()
		stats = stats
		return stats
	}
</script>

<Modal on:close={() => {$modalShown = false}}>
    <h2 slot="header">Statistics</h2>
    <div slot="default">
		{#await getstats()}
			<div class="fullcenter">
				<Loading />
			</div>
		{:then}
			<p>There are {(stats.posts / 1000).toFixed(2)}K+ Posts, {stats.chats} Chats and {(stats.users / 1000).toFixed(2)}K+ users</p>
		{/await}
	</div>
</Modal>

<style>
</style>