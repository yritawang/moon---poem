// wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

// state management
let currentStarIndex = 0;
const totalStars = 4;
const stars = document.querySelectorAll('.star');
const lines = document.querySelectorAll('.connection-line');

// audio controls
const audio = document.getElementById('backgroundMusic');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');

// play button handler
if (playBtn) {
    playBtn.addEventListener('click', () => {
        audio.play();
        playBtn.style.display = 'none';
        pauseBtn.style.display = 'block';
        pauseBtn.classList.add('playing');
    });
}

// pause button handler
if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
        audio.pause();
        pauseBtn.style.display = 'none';
        pauseBtn.classList.remove('playing');
        playBtn.style.display = 'block';
    });
}

// auto-play audio when entering stanza 1
let audioStarted = false;

// intro page - generate scrambled text
const text = "i love you to the moon &";
const moonText = document.getElementById('moonText');

if (moonText) {
    text.split('').forEach((char) => {
        const letter = document.createElement('span');
        letter.className = 'letter scrambled';
        letter.textContent = char;
        moonText.appendChild(letter);
    });
}

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
    
    // start stanza 1 when shown
    if (pageId === 'stanza1Page') {
        initializeStanza1();
        
        // auto-play audio on first entry to stanza 1
        if (!audioStarted && audio) {
            audio.play().then(() => {
                audioStarted = true;
                playBtn.style.display = 'none';
                pauseBtn.style.display = 'block';
                pauseBtn.classList.add('playing');
            }).catch(error => {
                console.log('Autoplay prevented by browser:', error);
                // show play button if autoplay fails
                playBtn.style.display = 'block';
                pauseBtn.style.display = 'none';
            });
        }
    }
    
    // start stanza 2 when shown
    if (pageId === 'stanza2Page') {
        console.log('Initializing Stanza 2');
        initializeStanza2();
    }
    
    // start stanza 3 when shown
    if (pageId === 'stanza3Page') {
        console.log('Initializing Stanza 3');
        initializeStanza3();
    }

    // start stanza 4 when shown
    if (pageId === 'stanza4Page') {
        console.log('Initializing Stanza 4');
        initializeStanza4();
    }
}

// stanza 2: sequential row activation
let currentRow = null;

function initializeStanza2() {
    console.log('initializeStanza2 called');
    
    // reset all flowers and words
    const flowers = document.querySelectorAll('#stanza2Page .flower');
    const words = document.querySelectorAll('#stanza2Page .flower-word');
    
    flowers.forEach(flower => {
        flower.classList.remove('step2');
    });
    
    words.forEach(word => {
        word.classList.remove('visible');
    });
    
    // reset and disable all click zones
    const zones = document.querySelectorAll('#stanza2Page .click-zone');
    zones.forEach(zone => {
        zone.classList.remove('completed', 'active');
    });
    
    // activate only the top row
    const topZone = document.querySelector('.top-row-zone');
    if (topZone) {
        topZone.classList.add('active');
        currentRow = 'top';
    }
    
    console.log('Stanza 2 initialized, top row active');
}

// animate flower row
function animateRow(rowClass, nextRow) {
    const flowerWrappers = Array.from(document.querySelectorAll(`#stanza2Page .${rowClass}`));
    
    console.log(`Animating ${rowClass}, flowers:`, flowerWrappers.length);
    
    // disable current zone
    const currentZone = document.querySelector(`.${rowClass.replace('row-', '')}-row-zone`);
    if (currentZone) {
        currentZone.classList.remove('active');
        currentZone.classList.add('completed');
    }
    
    // 1: show flower tops with random stagger
    flowerWrappers.forEach((wrapper) => {
        const flower = wrapper.querySelector('.flower');
        const randomDelay = Math.random() * 0.4;
        
        setTimeout(() => {
            flower.classList.add('step2');
        }, randomDelay * 1000);
    });
    
    // 2: animate words in with random timing
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
        
        // after words appear, activate next row or moon
        setTimeout(() => {
            if (nextRow) {
                const nextZone = document.querySelector(`.${nextRow}-row-zone`);
                if (nextZone) {
                    nextZone.classList.add('active');
                    currentRow = nextRow;
                    console.log(`${nextRow} row activated`);
                }
            } else {
                // all rows complete time to activate moon
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
const introMoon = document.getElementById('introMoon');
if (introMoon) {
    introMoon.addEventListener('click', () => {
        showPage('stanza1Page');
    });
}

// GSAP animation for poem line entrance
function animatePoemLine(poemLine) {
    const originalHTML = poemLine.innerHTML;
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = originalHTML;
    
    poemLine.innerHTML = '';
    
    const processNode = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            const words = node.textContent.split(' ').filter(w => w.trim());
            words.forEach((word, idx) => {
                const wordSpan = document.createElement('span');
                wordSpan.className = 'word';
                wordSpan.textContent = word;
                poemLine.appendChild(wordSpan);
                
                if (idx < words.length - 1 || node.nextSibling) {
                    poemLine.appendChild(document.createTextNode(' '));
                }
            });
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            const wordSpan = document.createElement('span');
            wordSpan.className = 'word';
            wordSpan.appendChild(node.cloneNode(true));
            poemLine.appendChild(wordSpan);
            
            if (node.nextSibling) {
                poemLine.appendChild(document.createTextNode(' '));
            }
        }
    };
    
    Array.from(tempDiv.childNodes).forEach(processNode);
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
                poemLine.classList.add('visible');
                
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

// ASCII moon click handler
const asciiMoon = document.getElementById('asciiMoon');
if (asciiMoon) {
    asciiMoon.addEventListener('click', () => {
        if (asciiMoon.classList.contains('active')) {
            console.log('Transitioning to Stanza 2');
            showPage('stanza2Page');
        }
    });
}

// click handlers for all four rows
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
            animateRow('row-bottom', null);
        }
    });
}

