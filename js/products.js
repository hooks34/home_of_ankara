const PRODUCTS_PER_PAGE = 12;

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let activeCategory = 'all';
let maxPrice = 200000;
let searchQuery = '';

async function initProductsPage() {
  try {
    const res = await fetch('data/products.json');
    allProducts = await res.json();
  } catch (err) {
    const gridError = document.getElementById('products-grid');
    if (gridError) {
      gridError.innerHTML =
        '<p style="color: var(--color-cream); grid-column: 1/-1; text-align:center; padding: 4rem 0;">Unable to load products at the moment.</p>';
    }
    return;
  }

  applyFilters();

  document.querySelectorAll('.filter-chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      document.querySelectorAll('.filter-chip').forEach(function (c) {
        c.classList.remove('active');
      });
      chip.classList.add('active');
      activeCategory = chip.dataset.category || 'all';
      currentPage = 1;
      applyFilters();
    });
  });

  const priceSlider = document.getElementById('price-max');
  const priceDisplay = document.getElementById('price-display');

  if (priceSlider) {
    priceSlider.addEventListener('input', function () {
      maxPrice = parseInt(priceSlider.value, 10);
      if (priceDisplay)
        priceDisplay.textContent = '\u20A6' + maxPrice.toLocaleString();
      currentPage = 1;
      applyFilters();
    });
  }

  const searchInput = document.getElementById('product-search');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      searchQuery = searchInput.value.trim().toLowerCase();
      currentPage = 1;
      applyFilters();
    });
  }

  const applyBtn = document.querySelector('.filter-apply');
  if (applyBtn) {
    applyBtn.addEventListener('click', function () {
      currentPage = 1;
      applyFilters();
    });
  }

  const clearBtn = document.querySelector('.filter-clear');
  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      activeCategory = 'all';
      maxPrice = 200000;
      searchQuery = '';
      currentPage = 1;

      document.querySelectorAll('.filter-chip').forEach(function (c) {
        c.classList.toggle('active', c.dataset.category === 'all');
      });

      if (priceSlider) priceSlider.value = String(maxPrice);
      if (priceDisplay)
        priceDisplay.textContent = '\u20A6200,000';
      if (searchInput) searchInput.value = '';

      applyFilters();
    });
  }

  const loadMoreBtn = document.getElementById('load-more-btn');
  const loadMoreLoader = document.getElementById('load-more-loader');

  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function () {

      loadMoreBtn.style.display = 'none';
      loadMoreLoader.style.display = 'inline-block';

      setTimeout(function () {
        currentPage += 1;
        renderProducts(false);

        loadMoreLoader.style.display = 'none';

        const start = (currentPage - 1) * PRODUCTS_PER_PAGE;
        if (start < filteredProducts.length) {
          loadMoreBtn.style.display = 'inline-flex';
        }
      }, 800);
    });
  }

  const featuredTrack = document.getElementById('featured-track');
  const featuredTabs = document.querySelectorAll(
    '.featured-products__tab'
  );

  if (featuredTrack) {
    renderFeaturedProducts(featuredTrack);
  }

  if (featuredTabs.length && featuredTrack) {
    featuredTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        featuredTabs.forEach(function (t) {
          t.classList.remove('active');
        });

        tab.classList.add('active');

        const filter = tab.dataset.filter;

        let featured;

        if (filter === 'all') {
          featured = allProducts.slice(0, 3);
        } else {
          featured = allProducts
            .filter(function (p) {
              return p.categories.includes(filter);
            })
            .slice(0, 3);
        }

        featuredTrack.innerHTML = '';

        featured.forEach(function (product) {
          featuredTrack.appendChild(createFeaturedProductCard(product));
        });

        const viewMore = document.createElement('div');
        viewMore.className = 'view-more-card';
        viewMore.innerHTML = `
          <a href="products.html" class="view-more-card__link">
            <span class="view-more-card__text">View More</span>
            <div class="view-more-card__dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </a>
        `;
        featuredTrack.appendChild(viewMore);
      });
    });
  }
}

