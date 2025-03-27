// 초등 국어 문법 놀이터 - 자바스크립트

// DOM이 완전히 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 플레이스홀더 초기화
    initPlaceholders();

    // 버튼 리스너 등록
    registerButtonListeners();

    // 검색 기능 초기화
    initSearch();

    // 카드 및 버튼 호버 효과
    initHoverEffects();
    
    // 학년별 탭 기능 초기화
    initGradeTabs();
    
    // 학습 활동 필터 기능 초기화
    initActivityFilters();

    // 위로 가기 버튼 기능
    // 위로 가기 버튼 요소 생성
    const scrollToTopBtn = document.createElement('div');
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollToTopBtn);
    
    // 스크롤 이벤트 리스너
    window.addEventListener('scroll', function() {
        // 현재 스크롤 위치가 100px 이상이면 버튼 표시
        if (window.pageYOffset > 100) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });
    
    // 버튼 클릭 이벤트
    scrollToTopBtn.addEventListener('click', function() {
        // 부드러운 스크롤로 페이지 상단으로 이동
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// 플레이스홀더 초기화 함수
function initPlaceholders() {
    // 모든 플레이스홀더 이미지에 설명 텍스트 추가
    const placeholders = document.querySelectorAll('.placeholder-img');
    placeholders.forEach(placeholder => {
        // 각 플레이스홀더 유형에 따른 설명적인 아이콘 또는 심볼 설정
        // 이미지 영역 텍스트 삭제 - 빈 내용으로 대체
        if (placeholder.classList.contains('logo-img')) {
            placeholder.setAttribute('aria-label', '문법놀이터 로고');
        } else if (placeholder.classList.contains('banner-img')) {
            placeholder.setAttribute('aria-label', '학습 환영 배너 이미지');
        } else if (placeholder.classList.contains('grade-icon')) {
            placeholder.setAttribute('aria-label', '학년 아이콘');
        } else if (placeholder.classList.contains('card-img')) {
            placeholder.setAttribute('aria-label', '학습 콘텐츠 이미지');
        } else if (placeholder.classList.contains('character-img')) {
            placeholder.setAttribute('aria-label', '캐릭터 이미지');
        } else if (placeholder.classList.contains('activity-img')) {
            placeholder.setAttribute('aria-label', '학습 활동 이미지');
        } else if (placeholder.classList.contains('chart-img')) {
            placeholder.setAttribute('aria-label', '차트 이미지');
        }
    });
}

// 버튼 리스너 등록 함수
function registerButtonListeners() {
    // 시작하기 버튼
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            scrollToSection('grade-selection');
        });
    }

    // 학습 시작 버튼들
    const startButtons = document.querySelectorAll('.start-btn');
    startButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const contentTitle = this.closest('.content-card').querySelector('h3').textContent;
            alert(`"${contentTitle}" 학습을 시작합니다!`);
        });
    });
}

// 검색 기능 초기화
function initSearch() {
    const searchForm = document.querySelector('.search-box');
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-btn');

    if (searchForm && searchInput && searchButton) {
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            performSearch(searchInput.value);
        });

        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            performSearch(searchInput.value);
        });
    }
}

// 검색 실행 함수
function performSearch(query) {
    if (!query.trim()) {
        alert('검색어를 입력해주세요.');
        return;
    }
    
    console.log(`"${query}" 검색 중...`);
    // 실제 검색 기능은 백엔드 연동 시 구현
    alert(`"${query}" 검색 결과를 표시합니다.`);
}

// 호버 효과 초기화
function initHoverEffects() {
    // 학년 버튼 호버 효과
    const gradeButtons = document.querySelectorAll('.grade-btn');
    gradeButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.1)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
    });

    // 콘텐츠 카드 호버 효과
    const contentCards = document.querySelectorAll('.content-card, .activity-card');
    contentCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
        });
    });
}

// 학년별 탭 기능 초기화
function initGradeTabs() {
    const tabButtons = document.querySelectorAll('.content-tabs .tab-btn');
    const contentCards = document.querySelectorAll('.content-card');
    
    if (tabButtons.length > 0 && contentCards.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                // 모든 탭 버튼에서 active 클래스 제거
                tabButtons.forEach(btn => btn.classList.remove('active'));
                
                // 현재 클릭한 버튼에 active 클래스 추가
                this.classList.add('active');
                
                // 선택한 학년 데이터 가져오기
                const selectedGrade = this.getAttribute('data-grade');
                
                // 모든 카드 표시 여부 설정
                contentCards.forEach(card => {
                    if (selectedGrade === 'all') {
                        // '전체' 선택 시 모든 카드 표시
                        card.style.display = 'block';
                    } else {
                        // 특정 학년 선택 시 해당 학년 카드만 표시
                        if (card.getAttribute('data-grade') === selectedGrade) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    }
                });
            });
        });
    }
}

// 학습 활동 필터 기능 초기화
function initActivityFilters() {
    const filterButtons = document.querySelectorAll('.activity-filters .filter-btn');
    const activityCards = document.querySelectorAll('.activity-cards .activity-card');
    
    if (filterButtons.length > 0 && activityCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // 모든 필터 버튼에서 active 클래스 제거
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // 현재 클릭한 버튼에 active 클래스 추가
                this.classList.add('active');
                
                // 선택한 필터 데이터 가져오기
                const selectedFilter = this.getAttribute('data-filter');
                
                // 모든 활동 카드 표시 여부 설정
                activityCards.forEach(card => {
                    // 카드 애니메이션 준비
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        if (selectedFilter === 'all') {
                            // '전체' 선택 시 모든 카드 표시
                            card.style.display = 'block';
                        } else {
                            // 특정 유형 선택 시 해당 유형 카드만 표시
                            if (card.getAttribute('data-type') === selectedFilter) {
                                card.style.display = 'block';
                            } else {
                                card.style.display = 'none';
                            }
                        }
                        
                        // 표시되는 카드에 애니메이션 적용
                        if (card.style.display === 'block') {
                            setTimeout(() => {
                                card.style.opacity = '1';
                                card.style.transform = 'translateY(0)';
                            }, 50);
                        }
                    }, 200);
                });
            });
        });
        
        // 카드 애니메이션을 위한 스타일 추가
        activityCards.forEach(card => {
            card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        });
    }
}

// 지정된 섹션으로 스크롤 이동
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// 추후 구현 예정 기능:
// 1. 모바일 메뉴 토글
// 2. 학년별 콘텐츠 필터링
// 3. 애니메이션 효과

// 향후 추가 기능:
// 1. 반응형 모바일 메뉴 토글
// 2. 이미지 슬라이더/캐러셀
// 3. 학습 진행 상황 차트 시각화 (Chart.js 등 활용)
// 4. 사용자 학습 데이터 로컬 스토리지 저장
// 5. 테마 전환 기능 (라이트/다크 모드) 