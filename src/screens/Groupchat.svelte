<script>

    import Container from "../lib/Container.svelte"
    import {chatid_stor,spinner} from "../lib/stores.js";

    let chatlist = ""
    let inchat = false
    let chatid = ""
    let chat_res = ""
    let chat_res_res = false
    export let chats = [];
    let chatposts = [];
    let postErrors = []
    let link = cljs
    
    cljs.send({
        cmd: "direct",
        val: {
            cmd: "get_chat_list",
            val: {},
        }
    })

    cljs.on("direct", cmd => {
        if (cmd.val.mode == "chats") {
            chatlist = cmd.val.payload
            for (let i = 0; i < chatlist.all_chats.length; i++) {
                chats.push(chatlist.all_chats[i])
            }
            chats = chats;
        } else if (cmd.val.post_origin == chatid) {

        }
    })

    loop_g()

    async function loop_g() {
        if (inchat) {
            if (!chat_res_res) {
                let headers = new Headers()
                headers.append("username", localStorage.getItem("meower_savedusername"))
                headers.append("token", localStorage.getItem("meower_savedpassword"))
                const resp = await fetch(
                    "https://api.meower.org/posts/"+chatid+"?autoget",
                    {headers: headers}
                );
                console.log(await resp)
                const json = await resp.json();
                chat_res = json
                chatid_stor.set(chatid)
                cljs.send({
                    cmd: "direct", 
                    val: {
                        cmd: "set_chat_state", 
                        val: {
                            chatid: chatid, 
                            state: 1
                        }
                    }
                })
                chat_res_res = true
            }
        }
        window.requestAnimationFrame(loop_g)
    }
</script>

<div class="Groupchat">
    {#if inchat}
        `<form 
            class="createpost"
            on:submit|preventDefault={e => {
                const EmojiRegex = new RegExp(/[\u{1F346}]/ug)
                
                postErrors = "";
                if (!e.target[0].value.trim()) {
                    postErrors = "You cannot send an empty post!";
                    return false;
                };

                spinner.set(true);

                link.send({
                    "cmd": "direct", 
                    "val": {
                        "cmd": "post_chat", 
                        "val": {
                            "p": e.target[0].value.replace(EmojiRegex,' Emoji '), 
                            "chatid": chatid
                        }
                    }, 
                    "listener": "post_chat"
                });
                const postListener = link.on("statuscode", cmd => {
                    if (cmd.listener !== "post_chat") return;
                    link.off(postListener);
                    spinner.set(false);

                    if (cmd.val === "I:100 | OK") {
                        e.target[0].value = "";
                    } else if (cmd.val === "E:106 | Too many requests") {
                        postErrors = "You're posting too fast!";
                    } else {
                        postErrors = "Unexpected " + cmd.val + " error!";
                    }
                });
                return false;
            }}
        >
            <input
                type="text"
                class="white"
                placeholder="Write something..."
                    id="postinput"
                    name="postinput"
                autocomplete="false"
                maxlength="250"
            >
            <button>Post</button>
        </form>
        {#if chat_res.error}
            <p>{"Error While Loading, Error: " + chat_res.type}</p>
        {:else}
            <p>{JSON.stringify(chat_res)}</p>
        {/if}
    {:else}
        {#each chats as chat (chat._id)}
            <div>
                <Container>
                    <div class="settings-controls">
                        <button
                            class="circle join"
                            on:click = {()=>{
                                chatid = chat._id
                                inchat = true
                            }}
                        ></button>
                        <button
                            class="circle leave"
                        ></button>
                    </div>

                    <h1>{chat.nickname}</h1>
                    {"Members: "+chat.members.join(", ")}
                </Container>
            </div>
        {/each}
    {/if}
</div>

<style>
    .settings-controls {
		position: absolute;
		top: 0.25em;
		right: 0.25em;
	}

	input[type="checkbox"], button.circle {
		border: none;
		margin: 0;
		margin-left: 0.125em;
	}
</style>