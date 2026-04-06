async function showResult() {
  const emailInput = document.getElementById('emailInput');
  const nameInput = document.getElementById('nameInput');

  const email = emailInput.value.trim();
  const firstName = nameInput.value.trim();

  emailInput.style.borderColor = '#d0d5dd';

  if (!email || !email.includes('@')) {
    emailInput.style.borderColor = '#dc2626';
    emailInput.focus();
    return;
  }

  const submitBtn = document.querySelector('.btn-submit');
  const originalBtnText = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';

  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        firstName
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Subscribe error:', data);
      alert('Something went wrong. Please try again.');
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
      return;
    }

    document.getElementById('emailGate').classList.remove('active');
    document.getElementById('resultScreen').classList.add('active');

    for (let i = 1; i <= 5; i++) {
      const d = document.getElementById('dot' + i);
      const l = document.getElementById('line' + i);
      if (d) {
        d.classList.remove('active');
        d.classList.add('done');
      }
      if (l) l.classList.add('done');
    }

    const key = getProduct();
    const p = products[key];

    const whyHTML = p.why.map(w => `<li>${w}</li>`).join('');

    const altHTML = p.alts.map(k => `
      <div class="alt-item">
        <img src="${products[k].img}" alt="${products[k].name}">
        <div class="alt-item-body">
          <div class="alt-name">${products[k].name}</div>
          <div class="alt-subtitle">${products[k].subtitle}</div>
          <div class="alt-desc">${products[k].desc}</div>
          <a class="alt-shop-btn" href="${products[k].url}" target="_blank">Shop Now</a>
        </div>
      </div>
    `).join('');

    const recipesHTML = p.recipes.map(r => `
      <div class="recipe-card">
        ${r.img
          ? `<img src="${r.img}" alt="${r.title}" class="recipe-img">`
          : `<div class="recipe-img-fallback">${r.emoji || '🥣'}</div>`}
        <div class="recipe-body">
          <div class="recipe-title">${r.title}</div>
          <div class="recipe-meta">${r.time} • ${r.meta}</div>
          <div class="recipe-section-label">Ingredients</div>
          <ul class="recipe-ingredients">
            ${r.ingredients.map(i => `<li>${i}</li>`).join('')}
          </ul>
          <div class="recipe-section-label">Steps</div>
          <ol class="recipe-steps">
            ${r.steps.map(s => `<li>${s}</li>`).join('')}
          </ol>
        </div>
      </div>
    `).join('');

    document.getElementById('resultContent').innerHTML = `
      <div style="text-align:center;">
        <div class="best-match-tag">Your Best Match</div>
      </div>

      <div class="result-product-block">
        <img class="result-product-img" src="${p.img}" alt="${p.name}">
        <div class="result-product-subtitle">${p.subtitle}</div>
        <div class="result-product-body">
          <h3>${p.name}</h3>
          <p>${p.desc}</p>
          <div class="tag-chips">
            ${p.tags.map(tag => `<span class="tag-chip">${tag}</span>`).join('')}
          </div>
          <a class="btn-shop" href="${p.url}" target="_blank">Shop This Product</a>
        </div>
      </div>

      <div class="why-list-wrap">
        <div class="section-title">Why this is your best fit</div>
        <ul class="why-list">${whyHTML}</ul>
      </div>

      <div class="section-title" style="text-align:center;margin-top:28px;">3 Ways to Use It</div>
      <div class="usage-grid">${recipesHTML}</div>

      <div class="also-label">Also worth trying</div>
      <div class="alt-grid">${altHTML}</div>
    `;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    console.error('Subscribe error:', error);
    alert('Something went wrong. Please try again.');
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
  }
}
