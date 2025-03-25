// 페이지 로드 시 공통 요소 삽입
document.addEventListener('DOMContentLoaded', function() {
    // 현재 페이지의 경로를 가져옴
    const path = window.location.pathname;
    const currentPage = path.split('/').pop();
    
    // 루트 경로 설정 (상대 경로 문제 해결)
    let rootPath = '';
    
    // 페이지 경로에 따른 상대 경로 설정
    if (path.includes('/pages/')) {
        // 서브 디렉토리에 있는 페이지인 경우 상위로 이동
        const pathSegments = path.split('/').filter(segment => segment);
        const depth = pathSegments.length;
        rootPath = '../'.repeat(depth);
    }
    
    console.log('현재 경로:', path);
    console.log('계산된 루트 경로:', rootPath);
    
    // 헤더 로드
    fetch(rootPath + 'includes/header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            // 헤더 삽입
            document.body.insertAdjacentHTML('afterbegin', html);
            
            // 상대 경로를 기반으로 링크 경로 수정
            fixHeaderLinks(rootPath);
            
            // 현재 페이지에 해당하는 네비게이션 메뉴 활성화
            highlightCurrentNav(currentPage, path);
        })
        .catch(error => {
            console.error('헤더를 불러오는 중 오류가 발생했습니다:', error);
            // 오류 발생 시 대체 헤더 표시
            const fallbackHeader = `
            <header class="site-header">
                <div class="header-container">
                    <div class="logo"><a href="${rootPath}index.html">문법놀이터</a></div>
                    <nav>
                        <ul>
                            <li id="nav-grade"><a href="${rootPath}grade_learning.html">학년별 학습</a></li>
                            <li id="nav-topics"><a href="${rootPath}topics.html">학습 주제별</a></li>
                            <li id="nav-activities"><a href="${rootPath}activities.html">학습 활동</a></li>
                        </ul>
                    </nav>
                </div>
            </header>`;
            document.body.insertAdjacentHTML('afterbegin', fallbackHeader);
        });

    // 푸터 로드
    fetch(rootPath + 'includes/footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            // 푸터 삽입
            document.body.insertAdjacentHTML('beforeend', html);
        })
        .catch(error => {
            console.error('푸터를 불러오는 중 오류가 발생했습니다:', error);
            // 오류 발생 시 대체 푸터 표시
            const fallbackFooter = `
            <footer>
                <div class="footer-container simple-footer">
                    <div class="copyright">
                        <p>&copy; 2025 <a href="mailto:milgae@naver.com">이진우</a> All rights reserved.</p>
                    </div>
                </div>
            </footer>`;
            document.body.insertAdjacentHTML('beforeend', fallbackFooter);
        });
});

// 헤더 링크의 경로를 수정하는 함수
function fixHeaderLinks(rootPath) {
    if (!rootPath) rootPath = '';
    
    // 로고 링크 수정
    const logoLink = document.querySelector('.logo a');
    if (logoLink) {
        logoLink.href = rootPath + 'index.html';
    }
    
    // 네비게이션 링크 수정
    const navLinks = {
        'nav-grade': rootPath + 'grade_learning.html',
        'nav-topics': rootPath + 'topics.html',
        'nav-activities': rootPath + 'activities.html'
    };
    
    Object.keys(navLinks).forEach(id => {
        const navItem = document.getElementById(id);
        if (navItem) {
            const link = navItem.querySelector('a');
            if (link) {
                link.href = navLinks[id];
            }
        }
    });
}

// 현재 페이지에 해당하는 네비게이션 메뉴 활성화
function highlightCurrentNav(currentPage, fullPath) {
    // 기본적으로 모든 네비게이션 아이템의 active 클래스 제거
    const navItems = document.querySelectorAll('nav ul li');
    navItems.forEach(item => {
        item.classList.remove('active');
    });
    
    // 현재 페이지에 따라 해당 메뉴 활성화
    if (currentPage === 'index.html' || currentPage === '') {
        // 홈페이지는 특별한 처리 없음
    } else if (fullPath.includes('/grade') || currentPage.includes('grade')) {
        const gradeNav = document.getElementById('nav-grade');
        if (gradeNav) gradeNav.classList.add('active');
    } else if (fullPath.includes('/topic') || currentPage.includes('topic')) {
        const topicsNav = document.getElementById('nav-topics');
        if (topicsNav) topicsNav.classList.add('active');
    } else if (fullPath.includes('/activit') || 
              ['word_matching_game.html', 'sentence_type_quiz.html', 
               'parts_of_speech_game.html', 'figurative_expressions.html',
               'honorific_converter.html', 'idiom_storytelling.html',
               'sentence_correction.html', 'proverb_puzzle.html'].includes(currentPage)) {
        const activitiesNav = document.getElementById('nav-activities');
        if (activitiesNav) activitiesNav.classList.add('active');
    }
} 