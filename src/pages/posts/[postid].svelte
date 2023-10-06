<!-- routify:options bundle=false -->
<!-- The individual post page. Pretty pointless without things like comments. -->
<script>
	import PostList from "../../lib/PostList.svelte";

	import {params} from "@roxi/routify";
</script>

<PostList
	fetchUrl={"posts"}
	postOrigin={null}
	chatName={null}
	canPost={false}
	queryParams={{id: $params.postid}}
/>