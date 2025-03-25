// 학습 진도 관리 자바스크립트

// 현재 선택된 학년
let currentGrade = 1;

// DOM이 완전히 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 초기 데이터 로드 및 표시
    loadProgressData();
    displayGradeData(currentGrade);
    
    // 플레이스홀더 초기화
    initPlaceholders();
    
    // 이벤트 리스너 등록
    registerEventListeners();
    
    // 가이드 토글 버튼 이벤트 등록
    initGuideToggle();
});

// 플레이스홀더 초기화 함수
function initPlaceholders() {
    const placeholders = document.querySelectorAll('.placeholder-img');
    placeholders.forEach(placeholder => {
        if (placeholder.classList.contains('logo-img')) {
            placeholder.setAttribute('aria-label', '문법놀이터 로고');
        } else if (placeholder.classList.contains('small-icon')) {
            placeholder.setAttribute('aria-label', '아이콘');
        } else if (placeholder.classList.contains('chart-img')) {
            placeholder.setAttribute('aria-label', '진도 차트');
        }
    });
}

// 학생용 가이드 토글 초기화
function initGuideToggle() {
    const toggleBtn = document.getElementById('toggle-guide');
    const guideContent = document.getElementById('guide-content');
    
    if (toggleBtn && guideContent) {
        // 로컬 스토리지에서 가이드 표시 상태 확인
        const isGuideHidden = localStorage.getItem('grammarGuideHidden') === 'true';
        
        // 초기 상태 설정
        if (isGuideHidden) {
            guideContent.style.display = 'none';
            toggleBtn.textContent = '안내 보기';
        }
        
        // 토글 버튼 클릭 이벤트
        toggleBtn.addEventListener('click', function() {
            if (guideContent.style.display === 'none') {
                // 가이드 보이기
                guideContent.style.display = 'grid';
                toggleBtn.textContent = '안내 숨기기';
                localStorage.setItem('grammarGuideHidden', 'false');
            } else {
                // 가이드 숨기기
                guideContent.style.display = 'none';
                toggleBtn.textContent = '안내 보기';
                localStorage.setItem('grammarGuideHidden', 'true');
            }
        });
    }
}

// 이벤트 리스너 등록
function registerEventListeners() {
    // 탭 버튼 클릭 이벤트
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 기존 선택 제거
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // 현재 선택 추가
            this.classList.add('active');
            // 선택된 학년 데이터 표시
            currentGrade = parseInt(this.getAttribute('data-grade'));
            displayGradeData(currentGrade);
        });
    });

    // 검색 기능 초기화
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-box input');
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', function() {
            performSearch(searchInput.value);
        });
        
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                performSearch(searchInput.value);
            }
        });
    }

    // 진도 데이터 초기화 버튼
    const resetBtn = document.getElementById('reset-progress');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            showModal('reset-modal');
        });
    }

    // 내보내기 버튼
    const exportBtn = document.getElementById('export-progress');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            exportProgressData();
        });
    }

    // 가져오기 버튼
    const importBtn = document.getElementById('import-progress');
    if (importBtn) {
        importBtn.addEventListener('click', function() {
            showModal('import-modal');
        });
    }

    // 모달 닫기 버튼들
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            hideModals();
        });
    });

    // 초기화 확인 버튼
    const confirmResetBtn = document.getElementById('confirm-reset');
    if (confirmResetBtn) {
        confirmResetBtn.addEventListener('click', function() {
            resetProgressData();
            hideModals();
        });
    }

    // 초기화 취소 버튼
    const cancelResetBtn = document.getElementById('cancel-reset');
    if (cancelResetBtn) {
        cancelResetBtn.addEventListener('click', function() {
            hideModals();
        });
    }

    // 가져오기 확인 버튼
    const confirmImportBtn = document.getElementById('confirm-import');
    if (confirmImportBtn) {
        confirmImportBtn.addEventListener('click', function() {
            importProgressData();
            hideModals();
        });
    }

    // 코드 복사 버튼
    const copyCodeBtn = document.getElementById('copy-code');
    if (copyCodeBtn) {
        copyCodeBtn.addEventListener('click', function() {
            const codeElement = document.getElementById('export-code');
            codeElement.select();
            document.execCommand('copy');
            alert('코드가 복사되었습니다!');
        });
    }

    // 계속하기 버튼 이벤트 (동적으로 생성된 요소)
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('topic-continue')) {
            const topicId = e.target.getAttribute('data-id');
            continueLearning(topicId);
        }
    });
}

