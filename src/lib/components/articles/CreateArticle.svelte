<script lang="ts">
  // import Counter from "../Counter.svelte";
  import Editor from "@tinymce/tinymce-svelte";
  import { goto } from "$app/navigation";
  import {
    createArticleListStore,
    articleSelectedForEditingPosition,
  } from "$lib/stores";

  import { Button, Helper, Input, Label, Spinner } from "flowbite-svelte";
  import PreviewChunks from "./PreviewChunks.svelte";
  import ImagesList from "./ImagesList.svelte";

  let apiKey = "q7h0i8r0h7ha598lyeh91pwubnpq34dseiz76p98qmzol7dc";

  let body = "<p>Hello World ....</p>";
  let title: string;
  let photos: string[] = [];

  const getImageSrc = () => {
    var images = [];
    var span = document.createElement("span");
    span.innerHTML = body;
    var imageTags = span.getElementsByTagName("img");

    for (var i in imageTags) {
      var src = imageTags[i].src;
      if (src != null && src != undefined) {
        images.push(src);
      }
    }

    if (images.length > 10) {
      photos = images.slice(0, 10);
    } else {
      photos = images;
    }
    console.log(photos);
  };

  // const logPhotos = () => console.log(photos)

  const uploadFile = async (pic: File) => {};

  let conf = {
    height: 500,
    images_upload_handler: uploadFile,
    plugins: [
      // "a11ychecker",
      // "advlist",
      // "advcode",
      // "advtable",
      // "checklist",
      // "export",
      // "powerpaste",
      // "formatpainter",
      "autolink",
      "lists",
      "link",
      "image",
      "charmap",
      "preview",
      "anchor",
      "searchreplace",
      "visualblocks",
      "fullscreen",
      "insertdatetime",
      "media",
      "table",
      "help",
      "wordcount",
    ],
    toolbar:
      "undo redo | a11ycheck casechange blocks | bold italic backcolor | alignleft aligncenter alignright alignjustify | " +
      "bullist numlist checklist outdent indent | removeformat | code table help",
  };

  // let percentage = 0;

  let error: any = null;
  let loading = false;

  async function handleSubmit() {
    loading = true;
    error = null;

    const response = await fetch("/api/ai", {
      method: "POST",
      body: JSON.stringify({
        q: `${$createArticleListStore[$articleSelectedForEditingPosition].ai_keywords}`,
      }),
      headers: {
        "content-type": "application/json",
      },
    });
    const res = await response.json();

    if (res?.success) {
      // console.log(res);
      const dt = $createArticleListStore[$articleSelectedForEditingPosition];
      loading = false;
      const dtToPush = {
        ...dt,
        identity: "ai",
        html_article_content: `<p>${res?.data?.answer}</p>`,
        ai_photos: res?.data?.images,
        ai_article_content: res?.data?.answer,
      };
      // console.log(dtToPush);
      createArticleListStore.update((list) => {
        list = [...list, dtToPush];
        return list;
      });
      let pos = $createArticleListStore.length - 1;
      articleSelectedForEditingPosition.set(pos);
    } else {
      loading = false;
      error = res?.error;
    }
  }

  let translating = false;
  let errorTrans = null;
  async function handleTranslate() {
    translating = true;
    errorTrans = null;

    const response = await fetch("/api/translate", {
      method: "POST",
      body: JSON.stringify({
        text: $createArticleListStore[$articleSelectedForEditingPosition]
          .html_article_content,
      }),
      headers: {
        "content-type": "application/json",
      },
    });
    const res = await response.json();

    if (res?.success) {
      translating = false;
      createArticleListStore.update((list) => {
        list = list.map((obj, id) => {
          if (id == $articleSelectedForEditingPosition) {
            obj.html_article_content = res?.data?.text;
          }
          return obj;
        });
        return list;
      });
    } else {
      translating = false;
      errorTrans = res?.error;
    }
  }

  function translate() {
    if ($createArticleListStore.length > 1) {
      handleTranslate();
    }
  }
</script>

<div class="flex flex-wrap items-center gap-2">
  <PreviewChunks />
  {#if translating}
    <Button><Spinner />translating...</Button>
  {:else}
    <Button on:click={translate}>Translate</Button>
  {/if}
  <ImagesList/>
</div>

<Label class="block space-y-2">
  <span>Title:</span>
  <Input
    bind:value={$createArticleListStore[$articleSelectedForEditingPosition]
      .title}
    label="Email"
    id="email"
    name="email"
    required
    placeholder="Title.."
  />
  <Helper class="text-sm"
    >This the title of the article.</Helper
  >
</Label>

<Label class="block space-y-2">
  <span>Key Words:</span>
  <div class="relative">
    <div
      id="inputContainer"
      class="border w-full border-gray-300 rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
      contenteditable
      placeholder="Enter you question.."
      bind:innerText={$createArticleListStore[
        $articleSelectedForEditingPosition
      ].ai_keywords}
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
  <Helper class="text-sm"
    >Start Entering Keywords And Send It AI To Generate The Article.</Helper
  >
</Label>

<br />
<Editor
  {apiKey}
  {conf}
  bind:value={$createArticleListStore[$articleSelectedForEditingPosition]
    .html_article_content}
/>
