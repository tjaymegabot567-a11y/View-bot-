!-- src/widget-ui.html -->
<div class="yt-widget-container">
    <header class="yt-header"><span>Your Bot Logo</span></header>
    
    <!-- Thumbnail area - dynamically injected via JS -->
    <figure class="yt-thumb-wrapper">
        <div class="yt-thumbnail-placeholder"></div>
    </figure>
    
    <h2 class="yt-title">Video Title Goes Here</h2>
    
    <footer class="yt-meta-section">
        <p>Total Views:</p>
        <span class="yt-stats-block yt-counters-group">
            <em>Loading...</em>
        </span>
    </footer>
</div>

<style>
/* Minimal inline styles to keep it self-contained */
.yt-widget-container { font-family: sans-serif; padding: 1rem; border-radius: 8px; max-width: 400px;}
.yt-header { margin-bottom: .5rem; }
.yt-thumb-wrapper { position: relative; width: 100%; height: auto; overflow: hidden; margin-bottom: .5rem; }
.yt-thumbnail-placeholder { background-color: #ddd; transition: opacity .3s ease-in-out; }
.yt-title { word-wrap: break-word; line-height: 1.3; margin-top: 0; }
.yt-meta-section p { margin: 0 0 .25rem; color: #666; font-size: .9rem; }
.yt-counters-group em { font-style: normal; letter-spacing: .5px; }
@media (min-width: 500px) { .yt-widget-container { max-width: none; } }</style>

<script>
document.addEventListener('DOMContentLoaded', () => {
    // Grab references to elements we'll update
    const thumbPlaceholder = document.querySelector('.yt-thumbnail-placeholder');
    const metaSection = document.querySelector('.yt-meta-section');
    const countersGroup = document.querySelector('.yt-counters-group');
    const titleEl = document.querySelector('.yt-title');
    
    // Define our API base path matching exactly what index.js exposes
    const apiUrlBasePath = '/view'; 
    
    // Prepare event listeners for each clickable region on the widget
    thumbPlaceholder.onclick = () => loadWidgetData(apiUrlBasePath);
    metaSection.onclick = () => loadWidgetData(apiUrlBasePath);
    countersGroup.onclick = () => loadWidgetData(apiUrlBasePath);
});

async function loadWidgetData(url) {
    try {
        const resp = await fetch(url, { method: 'POST' });
        
        if (!resp.ok) throw new Error(`HTTP ${resp.status}: Failed to fetch.`);
        
        const data = await resp.json();
        
        // Inject thumbnail image - assuming high-res version exists
        const hdThumbSrc = data.thumbnails.highres.url;
        if (hdThumbSrc) {
            thumbPlaceholder.style.opacity = '1';
            thumbPlaceholder.innerHTML = `<img src="${hdThumbSrc}" alt="" />`;
        } else {
            thumbPlaceholder.classList.add('fade-empty-state');
        }
        
        // Update title safely, preserving whitespace handling
        titleEl.textContent = data.title || '(Untitled)';
        
        // Format total views using our shared utility module
        const formattedTotalViews = formatDuration(data.views);
        countersGroup.innerHTML = `<strong>${formattedTotalViews}</strong>`;
        
        // Optional: cycle through additional metrics for richer visuals
        if (data.likes !== undefined && data.comments !== undefined) {
            const likesStr = formatNumber(data.likes);
            const commentsStr = formatNumber(data.comments);
            counterBlockOne.innerHTML = `${likesStr} Likes • ${commentsStr} Comments`;
        }
        
        // Reveal secondary stat blocks sequentially for animation effect
        revealStatBlocks(counterBlockTwo);
        setTimeout(() => revealStatBlocks(counterBlockThree), 300);
        setTimeout(() => revealStatBlocks(counterBlockFour), 600);
        
    } catch (err) {
        console.error(err.message);
        metaSection.innerText = err.message;
    }
}

function formatNumber(n) { return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g,', '); }
function revealStatBlocks(container) { container.style.display = 'block'; }
</script>
