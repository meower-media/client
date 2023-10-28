<script>
	import {params, redirect} from "@roxi/routify";

	$redirect(`/users/${$params.username.replace("@", "")}/posts`);
</script>