// stanza 2 moon click handler
const stanza2Moon = document.getElementById('stanza2Moon');
if (stanza2Moon) {
    stanza2Moon.addEventListener('click', () => {
        if (stanza2Moon.classList.contains('active')) {
            console.log('Transitioning to Stanza 3');
            showPage('stanza3Page');
        }
    });
}

// stanza 3 train station
let currentSmokeIndex = 0;
const smokeOrder = [1, 2, 3, 4];

function initializeStanza3() {
    console.log('initializeStanza3 called');
    
    // reset all smoke puffs and text
    const smokePuffs = document.querySelectorAll('#stanza3Page .smoke-puff');
    const smokeTexts = document.querySelectorAll('#stanza3Page .smoke-text');
    const smokeWrappers = document.querySelectorAll('#stanza3Page .smoke-wrapper');
    
    smokePuffs.forEach(puff => {
        puff.classList.remove('clicked');
    });
    
    smokeTexts.forEach(text => {
        text.classList.remove('visible');
    });
    
    // hide all smoke wrappers except the first one
    smokeWrappers.forEach((wrapper) => {
        const smokeClass = Array.from(wrapper.classList).find(c => c.startsWith('smoke-') && c !== 'smoke-wrapper');
        if (smokeClass) {
            const smokeNum = parseInt(smokeClass.split('-')[1]);
            
            if (smokeNum !== 1) {
                wrapper.classList.remove('visible');
            }
        }
    });
    
    // reset smoke index
    currentSmokeIndex = 0;
    
    // make first smoke puff clickable
    const firstPuff = document.querySelector(`#stanza3Page .smoke-${smokeOrder[0]} .smoke-puff.clickable`);
    if (firstPuff) {
        firstPuff.style.pointerEvents = 'auto';
    }
    
    console.log('Stanza 3 initialized - only smoke 1 visible');
}

// smoke puff click handlers
function attachSmokePuffHandlers() {
    document.querySelectorAll('#stanza3Page .smoke-puff.clickable').forEach((puff) => {
        puff.addEventListener('click', () => {
            const wrapper = puff.closest('.smoke-wrapper');
            const smokeClass = Array.from(wrapper.classList).find(c => c.startsWith('smoke-') && c !== 'smoke-wrapper');
            const smokeNum = parseInt(smokeClass.split('-')[1]);
            
            // check if this is the current smoke puff in sequence
            if (smokeNum === smokeOrder[currentSmokeIndex]) {
                console.log(`Smoke ${smokeNum} clicked`);
                
                // mark as clicked: change color to dark blue
                puff.classList.add('clicked');
                puff.style.pointerEvents = 'none';
                
                const text = wrapper.querySelector('.smoke-text');
                    if (text) {
                        text.classList.add('visible');
                        animatePoemLine(text);
                    }
                
                // move to next smoke puff
                currentSmokeIndex++;
                
                if (currentSmokeIndex < smokeOrder.length) {
                    // show and enable next smoke puff
                    const nextSmokeNum = smokeOrder[currentSmokeIndex];
                    const nextWrapper = document.querySelector(`#stanza3Page .smoke-${nextSmokeNum}`);
                    const nextPuff = document.querySelector(`#stanza3Page .smoke-${nextSmokeNum} .smoke-puff.clickable`);
                    
                    if (nextWrapper) {
                        // make wrapper visible
                        nextWrapper.classList.add('visible');
                        
                        // animate the smoke puff appearance
                        gsap.fromTo(nextWrapper,
                            {
                                opacity: 0,
                                scale: 0.8
                            },
                            {
                                opacity: 1,
                                scale: 1,
                                duration: 0.5,
                                ease: "back.out(1.7)",
                                delay: 0.3
                            }
                        );
                    }
                    
                    if (nextPuff) {
                        nextPuff.style.pointerEvents = 'auto';
                    }
                } else {
                    // all smoke puffs clicked - activate moon
                    console.log('All smoke puffs clicked! Activating moon...');
                    const stanza3Moon = document.getElementById('stanza3Moon');
                    if (stanza3Moon) {
                        stanza3Moon.classList.add('active');
                    }
                }
            }
        });
        
        // initially disable all smoke puffs except the first
        puff.style.pointerEvents = 'none';
    });
}

