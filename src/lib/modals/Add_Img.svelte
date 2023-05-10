<script>
	import Modal from "../Modal.svelte";

	import {modalShown, modalPage, PostInput, user} from "../stores.js";

	import Post from "../Post.svelte";
	
	import {IMAGE_HOST_WHITELIST} from "../ImageWhitelist.js"

	let ImgUrl;
	let ImgName;

	let post = {"user":$user.name,"content":"Content","date":1683754263,"post_origin":"home","isDeleted":false};

	function change() {
		//post.
	}

	let postErrors = "";
</script>

<Modal
	on:close={() => {
		$modalShown = false;
	}}
>
	<h2 slot="header">Add Image to post</h2>
	<div slot="default">
		<p class="smol">Example: [FunnyCat: https://go.meower.org/34378a47]</p>
		<label for="ImageNAMe"><b>Name</b></label>
		<input
			type="text"
			name="ImageNAMe"
			class="long white"
			placeholder="Image Name"
			autocomplete="false"
			bind:this={ImgName}
			on:change={change}
		/>
		<br/><br/>
		<label for="ImageURL"><b>URL</b></label>
		<input
			type="text"
			name="ImageURL"
			class="long white"
			placeholder="Image URL"
			autocomplete="false"
			bind:this={ImgUrl}
			on:change={change}
		/>
		<br/><br/>
		<h2>Preview:</h2>
		<div id="Preview">
			<!--TODO: post preview-->
			<Post canDoActions={false} buttons={false} />
		</div>
		<p class="post-errors">{postErrors}</p>
		<div class="modal-buttons">
			<button
				on:click={() => {
					$modalShown = false;
				}}>Close</button
			>

			<button
				on:click={() => {
					var full = "["+ImgName.value+": "+ImgUrl.value+"]"
					alert(full)
					const iterator = full.matchAll(
						/\[([^\]]+?): (https:\/\/[^\]]+?)\]/gs
					);
					const result = iterator.next();
					if (result.done) {
						postErrors = "Regex encountered an early end to the string."
						return
					};

					try {
						new URL(result.value[2]);
					} catch (e) {
						postErrors = "No proper url as url??"
						return
					}

					if (
						!IMAGE_HOST_WHITELIST.some(o =>
							result.value[2].toLowerCase().startsWith(o.toLowerCase())
						)
					) {
						postErrors = "Not on the image host whitelist"
					} else {
						$modalShown = false;
					}
				}}
			>
				Add
			</button>
		</div>
	</div>
</Modal>

<style>
	.smol {
		font-size: 10px;
	}

	.long {
		width: 100%;
		margin: 0;
		margin-bottom: -2px;
	}
</style>