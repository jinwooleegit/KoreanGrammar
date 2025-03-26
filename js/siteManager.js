/**
 * 사이트 매니저 - 메뉴 및 푸터 관리 시스템
 * 모든 페이지에 일관된 헤더와 푸터를 적용하고 관리하는 통합 시스템
 */

class SiteManager {
    constructor() {
        // 메뉴 아이템 구성 (여기서 메뉴를 쉽게 추가/수정할 수 있음)
        this.menuItems = [
            { id: 'home', title: '홈', url: 'index.html', pattern: /index\.html$|^\/$/ },
            { id: 'grade', title: '학년별 학습', url: 'grade-learning/index.html', pattern: /grade-learning/ },
            { id: 'topics', title: '학습 주제별', url: 'topics/index.html', pattern: /topics/ },
            { id: 'activities', title: '학습 활동', url: 'activities/index.html', pattern: /activities/ }
        ];
        
        // 현재 페이지 경로 분석
        this.currentPath = window.location.pathname;
        this.pathDepth = this.calculatePathDepth();
        
        // 초기화
        this.init();
    }
    
    /**
     * 페이지 깊이 계산 (상대 경로 설정을 위함)
     */
    calculatePathDepth() {
        const path = this.currentPath;
        console.log("현재 경로:", path);
        
        // '/pages/' 디렉토리가 경로에 포함되어 있는지 확인
        const inPagesDir = path.includes('/pages/');
        
        // 서브디렉토리 깊이 계산
        let depth = 0;
        
        if (inPagesDir) {
            const pathParts = path.split('/').filter(Boolean);
            const pagesIndex = pathParts.indexOf('pages');
            
            if (pagesIndex !== -1) {
                // pages 디렉토리를 기준으로 깊이 계산
                depth = pathParts.length - pagesIndex - 1;
            }
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
        
        // 'pages/' 디렉토리가 포함된 경로인 경우 추가
        if (this.currentPath.includes('/pages/')) {
            basePath += 'pages/';
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
        const menuHTML = this.menuItems.map(item => {
            // 경로 설정
            const url = item.url.startsWith('http') ? 
                        item.url : 
                        basePath + item.url.replace(/^\//, '');
            
            return `<li id="${item.id}-nav"><a href="${url}">${item.title}</a></li>`;
        }).join('');
        
        // 홈 링크도 basePath 적용
        const homeLink = basePath + 'index.html';
        
        return `
        <div class="site-header">
            <div class="header-container">
                <div class="logo">
                    <a href="${homeLink}">문법놀이터</a>
                </div>
                <nav>
                    <ul>${menuHTML}</ul>
                </nav>
                <div class="search-container">
                    <input type="text" placeholder="검색어를 입력하세요...">
                    <button>
                        <i class="fas fa-search"></i>
                    </button>
                </div>
            </div>
        </div>`;
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
                const menuItem = document.getElementById(`${item.id}-nav`);
                if (menuItem) {
                    menuItem.classList.add('active');
                    console.log(`활성화된 메뉴: ${item.title}`);
                    break;
                }
            }
        }
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
}

// 사이트 매니저 인스턴스 생성 및 실행
const siteManager = new SiteManager(); 