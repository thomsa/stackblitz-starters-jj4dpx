const input = document.getElementById('search-input');
const list = document.getElementById('list');
const xCache = document.getElementById('xcache');

input?.addEventListener('input', async (e) => {
  if (e.target instanceof HTMLInputElement) {
    const response = await fetch(`/api/search?value=${e.target.value}`, {
      method: 'GET',
    });

    const { data } = await response.json();

    if (xCache) {
      xCache.innerText = `x-cache: ${response.headers.get('x-cache')}`;
    }
    const liElems = data
      .map((el: any) => `<li>${el.first_name} ${el.last_name}</li>`)
      .join('');

    if (list) {
      list.innerHTML = liElems;
    }
  }
});
