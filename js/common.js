// 페이지 로드 시 공통 요소 삽입
document.addEventListener('DOMContentLoaded', function() {
    // 현재 페이지의 경로를 가져옴
    const path = window.location.pathname;
    const currentPage = path.split('/').pop();
    
    // 루트 경로 설정 (상대 경로 문제 해결)
    let rootPath = '';
    if (path.includes('/pages/')) {
        // 서브 디렉토리에 있는 페이지인 경우 상위로 이동
        rootPath = '../../';
    }

    // 헤더 로드
    fetch(rootPath + 'includes/header.html')
        .then(response => response.text())
        .then(html => {
            // 헤더 삽입
            document.body.insertAdjacentHTML('afterbegin', html);
            
            // 현재 페이지에 해당하는 네비게이션 메뉴 활성화
            highlightCurrentNav(currentPage);
        })
        .catch(error => console.error('헤더를 불러오는 중 오류가 발생했습니다:', error));

    // 푸터 로드
    fetch(rootPath + 'includes/footer.html')
        .then(response => response.text())
        .then(html => {
            // 푸터 삽입
            document.body.insertAdjacentHTML('beforeend', html);
        })
        .catch(error => console.error('푸터를 불러오는 중 오류가 발생했습니다:', error));
});

// 현재 페이지에 해당하는 네비게이션 메뉴 활성화
function highlightCurrentNav(currentPage) {
    // 기본적으로 모든 네비게이션 아이템의 active 클래스 제거
    document.querySelectorAll('nav ul li').forEach(item => {
        item.classList.remove('active');
    });
    
    // 현재 페이지에 따라 해당 메뉴 활성화
    if (currentPage === 'index.html' || currentPage === '') {
        // 홈페이지는 특별한 처리 없음
    } else if (currentPage.includes('grade')) {
        document.getElementById('nav-grade').classList.add('active');
    } else if (currentPage.includes('topic')) {
        document.getElementById('nav-topics').classList.add('active');
    } else if (currentPage.includes('activities') || 
              ['word_matching_game.html', 'sentence_type_quiz.html', 
               'parts_of_speech_game.html', 'figurative_expressions.html',
               'honorific_converter.html', 'idiom_storytelling.html',
               'sentence_correction.html', 'proverb_puzzle.html'].includes(currentPage)) {
        document.getElementById('nav-activities').classList.add('active');
    }
} 