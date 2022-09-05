<script>

    import Container from "../lib/Container.svelte"
    import Post from "../lib/Post.svelte";
    import {chatid_stor,spinner} from "../lib/stores.js";

    let id = 0;
    let chatlist = ""
    let inchat = false
    let chatid = ""
    let chatname = ""
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
            chatposts.unshift({
                id: id++,
                post_id: cmd.val.post_id,
                user: cmd.val.u,
                content: cmd.val.p,
                date: cmd.val.t.e,
            })
            chatposts = chatposts //svelte rendering sucks
        } else if (cmd.val.chatid = chatid) {
            const d = new Date();
            let time = d.getTime()/1000;
            if (cmd.val.state == 1) {
                chatposts.unshift({
                    id: id++,
                    post_id: "system "+id,
                    user: "System",
                    content: cmd.val.u + " Has Joined " + chatname + "!",
                    date: time,
                })
            } else if (cmd.val.state == 0) {
                chatposts.unshift({
                    id: id++,
                    post_id: "system "+id,
                    user: "System",
                    content: cmd.val.u + " Has Left " + chatname + "!",
                    date: time,
                })
            }
            chatposts = chatposts //svelte rendering sucks
        }
    })

    loop_g()

    async function loop_g() {
        if (inchat) {
            if (!chat_res_res) {
                if (chatid == "livechat") {
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
                } else {
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
                    for (var i = 0; i < chat_res.autoget.length; i++) {
                        var post = chat_res.autoget[i]
                        chatposts.push({
                            id: id++,
                            post_id: post.post_id,
                            user: post.u,
                            content: post.p,
                            date: post.t.e,
                        })
                    }
                    chatposts = chatposts //svelte rendering sucks
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
        }
        window.requestAnimationFrame(loop_g)
    }
</script>

<div class="Groupchat">
    {#if inchat}
        <form 
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
        <br />
        <h1>{chatname}</h1>
        {#if chat_res.error}
            <p>{"Error While Loading, Error: " + chat_res.type}</p>
        {:else}
            {#each chatposts as chatpost (chatpost.id)}
                <div>
                    <Post post={chatpost} />
                </div>
            {/each}
        {/if}
    {:else}
        <button on:click = {()=>{
            chatid = "livechat"
            chatname = "Livechat"
            inchat = true
        }}
        >
            Join LiveChat
        </button>
        <br />
        <br />
        {#each chats as chat (chat._id)}
            <div>
                <Container>
                    <div class="settings-controls">
                        <button
                            class="circle join"
                            on:click = {()=>{
                                chatid = chat._id
                                chatname = chat.nickname
                                inchat = true
                            }}
                        ></button>
                        <button
                            class="circle leave"
                            on:click = {()=>{
                                alert("Because of issues, you cant leave")
                            }}
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