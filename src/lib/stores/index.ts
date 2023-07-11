import type { ListResult, Record } from "pocketbase";
import { writable, type Writable } from "svelte/store";

export const ai_input_store = writable({
  question: "",
  target: "movies",
});
export const ai_result_store = writable({
  answer: "Hi. I am ai powered by bard.",
  links: [],
  images: [],
});

// Create a writable store for form data
export const bookingFormData = writable({
  room_id: "",
  check_in_date: "",
  check_out_date: "",
});

export const hostel_review_agg: Writable<Record | any> = writable({
  hostel_id: "RECORD_ID",
  mean_rate: 4.5,
  mode_rate: 5,
  median_rate: 4,
  total_reviews: 50,
  max_rate: 5,
  min_rate: 3,
  rating_counts: [
    { rating: 1, rating_count: 10 },
    { rating: 2, rating_count: 5 },
    { rating: 3, rating_count: 8 },
    { rating: 4, rating_count: 20 },
    { rating: 5, rating_count: 7 },
  ],
});

export const createJobStore = writable({
  employer: "",
  employee: [],
  down_payment: 500,
  estimated_full_payment: 1500,
  services: [],
});

export const createArticleListStore: Writable<
  {
    title: string;
    ai_keywords: string;
    photos: string[];
    ai_photos: string[];
    html_article_content: string;
    ai_article_content: string;
    publish_date: string;
    public: boolean;
  }[]
> = writable([]);
export const articleSelectecForEditing:Writable<
{
  title: string;
  ai_keywords: string;
  photos: string[];
  ai_photos: string[];
  html_article_content: string;
  ai_article_content: string;
  publish_date: string;
  public: boolean;
}
> = writable({
  title: "",
  ai_keywords: "",
  photos: [],
  ai_photos: [],
  html_article_content: "<p>Hello World ....</p>",
  ai_article_content: "",
  publish_date: "2022-01-01 10:00:00.123Z",
  public: true,
});
export const articleSelectecForEditingPosition = writable(0);

export const searchCustomers: Writable<ListResult<Record>> = writable();