// 진도 데이터 로드 (로컬 스토리지에서)
function loadProgressData() {
    // 기본 샘플 데이터
    const sampleData = {
        stats: {
            completedCount: 0,
            streakCount: 0,
            totalTimeMinutes: 0,
            averageScore: 0
        },
        grades: {
            1: { progress: 0, topics: [] },
            2: { progress: 0, topics: [] },
            3: { progress: 0, topics: [] },
            4: { progress: 0, topics: [] },
            5: { progress: 0, topics: [] },
            6: { progress: 0, topics: [] }
        },
        recentActivities: []
    };

    // 로컬 스토리지에서 데이터 불러오기
    let progressData = localStorage.getItem('grammarProgressData');
    
    // 저장된 데이터가 없으면 샘플 데이터 사용
    if (!progressData) {
        progressData = sampleData;
        // 샘플 학습 데이터 추가 (테스트용)
        addSampleLearningData(progressData);
    } else {
        try {
            progressData = JSON.parse(progressData);
        } catch (e) {
            console.error('저장된 데이터 파싱 오류:', e);
            progressData = sampleData;
        }
    }

    // 통계 데이터 표시
    updateStatistics(progressData.stats);
    
    return progressData;
}

// 통계 데이터 업데이트
function updateStatistics(stats) {
    document.getElementById('completed-count').textContent = stats.completedCount;
    document.getElementById('streak-count').textContent = stats.streakCount;
    document.getElementById('total-time').textContent = stats.totalTimeMinutes;
    document.getElementById('avg-score').textContent = stats.averageScore;
}

// 샘플 학습 데이터 추가 (테스트용)
function addSampleLearningData(data) {
    // 1학년 샘플 데이터
    data.grades[1].topics = [
        { id: '1-1', title: '낱말 알아보기', progress: 75, icon: '낱' },
        { id: '1-2', title: '문장 알아보기', progress: 40, icon: '문' },
        { id: '1-3', title: '바른 말 쓰기', progress: 20, icon: '바' }
    ];
    
    // 2학년 샘플 데이터
    data.grades[2].topics = [
        { id: '2-1', title: '문장의 종류', progress: 60, icon: '종' },
        { id: '2-2', title: '낱말의 관계', progress: 30, icon: '관' }
    ];
    
    // 3학년 샘플 데이터
    data.grades[3].topics = [
        { id: '3-1', title: '품사 알아보기', progress: 45, icon: '품' }
    ];
    
    // 학년별 전체 진도율 계산
    data.grades[1].progress = 45; // (75 + 40 + 20) / 3
    data.grades[2].progress = 45; // (60 + 30) / 2
    data.grades[3].progress = 45; // 45 / 1
    data.grades[4].progress = 0;
    data.grades[5].progress = 0;
    data.grades[6].progress = 0;
    
    // 통계 데이터
    data.stats.completedCount = 3;
    data.stats.streakCount = 2;
    data.stats.totalTimeMinutes = 45;
    data.stats.averageScore = 85;
    
    // 최근 활동
    data.recentActivities = [
        {
            id: 'act-1',
            title: '낱말 카드 매칭 게임',
            type: 'game',
            detail: '명사, 동사, 형용사 구분하기',
            date: '2023-05-15',
            score: 90,
            timeMinutes: 15
        },
        {
            id: 'act-2',
            title: '문장 종류 맞추기 퀴즈',
            type: 'quiz',
            detail: '문장의 종류를 맞혀보세요',
            date: '2023-05-14',
            score: 80,
            timeMinutes: 20
        },
        {
            id: 'act-3',
            title: '낱말의 의미 알아보기',
            type: 'learn',
            detail: '비슷한 말과 반대말 학습',
            date: '2023-05-13',
            score: 85,
            timeMinutes: 10
        }
    ];
    
    // 로컬 스토리지에 저장
    saveProgressData(data);
}

// 선택된 학년 데이터 표시
function displayGradeData(grade) {
    const progressData = loadProgressData();
    const gradeData = progressData.grades[grade];
    
    // 진도율 업데이트
    updateProgressBar(gradeData.progress);
    
    // 주제 목록 업데이트
    updateTopicsList(gradeData.topics);
    
    // 최근 활동 업데이트
    updateRecentActivities(progressData.recentActivities);
}

// 진도율 막대 업데이트
function updateProgressBar(percentage) {
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-percentage');
    
    progressFill.style.width = percentage + '%';
    progressText.textContent = percentage + '%';
}

