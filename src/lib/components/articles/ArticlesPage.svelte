<script lang="ts">
  import { pb } from "$lib/pocketbase";
  import type { Admin, ListResult, Record } from "pocketbase";
  import ErrorComp from "../ErrorComp.svelte";
  import { Gallery } from "flowbite-svelte";

  export let data: {
    articles: ListResult<Record> | null;
    user: Record | Admin | null;
    company: Record;
    error: any;
  };

  function formatDateTime(dateTimeString: string) {
    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
  }

  const returnImageUrl = (record: Record, imgUrl: string) => {
    imgUrl = imgUrl
      ? pb.files.getUrl(record, imgUrl, { thumb: "100x100" })
      : "/images/img1.jpg";
    // console.log(imgUrl)
    return imgUrl;
  };
  const getImagesURLs = (record: Record) => {
    let images: { src: string }[] = [];
    images = record?.photos?.map((url: string) => ({
      src: returnImageUrl(record, url),
    }));
    return images;
  };
</script>

<div class="p-4 dark:bg-gray-900 dark:text-white bg-white text-black">
  <h1 class="text-2xl font-bold mb-4">Our Products</h1>
  {#if data?.articles}
    <!-- content here -->
    {#each data?.articles?.items as item}
      <div class="mb-4">
        <h2 class="text-xl font-bold">{item?.title}</h2>
        <p>Author: {item?.expand?.author?.name ?? item?.expand?.author?.email}</p>
        <p>Created On: {formatDateTime(item?.created)}</p>

        <h3 class="text-lg font-bold mt-4">Photos:</h3>
        <Gallery
          class="grid relative xl:grid-cols-5 gap-6"
          items={getImagesURLs(item)}
        />
        <a href={`/articles/${item?.id}`} class="text-blue-600">View >></a>
        <hr class="my-4" />
      </div>
    {/each}
  {:else}
    <!-- else content here -->
    {#if data?.error}
      <!-- content here -->
      <ErrorComp error={data?.error} />
    {/if}
  {/if}

  {#if data?.articles?.items?.length === 0}
    <p>No additional services found.</p>
  {/if}
</div>
