document.addEventListener('DOMContentLoaded', function () {
  // Click tracking
  let clickCount = parseInt(localStorage.getItem('followClicks')) || 0;
  const clickCountSpans = document.querySelectorAll('#clickCount');

  function updateClickDisplay() {
    clickCountSpans.forEach((span) => {
      span.innerText = clickCount;
    });
  }
  updateClickDisplay();

  const followButton = document.getElementById('followButton');

  if (followButton) {
    followButton.addEventListener('click', function (e) {
      clickCount++;
      localStorage.setItem('followClicks', clickCount);
      updateClickDisplay();
      this.classList.add('btn-clicked');
      setTimeout(() => {
        this.classList.remove('btn-clicked');
      }, 200);
    });
  }

  // Follower count animation
  const followerElement = document.getElementById('followerCount');
  const currentFollowers = 322;
  const goalFollowers = 500;

  if (followerElement) {
    const duration = 1200;
    const startTime = performance.now();

    function animateCountUp(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = Math.floor(easeOutQuart * currentFollowers);
      followerElement.innerText = currentValue;

      if (progress < 1) {
        requestAnimationFrame(animateCountUp);
      }
    }

    requestAnimationFrame(animateCountUp);
  }

  // Progress bar
  const progressBar = document.getElementById('progressBar');
  if (progressBar) {
    const percentComplete = (currentFollowers / goalFollowers) * 100;
    progressBar.style.width = percentComplete + '%';
  }

  // Goal text
  const goalText = document.getElementById('goalText');
  if (goalText) {
    const remaining = goalFollowers - currentFollowers;
    goalText.innerText = remaining + ' followers to go → Unlock Stars';
  }

  // Days estimate
  const daysUntilElement = document.getElementById('daysUntilGoal');
  if (daysUntilElement) {
    let growthData = JSON.parse(localStorage.getItem('growthData')) || {
      previousCount: currentFollowers,
      previousDate: new Date().toISOString(),
      dailyRate: 3.5,
    };

    const today = new Date();
    const previousDate = new Date(growthData.previousDate);
    const daysDiff = (today - previousDate) / (1000 * 60 * 60 * 24);

    if (daysDiff >= 1 && growthData.previousCount !== currentFollowers) {
      const actualGrowth = currentFollowers - growthData.previousCount;
      const actualRate = actualGrowth / daysDiff;
      growthData.dailyRate = Math.max(0.5, actualRate);
      growthData.previousCount = currentFollowers;
      growthData.previousDate = today.toISOString();
      localStorage.setItem('growthData', JSON.stringify(growthData));
    }

    const remaining = goalFollowers - currentFollowers;
    const daysEstimate = Math.ceil(remaining / growthData.dailyRate);

    if (daysEstimate <= 30 && daysEstimate > 0) {
      daysUntilElement.innerText = daysEstimate;
    } else {
      daysUntilElement.innerText = '30+';
    }
  }

  console.log('Page loaded | Followers: ' + currentFollowers);
});