// 주제 목록 업데이트
function updateTopicsList(topics) {
    const topicsContainer = document.getElementById('topics-container');
    
    // 기존 내용 제거
    topicsContainer.innerHTML = '';
    
    // 주제가 없으면 빈 상태 표시
    if (!topics || topics.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <p>아직 학습한 내용이 없습니다.</p>
            <a href="index.html" class="start-btn">학습 시작하기</a>
        `;
        topicsContainer.appendChild(emptyState);
        return;
    }
    
    // 각 주제 항목 추가
    topics.forEach(topic => {
        const topicItem = document.createElement('div');
        topicItem.className = 'topic-item';
        topicItem.innerHTML = `
            <div class="topic-icon">${topic.icon}</div>
            <div class="topic-info">
                <h4 class="topic-title">${topic.title}</h4>
                <div class="topic-progress">${topic.progress}% 완료</div>
                <div class="topic-progress-bar">
                    <div class="topic-progress-fill" style="width: ${topic.progress}%"></div>
                </div>
            </div>
            <button class="topic-continue" data-id="${topic.id}">이어하기</button>
        `;
        topicsContainer.appendChild(topicItem);
    });
}

// 최근 활동 업데이트
function updateRecentActivities(activities) {
    const activitiesContainer = document.getElementById('activities-container');
    
    // 기존 내용 제거
    activitiesContainer.innerHTML = '';
    
    // 활동이 없으면 빈 상태 표시
    if (!activities || activities.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <p>아직 학습 활동 기록이 없습니다.</p>
        `;
        activitiesContainer.appendChild(emptyState);
        return;
    }
    
    // 각 활동 항목 추가
    activities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-header">
                <span class="activity-type-badge ${activity.type}">${getActivityTypeText(activity.type)}</span>
                <span class="activity-date">${formatDate(activity.date)}</span>
            </div>
            <h3 class="activity-title">${activity.title}</h3>
            <p class="activity-detail">${activity.detail}</p>
            <div class="activity-stats">
                <div class="activity-score">점수: <span>${activity.score}</span></div>
                <div class="activity-time">학습시간: <span>${activity.timeMinutes}분</span></div>
            </div>
        `;
        activitiesContainer.appendChild(activityItem);
    });
}

// 활동 유형 텍스트 변환
function getActivityTypeText(type) {
    switch (type) {
        case 'game': return '게임';
        case 'quiz': return '퀴즈';
        case 'learn': return '학습';
        default: return '기타';
    }
}

// 날짜 형식 변환
function formatDate(dateString) {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

// 검색 실행
function performSearch(query) {
    if (!query.trim()) {
        alert('검색어를 입력해주세요.');
        return;
    }
    
    console.log(`"${query}" 검색 중...`);
    // 실제 검색 기능은 백엔드 연동 시 구현
    alert(`"${query}" 검색 결과를 표시합니다.`);
}

// 진도 데이터 저장 (로컬 스토리지에)
function saveProgressData(data) {
    localStorage.setItem('grammarProgressData', JSON.stringify(data));
}

// 진도 데이터 초기화
function resetProgressData() {
    // 로컬 스토리지에서 진도 데이터 삭제
    localStorage.removeItem('grammarProgressData');
    
    // 페이지 새로고침하여 기본 상태로 돌아가기
    window.location.reload();
}

// 진도 데이터 내보내기
function exportProgressData() {
    const progressData = localStorage.getItem('grammarProgressData');
    
    // 데이터가 없으면 알림
    if (!progressData) {
        alert('내보낼 학습 데이터가 없습니다.');
        return;
    }
    
    // 데이터 인코딩
    const encodedData = btoa(progressData);
    
    // 모달에 코드 표시
    const exportCodeElement = document.getElementById('export-code');
    exportCodeElement.value = encodedData;
    
    // 모달 표시
    showModal('export-modal');
}

// 진도 데이터 가져오기
function importProgressData() {
    const importCodeElement = document.getElementById('import-code');
    const encodedData = importCodeElement.value.trim();
    
    // 코드가 비어있으면 알림
    if (!encodedData) {
        alert('가져올 학습 코드를 입력해주세요.');
        return;
    }
    
    try {
        // 데이터 디코딩
        const decodedData = atob(encodedData);
        
        // JSON 형식 확인
        JSON.parse(decodedData);
        
        // 로컬 스토리지에 저장
        localStorage.setItem('grammarProgressData', decodedData);
        
        // 페이지 새로고침하여 가져온 데이터 표시
        window.location.reload();
    } catch (e) {
        console.error('데이터 가져오기 오류:', e);
        alert('유효하지 않은 학습 코드입니다. 다시 확인해주세요.');
    }
}

// 계속 학습하기
function continueLearning(topicId) {
    // 실제 구현에서는 해당 주제의 학습 페이지로 이동
    console.log(`주제 ID: ${topicId} 학습 계속하기`);
    alert(`"${topicId}" 주제 학습을 계속합니다. (기능 구현 예정)`);
}

// 모달 표시
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
}

// 모든 모달 숨기기
function hideModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
} 