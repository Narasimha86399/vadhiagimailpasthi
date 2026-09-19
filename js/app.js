/**
 * Tannir Dictionary - Application Controller
 * Handles Multi-Script Search, Letter Filtering, CRUD Operations, LocalStorage Sync & Exports.
 */

(function () {
  'use strict';

  // State
  let dictionary = [];
  let filteredWords = [];
  let currentLetterFilter = 'ALL';
  let searchQuery = '';
  let currentPage = 1;
  const itemsPerPage = 36;
  let currentEditingWordId = null;

  // DOM Elements
  const wordsGrid = document.getElementById('wordsGrid');
  const searchInput = document.getElementById('searchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const alphabetPillsContainer = document.getElementById('alphabetPills');
  const resultsCountEl = document.getElementById('resultsCount');
  const activeFilterBadge = document.getElementById('activeFilterBadge');
  const totalWordsCountEl = document.getElementById('totalWordsCount');
  const totalLettersCountEl = document.getElementById('totalLettersCount');
  const paginationControls = document.getElementById('paginationControls');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const addWordBtn = document.getElementById('addWordBtn');
  const exportJsonBtn = document.getElementById('exportJsonBtn');
  const exportCsvBtn = document.getElementById('exportCsvBtn');

  // Modal Elements
  const wordModal = document.getElementById('wordModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCancelBtn = document.getElementById('modalCancelBtn');
  const wordForm = document.getElementById('wordForm');
  const formWordTe = document.getElementById('formWordTe');
  const formWordMl = document.getElementById('formWordMl');
  const formWordTannir = document.getElementById('formWordTannir');
  const formTannirRomanPreview = document.getElementById('formTannirRomanPreview');
  const formWordNote = document.getElementById('formWordNote');
  const formWordLetter = document.getElementById('formWordLetter');

  // Confirm Delete Modal
  const deleteModal = document.getElementById('deleteModal');
  const deleteModalCloseBtn = document.getElementById('deleteModalCloseBtn');
  const deleteModalCancelBtn = document.getElementById('deleteModalCancelBtn');
  const deleteModalConfirmBtn = document.getElementById('deleteModalConfirmBtn');
  let wordToDeleteId = null;

  // Toast Container
  const toastContainer = document.getElementById('toastContainer');

  // 44 Indic Letter Categories
  const INDIC_LETTERS = [
    { te: 'అ', ml: 'അ' }, { te: 'ఆ', ml: 'ആ' }, { te: 'ఇ', ml: 'ഇ' }, { te: 'ఈ', ml: 'ഈ' },
    { te: 'ఉ', ml: 'ഉ' }, { te: 'ఊ', ml: 'ഊ' }, { te: 'ఋ', ml: 'ഋ' }, { te: 'ఎ', ml: 'എ' },
    { te: 'ఏ', ml: 'ഏ' }, { te: 'ఐ', ml: 'ഐ' }, { te: 'ఒ', ml: 'ഒ' }, { te: 'ఓ', ml: 'ഓ' },
    { te: 'ఔ', ml: 'ഔ' }, { te: 'క', ml: 'ക' }, { te: 'ఖ', ml: 'ഖ' }, { te: 'గ', ml: 'ഗ' },
    { te: 'ఘ', ml: 'ഘ' }, { te: 'చ', ml: 'ച' }, { te: 'ఛ', ml: 'ഛ' }, { te: 'జ', ml: 'ജ' },
    { te: 'ఝ', ml: 'ഝ' }, { te: 'ట', ml: 'ട' }, { te: 'ఠ', ml: 'ഠ' }, { te: 'డ', ml: 'ഡ' },
    { te: 'ఢ', ml: 'ഢ' }, { te: 'త', ml: 'ത' }, { te: 'ద', ml: 'ദ' }, { te: 'ధ', ml: 'ധ' },
    { te: 'న', ml: 'ന' }, { te: 'ప', ml: 'പ' }, { te: 'ఫ', ml: 'ഫ' }, { te: 'బ', ml: 'ബ' },
    { te: 'భ', ml: 'ഭ' }, { te: 'మ', ml: 'മ' }, { te: 'య', ml: 'യ' }, { te: 'ర', ml: 'ര' },
    { te: 'ల', ml: 'ല' }, { te: 'వ', ml: 'വ' }, { te: 'శ', ml: 'ശ' }, { te: 'ష', ml: 'ഷ' },
    { te: 'స', ml: 'സ' }, { te: 'హ', ml: 'ഹ' }, { te: 'క్ష', ml: 'ക്ഷ' }
  ];

  // Initialize
  function init() {
    loadTheme();
    loadDictionaryData();
    populateLetterSelect();
    setupEventListeners();
    renderAlphabetPills();
    applyFilterAndSearch();
  }

  // Load Data with LocalStorage overrides
  function loadDictionaryData() {
    const defaultData = window.TANNIR_DICTIONARY || [];
    const savedOverrides = localStorage.getItem('tannir_dictionary_custom_v1');
    
    if (savedOverrides) {
      try {
        dictionary = JSON.parse(savedOverrides);
      } catch (e) {
        console.error('Error loading saved dictionary:', e);
        dictionary = defaultData.slice();
      }
    } else {
      dictionary = defaultData.slice();
    }

    // Precompute Romanized fields if missing for ultra-fast searching
    dictionary.forEach(item => {
      if (!item.romanTe) item.romanTe = Transliterate.toRoman(item.telugu || '');
      if (!item.romanMl) item.romanMl = Transliterate.toRoman(item.malayalam || '');
      if (!item.romanTannir) item.romanTannir = Transliterate.toRoman(item.tannir || '');
    });

    updateStats();
  }

  function saveDictionaryToStorage() {
    try {
      localStorage.setItem('tannir_dictionary_custom_v1', JSON.stringify(dictionary));
    } catch (e) {
      console.warn('LocalStorage quota exceeded or unavailable:', e);
    }
    updateStats();
    renderAlphabetPills();
  }

  function updateStats() {
    if (totalWordsCountEl) totalWordsCountEl.textContent = dictionary.length.toLocaleString();
    if (totalLettersCountEl) totalLettersCountEl.textContent = INDIC_LETTERS.length;
  }

  // Render Alphabet Bar
  function renderAlphabetPills() {
    if (!alphabetPillsContainer) return;

    // Calculate count per letter
    const counts = {};
    dictionary.forEach(item => {
      const l = item.letterTe || 'Other';
      counts[l] = (counts[l] || 0) + 1;
    });

    let html = `
      <button class="letter-pill all-pill ${currentLetterFilter === 'ALL' ? 'active' : ''}" data-letter="ALL">
        <span>అన్నీ (All)</span>
        <span class="pill-count">${dictionary.length}</span>
      </button>
    `;

    INDIC_LETTERS.forEach(letObj => {
      const cnt = counts[letObj.te] || 0;
      const isActive = currentLetterFilter === letObj.te;
      html += `
        <button class="letter-pill ${isActive ? 'active' : ''}" data-letter="${letObj.te}">
          <span class="script-telugu">${letObj.te}</span>
          <span class="pill-count">${cnt}</span>
        </button>
      `;
    });

    alphabetPillsContainer.innerHTML = html;
  }

  function populateLetterSelect() {
    if (!formWordLetter) return;
    let opts = '';
    INDIC_LETTERS.forEach(letObj => {
      opts += `<option value="${letObj.te}">${letObj.te} / ${letObj.ml}</option>`;
    });
    formWordLetter.innerHTML = opts;
  }

  // Search & Filter
  function applyFilterAndSearch() {
    const q = Transliterate.normalize(searchQuery);
    const romanQ = Transliterate.toRoman(searchQuery).toLowerCase().trim();

    filteredWords = dictionary.filter(item => {
      // 1. Letter Filter Check
      if (currentLetterFilter !== 'ALL' && item.letterTe !== currentLetterFilter) {
        return false;
      }

      // 2. Search Query Check
      if (!q) return true;

      // Check Telugu
      if (item.telugu && item.telugu.includes(searchQuery)) return true;
      // Check Malayalam
      if (item.malayalam && item.malayalam.includes(searchQuery)) return true;
      // Check Tannir (Tamil)
      if (item.tannir && item.tannir.includes(searchQuery)) return true;
      // Check Note / Context
      if (item.note && item.note.toLowerCase().includes(q)) return true;

      // Check Romanized phonetic matches
      if (romanQ.length >= 2) {
        if (item.romanTe && item.romanTe.includes(romanQ)) return true;
        if (item.romanMl && item.romanMl.includes(romanQ)) return true;
        if (item.romanTannir && item.romanTannir.includes(romanQ)) return true;
      }

      return false;
    });

    currentPage = 1;
    renderResultsMeta();
    renderWordsGrid();
  }

  function renderResultsMeta() {
    if (resultsCountEl) {
      resultsCountEl.textContent = `${filteredWords.length.toLocaleString()} ${filteredWords.length === 1 ? 'Word' : 'Words'}`;
    }
    if (activeFilterBadge) {
      if (currentLetterFilter !== 'ALL') {
        activeFilterBadge.textContent = `Letter: ${currentLetterFilter}`;
        activeFilterBadge.style.display = 'inline-block';
      } else if (searchQuery) {
        activeFilterBadge.textContent = `Search: "${searchQuery}"`;
        activeFilterBadge.style.display = 'inline-block';
      } else {
        activeFilterBadge.style.display = 'none';
      }
    }
  }

  function renderWordsGrid() {
    if (!wordsGrid) return;

    if (filteredWords.length === 0) {
      wordsGrid.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          <div class="empty-icon">🔍</div>
          <div class="empty-title">పదాలు కనుగొనబడలేదు (No Words Found)</div>
          <p>దయచేసి వేరే అక్షరం లేదా శోధన పదం ప్రయత్నించండి.</p>
        </div>
      `;
      if (paginationControls) paginationControls.innerHTML = '';
      return;
    }

    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = Math.min(startIdx + itemsPerPage, filteredWords.length);
    const pageItems = filteredWords.slice(startIdx, endIdx);

    let cardsHtml = '';
    pageItems.forEach(word => {
      const tannirRoman = word.romanTannir || Transliterate.toRoman(word.tannir || '');
      const noteHtml = word.note 
        ? `<span class="word-note" title="Meaning / Context">💡 ${escapeHtml(word.note)}</span>` 
        : `<span></span>`;

      cardsHtml += `
        <div class="word-card" data-id="${word.id}">
          <div class="card-top">
            <span class="letter-tag script-telugu">${escapeHtml(word.letterTe || 'అ')}</span>
            <div class="card-actions">
              <button class="action-btn btn-copy" title="Copy Word" data-action="copy" data-id="${word.id}">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              </button>
              <button class="action-btn btn-edit" title="Edit Word" data-action="edit" data-id="${word.id}">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
              </button>
              <button class="action-btn btn-delete" title="Delete Word" data-action="delete" data-id="${word.id}">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>

          <div class="card-words-section">
            <div class="source-word-box">
              <span class="script-label telugu">తెలుగు (Telugu)</span>
              <div class="word-telugu script-telugu">${escapeHtml(word.telugu || '')}</div>
              <div class="word-malayalam-sub script-malayalam" title="Malayalam representation">${escapeHtml(word.malayalam || '')}</div>
            </div>

            <div class="word-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>

            <div class="target-word-box">
              <span class="script-label tannir">తన్నీర్ (Tannir)</span>
              <div class="word-tannir script-tamil">${escapeHtml(word.tannir || '')}</div>
              <div class="word-tannir-roman">${escapeHtml(tannirRoman)}</div>
            </div>
          </div>

          <div class="card-bottom">
            ${noteHtml}
            <span class="word-id">#${word.id}</span>
          </div>
        </div>
      `;
    });

    wordsGrid.innerHTML = cardsHtml;
    renderPagination(startIdx, endIdx);
  }

  function renderPagination(startIdx, endIdx) {
    if (!paginationControls) return;
    const totalPages = Math.ceil(filteredWords.length / itemsPerPage);

    if (totalPages <= 1) {
      paginationControls.innerHTML = '';
      return;
    }

    paginationControls.innerHTML = `
      <button class="btn btn-secondary" id="prevPageBtn" ${currentPage === 1 ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ''}>
        ← Previous
      </button>
      <span class="page-info">
        Page <strong>${currentPage}</strong> of <strong>${totalPages}</strong> (${(startIdx + 1).toLocaleString()} - ${endIdx.toLocaleString()})
      </span>
      <button class="btn btn-secondary" id="nextPageBtn" ${currentPage === totalPages ? 'disabled style="opacity:0.5;cursor:not-allowed"' : ''}>
        Next →
      </button>
    `;

    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--;
          renderWordsGrid();
          window.scrollTo({ top: 280, behavior: 'smooth' });
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
          currentPage++;
          renderWordsGrid();
          window.scrollTo({ top: 280, behavior: 'smooth' });
        }
      });
    }
  }

  // Event Listeners
  function setupEventListeners() {
    // Search input with instant filtering
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        if (searchClearBtn) {
          searchClearBtn.style.display = searchQuery ? 'flex' : 'none';
        }
        applyFilterAndSearch();
      });
    }

    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        searchClearBtn.style.display = 'none';
        searchInput.focus();
        applyFilterAndSearch();
      });
    }

    // Alphabet Pill Clicks
    if (alphabetPillsContainer) {
      alphabetPillsContainer.addEventListener('click', (e) => {
        const pill = e.target.closest('.letter-pill');
        if (!pill) return;
        const letter = pill.dataset.letter;
        currentLetterFilter = letter;
        
        document.querySelectorAll('.letter-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        
        applyFilterAndSearch();
      });
    }

    // Grid Card Action Clicks (Event Delegation)
    if (wordsGrid) {
      wordsGrid.addEventListener('click', (e) => {
        const btn = e.target.closest('.action-btn');
        if (!btn) return;
        const action = btn.dataset.action;
        const id = parseInt(btn.dataset.id, 10);
        const wordObj = dictionary.find(w => w.id === id);
        if (!wordObj) return;

        if (action === 'copy') {
          copyWordText(wordObj);
        } else if (action === 'edit') {
          openEditModal(wordObj);
        } else if (action === 'delete') {
          openDeleteConfirmModal(wordObj);
        }
      });
    }

    // Add New Word Button
    if (addWordBtn) {
      addWordBtn.addEventListener('click', openAddModal);
    }

    // Modal Close handlers
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeWordModal);
    if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeWordModal);
    if (wordModal) {
      wordModal.addEventListener('click', (e) => {
        if (e.target === wordModal) closeWordModal();
      });
    }

    // Delete Modal Handlers
    if (deleteModalCloseBtn) deleteModalCloseBtn.addEventListener('click', closeDeleteModal);
    if (deleteModalCancelBtn) deleteModalCancelBtn.addEventListener('click', closeDeleteModal);
    if (deleteModalConfirmBtn) deleteModalConfirmBtn.addEventListener('click', confirmDeleteWord);

    // Live Script Sync in Form
    if (formWordTe) {
      formWordTe.addEventListener('input', (e) => {
        const teVal = e.target.value;
        if (formWordMl) {
          formWordMl.value = Transliterate.teToMl(teVal);
        }
        autoDetectLetter(teVal);
      });
    }

    if (formWordMl) {
      formWordMl.addEventListener('input', (e) => {
        const mlVal = e.target.value;
        if (formWordTe) {
          formWordTe.value = Transliterate.mlToTe(mlVal);
        }
        autoDetectLetter(formWordTe ? formWordTe.value : '');
      });
    }

    if (formWordTannir) {
      formWordTannir.addEventListener('input', (e) => {
        const roman = Transliterate.toRoman(e.target.value);
        if (formTannirRomanPreview) {
          formTannirRomanPreview.textContent = roman ? `Phonetic: ${roman}` : '';
        }
      });
    }

    // Word Form Submission
    if (wordForm) {
      wordForm.addEventListener('submit', handleWordFormSubmit);
    }

    // Export Buttons
    if (exportJsonBtn) exportJsonBtn.addEventListener('click', exportAsJson);
    if (exportCsvBtn) exportCsvBtn.addEventListener('click', exportAsCsv);

    // Theme Toggle
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', toggleTheme);
    }

    // Global Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
      if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && document.activeElement !== searchInput) {
        e.preventDefault();
        if (searchInput) searchInput.focus();
      } else if (e.key === 'Escape') {
        closeWordModal();
        closeDeleteModal();
      }
    });
  }

  function autoDetectLetter(teStr) {
    if (!teStr || !formWordLetter) return;
    const firstChar = teStr.trim().charAt(0);
    const match = INDIC_LETTERS.find(l => l.te === firstChar);
    if (match) {
      formWordLetter.value = match.te;
    }
  }

  // Copy Word
  function copyWordText(word) {
    const textToCopy = `${word.telugu} (${word.malayalam}) -> ${word.tannir}${word.note ? ' [' + word.note + ']' : ''}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      showToast(`Copied: ${word.telugu} -> ${word.tannir}`, 'success');
    }).catch(() => {
      showToast(`Word: ${word.telugu} -> ${word.tannir}`, 'success');
    });
  }

  // Modals (Add / Edit)
  function openAddModal() {
    currentEditingWordId = null;
    modalTitle.textContent = 'కొత్త పదాన్ని జోడించండి (Add New Word)';
    wordForm.reset();
    if (formTannirRomanPreview) formTannirRomanPreview.textContent = '';
    if (formWordLetter) formWordLetter.value = currentLetterFilter !== 'ALL' ? currentLetterFilter : 'అ';
    wordModal.classList.add('active');
    setTimeout(() => { if (formWordTe) formWordTe.focus(); }, 50);
  }

  function openEditModal(word) {
    currentEditingWordId = word.id;
    modalTitle.textContent = `పదాన్ని సవరించండి (Edit Word #${word.id})`;
    if (formWordTe) formWordTe.value = word.telugu || '';
    if (formWordMl) formWordMl.value = word.malayalam || '';
    if (formWordTannir) formWordTannir.value = word.tannir || '';
    if (formWordNote) formWordNote.value = word.note || '';
    if (formWordLetter) formWordLetter.value = word.letterTe || 'అ';
    if (formTannirRomanPreview) {
      const roman = Transliterate.toRoman(word.tannir || '');
      formTannirRomanPreview.textContent = roman ? `Phonetic: ${roman}` : '';
    }
    wordModal.classList.add('active');
  }

  function closeWordModal() {
    wordModal.classList.remove('active');
    currentEditingWordId = null;
  }

  function handleWordFormSubmit(e) {
    e.preventDefault();
    const telugu = (formWordTe ? formWordTe.value : '').trim();
    const malayalam = (formWordMl ? formWordMl.value : '').trim();
    const tannir = (formWordTannir ? formWordTannir.value : '').trim();
    const note = (formWordNote ? formWordNote.value : '').trim();
    const letterTe = formWordLetter ? formWordLetter.value : 'అ';
    const match = INDIC_LETTERS.find(l => l.te === letterTe);
    const letterMl = match ? match.ml : 'അ';

    if (!telugu && !malayalam && !tannir) {
      showToast('దయచేసి కనీసం ఒక పదాన్ని నమోదు చేయండి (Please enter at least one word)', 'error');
      return;
    }

    const romanTe = Transliterate.toRoman(telugu);
    const romanMl = Transliterate.toRoman(malayalam);
    const romanTannir = Transliterate.toRoman(tannir);

    if (currentEditingWordId !== null) {
      // Edit existing
      const idx = dictionary.findIndex(w => w.id === currentEditingWordId);
      if (idx !== -1) {
        dictionary[idx] = {
          ...dictionary[idx],
          telugu,
          malayalam,
          tannir,
          note,
          letterTe,
          letterMl,
          romanTe,
          romanMl,
          romanTannir
        };
        saveDictionaryToStorage();
        showToast('పదం విజయవంతంగా నవీకరించబడింది (Word updated successfully)', 'success');
      }
    } else {
      // Add new
      const newId = dictionary.length > 0 ? Math.max(...dictionary.map(w => w.id)) + 1 : 1;
      const newWord = {
        id: newId,
        letterTe,
        letterMl,
        telugu: telugu || Transliterate.mlToTe(malayalam),
        malayalam: malayalam || Transliterate.teToMl(telugu),
        tannir,
        note,
        romanTe,
        romanMl,
        romanTannir
      };
      dictionary.unshift(newWord);
      saveDictionaryToStorage();
      showToast('కొత్త పదం విజయవంతంగా జోడించబడింది (New word added successfully)', 'success');
    }

    closeWordModal();
    applyFilterAndSearch();
  }

  // Delete Flow
  function openDeleteConfirmModal(word) {
    wordToDeleteId = word.id;
    const deleteWordPreview = document.getElementById('deleteWordPreview');
    if (deleteWordPreview) {
      deleteWordPreview.textContent = `"${word.telugu}" (${word.malayalam}) -> "${word.tannir}"`;
    }
    deleteModal.classList.add('active');
  }

  function closeDeleteModal() {
    deleteModal.classList.remove('active');
    wordToDeleteId = null;
  }

  function confirmDeleteWord() {
    if (wordToDeleteId === null) return;
    const idx = dictionary.findIndex(w => w.id === wordToDeleteId);
    if (idx !== -1) {
      const deleted = dictionary.splice(idx, 1)[0];
      saveDictionaryToStorage();
      showToast(`పదం తొలగించబడింది: ${deleted.telugu}`, 'success');
      applyFilterAndSearch();
    }
    closeDeleteModal();
  }

  // Exports
  function exportAsJson() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dictionary, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `tannir_dictionary_${new Date().toISOString().slice(0,10)}.json`);
    dlAnchor.click();
    showToast('JSON నిఘంటువు డౌన్‌లోడ్ చేయబడింది (JSON Exported)', 'success');
  }

  function exportAsCsv() {
    let csv = '\uFEFF'; // UTF-8 BOM for Excel
    csv += 'ID,Letter_Telugu,Letter_Malayalam,Telugu_Word,Malayalam_Word,Tannir_Word,Note\n';
    
    dictionary.forEach(w => {
      const clean = (str) => `"${(str || '').replace(/"/g, '""')}"`;
      csv += `${w.id},${clean(w.letterTe)},${clean(w.letterMl)},${clean(w.telugu)},${clean(w.malayalam)},${clean(w.tannir)},${clean(w.note)}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", url);
    dlAnchor.setAttribute("download", `tannir_dictionary_${new Date().toISOString().slice(0,10)}.csv`);
    dlAnchor.click();
    showToast('CSV నిఘంటువు డౌన్‌లోడ్ చేయబడింది (CSV Exported)', 'success');
  }

  // Toast Notification
  function showToast(message, type = 'success') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✓' : '⚠️'}</span>
      <span>${escapeHtml(message)}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  // Theme Toggle
  function loadTheme() {
    const savedTheme = localStorage.getItem('tannir_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('tannir_theme', next);
    updateThemeIcon(next);
  }

  function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
    themeToggleBtn.innerHTML = theme === 'dark' 
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Start app on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
