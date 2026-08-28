const form = document.getElementById('signup-form');
const emailInput = document.getElementById('email');
const messageEl = document.getElementById('form-message');
const submitBtn = form.querySelector('button');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  messageEl.textContent = '';
  messageEl.className = 'form-message';

  submitBtn.disabled = true;
  submitBtn.textContent = 'Subscribing...';

  try {
    const response = await fetch('http://localhost:3000/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (response.ok) {
      messageEl.textContent = data.message || 'Subscribed! Check your inbox.';
      messageEl.classList.add('success');
      form.reset();
    } else {
      messageEl.textContent = data.message || 'Something went wrong. Please try again.';
      messageEl.classList.add('error');
    }
  } catch (err) {
    console.error('Error submitting form:', err);
    messageEl.textContent = 'Could not reach the server. Is it running?';
    messageEl.classList.add('error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Subscribe';
  }
});