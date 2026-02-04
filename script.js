// state management
let currentStarIndex = 0;
const totalStars = 4;
const stars = document.querySelectorAll('.star');
const lines = document.querySelectorAll('.connection-line');

// intro page - generate scrambled text
const text = "i love you to the moon &";
const moonText = document.getElementById('moonText');

text.split('').forEach((char) => {
    const letter = document.createElement('span');
    letter.className = 'letter scrambled';
    letter.textContent = char;
    moonText.appendChild(letter);
});

// page navigation
function showPage(pageId) {
    console.log('showPage called with:', pageId);
    
    document.querySelectorAll('.page').forEach(page => {
        console.log('Removing active from:', page.id);
        page.classList.remove('active');
    });
    
    const targetPage = document.getElementById(pageId);
    console.log('Target page found:', targetPage);
    
    if (targetPage) {
        targetPage.classList.add('active');
        console.log('Added active class to:', pageId);
    } else {
        console.error('Page not found:', pageId);
    }
    
    // Initialize stanza 1 when shown
    if (pageId === 'stanza1Page') {
        initializeStanza1();
    }
    
    // Initialize stanza 2 when shown
    if (pageId === 'stanza2Page') {
        console.log('Initializing Stanza 2');
        initializeStanza2();
    }
    
    // Initialize stanza 3 when shown
    if (pageId === 'stanza3Page') {
        console.log('Initializing Stanza 3');
        initializeStanza3();
    }
}

// stanza 2: sequential row activation
let currentRow = null;

function initializeStanza2() {
    console.log('initializeStanza2 called');
    
    // Reset all flowers and words
    const flowers = document.querySelectorAll('#stanza2Page .flower');
    const words = document.querySelectorAll('#stanza2Page .flower-word');
    
    flowers.forEach(flower => {
        flower.classList.remove('step2');
    });
    
    words.forEach(word => {
        word.classList.remove('visible');
    });
    
    // Reset and disable all click zones
    const zones = document.querySelectorAll('#stanza2Page .click-zone');
    zones.forEach(zone => {
        zone.classList.remove('completed', 'active');
    });
    
    // Activate only the top row
    const topZone = document.querySelector('.top-row-zone');
    if (topZone) {
        topZone.classList.add('active');
        currentRow = 'top';
    }
    
    console.log('Stanza 2 initialized, top row active');
}

// Generic function to animate any row
function animateRow(rowClass, nextRow) {
    const flowerWrappers = Array.from(document.querySelectorAll(`#stanza2Page .${rowClass}`));
    
    console.log(`Animating ${rowClass}, flowers:`, flowerWrappers.length);
    
    // Disable current zone
    const currentZone = document.querySelector(`.${rowClass.replace('row-', '')}-row-zone`);
    if (currentZone) {
        currentZone.classList.remove('active');
        currentZone.classList.add('completed');
    }
    
    // STEP 1: Show flower tops with random stagger
    flowerWrappers.forEach((wrapper) => {
        const flower = wrapper.querySelector('.flower');
        const randomDelay = Math.random() * 0.4;
        
        setTimeout(() => {
            flower.classList.add('step2');
        }, randomDelay * 1000);
    });
    
    // STEP 2: Animate words in with random timing
    setTimeout(() => {
        flowerWrappers.forEach((wrapper) => {
            const word = wrapper.querySelector('.flower-word');
            const randomDelay = Math.random() * 0.5;
            
            gsap.fromTo(word,
                {
                    opacity: 0,
                    y: 15,
                    scale: 0.8
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.4,
                    ease: "back.out(1.7)",
                    delay: randomDelay
                }
            );
        });
        
        // After words appear, activate next row or moon
        setTimeout(() => {
            if (nextRow) {
                const nextZone = document.querySelector(`.${nextRow}-row-zone`);
                if (nextZone) {
                    nextZone.classList.add('active');
                    currentRow = nextRow;
                    console.log(`${nextRow} row activated`);
                }
            } else {
                // All rows complete - activate moon
                const stanza2Moon = document.getElementById('stanza2Moon');
                stanza2Moon.classList.add('active');
                console.log('All rows complete, moon activated');
            }
        }, 1200);
        
    }, 600);
}

