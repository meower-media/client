<script>
	import Modal from "../Modal.svelte";
	import Container from "../Container.svelte";

	import * as modals from "../modals.js";
	import * as stores from "../stores.js";

	let parsedStores = {};
	let editingStore, editingStoreVal, saveStoreError;

	$: {
		Object.entries(stores).forEach(([key, value]) => {
			value.subscribe(
				v => (parsedStores[key] = [typeof v, JSON.stringify(v)])
			);
		});
	}
</script>

<Modal showClose={true} on:close={modals.closeLastModal}>
	<h2 slot="header">Debug</h2>
	<div slot="default">
		<h2>Stores</h2>
		{#each Object.entries(parsedStores) as [storeName, [storeType, storeVal]]}
			<Container>
				<b>{storeName}</b><br />
				{#if editingStore === storeName}
					{#if storeType === "object"}
						<textarea
							class="white"
							style="width: 100%;"
							name="input"
							autocomplete="off"
							bind:value={editingStoreVal}
							on:keydown={e => {
								if (e.key == "Enter") e.preventDefault();
							}}
						/>
					{:else if storeType === "boolean"}
						<input type="checkbox" bind:checked={editingStoreVal} />
					{:else if storeType === "number"}
						<input
							type="number"
							class="white"
							style="width: 100%;"
							name="input"
							autocomplete="off"
							bind:value={editingStoreVal}
						/>
					{:else}
						<input
							type="text"
							class="white"
							style="width: 100%;"
							name="input"
							autocomplete="off"
							bind:value={editingStoreVal}
						/>
					{/if}
				{:else}
					<code>{storeVal}</code>
				{/if}

				{#if editingStore === storeName && saveStoreError}
					<p style="color: crimson;">{saveStoreError}</p>
				{/if}

				<div class="settings-controls">
					{#if editingStore === storeName}
						<button
							class="circle close"
							on:click={() => (editingStore = "")}
						/>
						<button
							class="circle check"
							on:click={() => {
								try {
									stores[storeName].set(
										storeType === "object"
											? JSON.parse(editingStoreVal)
											: editingStoreVal
									);
									editingStore = "";
								} catch (e) {
									saveStoreError = e;
								}
							}}
						/>
					{:else}
						<button
							class="circle settings"
							on:click={() => {
								saveStoreError = "";
								editingStoreVal =
									storeType === "object"
										? storeVal
										: JSON.parse(storeVal);
								editingStore = storeName;
							}}
						/>
					{/if}
				</div>
			</Container>
		{/each}
	</div>
</Modal>

<style>
	textarea,
	input {
		margin-top: 0.5em;
	}
</style>
