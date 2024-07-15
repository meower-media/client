<!--Adding images. not really-->

<script>
	import Modal from "../Modal.svelte";
	import Attachment from "../Attachment.svelte";
	import BasicModal from "./Basic.svelte";

	import {authHeader} from "../stores.js";
	import * as modals from "../modals.js";

	import {focus} from "@roxi/routify";
	import { onMount } from "svelte";
	import { apiUrl, uploadsUrl } from "../urls";
	

	export let modalData;

	let {postOrigin} = modalData;
	let uploadRequests = [];
	let uploadPercentages = {};
	let totalUploadPercentage = 0;
	let comment;
	let loading;
	let error;

	onMount(() => {
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.multiple = true;
		fileInput.click();
		fileInput.onchange = () => {
			// Check files
			if (fileInput.files.length > 10) {
				modals.closeAllModals();
				modals.showModal(BasicModal, {
					title: "Too Many Files",
					desc: "You can only upload 10 files at a time!",
				});
				return;
			}
			for (const file of fileInput.files) {
				if (file.size > (25 << 20)) {
					modals.closeAllModals();
					modals.showModal(BasicModal, {
						title: "File Too Large",
						desc: `${file.name} is too large! Files must be 25 MiB or smaller.`,
					});
					return;
				}
			}

			// Upload files
			for (const file of fileInput.files) {
				const req = new Promise((resolve, reject) => {
					const xhr = new XMLHttpRequest();
					uploadPercentages[xhr] = { loaded: 0, total: 1 };
					xhr.open("POST", `${uploadsUrl}attachments`);
					xhr.setRequestHeader("Authorization", $authHeader.token);

					xhr.onload = () => {
						const xhrResp = JSON.parse(xhr.response);
						resolve({
							id: xhrResp.id,
							filename: xhrResp.filename,
							mime: file.type,
						});
					};
					xhr.upload.onprogress = (ev) => {
						uploadPercentages[xhr] = {
							loaded: ev.loaded,
							total: ev.total,
						};

						let totalLoaded = 0;
						let totalTotal = 0;
						Object.values(uploadPercentages).forEach((el) => {
							totalLoaded += el.loaded;
							totalTotal += el.total;
						});

						if ((totalLoaded / totalTotal) * 100 > totalUploadPercentage) {
							totalUploadPercentage = (totalLoaded / totalTotal) * 100;
						}
					};
					xhr.onerror = reject;;

					const formData = new FormData();
					formData.append("file", file);
					xhr.send(formData);
				});
				uploadRequests = uploadRequests.concat([req]);
			}

			// Close modal if no requests are made
			if (uploadRequests.length === 0) {
				modals.closeAllModals();
			}
		};
		fileInput.oncancel = () => {
			modals.closeAllModals();
		};
	});
</script>

{#if uploadRequests.length}
	<Modal on:close={modals.closeLastModal}>
		<h2 slot="header">Send Files</h2>
		<div slot="default">
			{#await Promise.all(uploadRequests)}
				<span>
					Uploading {uploadRequests.length} files ({Number(totalUploadPercentage).toFixed(2)}%)...
				</span>
			{:then attachments} 
				<form
					on:submit|preventDefault={async () => {
						loading = true;
						try {
							const resp = await fetch(`${apiUrl}${postOrigin === "home" ? "home" : `/posts/${postOrigin}`}`, {
								method: "POST",
								headers: {
									"Content-Type": "application/json",
									...$authHeader,
								},
								body: JSON.stringify({
									attachments: attachments.map(attachment => attachment.id),
									content: comment,
								}),
							});
							if (!resp.ok) {
								if (resp.status === 429) {
									throw new Error(
										"Too many requests! Try again later."
									);
								}
								throw new Error(
									"Response code is not OK; code is " + resp.status
								);
							}
							modals.closeLastModal();
						} catch (e) {
							loading = false;
							error = e;
						}
					}}
				>
					<h2>Preview Files</h2>
					<div class="post-images">
						{#each attachments as attachment}
							<Attachment
								id={attachment.id}
								filename={attachment.filename}
								mime={attachment.mime}
							/>
						{/each}
					</div>
					<label for="comment">
						<b>Comment</b>
					</label>
					<input
						id="comment"
						type="text"
						class="long white"
						placeholder="Write something..."
						autocomplete="off"
						bind:value={comment}
						use:focus
					/>
					{#if error}
						<p style="color: crimson;">{error}</p>
					{:else}
						<br /><br />
					{/if}
					<div class="modal-buttons">
						<button
							type="button"
							disabled={loading}
							on:click={modals.closeLastModal}>Cancel</button
						>
						<button type="submit" disabled={loading}
							>Send</button
						>
					</div>
				</form>
			{:catch e}
				<span>
					Failed to upload files: {e}
				</span>
			{/await}
		</div>
	</Modal>
{/if}

<style>
	.post-images {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25em;
		max-height: 35em;
		overflow: scroll;
		margin-bottom: 0.25em;
	}

	.long {
		width: 100%;
		margin: 0;
		margin-bottom: 0.2em;
	}
</style>
