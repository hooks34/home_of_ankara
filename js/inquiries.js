document.addEventListener('DOMContentLoaded', function () {
  let selectedYear = new Date().getFullYear();
  let selectedMonth = new Date().getMonth();
  let selectedDate = null;
  let selectedTime = null;

  const calDates = document.getElementById('cal-dates');
  const calLabel = document.getElementById('cal-month-label');
  const btnPrev = document.querySelector('.cal-nav--prev');
  const btnNext = document.querySelector('.cal-nav--next');
  const apptSubmit = document.getElementById('appt-submit');

  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  function renderCalendar() {
    if (!calDates || !calLabel) return;

    calLabel.textContent = MONTHS[selectedMonth] + ' ' + selectedYear;
    calDates.innerHTML = '';

    const firstDay = new Date(selectedYear, selectedMonth, 1).getDay();
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    for (let i = 0; i < firstDay; i += 1) {
      const empty = document.createElement('button');
      empty.className = 'cal-date empty';
      empty.setAttribute('aria-hidden', 'true');
      empty.tabIndex = -1;
      calDates.appendChild(empty);
    }

    for (let d = 1; d <= daysInMonth; d += 1) {
      const btn = document.createElement('button');
      btn.className = 'cal-date';
      btn.textContent = String(d);
      btn.setAttribute('role', 'gridcell');
      btn.setAttribute('aria-label', d + ' ' + MONTHS[selectedMonth] + ' ' + selectedYear);

      const thisDate = new Date(selectedYear, selectedMonth, d);
      if (thisDate < todayStart) {
        btn.classList.add('disabled');
        btn.setAttribute('aria-disabled', 'true');
      }

      if (
        d === today.getDate() &&
        selectedMonth === today.getMonth() &&
        selectedYear === today.getFullYear()
      ) {
        btn.classList.add('today');
      }

      if (
        selectedDate &&
        d === selectedDate.getDate() &&
        selectedMonth === selectedDate.getMonth() &&
        selectedYear === selectedDate.getFullYear()
      ) {
        btn.classList.add('selected');
      }

      btn.addEventListener('click', function () {
        selectedDate = new Date(selectedYear, selectedMonth, d);
        renderCalendar();
      });

      calDates.appendChild(btn);
    }
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', function () {
      selectedMonth -= 1;
      if (selectedMonth < 0) {
        selectedMonth = 11;
        selectedYear -= 1;
      }
      renderCalendar();
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', function () {
      selectedMonth += 1;
      if (selectedMonth > 11) {
        selectedMonth = 0;
        selectedYear += 1;
      }
      renderCalendar();
    });
  }

  renderCalendar();

  document.querySelectorAll('.time-slot').forEach(function (btn) {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.time-slot').forEach(function (slot) { slot.classList.remove('selected'); });
      btn.classList.add('selected');
      selectedTime = btn.dataset.time;
    });
  });

  if (apptSubmit) {
    apptSubmit.addEventListener('click', function () {
      if (!selectedDate) {
        alert('Please select a date.');
        return;
      }
      if (!selectedTime) {
        alert('Please select a time slot.');
        return;
      }
      alert('Appointment requested for ' + selectedDate.toDateString() + ' at ' + selectedTime + '.\nOur team will confirm via email.');
    });
  }

  const inqSubmit = document.getElementById('inq-submit');
  if (inqSubmit) {
    inqSubmit.addEventListener('click', function () {
      const name = (document.getElementById('inq-name') || {}).value?.trim();
      const email = (document.getElementById('inq-email') || {}).value?.trim();
      const message = (document.getElementById('inq-message') || {}).value?.trim();

      if (!name || !email || !message) {
        alert('Please fill in all required fields (Name, Email, Message).');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }

      alert('Thank you, ' + name + '! Your inquiry has been received. We\'ll be in touch within 24 hours.');
    });
  }
});
