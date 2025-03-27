/**
 * 학습 진도 관리 시스템
 * 사용자의 학습 활동을 추적하고 저장하는 기능을 제공합니다.
 */

document.addEventListener('DOMContentLoaded', function() {
    // 엘리먼트 참조
    const completedCount = document.getElementById('completed-count');
    const streakCount = document.getElementById('streak-count');
    const totalTime = document.getElementById('total-time');
    const avgScore = document.getElementById('avg-score');
    const progressFill = document.getElementById('progress-fill');
    const progressPercentage = document.getElementById('progress-percentage');
    const topicsContainer = document.getElementById('topics-container');
    const activitiesContainer = document.getElementById('activities-container');
    
    // 모달 관련 엘리먼트
    const importModal = document.getElementById('import-modal');
    const exportModal = document.getElementById('export-modal');
    const resetModal = document.getElementById('reset-modal');
    const importCode = document.getElementById('import-code');
    const exportCode = document.getElementById('export-code');
    
    // 버튼 참조
    const importBtn = document.getElementById('import-progress');
    const exportBtn = document.getElementById('export-progress');
    const resetBtn = document.getElementById('reset-progress');
    const confirmImportBtn = document.getElementById('confirm-import');
    const confirmResetBtn = document.getElementById('confirm-reset');
    const cancelResetBtn = document.getElementById('cancel-reset');
    const copyCodeBtn = document.getElementById('copy-code');
    const toggleGuideBtn = document.getElementById('toggle-guide');
    const guideContent = document.getElementById('guide-content');
    
    // 닫기 버튼들
    const closeButtons = document.querySelectorAll('.close-modal');
    
    // 학년 탭 버튼들
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    // 현재 활성화된 학년
    let activeGrade = '1';
    
    // 샘플 데이터 (실제로는 localStorage에서 가져옴)
    let progressData = loadProgressData();
    
    // 가이드 토글
    if (toggleGuideBtn) {
        toggleGuideBtn.addEventListener('click', function() {
            if (guideContent.style.display === 'none') {
                guideContent.style.display = 'grid';
                toggleGuideBtn.textContent = '안내 숨기기';
            } else {
                guideContent.style.display = 'none';
                toggleGuideBtn.textContent = '안내 보기';
            }
        });
    }
    
    // 초기 데이터 표시
    displayProgressStats();
    updateGradeContent(activeGrade);
    displayRecentActivities();
    
    // 학년 탭 이벤트 리스너
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 이전 활성 버튼에서 활성 클래스 제거
            document.querySelector('.tab-btn.active').classList.remove('active');
            
            // 현재 버튼에 활성 클래스 추가
            this.classList.add('active');
            
            // 활성 학년 업데이트
            activeGrade = this.getAttribute('data-grade');
            
            // 학년 콘텐츠 업데이트
            updateGradeContent(activeGrade);
        });
    });
    
    // 모달 이벤트 리스너
    if (importBtn) {
        importBtn.addEventListener('click', function() {
            importModal.style.display = 'flex';
        });
    }
    
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            // 진도 데이터를 JSON 문자열로 변환하여 내보내기
            exportCode.value = JSON.stringify(progressData);
            exportModal.style.display = 'flex';
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetModal.style.display = 'flex';
        });
    }
    
    // 확인 버튼 이벤트 리스너
    if (confirmImportBtn) {
        confirmImportBtn.addEventListener('click', function() {
            try {
                const importedData = JSON.parse(importCode.value);
                if (importedData && typeof importedData === 'object') {
                    progressData = importedData;
                    saveProgressData();
                    
                    // 화면 업데이트
                    displayProgressStats();
                    updateGradeContent(activeGrade);
                    displayRecentActivities();
                    
                    // 모달 닫기
                    importModal.style.display = 'none';
                    
                    // 성공 메시지
                    alert('학습 데이터를 성공적으로 가져왔습니다.');
                } else {
                    alert('유효하지 않은 데이터 형식입니다.');
                }
            } catch (e) {
                alert('데이터 가져오기에 실패했습니다. 올바른 형식인지 확인해주세요.');
                console.error('Import error:', e);
            }
        });
    }
    
    if (confirmResetBtn) {
        confirmResetBtn.addEventListener('click', function() {
            // 진도 데이터 초기화
            progressData = {
                completedActivities: 0,
                streakDays: 0,
                totalTimeMinutes: 0,
                averageScore: 0,
                gradeProgress: {
                    '1': { completed: 0, total: 10, topics: [] },
                    '2': { completed: 0, total: 10, topics: [] },
                    '3': { completed: 0, total: 10, topics: [] },
                    '4': { completed: 0, total: 10, topics: [] },
                    '5': { completed: 0, total: 10, topics: [] },
                    '6': { completed: 0, total: 10, topics: [] }
                },
                recentActivities: []
            };
            
            saveProgressData();
            
            // 화면 업데이트
            displayProgressStats();
            updateGradeContent(activeGrade);
            displayRecentActivities();
            
            // 모달 닫기
            resetModal.style.display = 'none';
            
            // 성공 메시지
            alert('학습 데이터가 초기화되었습니다.');
        });
    }
    
    if (cancelResetBtn) {
        cancelResetBtn.addEventListener('click', function() {
            resetModal.style.display = 'none';
        });
    }
    
    if (copyCodeBtn) {
        copyCodeBtn.addEventListener('click', function() {
            exportCode.select();
            document.execCommand('copy');
            alert('코드가 클립보드에 복사되었습니다.');
        });
    }
    
    // 모달 닫기 버튼 이벤트 리스너
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            importModal.style.display = 'none';
            exportModal.style.display = 'none';
            resetModal.style.display = 'none';
        });
    });
    
    // 윈도우 클릭 시 모달 닫기
    window.addEventListener('click', function(event) {
        if (event.target === importModal) {
            importModal.style.display = 'none';
        } else if (event.target === exportModal) {
            exportModal.style.display = 'none';
        } else if (event.target === resetModal) {
            resetModal.style.display = 'none';
        }
    });
    
    /**
     * 진도 통계 정보를 화면에 표시
     */
    function displayProgressStats() {
        // 각 통계 정보 업데이트
        completedCount.textContent = progressData.completedActivities;
        streakCount.textContent = progressData.streakDays;
        totalTime.textContent = progressData.totalTimeMinutes;
        avgScore.textContent = progressData.averageScore;
    }
    
    /**
     * 학년별 진도 내용 업데이트
     */
    function updateGradeContent(grade) {
        const gradeData = progressData.gradeProgress[grade];
        
        // 진도율 계산 및 표시
        const percentage = Math.round((gradeData.completed / gradeData.total) * 100);
        progressFill.style.width = `${percentage}%`;
        progressPercentage.textContent = `${percentage}%`;
        
        // 주제 목록 업데이트
        if (gradeData.topics.length > 0) {
            topicsContainer.innerHTML = '';
            
            gradeData.topics.forEach(topic => {
                const topicItem = document.createElement('div');
                topicItem.className = 'topic-item';
                topicItem.innerHTML = `
                    <div class="topic-info">
                        <h4 class="topic-title">${topic.title}</h4>
                        <div class="topic-progress">${topic.completed}/${topic.total} 완료</div>
                    </div>
                    <a href="${topic.continueUrl}" class="continue-btn">이어하기</a>
                `;
                topicsContainer.appendChild(topicItem);
            });
        } else {
            // 학습 주제가 없는 경우
            topicsContainer.innerHTML = `
                <div class="empty-state">
                    <p>아직 학습한 내용이 없습니다.</p>
                    <a href="/pages/grade-learning/grade${grade}/" class="start-btn">학습 시작하기</a>
                </div>
            `;
        }
    }
    
    /**
     * 최근 학습 활동 표시
     */
    function displayRecentActivities() {
        if (progressData.recentActivities.length > 0) {
            activitiesContainer.innerHTML = '';
            
            progressData.recentActivities.forEach(activity => {
                const activityItem = document.createElement('div');
                activityItem.className = 'activity-item';
                activityItem.innerHTML = `
                    <div class="activity-date">${activity.date}</div>
                    <h3 class="activity-title">${activity.title}</h3>
                    <div class="activity-details">${activity.details}</div>
                    <div class="activity-score">점수: ${activity.score}/100</div>
                `;
                activitiesContainer.appendChild(activityItem);
            });
        } else {
            // 학습 활동이 없는 경우
            activitiesContainer.innerHTML = `
                <div class="empty-state">
                    <p>아직 학습 활동 기록이 없습니다.</p>
                </div>
            `;
        }
    }
    
    /**
     * localStorage에서 진도 데이터 로드
     */
    function loadProgressData() {
        const savedData = localStorage.getItem('grammarPlaygroundProgress');
        
        if (savedData) {
            try {
                return JSON.parse(savedData);
            } catch (e) {
                console.error('Error parsing progress data:', e);
            }
        }
        
        // 기본 데이터 구조
        return {
            completedActivities: 0,
            streakDays: 0,
            totalTimeMinutes: 0,
            averageScore: 0,
            gradeProgress: {
                '1': { completed: 0, total: 10, topics: [] },
                '2': { completed: 0, total: 10, topics: [] },
                '3': { completed: 0, total: 10, topics: [] },
                '4': { completed: 0, total: 10, topics: [] },
                '5': { completed: 0, total: 10, topics: [] },
                '6': { completed: 0, total: 10, topics: [] }
            },
            recentActivities: []
        };
    }
    
    /**
     * localStorage에 진도 데이터 저장
     */
    function saveProgressData() {
        localStorage.setItem('grammarPlaygroundProgress', JSON.stringify(progressData));
    }
    
    // 예제 데이터 생성 (개발 확인용)
    function generateSampleData() {
        return {
            completedActivities: 15,
            streakDays: 3,
            totalTimeMinutes: 240,
            averageScore: 85,
            gradeProgress: {
                '1': {
                    completed: 7,
                    total: 10,
                    topics: [
                        { title: '낱말 알아보기', completed: 5, total: 5, continueUrl: '/pages/grade-learning/grade1/grade1_words.html' },
                        { title: '문장 알아보기', completed: 2, total: 5, continueUrl: '/pages/grade-learning/grade1/grade1_sentences.html' }
                    ]
                },
                '2': { completed: 4, total: 10, topics: [] },
                '3': { completed: 2, total: 10, topics: [] },
                '4': { completed: 1, total: 10, topics: [] },
                '5': { completed: 1, total: 10, topics: [] },
                '6': { completed: 0, total: 10, topics: [] }
            },
            recentActivities: [
                { date: '2025년 3월 27일', title: '낱말 알아보기', details: '기초 낱말 학습을 완료했습니다.', score: 90 },
                { date: '2025년 3월 26일', title: '문장 종류 맞추기', details: '문장 유형 구분하기 퀴즈를 풀었습니다.', score: 80 },
                { date: '2025년 3월 25일', title: '단어 퀴즈', details: '1학년 단어 테스트를 완료했습니다.', score: 85 }
            ]
        };
    }
}); 