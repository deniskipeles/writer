<script lang="ts">
  // import Counter from "../Counter.svelte";
  import Editor from "@tinymce/tinymce-svelte";
  import { goto } from "$app/navigation";
  import {
    articleSelectecForEditing,
    createArticleListStore,
  } from "$lib/stores";
  import { list } from "postcss";
  import { Spinner } from "flowbite-svelte";

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
      "a11ychecker",
      "advlist",
      "advcode",
      "advtable",
      "autolink",
      "checklist",
      "export",
      "lists",
      "link",
      "image",
      "charmap",
      "preview",
      "anchor",
      "searchreplace",
      "visualblocks",
      "powerpaste",
      "fullscreen",
      "formatpainter",
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
        ...$articleSelectecForEditing,
        q: `${$articleSelectecForEditing?.ai_keywords}`,
      }),
      headers: {
        "content-type": "application/json",
      },
    });
    const res = await response.json();

    if (res?.success) {
      // console.log(res)
      loading = false;
      articleSelectecForEditing.set({
        ...$articleSelectecForEditing,
        html_article_content: `<p>${res?.data?.answer}</p>`,
        ai_photos: res?.data?.images,
        ai_article_content: res?.data?.answer,
      });
      // createArticleListStore.update((list) => {
      //   list = [...list, val];
      //   return list;
      // });
    } else {
      loading = false;
      error = res?.error;
    }
  }

  function extractContent(s: string) {
    var span = document.createElement("span");
    span.innerHTML = s;
    return span.textContent || span.innerText;
  }
</script>

<label for="title">Title:</label>
<input
  bind:value={$articleSelectecForEditing.ai_keywords}
  type="text"
  id="title"
  placeholder="Enter title"
  name="title"
  required
/>
<div>
  <div class="relative">
    <div
      id="inputContainer"
      class="border w-full border-gray-300 rounded p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
      contenteditable
      placeholder="Enter you question.."
      bind:innerText={$articleSelectecForEditing.ai_keywords}
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

<br />
<Editor
  {apiKey}
  {conf}
  bind:value={$articleSelectecForEditing.html_article_content}
/>

<style>
  form {
    font-family: Arial, Helvetica, sans-serif;
  }
  * {
    box-sizing: border-box;
  }

  .form-inline {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
  }

  .form-inline label {
    margin: 5px 10px 5px 0;
  }

  .form-inline input {
    vertical-align: middle;
    margin: 5px 10px 5px 0;
    padding: 10px;
    background-color: #fff;
    border: 1px solid #ddd;
  }

  .form-inline button {
    padding: 10px 20px;
    background-color: dodgerblue;
    border: 1px solid #ddd;
    color: white;
    cursor: pointer;
  }

  .form-inline button:hover {
    background-color: royalblue;
  }

  @media (max-width: 800px) {
    .form-inline input {
      margin: 10px 0;
    }

    .form-inline {
      flex-direction: column;
      align-items: stretch;
    }
  }
</style>