// stanza 1: set first star as active and hollow
function initializeStanza1() {
    stars.forEach((star, index) => {
        star.classList.remove('active', 'filled');
        star.classList.add('hollow');
        
        // hide all poem lines and connection lines
        const wrapper = star.closest('.star-wrapper');
        const poemLine = wrapper.querySelector('.poem-line');
        if (poemLine) {
            poemLine.classList.remove('visible');
        }
    });
    
    lines.forEach(line => {
        line.classList.remove('visible');
    });
    
    // activate first star
    currentStarIndex = 0;
    stars[0].classList.add('active');
}

// transition from intro to stanza 1 (no ampersand trail)
document.getElementById('introMoon').addEventListener('click', () => {
    showPage('stanza1Page');
});

// GSAP animation for poem line entrance - word by word
function animatePoemLine(poemLine) {
    // Get the original HTML
    const originalHTML = poemLine.innerHTML;
    
    // Simple approach: split by spaces but preserve HTML tags
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = originalHTML;
    
    // Clear the poem line
    poemLine.innerHTML = '';
    
    // Process text nodes and elements
    const processNode = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            // Split text into words
            const words = node.textContent.split(' ').filter(w => w.trim());
            words.forEach((word, idx) => {
                const wordSpan = document.createElement('span');
                wordSpan.className = 'word';
                wordSpan.textContent = word;
                poemLine.appendChild(wordSpan);
                
                // Add space after word (except last)
                if (idx < words.length - 1 || node.nextSibling) {
                    poemLine.appendChild(document.createTextNode(' '));
                }
            });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Wrap entire element (like <span class="parenthetical">) in a word span
            const wordSpan = document.createElement('span');
            wordSpan.className = 'word';
            wordSpan.appendChild(node.cloneNode(true));
            poemLine.appendChild(wordSpan);
            
            // Add space after if there's a next sibling
            if (node.nextSibling) {
                poemLine.appendChild(document.createTextNode(' '));
            }
        }
    };
    
    // Process all child nodes
    Array.from(tempDiv.childNodes).forEach(processNode);
    
    // Animate each word popping up from bottom
    const wordElements = poemLine.querySelectorAll('.word');
    
    gsap.fromTo(wordElements,
        {
            opacity: 0,
            y: 20,
            scale: 0.8
        },
        {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: "back.out(1.7)",
            stagger: 0.1
        }
    );
}

// star click handler
stars.forEach((star, index) => {
    star.addEventListener('click', () => {
        // process click if this is the current active star
        if (index === currentStarIndex && star.classList.contains('active')) {
            // fill star
            star.classList.remove('hollow');
            star.classList.add('filled');
            star.classList.remove('active');
            
            // show poem line for this star with GSAP animation
            const wrapper = star.closest('.star-wrapper');
            const poemLine = wrapper.querySelector('.poem-line');
            if (poemLine) {
                // Make visible first (but words still invisible)
                poemLine.classList.add('visible');
                
                // Animate words
                animatePoemLine(poemLine);
            }
            
            // show connection line to the next star
            if (index < totalStars - 1) {
                lines[index].classList.add('visible');
                
                // activate next star
                currentStarIndex++;
                stars[currentStarIndex].classList.add('active');
            } else {
                // all stars completed - activate ASCII moon
                const asciiMoon = document.getElementById('asciiMoon');
                asciiMoon.classList.add('active');
            }
        }
    });
});

// ASCII moon click handler (Stanza 1)
const asciiMoon = document.getElementById('asciiMoon');
if (asciiMoon) {
    asciiMoon.addEventListener('click', () => {
        if (asciiMoon.classList.contains('active')) {
            console.log('Transitioning to Stanza 2');
            showPage('stanza2Page');
        }
    });
}

// Click handlers for all four rows
const topZone = document.querySelector('.top-row-zone');
if (topZone) {
    topZone.addEventListener('click', () => {
        console.log('Top zone clicked');
        if (currentRow === 'top') {
            animateRow('row-top', 'left');
        }
    });
}

