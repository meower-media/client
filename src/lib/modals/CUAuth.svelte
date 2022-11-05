<script>
    import Modal from "../Modal.svelte";

    import {modalShown} from "../stores.js";
</script>

<Modal on:close={() => {$modalShown = false}}>
    <h2 slot="header">
        CubeUpload Login
    </h2>
    <div slot="default">
        <!-- svelte-ignore missing-declaration -->
        <form
			on:submit|preventDefault={async e => {
				var http = new XMLHttpRequest()
                http.open('POST', "https://cubeupload.com/login", true)
                http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
                http.onreadystatechange = function() {//Call a function when the state changes.
                    if(http.readyState == 4 && http.status == 200) {
                        alert(http.responseText);
                    }
                }
                http.send("cube_username=" + e.target[0].value + "&cube_password=" + e.target[1].value + "&login=Login")
			}}
		>
            <input type="text" class="modal-input white" placeholder="Username" maxlength="64" /><br /><br />
			<input type="password" class="modal-input white" placeholder="Password" maxlength="64" /><br /><br />
			<div class="modal-buttons">
				<button type="submit">Login To CubeUpload</button>
			</div>
		</form>
    </div>
</Modal>