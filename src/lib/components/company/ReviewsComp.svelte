<script lang="ts">
  import { pb } from "$lib/pocketbase";
  import type { Admin, ListResult, Record } from "pocketbase";
  import ReviewForm from "./ReviewForm.svelte";
  import { onDestroy, onMount } from "svelte";
  import { getTimeAgo, serializeNonPOJOs } from "$lib/tools";
  import { writable } from "svelte/store";
  import {
    Activity,
    ActivityItem,
    AdvancedRating,
    Card,
    Rating,
  } from "flowbite-svelte";
  import { hostel_review_agg } from "$lib/stores";

  export let data: {
    reviews: ListResult<Record>|null;
    company: Record;
    user: Record | Admin | null;
    error: any;
  };
  // console.log(data);

  function getReviewImageUrl(record: Record) {
    let imgUrl = record?.photo;
    imgUrl = imgUrl
      ? pb.files.getUrl(record, imgUrl, { thumb: "100x100" })
      : "/images/img1.jpg";
    // console.log(imgUrl)
    return imgUrl;
  }
  const reviews = writable(getStructuredView());

  async function fetchReviews() {
    let reviews_record = await pb
      .collection("company_reviews_aggregations")
      .getOne(data?.company?.id, {
        // expand: 'relField1,relField2.subRelField',
      });
    reviews_record = serializeNonPOJOs(reviews_record);
    hostel_review_agg.set(reviews_record);
  }
  // onMount(async()=>{
  //   await fetchReviews()
  // })
  let interval:any
  onMount(async () => {
    pb.collection("reviews").subscribe("*", async function (e) {
      // console.log(e.record);
      let record = await pb.collection("retrieve_reviews").getOne(e?.record?.id, {
        // expand: 'relField1,relField2.subRelField',
      });
      record = serializeNonPOJOs(record);
      if (data?.reviews) {
        data.reviews.items = [record, ...data?.reviews?.items];
      }
      await fetchReviews();
      updateUi();
    });

    await fetchReviews();
    interval = setInterval(updateUi, 1000);

  });
  
  
  onDestroy(() => {
    // Stop the interval when the component is destroyed
    clearInterval(interval);
    // Unsubscribe
    pb.collection("reviews").unsubscribe("*"); // remove all '*' topic subscriptions
  });

  function getStructuredView() {
    if (data?.reviews) {
      return data.reviews.items.map((obj) => {
        return {
          title: obj?.name,
          date: getTimeAgo(obj?.created),
          alt: "image alt here",
          src: getReviewImageUrl(obj),
          text: obj?.comment,
        };
      });
    }
    return []
  }

  async function updateUi() {
    reviews.set(getStructuredView());
  }

  interface RatingCount {
    rating: number;
    rating_count: number;
  }

  function calculateRatingPercentages(
    ratingCounts: RatingCount[]
  ): { label: string; rating: number }[] {
    const totalRatingCount = ratingCounts.reduce(
      (sum, count) => sum + count.rating_count,
      0
    );
    const ratingPercentages = ratingCounts.map((count) => ({
      label: `${count.rating} star`,
      rating: Math.round((count.rating_count / totalRatingCount) * 100),
    }));

    // Adjust the last rating percentage to ensure it sums up to 100
    const lastRatingPercentage = ratingPercentages.reduce(
      (sum, rating) => sum + rating.rating,
      0
    );
    ratingPercentages[ratingPercentages.length - 1].rating +=
      100 - lastRatingPercentage;

    return ratingPercentages;
  }
</script>

<div>
  <div class="grid relative md:grid-cols-3 gap-6">
    <Card>
      <AdvancedRating
        ratings={calculateRatingPercentages($hostel_review_agg?.rating_counts)}
      >
        <span slot="rating">
          <Rating total={5} rating={3.72} id="example-8">
            <p
              slot="text"
              class="text-sm font-medium text-gray-500 dark:text-gray-400 ml-2"
            >
              {$hostel_review_agg.mean_rate} out of 5
            </p>
          </Rating>
        </span>
        <p
          slot="globalText"
          class="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400"
        >
          {$hostel_review_agg?.total_reviews} total ratings
        </p>
      </AdvancedRating>
    </Card>

    <Card>
      <ReviewForm {data} />
    </Card>
  </div>
</div>

<!-- <PreviewHostelAggReviews/> -->
<div class="p-4">
  <h1 class="text-2xl font-bold mb-4">Reviews</h1>

  <Activity>
    <ActivityItem activities={$reviews} />
  </Activity>

  {#if data?.reviews?.items.length === 0}
    <p>No reviews available.</p>
  {/if}
</div>