const leftZone = document.querySelector('.left-row-zone');
if (leftZone) {
    leftZone.addEventListener('click', () => {
        console.log('Left zone clicked');
        if (currentRow === 'left') {
            animateRow('row-left', 'right');
        }
    });
}

const rightZone = document.querySelector('.right-row-zone');
if (rightZone) {
    rightZone.addEventListener('click', () => {
        console.log('Right zone clicked');
        if (currentRow === 'right') {
            animateRow('row-right', 'bottom');
        }
    });
}

const bottomZone = document.querySelector('.bottom-row-zone');
if (bottomZone) {
    bottomZone.addEventListener('click', () => {
        console.log('Bottom zone clicked');
        if (currentRow === 'bottom') {
            animateRow('row-bottom', null); // null means activate moon next
        }
    });
}

// Stanza 2 moon click handler
const stanza2Moon = document.getElementById('stanza2Moon');
if (stanza2Moon) {
    stanza2Moon.addEventListener('click', () => {
        if (stanza2Moon.classList.contains('active')) {
            console.log('Transitioning to Stanza 3');
            showPage('stanza3Page');
        }
    });
}

// ===== STANZA 3: TRAIN STATION =====
let currentSmokeIndex = 0;
const smokeOrder = [1, 2, 3, 4, 5, 6, 7]; // Order of smoke puffs to click

function initializeStanza3() {
    console.log('initializeStanza3 called');
    
    // Reset all smoke puffs and text
    const smokePuffs = document.querySelectorAll('#stanza3Page .smoke-puff');
    const smokeTexts = document.querySelectorAll('#stanza3Page .smoke-text');
    
    smokePuffs.forEach(puff => {
        puff.classList.remove('clicked');
    });
    
    smokeTexts.forEach(text => {
        text.classList.remove('visible');
    });
    
    // Make first smoke puff clickable
    currentSmokeIndex = 0;
    const firstPuff = document.querySelector(`#stanza3Page .smoke-${smokeOrder[0]} .smoke-puff.clickable`);
    if (firstPuff) {
        firstPuff.style.pointerEvents = 'auto';
    }
    
    console.log('Stanza 3 initialized');
}

// Smoke puff click handlers
document.querySelectorAll('#stanza3Page .smoke-puff.clickable').forEach((puff, index) => {
    puff.addEventListener('click', () => {
        const wrapper = puff.closest('.smoke-wrapper');
        const smokeClass = Array.from(wrapper.classList).find(c => c.startsWith('smoke-'));
        const smokeNum = parseInt(smokeClass.split('-')[1]);
        
        // Check if this is the current smoke puff in sequence
        if (smokeNum === smokeOrder[currentSmokeIndex]) {
            console.log(`Smoke ${smokeNum} clicked`);
            
            // Mark as clicked (reduce opacity)
            puff.classList.add('clicked');
            puff.style.pointerEvents = 'none';
            
            // Show text with GSAP animation
            const text = wrapper.querySelector('.smoke-text');
            if (text) {
                gsap.fromTo(text,
                    {
                        opacity: 0,
                        y: 10,
                        scale: 0.9
                    },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.4,
                        ease: "back.out(1.7)"
                    }
                );
                text.classList.add('visible');
            }
            
            // Move to next smoke puff
            currentSmokeIndex++;
            
            if (currentSmokeIndex < smokeOrder.length) {
                // Enable next smoke puff
                const nextPuff = document.querySelector(`#stanza3Page .smoke-${smokeOrder[currentSmokeIndex]} .smoke-puff.clickable`);
                if (nextPuff) {
                    nextPuff.style.pointerEvents = 'auto';
                }
            } else {
                // All smoke puffs clicked - could activate something here
                console.log('All smoke puffs clicked!');
                // TODO: Add transition to next stanza or final interaction
            }
        }
    });
    
    // Initially disable all smoke puffs except the first
    puff.style.pointerEvents = 'none';
});