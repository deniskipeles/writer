<script lang="ts">
  import {
    articleSelectedForEditingPosition,
    createArticleListStore,
    type Article,
  } from "$lib/stores";
  import { concatenateFieldValues } from "$lib/tools";
  import { Drawer, Button, CloseButton, Checkbox, Card } from "flowbite-svelte";
  import { sineIn } from "svelte/easing";
  let hidden1 = true;
  let transitionParams = {
    x: -320,
    duration: 200,
    easing: sineIn,
  };

  function getWordCount(str: string, maxWords: number): string {
    const trimmedStr = str.trim();
    const words = trimmedStr.split(/\s+/);
    const selectedWords = words.slice(0, maxWords);
    const remainingWords = Math.max(words.length - maxWords, 0);
    const word = selectedWords.join(" ");
    return `
      ${word}...
      ${remainingWords} more
    `;
  }

  function setArticleToEdit(key: number, ai: string) {
    articleSelectedForEditingPosition.set(key);
    if (ai == "whole") {
      const dt = $createArticleListStore[0];
      const dtToPush = {
        ...dt,
        html_article_content: `<p>${concatenateFieldValues(
          $createArticleListStore,
          "html_article_content"
        )}</p>`,
        ai_article_content: concatenateFieldValues(
          $createArticleListStore,
          "ai_article_content"
        ),
      };
      // console.log(dtToPush);
      createArticleListStore.update((list) => {
        list = list.map((obj, id) => {
          if (id == 0) {
            return dtToPush;
          } else {
            return obj;
          }
        });
        return list;
      });
    }
  }

  
</script>

<div class="text-center">
  <Button on:click={() => (hidden1 = false)}>AI Generated Chunk List</Button>
</div>

<Drawer
  transitionType="fly"
  {transitionParams}
  bind:hidden={hidden1}
  id="sidebar1"
>
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
      >CHUNKS OF ARTICLES
    </h5>
    <CloseButton
      on:click={() => (hidden1 = true)}
      class="mb-4 dark:text-white"
    />
  </div>
  <p class="mb-6 text-sm text-gray-500 dark:text-gray-400">
    This the list of the generated articles
  </p>
  {#each $createArticleListStore as record, key}
    {#if key > 0}
      <div class="rounded border border-gray-200 dark:border-gray-700">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          class="hover:outline-dotted"
          on:click={() => setArticleToEdit(key, record?.identity)}
        >
          <Card>
            {@html getWordCount(record.ai_article_content, 30)}
          </Card>
        </div>
      </div>
    {:else}
      <div class="rounded border border-gray-200 dark:border-gray-700">
        <p>Combined Article</p>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div
          class="hover:outline-dotted"
          on:click={() => setArticleToEdit(0, "whole")}
        >
          <Card>
            {@html getWordCount(
              concatenateFieldValues(
                $createArticleListStore,
                "ai_article_content"
              ),
              50
            )}
          </Card>
        </div>
      </div>
    {/if}
  {/each}
</Drawer>
