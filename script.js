document.addEventListener('DOMContentLoaded', function () {
  /* Main Navigation Toggle */
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const homeBtn = document.getElementById('homeBtn');
  const uploadBtn = document.getElementById('uploadBtn');
  const homeSection = document.getElementById('homeSection');
  const uploadSection = document.getElementById('uploadSection');

  menuToggle.addEventListener('click', function () {
    navMenu.classList.toggle('active');
  });

  function showHome() {
    homeSection.classList.remove('section-hidden');
    homeSection.classList.add('section-active');
    uploadSection.classList.remove('section-active');
    uploadSection.classList.add('section-hidden');
    homeBtn.classList.add('active');
    uploadBtn.classList.remove('active');
    navMenu.classList.remove('active');
  }

  function showUpload() {
    uploadSection.classList.remove('section-hidden');
    uploadSection.classList.add('section-active');
    homeSection.classList.remove('section-active');
    homeSection.classList.add('section-hidden');
    uploadBtn.classList.add('active');
    homeBtn.classList.remove('active');
    navMenu.classList.remove('active');
  }

  homeBtn.addEventListener('click', function (e) {
    e.preventDefault();
    showHome();
  });

  uploadBtn.addEventListener('click', function (e) {
    e.preventDefault();
    showUpload();
  });

  /* Upload Form Placeholder */
  const uploadForm = document.getElementById('upload-form');
  if (uploadForm) {
    uploadForm.addEventListener('submit', function (e) {
      e.preventDefault();
      console.log('Upload form submitted. (Placeholder action.)');
      alert('This is a placeholder. Backend integration coming soon.');
    });
  }

  /* Data Gallery Filtering, Sorting, and Pagination */
  const gallerySearchInput = document.getElementById('gallerySearchInput');
  const dateFilter = document.getElementById('dateFilter');
  const orgFilter = document.getElementById('orgFilter');
  const sortOption = document.getElementById('sortOption');
  const dataBoxesContainer = document.querySelector('.data-boxes');
  const dataBoxes = Array.from(document.querySelectorAll('.data-box'));
  const loadMoreBtn = document.getElementById('loadMoreBtn');

  let itemsToShow = 4; // initial count
  let filteredBoxes = dataBoxes;

  function displayBoxes() {
    dataBoxesContainer.innerHTML = '';
    filteredBoxes.slice(0, itemsToShow).forEach(box => {
      dataBoxesContainer.appendChild(box);
    });
    loadMoreBtn.style.display = (itemsToShow >= filteredBoxes.length) ? 'none' : 'block';
  }

  function filterAndSortBoxes() {
    const searchTerm = gallerySearchInput.value.toLowerCase();
    const selectedDateFilter = dateFilter.value;
    const selectedOrg = orgFilter.value;
    const selectedSort = sortOption.value;
    const currentDate = new Date();

    filteredBoxes = dataBoxes.filter(box => {
      const title = box.dataset.title.toLowerCase();
      const boxDate = new Date(box.dataset.date);
      const boxOrg = box.dataset.org;
      let matchesSearch = title.includes(searchTerm);

      // Date Filter
      let matchesDate = false;
      if (selectedDateFilter === 'all') {
        matchesDate = true;
      } else if (selectedDateFilter === 'today') {
        matchesDate = boxDate.toDateString() === currentDate.toDateString();
      } else if (selectedDateFilter === 'thisWeek') {
        const currentDay = currentDate.getDay();
        const firstDayOfWeek = new Date(currentDate);
        firstDayOfWeek.setDate(currentDate.getDate() - currentDay);
        const lastDayOfWeek = new Date(firstDayOfWeek);
        lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
        matchesDate = boxDate >= firstDayOfWeek && boxDate <= lastDayOfWeek;
      } else if (selectedDateFilter === 'thisMonth') {
        matchesDate = boxDate.getMonth() === currentDate.getMonth() &&
                      boxDate.getFullYear() === currentDate.getFullYear();
      }

      // Organization Filter
      let matchesOrg = (selectedOrg === 'all') || (boxOrg === selectedOrg);

      return matchesSearch && matchesDate && matchesOrg;
    });

    // Sorting
    filteredBoxes.sort((a, b) => {
      if (selectedSort === 'dateDesc') {
        return new Date(b.dataset.date) - new Date(a.dataset.date);
      } else if (selectedSort === 'dateAsc') {
        return new Date(a.dataset.date) - new Date(b.dataset.date);
      } else if (selectedSort === 'titleAsc') {
        return a.dataset.title.localeCompare(b.dataset.title);
      } else if (selectedSort === 'titleDesc') {
        return b.dataset.title.localeCompare(a.dataset.title);
      }
    });

    itemsToShow = 4; // reset shown count
    displayBoxes();
  }

  gallerySearchInput.addEventListener('input', filterAndSortBoxes);
  dateFilter.addEventListener('change', filterAndSortBoxes);
  orgFilter.addEventListener('change', filterAndSortBoxes);
  sortOption.addEventListener('change', filterAndSortBoxes);
  loadMoreBtn.addEventListener('click', function () {
    itemsToShow += 4;
    displayBoxes();
  });

  // Initial display
  filterAndSortBoxes();

  /* Modal Popup for Detailed View */
  const modal = document.getElementById('modal');
  const modalClose = document.getElementById('modalClose');
  const modalBody = document.getElementById('modalBody');

  dataBoxes.forEach(box => {
    box.addEventListener('click', function () {
      // Populate modal with box content (clone the box's inner HTML)
      modalBody.innerHTML = `<div class="modal-details">${box.innerHTML}</div>`;
      modal.style.display = 'block';
    });
  });

  modalClose.addEventListener('click', function () {
    modal.style.display = 'none';
  });

  window.addEventListener('click', function (e) {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });
});
