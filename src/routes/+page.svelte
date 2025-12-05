<script>
  import { onMount } from "svelte";
  import { SDK_V3 } from "$lib/sdk/index";

  let hydrated = false;

  onMount(async () => {
    SDK_V3.configure({
      apiBaseUrl: "http://localhost:5173/api/v2/public/",
      jwtToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaXRlSWQiOiIzY2M0MGJiYy0yYjcxLTRhZGMtOTYwNC0wY2U1MjY1ZjExNmMiLCJkb21haW4iOiJsb2NhbGhvc3Q6NTE3MyIsInBlcm1pc3Npb25zIjpbInJlYWQ6Y29udGVudCJdLCJpYXQiOjE3NjMwNTA3ODQsImV4cCI6MTc5NDU4Njc4NH0.gEo8liJIL-Snf02nZZfPct0iKyhfXu96jTgPDK8z8yI"
    })
    SDK_V3.run();
    
    // await SDK_V2.configure({
    //   jwtToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaXRlSWQiOiIzY2M0MGJiYy0yYjcxLTRhZGMtOTYwNC0wY2U1MjY1ZjExNmMiLCJkb21haW4iOiJsb2NhbGhvc3Q6NTE3MyIsInBlcm1pc3Npb25zIjpbInJlYWQ6Y29udGVudCJdLCJpYXQiOjE3NjMwNTA3ODQsImV4cCI6MTc5NDU4Njc4NH0.gEo8liJIL-Snf02nZZfPct0iKyhfXu96jTgPDK8z8yI",
    //   baseUrl: "http://localhost:5173/",
    //   autoHydrate: true,
    //   dev: true
    // });

    // // Once Foundy is hydrated → fade in content
    hydrated = true;
  });
</script>

<style>
  .container { max-width: 1200px; margin: 0 auto; padding: 3rem 1.5rem; }
  .hero { text-align: center; padding: 6rem 1rem; }
  .title { font-size: 3rem; font-weight: 700; }
  .subtitle { font-size: 1.25rem; color: #555; margin-top: 1rem; }
  .button { background: black; color: white; padding: 0.75rem 1.5rem; border-radius: 8px; margin-top: 2rem; display: inline-block; }

  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem; margin-top: 4rem; }
  .card { padding: 2rem; border: 1px solid #eee; border-radius: 12px; background: white; transition: 0.2s; }
  .card:hover { box-shadow: 0 6px 25px rgba(0,0,0,0.07); }

  /* Hidden before hydration */
  .fade {
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  /* Visible after hydration */
  .fade.show {
    opacity: 1;
  }
</style>

<!-- HERO SECTION -->
<section
  class="hero container fade {hydrated ? 'show' : ''}"
  data-foundy="homepage:<faq<a>>:"
  data-priority="10">
</section>

<!-- FEATURES GRID SECTION -->
<section class="container fade {hydrated ? 'show' : ''}">
  <h2
    class="title"
    style="font-size:2rem; text-align:center"
    data-foundy="homepage:homepage"
    data-priority="9">
  </h2>

  <div
    class="grid"
    data-foundy="post::0-10"
    data-priority="10">
  </div>
</section>
