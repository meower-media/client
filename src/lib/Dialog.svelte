<!--
    A Half working dialog UI
    For literally any "Are you sure?" in Meower
-->

<script>
    import { getContext } from 'svelte';
    export let message;
    export let hasForm = false;
    export let onCancel = () => {};
    export let onOkay = () => {};
  
    const { close } = getContext('simple-modal');

    let value;
    let onChange = () => {};
    
    function _onCancel() {
        onCancel();
        close();
    }
    
    function _onOkay() {
        onOkay(value);
        close();
    }
    
    $: onChange(value)
  </script>
  
  <style>
    * {
        background-color: var(--background);
        border: solid 2px var(--orange);
        border-radius: 1px;
    }
    h2 {
          font-size: 2rem;
          text-align: center;
      }
      
      input {
          width: 100%;
      }
      
      .buttons {
          display: flex;
          justify-content: space-between;
      }
      
      .hidden {
          display: none;
      }
  </style>
  
  <h2>{message}</h2>
  
  {#if hasForm}
      <input
      type="text"
        bind:value
        on:keydown={e => e.which === 13 && _onOkay()} />
    <br/>
    <input
          disabled
        type="text"
          value="I'm disabled, but I don't break the tabulation"
      />
    <br/>
    <input
          hidden
        type="text"
          value="I'm hidden, but I don't break the tabulation"
      />
    <br/>
    <input
        type="hidden"
          value="I'm hidden, but I don't break the tabulation"
      />
      <div class="hidden">
          <input
              type="text"
              value="I'm indirectly hidden, but I don't break the tabulation"
          />
    </div>
  {/if}
  
  <div class="buttons">
      <button on:click={_onCancel}>
          Cancel
      </button>
      <button on:click={_onOkay}>
          Okay
      </button>
  </div>