// call this once on page load
attachSmokePuffHandlers();

// Stanza 3 moon click handler
const stanza3Moon = document.getElementById('stanza3Moon');
if (stanza3Moon) {
    stanza3Moon.addEventListener('click', () => {
        if (stanza3Moon.classList.contains('active')) {
            console.log('Transitioning to Stanza 4');
            showPage('stanza4Page');
        }
    });
}

// stanza 4
let currentBunnyIndex = 0;
const bunnyOrder = [1, 2, 3, 4];

function initializeStanza4() {
    console.log('initializeStanza4 called');
    
    // reset all bunnies and text
    const bunnies = document.querySelectorAll('#stanza4Page .bunny');
    const bunnyTexts = document.querySelectorAll('#stanza4Page .bunny-text');
    const bunnyWrappers = document.querySelectorAll('#stanza4Page .bunny-wrapper');
    
    bunnies.forEach(bunny => {
        bunny.classList.remove('clicked');
    });
    
    bunnyTexts.forEach(text => {
        text.classList.remove('visible');
    });
    
    // hide all bunny wrappers except the first one
    bunnyWrappers.forEach((wrapper) => {
        const bunnyClass = Array.from(wrapper.classList).find(c => c.startsWith('bunny-') && c !== 'bunny-wrapper');
        if (bunnyClass) {
            const bunnyNum = parseInt(bunnyClass.split('-')[1]);
            
            if (bunnyNum !== 1) {
                wrapper.classList.remove('visible');
            }
        }
    });
    
    // reset bunny index
    currentBunnyIndex = 0;
    
    // make first bunny clickable
    const firstBunny = document.querySelector(`#stanza4Page .bunny-${bunnyOrder[0]} .bunny.clickable`);
    if (firstBunny) {
        firstBunny.style.pointerEvents = 'auto';
    }
    
    console.log('Stanza 4 initialized - only bunny 1 visible');
}

// bunny click handlers
function attachBunnyHandlers() {
    document.querySelectorAll('#stanza4Page .bunny.clickable').forEach((bunny) => {
        bunny.addEventListener('click', () => {
            const wrapper = bunny.closest('.bunny-wrapper');
            const bunnyClass = Array.from(wrapper.classList).find(c => c.startsWith('bunny-') && c !== 'bunny-wrapper');
            const bunnyNum = parseInt(bunnyClass.split('-')[1]);
            
            // check if this is the current bunny in sequence
            if (bunnyNum === bunnyOrder[currentBunnyIndex]) {
                console.log(`Bunny ${bunnyNum} clicked`);
                
                // mark as clicked - change color to dark blue
                bunny.classList.add('clicked');
                bunny.style.pointerEvents = 'none';
                
                // show text with GSAP animation
                const text = wrapper.querySelector('.bunny-text');
                if (text) {
                    gsap.fromTo(text,
                        {
                            opacity: 0,
                            y: -10,
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
                
                // move to next bunny
                currentBunnyIndex++;
                
                if (currentBunnyIndex < bunnyOrder.length) {
                    // show and enable next bunny
                    const nextBunnyNum = bunnyOrder[currentBunnyIndex];
                    const nextWrapper = document.querySelector(`#stanza4Page .bunny-${nextBunnyNum}`);
                    const nextBunny = document.querySelector(`#stanza4Page .bunny-${nextBunnyNum} .bunny.clickable`);
                    
                    if (nextWrapper) {
                        nextWrapper.classList.add('visible');
                        
                        gsap.fromTo(nextWrapper,
                            {
                                opacity: 0,
                                scale: 0.8
                            },
                            {
                                opacity: 1,
                                scale: 1,
                                duration: 0.5,
                                ease: "back.out(1.7)",
                                delay: 0.3
                            }
                        );
                    }
                    
                    if (nextBunny) {
                        nextBunny.style.pointerEvents = 'auto';
                    }
                } else {
                    console.log('All bunnies clicked! Activating moon...');
                    const stanza4Moon = document.getElementById('stanza4Moon');
                    if (stanza4Moon) {
                        stanza4Moon.classList.add('active');
                    }
                }
            }
        });
        
        bunny.style.pointerEvents = 'none';
    });
}

attachBunnyHandlers();

// Stanza 4 moon click handler
const stanza4Moon = document.getElementById('stanza4Moon');
if (stanza4Moon) {
    stanza4Moon.addEventListener('click', () => {
        if (stanza4Moon.classList.contains('active')) {
            console.log('Transitioning to End Page');
            console.log('End page not yet created');
        }
    });
}

});