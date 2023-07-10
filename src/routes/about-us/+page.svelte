<script lang="ts">
  import { Breadcrumb, BreadcrumbItem } from "flowbite-svelte";
  export let data;
  let hostelName = data?.company?.name;
  let hostelDescription =
    "Welcome to Our Workshop! We are a cozy and friendly services located in the heart of the city. Our mission is to provide a affordable and quality services. With our convenient location, excellent facilities, and dedicated staff, we strive to make your experience with us unforgettable.";
</script>

<Breadcrumb class="pt-20 py-8">
  <BreadcrumbItem href="/" home>Home</BreadcrumbItem>
  <BreadcrumbItem>About Us</BreadcrumbItem>
</Breadcrumb>

<div class="max-w-lg mx-auto">
  <h2 class="text-2xl font-bold mb-4">About {hostelName}</h2>

  <p class="text-gray-600">{hostelDescription}</p>
</div>
