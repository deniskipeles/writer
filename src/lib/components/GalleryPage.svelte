<script>
  export let images = [];
  export let removeImage;
</script>

<div class="grid gap-2 grid-cols-2">
  {#each images as image, index}
    <div class="image">
      <!-- svelte-ignore a11y-img-redundant-alt -->
      <img
        src={image.src}
        alt="Preview Image"
        class="h-auto w-full rounded-lg"
      />

      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div class="remove-button" on:click={() => removeImage(index)}>X</div>
    </div>
  {/each}
</div>

<style>
  .image {
    position: relative;
    cursor: pointer;
    overflow: hidden;
    border-radius: 8px;
  }

  .remove-button {
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 4px;
    border-radius: 50%;
    font-size: 16px;
    cursor: pointer;
  }

  .remove-button:hover {
    background-color: rgb(241, 52, 52);
  }
</style>
