// 루트 경로 계산
function calculateRootPath() {
    const path = window.location.pathname;
    console.log("현재 경로:", path);
    
    // 서브디렉토리에 있는 경우
    if (path.includes('/pages/topics/') || 
        path.includes('/pages/activities/') || 
        path.includes('/pages/grade-learning/')) {
        return '../../';
    } else if (path.includes('/pages/')) {
        return '../';
    } else {
        return '';
    }
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    const rootPath = calculateRootPath();
    console.log("계산된 루트 경로:", rootPath);
    
    // 헤더 로드
    fetch(rootPath + 'includes/header.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.querySelector('header').innerHTML = data;
            // 헤더 로드 후 링크 수정 및 현재 메뉴 활성화
            fixHeaderLinks();
            highlightCurrentNav();
        })
        .catch(error => {
            console.error('헤더 로드 중 오류 발생:', error);
            document.querySelector('header').innerHTML = '<div class="header-error">헤더를 로드할 수 없습니다.</div>';
        });

    // 푸터 로드
    fetch(rootPath + 'includes/footer.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.querySelector('footer').innerHTML = data;
        })
        .catch(error => {
            console.error('푸터 로드 중 오류 발생:', error);
            document.querySelector('footer').innerHTML = '<div class="footer-error">푸터를 로드할 수 없습니다.</div>';
        });
});

// 현재 활성화된 네비게이션 항목 하이라이트
function highlightCurrentNav() {
    console.log("현재 페이지 경로 분석 중...");
    const currentPage = window.location.pathname;
    console.log("현재 페이지:", currentPage);
    
    const fullPath = window.location.href;
    console.log("전체 경로:", fullPath);
    
    // 모든 네비게이션 항목에서 active 클래스 제거
    document.querySelectorAll('.site-header nav ul li').forEach(item => {
        item.classList.remove('active');
    });
    
    // 홈페이지인 경우 (index.html 또는 루트)
    if (currentPage === '/index.html' || currentPage === '/' || currentPage.endsWith('/KoreanGrammar/')) {
        // 아무 메뉴도 활성화하지 않음 (홈페이지는 특별한 메뉴가 없음)
    } 
    // 학년별 학습 페이지인 경우
    else if (currentPage.includes('/grade-learning/') || currentPage.includes('/grade_')) {
        document.querySelector('.site-header nav ul li:nth-child(1)').classList.add('active');
    } 
    // 학습 주제별 페이지인 경우
    else if (currentPage.includes('/topics/')) {
        document.querySelector('.site-header nav ul li:nth-child(2)').classList.add('active');
    } 
    // 학습 활동 페이지인 경우
    else if (currentPage.includes('/activities/')) {
        document.querySelector('.site-header nav ul li:nth-child(3)').classList.add('active');
        console.log("활동 페이지 메뉴 활성화됨");
    }
    
    console.log("네비게이션 하이라이트 완료");
}

// 헤더의 링크 경로 조정
function fixHeaderLinks() {
    const currentPath = window.location.pathname;
    const header = document.querySelector('.site-header');
    
    if (!header) return;
    
    // 로고 링크 수정
    const logoLink = header.querySelector('.logo a');
    if (logoLink) {
        if (currentPath.includes('/pages/')) {
            // 서브디렉토리에 있는 경우 (2단계 깊이)
            if (currentPath.includes('/pages/topics/') || 
                currentPath.includes('/pages/activities/') || 
                currentPath.includes('/pages/grade-learning/')) {
                logoLink.setAttribute('href', '../../index.html');
            } else {
                // 1단계 깊이
                logoLink.setAttribute('href', '../index.html');
            }
        } else {
            // 루트에 있는 경우
            logoLink.setAttribute('href', 'index.html');
        }
    }
    
    // 네비게이션 링크 수정
    const navLinks = header.querySelectorAll('nav ul li a');
    if (navLinks.length > 0) {
        // 첫 번째 링크: 학년별 학습
        if (navLinks[0]) {
            if (currentPath.includes('/pages/')) {
                if (currentPath.includes('/pages/topics/') || 
                    currentPath.includes('/pages/activities/') || 
                    currentPath.includes('/pages/grade-learning/')) {
                    navLinks[0].setAttribute('href', '../../pages/grade-learning/index.html');
                } else {
                    navLinks[0].setAttribute('href', '../grade-learning/index.html');
                }
            } else {
                navLinks[0].setAttribute('href', 'pages/grade-learning/index.html');
            }
        }
        
        // 두 번째 링크: 학습 주제별
        if (navLinks[1]) {
            if (currentPath.includes('/pages/')) {
                if (currentPath.includes('/pages/topics/') || 
                    currentPath.includes('/pages/activities/') || 
                    currentPath.includes('/pages/grade-learning/')) {
                    navLinks[1].setAttribute('href', '../../pages/topics/index.html');
                } else {
                    navLinks[1].setAttribute('href', '../topics/index.html');
                }
            } else {
                navLinks[1].setAttribute('href', 'pages/topics/index.html');
            }
        }
        
        // 세 번째 링크: 학습 활동
        if (navLinks[2]) {
            if (currentPath.includes('/pages/')) {
                if (currentPath.includes('/pages/topics/') || 
                    currentPath.includes('/pages/activities/') || 
                    currentPath.includes('/pages/grade-learning/')) {
                    navLinks[2].setAttribute('href', '../../pages/activities/index.html');
                } else {
                    navLinks[2].setAttribute('href', '../activities/index.html');
                }
            } else {
                navLinks[2].setAttribute('href', 'pages/activities/index.html');
            }
        }
    }
} 