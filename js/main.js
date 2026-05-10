// Sunflower Offers - membership LP
// Handles FAQ accordion, plan card pre-select, form submission, mobile menu

// FAQ accordion
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// Pre-select plan when clicking a plan card CTA
document.querySelectorAll('.plan .btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const plan = btn.getAttribute('data-plan');
    if (plan) {
      const select = document.getElementById('plan');
      if (select) select.value = plan.toLowerCase();
    }
  });
});

// Form submission placeholder — wire to GHL/your endpoint
document.getElementById('enrollForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(e.target));
  console.log('Form submission (replace with GHL endpoint):', data);
  // =================================================================
  // TODO: WIRE TO GHL FORM ENDPOINT
  // Replace the alert/console below with a fetch() to your GHL webhook.
  // Tyler will provide the GHL form embed or webhook URL.
  // Example:
  //   await fetch('https://services.leadconnectorhq.com/hooks/...', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(data)
  //   });
  // =================================================================

  alert("Thanks! We'll be in touch within 24 hours.");
  e.target.reset();
});

// Mobile menu toggle (simple version — expand as needed)
document.querySelector('.menu-toggle')?.addEventListener('click', () => {
  const nav = document.querySelector('.main-nav');
  if (nav) nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
});
