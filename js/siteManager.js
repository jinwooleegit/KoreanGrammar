/**
 * 사이트 매니저 - 메뉴 및 푸터 관리 시스템
 * 모든 페이지에 일관된 헤더와 푸터를 적용하고 관리하는 통합 시스템
 * 버전: 1.4.0 (모바일 메뉴 개선 및 햄버거 메뉴 추가)
 */

class SiteManager {
    constructor() {
        // 메뉴 아이템 구성 (여기서 메뉴를 쉽게 추가/수정할 수 있음)
        this.menuItems = [
            { id: 'grade', title: '학년별 학습', url: '/pages/grade-learning/index.html', pattern: /grade-learning/ },
            { id: 'topics', title: '학습 주제별', url: '/pages/topics/index.html', pattern: /topics/ },
            { id: 'activities', title: '학습 활동', url: '/pages/activities/index.html', pattern: /activities/ },
            { id: 'progress', title: '나의 학습 진도', url: '/pages/progress/index.html', pattern: /progress/ },
            { id: 'sitemap', title: '사이트맵', url: '/sitemap.html', pattern: /sitemap\.html/ }
        ];
        
        // 캐시 방지 (v1.4.0)
        console.log('SiteManager 초기화: 버전 1.4.0');
        
        // 현재 페이지 경로 분석
        this.currentPath = window.location.pathname;
        this.pathDepth = this.calculatePathDepth();
        this.basePath = this.getBasePath();
        
        // 모바일 메뉴 상태
        this.isMobileMenuOpen = false;
        
        // 초기화
        this.init();
    }
    
    /**
     * 페이지 깊이 계산 (상대 경로 설정을 위함)
     */
    calculatePathDepth() {
        const path = this.currentPath;
        console.log("현재 경로:", path);
        
        // 경로를 /로 분할하고 빈 문자열 제거
        const pathParts = path.split('/').filter(Boolean);
        
        // 디렉토리 깊이 계산
        let depth = pathParts.length;
        
        // 파일명이 포함된 경우 하나 빼기
        if (path.endsWith('.html') || path.includes('.html?') || 
            path.endsWith('/') === false && pathParts.length > 0) {
            depth--;
        }
        
        console.log("계산된 경로 깊이:", depth);
        return depth;
    }
    
    /**
     * 상대 경로 계산
     */
    getBasePath() {
        const depth = this.pathDepth;
        let basePath = '';
        
        // 각 깊이 수준에 맞게 '../'를 추가
        for (let i = 0; i < depth; i++) {
            basePath += '../';
        }
        
        // 루트 경로일 경우 처리
        if (depth === 0 || this.currentPath === '/' || this.currentPath === '/index.html') {
            basePath = '/';
        }
        
        // 특정 페이지 처리
        if (this.currentPath.includes('sitemap.html')) {
            basePath = '/';
        }
        
        console.log("기본 경로:", basePath);
        return basePath;
    }
    
