/* =========================================
   共通スクリプト
   ========================================= */


/* ---------- ヘッダー読み込み ---------- */

fetch('header.html')
    .then(res => res.text())
    .then(html => {

        // 既にヘッダーが存在する場合は二重挿入を防ぐ
        document.querySelectorAll('header').forEach(el => el.remove());

        // ヘッダーは常にページ最上部（サイト共通の動き）
        document.body.insertAdjacentHTML('afterbegin', html);

        initHeader();
        setHeaderHeight();
    })
    .catch(() => {});


/* ---------- フッター読み込み ---------- */

fetch('footer.html')
    .then(res => res.text())
    .then(html => {

        // 既にフッターが存在する場合は二重挿入を防ぐ
        document.querySelectorAll('footer').forEach(el => el.remove());

        document.body.insertAdjacentHTML('beforeend', html);
    })
    .catch(() => {});


/* ---------- ヘッダーの動作 ---------- */

function initHeader(){

    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('nav-menu');

    if(hamburger && navMenu){
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // スマホ時のドロップダウン
    document.querySelectorAll('.dropdown > a').forEach(item => {

        item.addEventListener('click', function(e){

            if(window.innerWidth <= 768){
                e.preventDefault();
                this.parentElement.classList.toggle('open');
            }

        });

    });

}


/* ---------- ヘッダー高さを CSS 変数へ ---------- */

function setHeaderHeight(){

    const header = document.querySelector('header');
    if(!header) return;

    const apply = () => {
        document.documentElement.style.setProperty(
            '--head-h', header.offsetHeight + 'px'
        );
    };

    apply();
    window.addEventListener('resize', apply);

}


/* =========================================
   トップページ用
   ========================================= */

document.addEventListener('DOMContentLoaded', function(){

    initHeroSlider();
    initReveal();
    initLegacyHero();

});


/* ---------- ヒーロースライダー ---------- */

function initHeroSlider(){

    const slides = document.querySelectorAll('.hv-slide');
    const dotsBox = document.getElementById('hv-dots');

    if(slides.length === 0) return;

    let current = 0;
    let timer = null;

    // インジケーター生成
    const dots = [];

    if(dotsBox){

        slides.forEach((_, i) => {

            const b = document.createElement('button');
            b.type = 'button';
            b.setAttribute('aria-label', (i + 1) + '枚目を表示');

            if(i === 0) b.classList.add('is-active');

            b.addEventListener('click', () => {
                show(i);
                restart();
            });

            dotsBox.appendChild(b);
            dots.push(b);

        });

    }

    function show(index){

        slides[current].classList.remove('is-active');
        if(dots[current]) dots[current].classList.remove('is-active');

        current = index;

        slides[current].classList.add('is-active');
        if(dots[current]) dots[current].classList.add('is-active');

    }

    function next(){
        show((current + 1) % slides.length);
    }

    function restart(){
        clearInterval(timer);
        if(slides.length > 1) timer = setInterval(next, 6000);
    }

    restart();

}


/* ---------- 旧マークアップ用スライダー（他ページ互換） ---------- */

function initLegacyHero(){

    const slides = document.querySelectorAll('.hero-slide');
    if(slides.length <= 1) return;

    let current = 0;

    setInterval(function(){
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
    }, 5000);

}


/* ---------- スクロール表示アニメーション ---------- */

function initReveal(){

    const targets = document.querySelectorAll('[data-reveal]');
    if(targets.length === 0) return;

    if(!('IntersectionObserver' in window)){
        targets.forEach(el => el.classList.add('is-in'));
        return;
    }

    const io = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if(entry.isIntersecting){
                entry.target.classList.add('is-in');
                io.unobserve(entry.target);
            }

        });

    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    targets.forEach(el => io.observe(el));

}