function applyFilters() {
  filteredProducts = allProducts.filter(function (p) {
    const catMatch =
      activeCategory === 'all' ||
      p.categories.includes(activeCategory);
    const priceMatch = p.price <= maxPrice;
    const nameMatch = p.name
      .toLowerCase()
      .includes(searchQuery);

    return catMatch && priceMatch && nameMatch;
  });

  renderProducts(true);
}

function renderProducts(reset) {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  if (reset) grid.innerHTML = '';

  const start =
    (currentPage - 1) * PRODUCTS_PER_PAGE;
  const end = start + PRODUCTS_PER_PAGE;

  const page = filteredProducts.slice(start, end);

  page.forEach(function (product) {
    grid.appendChild(createProductCard(product));
  });

  const loadMoreBtn =
    document.getElementById('load-more-btn');

  if (loadMoreBtn) {
    loadMoreBtn.style.display =
      end >= filteredProducts.length
        ? 'none'
        : 'inline-flex';
  }

  if (filteredProducts.length === 0) {
    grid.innerHTML =
      '<p style="color: var(--color-cream); grid-column: 1/-1; text-align:center; padding: 4rem 0;">No products found. Try adjusting your filters.</p>';
  }
}

function renderFeaturedProducts(track) {
  const featured = allProducts.slice(0, 3);
  track.innerHTML = '';

  featured.forEach(function (product) {
    track.appendChild(createProductCard(product));
  });

  const viewMore = document.createElement('div');
  viewMore.className = 'view-more-card';
  viewMore.innerHTML = `
    <a href="products.html" class="view-more-card__link">
      <span class="view-more-card__text">View More</span>
      <div class="view-more-card__dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </a>
  `;

  track.appendChild(viewMore);
}

function createProductCard(product) {
  const isSale = product.categories.includes('sale');
  const isNewArrival =
    product.categories.includes('new-arrivals');
  const badge = isSale
    ? 'Sale'
    : isNewArrival
      ? 'New'
      : '';

  const article = document.createElement('article');
  article.className = 'product-card';
  article.dataset.id = String(product.id);
  article.dataset.categories =
    product.categories.join(',');

  article.innerHTML = [
    '<div class="product-card__img-wrap">',
    '<img src="' +
    product.image +
    '" alt="' +
    product.name +
    '" class="product-card__img" loading="lazy" />',
    badge
      ? '<span class="product-card__badge">' +
      badge +
      '</span>'
      : '',
    '<button class="product-card__wishlist" aria-label="Add ' +
    product.name +
    ' to wishlist">&#9825;</button>',
    '<div class="product-card__overlay">',
    '<button class="product-card__add">ADD TO CART</button>',
    '</div>',
    '</div>',
    '<div class="product-card__meta">',
    '<h3 class="product-card__name">' +
    product.name +
    '</h3>',
    '<p class="product-card__price">\u20A6' +
    product.price.toLocaleString() +
    '</p>',
    '</div>'
  ].join('');

  return article;
}

function createFeaturedProductCard(product) {
  const isSale = product.categories.includes('sale');
  const isNewArrival =
    product.categories.includes('new-arrivals');
  const badge = isSale
    ? 'Sale'
    : isNewArrival
      ? 'New'
      : '';

  const article = document.createElement('article');
  article.className = 'product-card';
  article.dataset.id = String(product.id);
  article.dataset.categories =
    product.categories.join(',');

  article.innerHTML = [
    '<div class="product-card__img-wrap">',
    '<img src="' +
    product.image +
    '" alt="' +
    product.name +
    '" class="product-card__img" loading="lazy" />',
    badge
      ? '<span class="product-card__badge">' +
      badge +
      '</span>'
      : '',
    '<button class="product-card__wishlist" aria-label="Add ' +
    product.name +
    ' to wishlist">&#9825;</button>',
    '<div class="product-card__overlay">',
    '<button class="product-card__add">ADD TO CART</button>',
    '</div>',
    '</div>',
    '<div class="product-card__meta">',
    '<h3 class="product-card__name">' +
    product.name +
    '</h3>',
    '<p class="product-card__price">\u20A6' +
    product.price.toLocaleString() +
    '</p>',
    '</div>'
  ].join('');

  return article;
}
document.addEventListener(
  'DOMContentLoaded',
  initProductsPage
);