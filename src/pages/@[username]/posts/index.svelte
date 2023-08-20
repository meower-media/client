<script>
	import {params, goto} from "@roxi/routify";

	$goto(`/users/${$params.username.replace("@", "")}/posts`);
</script>
