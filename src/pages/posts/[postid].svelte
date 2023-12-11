<!-- The individual post page. Pretty pointless without things like comments. -->
<script>
	import PostList from "../../lib/PostList.svelte";
	import BasicModal from "../../lib/modals/Basic.svelte";
	import * as modals from "../../lib/modals.js";


	import {params} from "@roxi/routify";

	modals.showModal(BasicModal, {
		title: "Subscription",
		desc: "This requires Meower Plus.",
	});
</script>

<!-- routify:options bundle=false -->

<PostList
	fetchUrl={"posts"}
	postOrigin={null}
	chatName={null}
	canPost={false}
	queryParams={{id: $params.postid}}
/>
