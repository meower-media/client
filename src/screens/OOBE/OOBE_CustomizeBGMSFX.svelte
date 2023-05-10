<script>
	import Container from "../../lib/Container.svelte";
    import * as clm from "../../lib/clmanager.js";
    import {user} from "../../lib/stores.js";
	
</script>

<div>
    <div id="ScrollableThing">
        <Container>
            <div class="settings-controls">
                <input
                    type="checkbox"
                    checked={$user.sfx}
                    on:change={() => {
                        const _user = $user;
                        _user.sfx = !_user.sfx;
                        user.set(_user);
        
                        clm.updateProfile();
                    }}
                />
            </div>
        
            <h2>Sound Effects</h2>
            Sound effects (for new messages) are currently {!$user.sfx
                ? "disabled"
                : "enabled"}.
        </Container>
        TODO: BGM
    </div>
</div>

<style>
    #ScrollableThing {
        width: 50%;
        left: 50%;
        transform: translate(-50%,0);
        position: relative;
    }
</style>
