<script lang="ts">
  import { onMount } from "svelte";
  // Assuming these exist in your project
  import { SDK_V3 } from "$lib/sdk/index";
  import type { PipelineConfig } from "$lib/sdk/v3/orchestra/types";

  let hydrated = false;

  const config_dev : PipelineConfig = {
      apiBaseUrl: "http://localhost:5173/api/v2/public/",
      jwtToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaXRlSWQiOiIzY2M0MGJiYy0yYjcxLTRhZGMtOTYwNC0wY2U1MjY1ZjExNmMiLCJkb21haW4iOiJsb2NhbGhvc3Q6NTE3MyIsInBlcm1pc3Npb25zIjpbInJlYWQ6Y29udGVudCJdLCJpYXQiOjE3NjMwNTA3ODQsImV4cCI6MTc5NDU4Njc4NH0.gEo8liJIL-Snf02nZZfPct0iKyhfXu96jTgPDK8z8yI"
  }

  const config_prod : PipelineConfig = {
    apiBaseUrl: "https://foundy-opal.vercel.app/api/v2/public",
    jwtToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzaXRlSWQiOiJkNWRjOWQyOC05MmJkLTRjM2QtOTI4YS0yMjRlMWVjNzBhZTAiLCJkb21haW4iOiJmb3VuZHktb3BhbC52ZXJjZWwuYXBwIiwicGVybWlzc2lvbnMiOlsicmVhZDpjb250ZW50Il0sImlhdCI6MTc2MzA1MTM4OSwiZXhwIjoxNzk0NTg3Mzg5fQ.xb-BlsS8Qho_m59dQb1NOKVYs8rc3CMtopIskoU8Ki8"
  }

  onMount(async () => {
    const isDev : boolean = window.location.hostname === "localhost";
    const usingConfig : PipelineConfig = isDev ? config_dev : config_prod;

    SDK_V3.configure(usingConfig);
    SDK_V3.run();
    
    hydrated = true;
  });
</script>

