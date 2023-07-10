<script lang="ts">
  import ErrorComp from "$lib/components/ErrorComp.svelte";

  import {
    Spinner,
    Button,
    Drawer,
    CloseButton,
  } from "flowbite-svelte";
  import { sineIn } from "svelte/easing";
  import { writable, type Writable } from "svelte/store";

  export let data:string

  const dt = writable({
    question: "",
    conversation_id: "",
  });
  const result = writable({ answer: "Hi. I am ai powered by bard." });
  let error: any = null;
  let loading = false;
  let updateSuccess = false;

  async function handleSubmit() {
    loading = true;
    error = null;
    let {question,conversation_id} = $dt
    question = `>>${data}<< ${question}`
    const response = await fetch("/api/ai", {
      method: "POST",
      body: JSON.stringify({question,conversation_id}),
      headers: {
        "content-type": "application/json",
      },
    });
    const res = await response.json();

    if (res?.success) {
      loading = false;
      result.set(res?.data);
    } else {
      loading = false;
      error = res?.error;
    }
  }

  let hidden = true;
  let transitionParams = {
    x: -320,
    duration: 200,
    easing: sineIn,
  };
</script>

<Button on:click={() => (hidden = false)} pill={true}>Need Advice? Ask our AI.</Button>
<Drawer transitionType="fly" {transitionParams} bind:hidden id="sidebar1">
  <div class="flex items-center">
    <h5
      id="drawer-label"
      class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400"
    >
      <svg
        class="w-5 h-5 mr-2"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
        ><path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
          clip-rule="evenodd"
        /></svg
      >AI PRODUCT GUIDE
    </h5>
    <CloseButton
      on:click={() => (hidden = true)}
      class="mb-4 dark:text-white"
    />
  </div>

  <div>
    <div class="relative">
      <div
        id="inputContainer"
        class="border w-full border-gray-300 rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
        contenteditable
        bind:innerText={$dt.question}
        style="min-height: 1rem; max-height: 10rem;"
      />
      {#if loading}
        <div>
          <Spinner
            class="absolute right-0 flex items-center justify-center rounded-full w-10 h-10 bottom-0"
          />
        </div>
      {:else}
        <button
          on:click={async () => await handleSubmit()}
          class="absolute right-0 flex items-center justify-center bg-blue-500 text-white rounded-full w-10 h-10 focus:outline-none bottom-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="h-6 w-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      {/if}
    </div>
  </div>

  {#if error}
    <ErrorComp {error} />
  {/if}

  <pre class="bg-gray-100 text-lg rounded p-4 shadow-md whitespace-pre-wrap">
    {@html $result.answer}
   </pre>
</Drawer>
