<script>
	import { goto } from "@roxi/routify";
	import {onMount} from "svelte";

    onMount(() => {
        $goto("/home");
    })
</script>