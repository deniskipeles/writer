<script lang="ts">
  import ErrorComp from "$lib/components/ErrorComp.svelte";
  import { ai_result_store, ai_input_store } from "$lib/stores";

  import {
    Breadcrumb,
    BreadcrumbItem,
    Gallery,
    Radio,
    Spinner,
  } from "flowbite-svelte";
  import { writable, type Writable } from "svelte/store";

  /** @type {import('./$types').PageData} */
  // export let data: any;

  let error: any = null;
  let loading = false;
  let updateSuccess = false;

  async function handleSubmit() {
    loading = true;
    error = null;

    const response = await fetch("/api/ai", {
      method: "POST",
      body: JSON.stringify($ai_input_store),
      headers: {
        "content-type": "application/json",
      },
    });
    const res = await response.json();

    if (res?.success) {
      loading = false;
      ai_result_store.set(res?.data);
    } else {
      loading = false;
      error = res?.error;
    }
  }

  let items = [
    "general",
    "movies",
    "series",
    "comedies",
    "music",
  ];

  function getImages(images: string[]) {
    return images.map((url) => ({ src: url }));
  }
</script>

<Breadcrumb class="pt-20 py-8">
  <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
  <BreadcrumbItem>AI</BreadcrumbItem>
</Breadcrumb>
<!-- {JSON.stringify($ai_input_store)} -->
<div>
  <p class="mb-4 font-semibold text-gray-900 dark:text-white">AI Helper Category:</p>
  <ul
    class="items-center w-full rounded-lg border border-gray-200 sm:flex dark:bg-gray-800 dark:border-gray-600 divide-x divide-gray-200 dark:divide-gray-600"
  >
    {#each items as item}
      <!-- content here -->
      <li class="w-full">
        <Radio
          value={item}
          bind:group={$ai_input_store.target}
          name="hor-list"
          class="p-3">{item.split("-").join(" ")}</Radio
        >
      </li>
    {/each}
  </ul>
  <div class="relative">
    <div
      id="inputContainer"
      class="border w-full border-gray-300 rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
      contenteditable
      placeholder="Enter you question.."
      bind:innerText={$ai_input_store.question}
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
  {$ai_result_store.answer}
  {#if $ai_result_store.images.length > 0}
    <Gallery
      class="gap-2 grid-cols-2"
      items={getImages($ai_result_store.images)}
    />
  {/if}
 </pre>
