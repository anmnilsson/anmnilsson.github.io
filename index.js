
const track = document.querySelector('.carousel-track');
const items = document.querySelectorAll('.carousel-item');
const totalItems = items.length;
let currentIndex = 1;

function updateCarousel() {
  const offset = (currentIndex - 1) * 33.333;
  track.style.transform = `translateX(-${offset}%)`;

  items.forEach(item => item.classList.remove('active'));
  items[currentIndex].classList.add('active');
}

function nextSlide() {
  currentIndex++;
  if (currentIndex >= totalItems - 1) {
    currentIndex = 1;
  }
  updateCarousel();
}

updateCarousel();
setInterval(nextSlide, 4000);

const images = [
  'https://picsum.photos/seed/a/450/450',
  'https://picsum.photos/seed/b/450/450',
  'https://picsum.photos/seed/c/450/450',
  'https://picsum.photos/seed/d/450/450',
  'https://picsum.photos/seed/e/450/450',
  'https://picsum.photos/seed/f/450/450'
];

let currentImageIndex = 0;
let nextImageIndex = 1;
let animationProgress = 0;      /* tracks how far around the pie has gone 0 to 1 */
let animationFrameId = null;
let waitTimeout = null;

const sectionImage = document.querySelector('.section-image');
const canvas = document.querySelector('.pie-overlay');
const ctx = canvas.getContext('2d');  /* gets the drawing context of the canvas */

/* preload all images so they are ready when needed */
const preloadedImages = images.map(src => {
  const img = new Image();
  img.src = src;
  return img;
});

function drawPieOverlay(progress) {
  const size = 300;
  const cx = size / 2;    /* center x */
  const cy = size / 2;    /* center y */
  const radius = size / 2;

  /* clears the canvas before redrawing */
  ctx.clearRect(0, 0, size, size);

  if (progress <= 0) return;

  /* draws a circular clipping mask so pie stays within the circle */
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();

  /* draws the next image underneath the pie slice */
  ctx.drawImage(preloadedImages[nextImageIndex], 0, 0, size, size);

  /* draws the pie slice shape that masks the next image */
  ctx.globalCompositeOperation = 'destination-in';
  ctx.beginPath();
  ctx.moveTo(cx, cy);

  /* starts from the top (-90 degrees) and sweeps clockwise */
  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (Math.PI * 2 * progress);
  ctx.arc(cx, cy, radius, startAngle, endAngle);
  ctx.closePath();
  ctx.fillStyle = 'black';
  ctx.fill();

  ctx.restore();
}

function animate() {
  animationProgress += 0.008;   /* controls the speed of the sweep */

  if (animationProgress >= 1) {
    animationProgress = 1;
    drawPieOverlay(1);

    /* swap the image once the pie has fully covered it */
    currentImageIndex = nextImageIndex;
    nextImageIndex = (nextImageIndex + 1) % images.length;
    sectionImage.src = images[currentImageIndex];

    /* clear the canvas and wait before starting next animation */
    setTimeout(() => {
      ctx.clearRect(0, 0, 300, 300);
      animationProgress = 0;
      waitTimeout = setTimeout(startAnimation, 3000);  /* waits 3 seconds before next sweep */
    }, 100);

    return;
  }

  drawPieOverlay(animationProgress);
  animationFrameId = requestAnimationFrame(animate);  /* keeps the animation loop going */
}

function startAnimation() {
  animationProgress = 0;
  animationFrameId = requestAnimationFrame(animate);
}

/* starts the first animation after 3 seconds */
waitTimeout = setTimeout(startAnimation, 3000);