<style>
  /* --- THEME: SKELETON "MONA" --- */
  :root {
    /* BACKGROUNDS: Zinc Palette */
    --mona-bg: #09090b;       /* Zinc-950 */
    --mona-surface: #18181b;  /* Zinc-900 */
    --mona-surface-hover: #27272a; /* Zinc-800 */
    
    /* TEXT */
    --mona-text-main: #fafafa; /* Zinc-50 */
    --mona-text-muted: #a1a1aa; /* Zinc-400 */
    
    /* BORDERS */
    --mona-border: #27272a;   /* Zinc-800 */
    
    /* PRIMARY: Rose Palette */
    --mona-primary: #f43f5e;  /* Rose-500 */
    --mona-primary-hover: #e11d48; /* Rose-600 */
    --mona-primary-glow: rgba(244, 63, 94, 0.35); /* Rose-500 with opacity */
    
    /* FONT */
    --mona-font: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }

  :global(html) { scroll-behavior: smooth; }

  body {
    background-color: var(--mona-bg);
    color: var(--mona-text-main);
    font-family: var(--mona-font);
    margin: 0;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  /* --- UTILITIES --- */
  .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
  .section-spacer { padding: 100px 0; border-bottom: 1px solid var(--mona-border); }
  .text-center { text-align: center; }
  
  /* BUTTONS */
  .btn-primary {
    background-color: var(--mona-primary);
    color: #fff;
    border: none;
    padding: 12px 24px;
    border-radius: 9999px; /* Pill shape standard in Mona theme */
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 4px 14px var(--mona-primary-glow);
  }
  .btn-primary:hover {
    background-color: var(--mona-primary-hover);
    transform: translateY(-1px);
    box-shadow: 0 6px 20px var(--mona-primary-glow);
  }

  /* --- HERO SECTION --- */
  .hero-wrapper {
    position: relative;
    padding: 160px 0 100px;
    text-align: center;
    /* Zinc Grid Pattern */
    background-image: 
      linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    border-bottom: 1px solid var(--mona-border);
    overflow: hidden;
  }

  /* Rose Glow Backdrop */
  .hero-wrapper::before {
    content: '';
    position: absolute;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    width: 600px;
    height: 400px;
    background: radial-gradient(circle, var(--mona-primary-glow) 0%, transparent 70%);
    z-index: -1;
    pointer-events: none;
    filter: blur(60px);
  }
  
  /* Titles injected by SDK */
  .hero-title {
    font-size: 4.5rem; /* Larger, bolder hero for Mona */
    font-weight: 800;
    margin-bottom: 24px;
    line-height: 1.1;
    /* Gradient Text: White to Rose-200 */
    background: linear-gradient(to bottom right, #fff 30%, #fecdd3 100%); 
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  /* --- GRID SYSTEM (Matches 'pricing', 'post', 'product') --- */
  .foundy-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: 24px;
    margin-top: 50px;
  }

  /* SDK Children Styling */
  .foundy-grid :global(> div) {
    background: var(--mona-surface);
    border: 1px solid var(--mona-border);
    border-radius: 12px; /* Softer corners */
    padding: 28px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    transition: all 0.2s ease;
  }

  .foundy-grid :global(> div:hover) {
    border-color: var(--mona-primary); /* Pink border on hover */
    box-shadow: 0 0 20px rgba(244, 63, 94, 0.1);
    transform: translateY(-4px);
  }

  /* Typography inside Cards */
  .foundy-grid :global(h1), 
  .foundy-grid :global(h2), 
  .foundy-grid :global(h3) {
    color: var(--mona-text-main);
    margin: 16px 0 8px;
    font-weight: 700;
  }
  
  /* Pricing Specifics (string[] lists) */
  .pricing-grid :global(ul) {
    padding-left: 20px;
    margin-top: 20px;
    color: var(--mona-text-muted);
  }
  .pricing-grid :global(li) {
    margin-bottom: 10px;
  }
  .pricing-grid :global(li::marker) {
    color: var(--mona-primary); /* Rose bullets */
  }

  /* Images inside cards */
  .foundy-grid :global(img) {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    background-color: #000;
  }

  /* --- LOGO WALL --- */
  .logo-wall {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 50px;
    opacity: 0.5;
    margin-top: 30px;
    filter: grayscale(100%);
    transition: opacity 0.3s;
  }
  .logo-wall:hover { opacity: 0.9; }
  .logo-wall :global(img) { height: 32px; width: auto; }

  /* --- FAQ GRID --- */
  .faq-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    margin-top: 40px;
  }
  .faq-grid :global(> div) {
    border-bottom: 1px solid var(--mona-border);
    padding-bottom: 24px;
  }
  .faq-grid :global(h3) {
    color: var(--mona-primary); /* Rose Questions */
    font-size: 1.1rem;
    margin-bottom: 12px;
    font-weight: 600;
  }
  .faq-grid :global(p) { color: var(--mona-text-muted); }

</style>

<main>
  
  <section class="hero-wrapper">
    <div class="container">
      <div style="margin-bottom: 24px;">
        <img data-foundy="homepage:<hero<logo>>" style="height: 64px; width: auto;" alt="App Logo" />
      </div>

      <h1 class="hero-title" data-foundy="homepage:<hero<title>>"></h1>
      
      <p style="color: var(--mona-text-muted); font-size: 1.25rem; max-width: 650px; margin: 0 auto 40px; font-weight: 300;" 
         data-foundy="homepage:<hero<subtitle>>">
      </p>

      <button class="btn-primary">Get Started</button>
    </div>
  </section>

  <section class="container section-spacer">
    <div class="text-center" style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px; color: var(--mona-text-muted); margin-bottom: 20px;">
      Powering next-gen teams
    </div>
    
    <div class="logo-wall" data-foundy="homepage:<featured>">
    </div>
  </section>

  <section class="container section-spacer">
    <div class="text-center">
      <h2 style="font-size: 2.5rem; margin-bottom: 10px; font-weight: 700;">Transparent Pricing</h2>
      <p style="color: var(--mona-text-muted);">No hidden fees. Cancel anytime.</p>
    </div>

    <div class="foundy-grid pricing-grid" data-foundy="homepage:<pricing>">
    </div>
  </section>

  <section class="container section-spacer">
    <div style="display:flex; justify-content:space-between; align-items: flex-end; margin-bottom: 20px;">
      <h2 style="font-size: 2rem; margin:0; font-weight: 700;">Latest Updates</h2>
      <a href="/blog" style="color: var(--mona-primary); font-weight: 600; text-decoration: none;">Read the blog &rarr;</a>
    </div>

    <div class="foundy-grid" data-foundy="post::0-3">
    </div>
  </section>

  <section class="container section-spacer" style="border-bottom: none;">
    <h2 style="font-size: 2rem; margin-bottom: 10px; font-weight: 700;">Questions?</h2>
    
    <div class="faq-grid" data-foundy="homepage:<faq>">
    </div>
  </section>

</main>