    /**
     * 사이트 초기화
     */
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.loadHeader();
            this.loadFooter();
            this.addBackToTopButton();
            this.ensureResourcesLoaded();
            this.setupMobileMenu();
            this.handleWindowResize();
        });
    }
    
    /**
     * 헤더 로드 및 적용
     */
    loadHeader() {
        const headerElement = document.querySelector('header');
        if (!headerElement) return;
        
        const basePath = this.getBasePath();
        headerElement.innerHTML = this.generateHeader(basePath);
        
        // 현재 페이지에 맞는 메뉴 활성화
        this.highlightActiveMenu();
    }
    
    /**
     * 헤더 HTML 생성
     */
    generateHeader(basePath) {
        // 루트 기준으로 URL을 상대 경로로 변환
        const menuHTML = this.menuItems.map(item => {
            // 안전하게 URL 경로 정규화
            let href = item.url;
            
            // 상대 경로가 필요한 경우 처리
            if (href.startsWith('/')) {
                href = href.substring(1); // 슬래시 제거
                href = basePath === '/' ? `/${href}` : `${basePath}${href}`;
            }
            
            return `<li id="${item.id}-nav"><a href="${href}">${item.title}</a></li>`;
        }).join('');
        
        // 로고 링크도 상대 경로로 조정
        const logoHref = basePath === '/' ? '/' : `${basePath}index.html`;
        
        return `
        <div class="site-header">
            <div class="header-container">
                <div class="logo">
                    <a href="${logoHref}">문법놀이터</a>
                </div>
                <div class="mobile-menu-toggle" aria-label="메뉴 토글" role="button" tabindex="0">
                    <span class="bar"></span>
                    <span class="bar"></span>
                    <span class="bar"></span>
                </div>
                <div class="nav-search-wrapper">
                    <nav class="desktop-nav">
                        <ul>${menuHTML}</ul>
                    </nav>
                    <div class="search-container">
                        <input type="text" placeholder="검색어를 입력하세요..." aria-label="검색">
                        <button aria-label="검색">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </div>
            </div>
            <div class="mobile-menu">
                <nav>
                    <ul>${menuHTML}</ul>
                </nav>
                <div class="search-container">
                    <input type="text" placeholder="검색어를 입력하세요..." aria-label="모바일 검색">
                    <button aria-label="검색">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                <div class="mobile-menu-footer">
                    <p>초등 국어 문법을 재미있게 배워요!</p>
                    <div class="social-links">
                        <a href="#" aria-label="유튜브"><i class="fab fa-youtube"></i></a>
                        <a href="#" aria-label="인스타그램"><i class="fab fa-instagram"></i></a>
                        <a href="#" aria-label="카카오톡"><i class="fas fa-comment"></i></a>
                        <a href="mailto:milgae@naver.com" aria-label="이메일"><i class="fas fa-envelope"></i></a>
                    </div>
                </div>
            </div>
        </div>`;
    }
    
    /**
     * 모바일 메뉴 설정
     */
    setupMobileMenu() {
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (!mobileMenuToggle || !mobileMenu) return;
        
        mobileMenuToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });
        
        // 키보드 접근성을 위한 키보드 이벤트 처리
        mobileMenuToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggleMobileMenu();
            }
        });
        
        // 모바일 메뉴 내부의 링크 클릭 시 메뉴 닫기
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.isMobileMenuOpen) {
                    this.toggleMobileMenu();
                }
            });
        });
        
        // 검색 기능 설정
        this.setupSearch();
    }
    
    /**
     * 검색 기능 설정
     */
    setupSearch() {
        const searchContainers = document.querySelectorAll('.search-container');
        
        searchContainers.forEach(container => {
            const searchInput = container.querySelector('input');
            const searchButton = container.querySelector('button');
            
            if (!searchInput || !searchButton) return;
            
            // 검색 버튼 클릭 이벤트
            searchButton.addEventListener('click', () => {
                this.performSearch(searchInput.value);
            });
            
            // 엔터 키 이벤트
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(searchInput.value);
                }
            });
        });
    }
    
    /**
     * 검색 실행
     */
    performSearch(query) {
        if (!query || query.trim() === '') return;
        
        // 검색어 공백 제거 및 인코딩
        const trimmedQuery = query.trim();
        const encodedQuery = encodeURIComponent(trimmedQuery);
        
        // 검색 결과 페이지로 이동 (상대 경로 적용)
        const searchResultsUrl = `${this.basePath}search.html?q=${encodedQuery}`;
        window.location.href = searchResultsUrl;
        
        console.log(`검색어: ${trimmedQuery}`);
    }
    
    /**
     * 모바일 메뉴 토글
     */
    toggleMobileMenu() {
        const mobileMenu = document.querySelector('.mobile-menu');
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        
        if (!mobileMenu || !mobileMenuToggle) return;
        
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
        
        if (this.isMobileMenuOpen) {
            mobileMenu.classList.add('open');
            mobileMenuToggle.classList.add('active');
            document.body.style.overflow = 'hidden'; // 스크롤 방지
        } else {
            mobileMenu.classList.remove('open');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = ''; // 스크롤 복원
        }
    }
    
    /**
     * 창 크기 변경 처리
     */
    handleWindowResize() {
        window.addEventListener('resize', () => {
            // 화면이 모바일 크기가 아닐 때 모바일 메뉴가 열려있다면 닫기
            if (window.innerWidth > 768 && this.isMobileMenuOpen) {
                this.toggleMobileMenu();
            }
        });
    }
    
    /**
     * 현재 페이지에 맞는 메뉴 활성화
     */
    highlightActiveMenu() {
        // 모든 메뉴 아이템에서 active 클래스 제거
        document.querySelectorAll('.site-header nav ul li').forEach(item => {
            item.classList.remove('active');
        });
        
        // 현재 경로와 일치하는 메뉴 아이템 찾기
        for (const item of this.menuItems) {
            if (item.pattern && item.pattern.test(this.currentPath)) {
                const menuItems = document.querySelectorAll(`#${item.id}-nav`);
                menuItems.forEach(menuItem => {
                    if (menuItem) {
                        menuItem.classList.add('active');
                        console.log(`활성화된 메뉴: ${item.title}`);
                    }
                });
                break;
            }
        }
    }
    
    /**
     * Back to Top 버튼 추가
     */
    addBackToTopButton() {
        // Back to Top 버튼 생성
        const backToTopButton = document.createElement('div');
        backToTopButton.className = 'back-to-top';
        backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(backToTopButton);
        
        // 스크롤 이벤트 리스너 추가
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) { // 300px 이상 스크롤 시 버튼 표시
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
        
        // 클릭 이벤트 리스너 추가
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth' // 부드러운 스크롤 효과
            });
        });
    }
    
    /**
     * 푸터 로드 및 적용
     */
    loadFooter() {
        const footerElement = document.querySelector('footer');
        if (!footerElement) return;
        
        footerElement.innerHTML = this.generateFooter();
    }
    
    /**
     * 푸터 HTML 생성
     */
    generateFooter() {
        return `
        <div class="footer-container simple-footer">
            <div class="copyright">
                <p>&copy; 2025 <a href="mailto:milgae@naver.com">이진우</a> All rights reserved.</p>
            </div>
        </div>`;
    }
    
    /**
     * 필요한 리소스가 올바르게 로드되었는지 확인
     */
    ensureResourcesLoaded() {
        // 이미 로드된 스크립트와 스타일시트 확인
        const loadedScripts = Array.from(document.querySelectorAll('script')).map(script => script.src);
        const loadedStyles = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(link => link.href);
        
        // 필요한 스크립트와 스타일시트 목록
        const essentialScripts = [
            { path: 'assets/js/scripts.js', loaded: false },
            { path: 'js/siteManager.js', loaded: false }
        ];
        
        const essentialStyles = [
            { path: 'assets/css/styles.css', loaded: false }
        ];
        
        // 이미 로드된 리소스 확인
        loadedScripts.forEach(src => {
            essentialScripts.forEach(script => {
                if (src.includes(script.path)) {
                    script.loaded = true;
                }
            });
        });
        
        loadedStyles.forEach(href => {
            essentialStyles.forEach(style => {
                if (href.includes(style.path)) {
                    style.loaded = true;
                }
            });
        });
        
        // 누락된 스크립트 로드
        essentialScripts.forEach(script => {
            if (!script.loaded) {
                console.log(`리소스 자동 로드: ${script.path}`);
                const scriptEl = document.createElement('script');
                scriptEl.src = this.basePath === '/' ? `/${script.path}` : `${this.basePath}${script.path}`;
                document.body.appendChild(scriptEl);
            }
        });
        
        // 누락된 스타일시트 로드
        essentialStyles.forEach(style => {
            if (!style.loaded) {
                console.log(`리소스 자동 로드: ${style.path}`);
                const linkEl = document.createElement('link');
                linkEl.rel = 'stylesheet';
                linkEl.href = this.basePath === '/' ? `/${style.path}` : `${this.basePath}${style.path}`;
                document.head.appendChild(linkEl);
            }
        });
    }
}

// 사이트 매니저 인스턴스 생성 및 실행
const siteManager = new SiteManager(); 