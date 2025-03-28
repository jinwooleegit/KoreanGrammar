// 문법놀이터 - 학습 활동 핸들러
// 모든 학습 활동 버튼 클릭 이벤트 및 게임 기능을 관리하는 파일

// 모달 생성 함수
function createModal(title, content, gradeColor = '#4B7BEC') {
    // 기존 모달 제거
    const existingModal = document.querySelector('.activity-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 모달 생성
    const modal = document.createElement('div');
    modal.className = 'activity-modal';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '1000';
    
    // 모달 내용
    const modalContent = document.createElement('div');
    modalContent.style.backgroundColor = 'white';
    modalContent.style.borderRadius = '12px';
    modalContent.style.padding = '30px';
    modalContent.style.maxWidth = '800px';
    modalContent.style.width = '90%';
    modalContent.style.maxHeight = '80vh';
    modalContent.style.overflowY = 'auto';
    modalContent.style.position = 'relative';
    
    // 닫기 버튼
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '&times;';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '15px';
    closeButton.style.border = 'none';
    closeButton.style.background = 'none';
    closeButton.style.fontSize = '24px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.color = gradeColor;
    closeButton.onclick = function() {
        modal.remove();
    };
    
    // 제목
    const titleEl = document.createElement('h2');
    titleEl.textContent = title;
    titleEl.style.color = gradeColor;
    titleEl.style.marginBottom = '20px';
    titleEl.style.borderBottom = `2px solid ${gradeColor}`;
    titleEl.style.paddingBottom = '10px';
    
    // 내용 컨테이너
    const contentContainer = document.createElement('div');
    contentContainer.className = 'activity-content';
    
    if (typeof content === 'string') {
        contentContainer.innerHTML = content;
    } else if (content instanceof HTMLElement) {
        contentContainer.appendChild(content);
    }
    
    // 모달에 요소 추가
    modalContent.appendChild(closeButton);
    modalContent.appendChild(titleEl);
    modalContent.appendChild(contentContainer);
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    return { modal, contentContainer };
}

// 각 활동 유형별 처리기
const activityHandlers = {
    // 문장 성분 찾기 게임
    'sentence-component-game': function() {
        const sentences = [
            {
                text: "아름다운 꽃이 활짝 피었습니다.",
                components: {
                    subject: "꽃이",
                    predicate: "피었습니다",
                    adverb: "활짝",
                    modifier: "아름다운"
                }
            },
            {
                text: "동생이 학교에서 친구와 재미있게 놀았습니다.",
                components: {
                    subject: "동생이",
                    predicate: "놀았습니다",
                    adverb: ["학교에서", "재미있게"],
                    modifier: "친구와"
                }
            },
            {
                text: "우리 반 학생들은 체육관에서 농구를 열심히 합니다.",
                components: {
                    subject: "학생들은",
                    predicate: "합니다",
                    object: "농구를",
                    adverb: ["체육관에서", "열심히"],
                    modifier: "우리 반"
                }
            }
        ];
        
        // 랜덤 문장 선택
        const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
        
        // 게임 컨텐츠 생성
        const gameContent = document.createElement('div');
        
        // 설명 추가
        const instructionEl = document.createElement('p');
        instructionEl.innerHTML = "다음 문장에서 각 성분을 찾아 드래그하여 올바른 위치에 놓아보세요.";
        gameContent.appendChild(instructionEl);
        
        // 문장 표시
        const sentenceEl = document.createElement('div');
        sentenceEl.className = 'game-sentence';
        sentenceEl.textContent = randomSentence.text;
        sentenceEl.style.fontSize = '18px';
        sentenceEl.style.marginBottom = '20px';
        sentenceEl.style.padding = '15px';
        sentenceEl.style.backgroundColor = '#f5f5f5';
        sentenceEl.style.borderRadius = '8px';
        gameContent.appendChild(sentenceEl);
        
        // 성분 드롭 영역
        const dropZonesEl = document.createElement('div');
        dropZonesEl.className = 'component-drop-zones';
        dropZonesEl.style.display = 'grid';
        dropZonesEl.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
        dropZonesEl.style.gap = '15px';
        dropZonesEl.style.marginBottom = '30px';
        
        const componentTypes = {
            'subject': '주어',
            'predicate': '서술어',
            'object': '목적어',
            'adverb': '부사어',
            'modifier': '수식어'
        };
        
        // 성분별 드롭 영역 생성
        Object.keys(componentTypes).forEach(type => {
            if (randomSentence.components[type]) {
                const dropZone = document.createElement('div');
                dropZone.className = `drop-zone ${type}-zone`;
                dropZone.dataset.type = type;
                dropZone.innerHTML = `<h3>${componentTypes[type]}</h3>`;
                dropZone.style.padding = '15px';
                dropZone.style.backgroundColor = '#e9f7fe';
                dropZone.style.borderRadius = '8px';
                dropZone.style.minHeight = '100px';
                dropZone.style.border = '2px dashed #4B7BEC';
                
                dropZonesEl.appendChild(dropZone);
            }
        });
        
        gameContent.appendChild(dropZonesEl);
        
        // 모달 표시
        const { modal, contentContainer } = createModal("문장 성분 찾기 게임", gameContent);
        
        // 이 시점에서 실제 드래그 앤 드롭 로직을 추가할 수 있음
        // 간단한 설명으로 대체
        const placeholderEl = document.createElement('div');
        placeholderEl.style.padding = '20px';
        placeholderEl.style.backgroundColor = '#fffde7';
        placeholderEl.style.borderRadius = '8px';
        placeholderEl.style.marginTop = '20px';
        placeholderEl.innerHTML = `
            <p>이 활동에서는 주어진 문장에서 각 성분(주어, 서술어, 목적어 등)을 찾아 드래그하여 해당 카테고리에 배치하게 됩니다.</p>
            <p>예를 들어 위 문장에서:</p>
            <ul style="margin-left: 20px; line-height: 1.6;">
                ${Object.keys(randomSentence.components).map(type => {
                    const component = randomSentence.components[type];
                    if (Array.isArray(component)) {
                        return `<li><strong>${componentTypes[type]}:</strong> ${component.join(', ')}</li>`;
                    } else {
                        return `<li><strong>${componentTypes[type]}:</strong> ${component}</li>`;
                    }
                }).join('')}
            </ul>
            <p style="margin-top: 15px; font-style: italic; color: #666;">실제 게임에서는 드래그 앤 드롭으로 이 활동을 수행할 수 있습니다.</p>
        `;
        
        contentContainer.appendChild(placeholderEl);
    },
    
    // 시제 바꾸기 활동
    'tense-conversion': function() {
        const sentences = [
            {
                present: "나는 학교에 갑니다.",
                past: "나는 학교에 갔습니다.",
                future: "나는 학교에 갈 것입니다."
            },
            {
                present: "동생이 책을 읽습니다.",
                past: "동생이 책을 읽었습니다.",
                future: "동생이 책을 읽을 것입니다."
            },
            {
                present: "친구들이 운동장에서 놉니다.",
                past: "친구들이 운동장에서 놀았습니다.",
                future: "친구들이 운동장에서 놀 것입니다."
            }
        ];
        
        // 랜덤 문장 선택
        const randomSentence = sentences[Math.floor(Math.random() * sentences.length)];
        
        // 활동 컨텐츠 생성
        const activityContent = document.createElement('div');
        
        // 설명 추가
        const instructionEl = document.createElement('p');
        instructionEl.innerHTML = "다음 문장의 시제를 바꿔보세요. 입력란에 올바른 시제의 문장을 작성해보세요.";
        activityContent.appendChild(instructionEl);
        
        // 시제별 입력 영역 생성
        const tenseTypes = {
            'present': '현재 시제',
            'past': '과거 시제',
            'future': '미래 시제'
        };
        
        // 랜덤 시제 선택 (원본)
        const tenseKeys = Object.keys(tenseTypes);
        const originalTense = tenseKeys[Math.floor(Math.random() * tenseKeys.length)];
        
        // 원본 문장 표시
        const originalSentenceEl = document.createElement('div');
        originalSentenceEl.className = 'original-sentence';
        originalSentenceEl.innerHTML = `<strong>${tenseTypes[originalTense]}:</strong> ${randomSentence[originalTense]}`;
        originalSentenceEl.style.fontSize = '18px';
        originalSentenceEl.style.marginBottom = '20px';
        originalSentenceEl.style.padding = '15px';
        originalSentenceEl.style.backgroundColor = '#f5f5f5';
        originalSentenceEl.style.borderRadius = '8px';
        activityContent.appendChild(originalSentenceEl);
        
        // 변환 영역
        const conversionEl = document.createElement('div');
        conversionEl.className = 'tense-conversion-area';
        conversionEl.style.display = 'grid';
        conversionEl.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
        conversionEl.style.gap = '15px';
        conversionEl.style.marginBottom = '30px';
        
        // 다른 시제들에 대한 입력 영역 생성
        tenseKeys.filter(tense => tense !== originalTense).forEach(tense => {
            const conversionBox = document.createElement('div');
            conversionBox.className = `conversion-box ${tense}-box`;
            conversionBox.style.padding = '15px';
            conversionBox.style.backgroundColor = '#e9f7fe';
            conversionBox.style.borderRadius = '8px';
            
            const tenseLabel = document.createElement('h3');
            tenseLabel.textContent = tenseTypes[tense];
            conversionBox.appendChild(tenseLabel);
            
            const inputArea = document.createElement('textarea');
            inputArea.placeholder = `${randomSentence[originalTense]}를 ${tenseTypes[tense]}로 바꿔보세요...`;
            inputArea.style.width = '100%';
            inputArea.style.padding = '10px';
            inputArea.style.borderRadius = '5px';
            inputArea.style.border = '1px solid #ddd';
            inputArea.style.marginBottom = '10px';
            inputArea.style.minHeight = '60px';
            inputArea.dataset.correctAnswer = randomSentence[tense];
            conversionBox.appendChild(inputArea);
            
            const checkButton = document.createElement('button');
            checkButton.textContent = "정답 확인";
            checkButton.style.backgroundColor = '#4B7BEC';
            checkButton.style.color = 'white';
            checkButton.style.border = 'none';
            checkButton.style.borderRadius = '5px';
            checkButton.style.padding = '8px 15px';
            checkButton.style.cursor = 'pointer';
            checkButton.onclick = function() {
                const userAnswer = inputArea.value.trim();
                const correctAnswer = inputArea.dataset.correctAnswer;
                
                const resultEl = document.createElement('div');
                resultEl.style.marginTop = '10px';
                resultEl.style.padding = '10px';
                resultEl.style.borderRadius = '5px';
                
                if (userAnswer === correctAnswer) {
                    resultEl.textContent = "정답입니다! 👏";
                    resultEl.style.backgroundColor = '#e8f5e9';
                    resultEl.style.color = '#388e3c';
                } else {
                    resultEl.innerHTML = `오답입니다. 정답은: <strong>${correctAnswer}</strong>`;
                    resultEl.style.backgroundColor = '#ffebee';
                    resultEl.style.color = '#d32f2f';
                }
                
                // 이미 결과가 있으면 교체, 없으면 추가
                const existingResult = conversionBox.querySelector('.result');
                if (existingResult) {
                    conversionBox.replaceChild(resultEl, existingResult);
                } else {
                    conversionBox.appendChild(resultEl);
                }
                resultEl.className = 'result';
            };
            conversionBox.appendChild(checkButton);
            
            conversionEl.appendChild(conversionBox);
        });
        
        activityContent.appendChild(conversionEl);
        
        // 모달 표시
        createModal("시제 바꾸기 활동", activityContent);
    },
    
    // 낱말 카드 매칭 게임
    'word-matching-game': function() {
        const wordPairs = [
            { word: "학교", match: "공부하는 곳" },
            { word: "의자", match: "앉는 가구" },
            { word: "연필", match: "글씨 쓰는 도구" },
            { word: "책상", match: "물건을 올려놓는 가구" },
            { word: "가방", match: "물건을 넣어 들고 다니는 것" },
            { word: "창문", match: "밖을 볼 수 있는 공간" }
        ];
        
        // 섞인 단어와 매칭 배열 준비
        const shuffledWords = [...wordPairs].sort(() => Math.random() - 0.5);
        const shuffledMatches = [...wordPairs].sort(() => Math.random() - 0.5);
        
        // 게임 컨텐츠 생성
        const gameContent = document.createElement('div');
        
        // 설명 추가
        const instructionEl = document.createElement('p');
        instructionEl.innerHTML = "왼쪽 단어와 오른쪽 의미를 올바르게 연결해보세요.";
        gameContent.appendChild(instructionEl);
        
        // 매칭 영역 생성
        const matchingAreaEl = document.createElement('div');
        matchingAreaEl.style.display = 'flex';
        matchingAreaEl.style.justifyContent = 'space-between';
        matchingAreaEl.style.gap = '30px';
        matchingAreaEl.style.marginTop = '20px';
        
        // 단어 영역
        const wordsEl = document.createElement('div');
        wordsEl.className = 'words-column';
        wordsEl.style.flex = '1';
        
        // 매칭 영역
        const matchesEl = document.createElement('div');
        matchesEl.className = 'matches-column';
        matchesEl.style.flex = '1';
        
        // 각 단어/매칭 아이템 생성
        shuffledWords.forEach((item, index) => {
            const wordItem = document.createElement('div');
            wordItem.className = 'word-item';
            wordItem.dataset.word = item.word;
            wordItem.textContent = item.word;
            wordItem.style.padding = '12px';
            wordItem.style.margin = '8px 0';
            wordItem.style.backgroundColor = '#e3f2fd';
            wordItem.style.borderRadius = '5px';
            wordItem.style.cursor = 'pointer';
            wordItem.style.transition = 'all 0.2s';
            
            wordItem.addEventListener('click', function() {
                // 이미 선택된 단어가 있으면 선택 해제
                const selectedWord = wordsEl.querySelector('.selected');
                if (selectedWord) {
                    selectedWord.classList.remove('selected');
                    selectedWord.style.backgroundColor = '#e3f2fd';
                }
                
                // 현재 단어 선택
                this.classList.add('selected');
                this.style.backgroundColor = '#bbdefb';
                
                // 이미 선택된 매칭이 있으면 매칭 시도
                const selectedMatch = matchesEl.querySelector('.selected');
                if (selectedMatch) {
                    checkMatch(this, selectedMatch);
                }
            });
            
            wordsEl.appendChild(wordItem);
        });
        
        shuffledMatches.forEach(item => {
            const matchItem = document.createElement('div');
            matchItem.className = 'match-item';
            matchItem.dataset.match = item.match;
            matchItem.dataset.word = item.word; // 어떤 단어와 매칭되는지 저장
            matchItem.textContent = item.match;
            matchItem.style.padding = '12px';
            matchItem.style.margin = '8px 0';
            matchItem.style.backgroundColor = '#fff8e1';
            matchItem.style.borderRadius = '5px';
            matchItem.style.cursor = 'pointer';
            matchItem.style.transition = 'all 0.2s';
            
            matchItem.addEventListener('click', function() {
                // 이미 선택된 매칭이 있으면 선택 해제
                const selectedMatch = matchesEl.querySelector('.selected');
                if (selectedMatch) {
                    selectedMatch.classList.remove('selected');
                    selectedMatch.style.backgroundColor = '#fff8e1';
                }
                
                // 현재 매칭 선택
                this.classList.add('selected');
                this.style.backgroundColor = '#ffecb3';
                
                // 이미 선택된 단어가 있으면 매칭 시도
                const selectedWord = wordsEl.querySelector('.selected');
                if (selectedWord) {
                    checkMatch(selectedWord, this);
                }
            });
            
            matchesEl.appendChild(matchItem);
        });
        
        matchingAreaEl.appendChild(wordsEl);
        matchingAreaEl.appendChild(matchesEl);
        gameContent.appendChild(matchingAreaEl);
        
        // 결과 영역
        const resultEl = document.createElement('div');
        resultEl.className = 'matching-result';
        resultEl.style.marginTop = '20px';
        resultEl.style.padding = '10px';
        resultEl.style.borderRadius = '5px';
        resultEl.style.display = 'none';
        gameContent.appendChild(resultEl);
        
        // 모달 표시
        const { modal } = createModal("낱말 카드 매칭 게임", gameContent);
        
        // 매칭 확인 함수
        function checkMatch(wordEl, matchEl) {
            const word = wordEl.dataset.word;
            const match = matchEl.dataset.word; // 이 매칭이 어떤 단어에 속하는지
            
            if (word === match) {
                // 정답
                wordEl.style.backgroundColor = '#c8e6c9';
                matchEl.style.backgroundColor = '#c8e6c9';
                wordEl.style.cursor = 'default';
                matchEl.style.cursor = 'default';
                
                // 선택 클래스 제거 및 이벤트 리스너 제거
                wordEl.classList.remove('selected');
                matchEl.classList.remove('selected');
                
                // 클릭 비활성화
                wordEl.style.pointerEvents = 'none';
                matchEl.style.pointerEvents = 'none';
                
                // 모든 매칭이 완료되었는지 확인
                const remainingWords = wordsEl.querySelectorAll('.word-item:not([style*="pointer-events: none"])');
                if (remainingWords.length === 0) {
                    resultEl.textContent = "축하합니다! 모든 낱말을 올바르게 매칭했습니다! 👏";
                    resultEl.style.backgroundColor = '#e8f5e9';
                    resultEl.style.color = '#388e3c';
                    resultEl.style.display = 'block';
                }
            } else {
                // 오답
                setTimeout(() => {
                    wordEl.classList.remove('selected');
                    matchEl.classList.remove('selected');
                    wordEl.style.backgroundColor = '#e3f2fd';
                    matchEl.style.backgroundColor = '#fff8e1';
                    
                    resultEl.textContent = "다시 시도해보세요!";
                    resultEl.style.backgroundColor = '#ffebee';
                    resultEl.style.color = '#d32f2f';
                    resultEl.style.display = 'block';
                    
                    // 잠시 후 결과 메시지 숨기기
                    setTimeout(() => {
                        resultEl.style.display = 'none';
                    }, 1500);
                }, 500);
            }
        }
    },
    
    // 품사 분류 게임
    'parts-of-speech-game': function() {
        const wordsList = [
            { word: "학교", type: "명사", meaning: "교육을 받는 곳" },
            { word: "가다", type: "동사", meaning: "한 곳에서 다른 곳으로 움직이다" },
            { word: "예쁜", type: "형용사", meaning: "보기에 좋은" },
            { word: "책", type: "명사", meaning: "여러 장의 종이를 묶어 글이나 그림을 인쇄한 것" },
            { word: "빨리", type: "부사", meaning: "속도가 빠르게" },
            { word: "읽다", type: "동사", meaning: "글을 보고 내용을 이해하다" },
            { word: "그리고", type: "접속사", meaning: "앞의 말에 뒤의 말을 이어 주는 말" },
            { word: "작은", type: "형용사", meaning: "크기가 보통보다 적은" },
            { word: "아이", type: "명사", meaning: "어린 사람" },
            { word: "웃다", type: "동사", meaning: "기쁨이나 즐거움을 표현하다" },
            { word: "아주", type: "부사", meaning: "정도가 매우" },
            { word: "슬픈", type: "형용사", meaning: "마음이 아프고 괴로운" },
            { word: "하지만", type: "접속사", meaning: "앞의 내용과 뒤의 내용이 상반됨을 나타내는 말" },
            { word: "친구", type: "명사", meaning: "가깝게 사귀는 사람" },
            { word: "천천히", type: "부사", meaning: "느린 속도로" }
        ];
        
        // 랜덤으로 10개 단어 선택
        const randomWords = [...wordsList].sort(() => 0.5 - Math.random()).slice(0, 10);
        
        // 활동 컨텐츠 생성
        const activityContent = document.createElement('div');
        
        // 설명 추가
        const instructionEl = document.createElement('p');
        instructionEl.innerHTML = "다음 낱말들을 올바른 품사로 분류해보세요. 각 낱말을 드래그하여 해당 품사 영역에 놓으면 됩니다.";
        activityContent.appendChild(instructionEl);
        
        // 단어 영역 생성
        const wordsEl = document.createElement('div');
        wordsEl.className = 'words-container';
        wordsEl.style.display = 'flex';
        wordsEl.style.flexWrap = 'wrap';
        wordsEl.style.gap = '10px';
        wordsEl.style.marginBottom = '20px';
        wordsEl.style.padding = '15px';
        wordsEl.style.backgroundColor = '#f5f5f5';
        wordsEl.style.borderRadius = '8px';
        
        randomWords.forEach(word => {
            const wordEl = document.createElement('div');
            wordEl.className = 'word-item';
            wordEl.textContent = word.word;
            wordEl.dataset.word = word.word;
            wordEl.dataset.type = word.type;
            wordEl.dataset.meaning = word.meaning;
            wordEl.style.padding = '8px 15px';
            wordEl.style.backgroundColor = '#e3f2fd';
            wordEl.style.borderRadius = '20px';
            wordEl.style.cursor = 'move';
            wordEl.style.display = 'inline-block';
            wordEl.style.userSelect = 'none';
            wordEl.draggable = true;
            
            wordEl.addEventListener('dragstart', function(e) {
                e.dataTransfer.setData('text/plain', word.word);
                this.style.opacity = '0.5';
            });
            
            wordEl.addEventListener('dragend', function() {
                this.style.opacity = '1';
            });
            
            wordsEl.appendChild(wordEl);
        });
        
        activityContent.appendChild(wordsEl);
        
        // 결과 표시 영역
        const resultEl = document.createElement('div');
        resultEl.className = 'result-area';
        resultEl.style.marginTop = '20px';
        resultEl.style.display = 'none';
        resultEl.style.padding = '15px';
        resultEl.style.borderRadius = '8px';
        activityContent.appendChild(resultEl);
        
        // 품사 드롭 영역
        const dropAreasEl = document.createElement('div');
        dropAreasEl.className = 'pos-drop-areas';
        dropAreasEl.style.display = 'grid';
        dropAreasEl.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
        dropAreasEl.style.gap = '15px';
        
        const posTypes = {
            '명사': { color: '#C8E6C9', description: '사람, 장소, 사물, 개념 등의 이름을 나타내는 말' },
            '동사': { color: '#BBDEFB', description: '움직임이나 행동을 표현하는 말' },
            '형용사': { color: '#FFECB3', description: '사물의 성질이나 상태를 나타내는 말' },
            '부사': { color: '#E1BEE7', description: '주로 동사, 형용사, 다른 부사를 꾸며주는 말' },
            '접속사': { color: '#FFCCBC', description: '단어, 구, 절, 문장 등을 연결하는 말' }
        };
        
        // 품사별 드롭 영역 생성
        Object.keys(posTypes).forEach(type => {
            const dropAreaEl = document.createElement('div');
            dropAreaEl.className = `drop-area ${type}-area`;
            dropAreaEl.dataset.type = type;
            dropAreaEl.innerHTML = `<h3>${type}</h3><p class="type-desc">${posTypes[type].description}</p><div class="dropped-words"></div>`;
            dropAreaEl.style.padding = '15px';
            dropAreaEl.style.backgroundColor = posTypes[type].color + '40'; // 40% 투명도
            dropAreaEl.style.borderRadius = '8px';
            dropAreaEl.style.border = `2px dashed ${posTypes[type].color}`;
            dropAreaEl.style.minHeight = '150px';
            
            // 드롭 영역 스타일
            const typeTitle = dropAreaEl.querySelector('h3');
            typeTitle.style.margin = '0 0 5px 0';
            typeTitle.style.color = '#333';
            
            const typeDesc = dropAreaEl.querySelector('.type-desc');
            typeDesc.style.fontSize = '13px';
            typeDesc.style.color = '#666';
            typeDesc.style.marginBottom = '10px';
            
            const droppedWordsEl = dropAreaEl.querySelector('.dropped-words');
            droppedWordsEl.style.minHeight = '100px';
            
            // 드래그 앤 드롭 이벤트
            dropAreaEl.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.style.backgroundColor = posTypes[type].color + '70'; // 70% 투명도
            });
            
            dropAreaEl.addEventListener('dragleave', function() {
                this.style.backgroundColor = posTypes[type].color + '40'; // 40% 투명도
            });
            
            dropAreaEl.addEventListener('drop', function(e) {
                e.preventDefault();
                this.style.backgroundColor = posTypes[type].color + '40'; // 40% 투명도
                
                const word = e.dataTransfer.getData('text/plain');
                const wordEl = document.querySelector(`.word-item[data-word="${word}"]`);
                
                if (wordEl) {
                    // 이미 다른 영역에 있는 경우 제거
                    const alreadyDropped = document.querySelector(`.dropped-word[data-word="${word}"]`);
                    if (alreadyDropped) {
                        alreadyDropped.remove();
                    }
                    
                    // 새 영역에 추가
                    const droppedWordEl = document.createElement('div');
                    droppedWordEl.className = 'dropped-word';
                    droppedWordEl.dataset.word = word;
                    droppedWordEl.dataset.type = wordEl.dataset.type;
                    droppedWordEl.textContent = word;
                    droppedWordEl.style.display = 'inline-block';
                    droppedWordEl.style.padding = '6px 12px';
                    droppedWordEl.style.margin = '5px';
                    droppedWordEl.style.backgroundColor = posTypes[type].color;
                    droppedWordEl.style.borderRadius = '15px';
                    droppedWordEl.style.cursor = 'pointer';
                    
                    // 드롭된 단어 클릭 시 다시 원래 위치로
                    droppedWordEl.addEventListener('click', function() {
                        this.remove();
                        wordEl.style.display = 'inline-block';
                    });
                    
                    droppedWordsEl.appendChild(droppedWordEl);
                    wordEl.style.display = 'none';
                    
                    // 모든 단어가 배치되었는지 확인
                    checkAllWordsPlaced();
                }
            });
            
            dropAreasEl.appendChild(dropAreaEl);
        });
        
        activityContent.appendChild(dropAreasEl);
        
        // 정답 확인 버튼
        const checkButton = document.createElement('button');
        checkButton.textContent = '정답 확인하기';
        checkButton.style.marginTop = '20px';
        checkButton.style.padding = '10px 20px';
        checkButton.style.backgroundColor = '#4285F4';
        checkButton.style.color = 'white';
        checkButton.style.border = 'none';
        checkButton.style.borderRadius = '5px';
        checkButton.style.cursor = 'pointer';
        checkButton.style.display = 'block';
        checkButton.style.margin = '20px auto';
        
        checkButton.addEventListener('click', function() {
            const droppedWords = document.querySelectorAll('.dropped-word');
            let correctCount = 0;
            
            droppedWords.forEach(word => {
                const wordText = word.dataset.word;
                const correctType = word.dataset.type;
                const droppedArea = word.closest('.drop-area');
                const droppedType = droppedArea.dataset.type;
                
                if (correctType === droppedType) {
                    word.style.backgroundColor = '#81C784'; // 초록색으로 변경
                    word.style.color = 'white';
                    correctCount++;
                } else {
                    word.style.backgroundColor = '#E57373'; // 빨간색으로 변경
                    word.style.color = 'white';
                    
                    // 툴팁으로 정답 표시
                    const tooltip = document.createElement('span');
                    tooltip.textContent = `정답: ${correctType}`;
                    tooltip.style.position = 'absolute';
                    tooltip.style.backgroundColor = '#333';
                    tooltip.style.color = 'white';
                    tooltip.style.padding = '5px';
                    tooltip.style.borderRadius = '3px';
                    tooltip.style.fontSize = '12px';
                    tooltip.style.zIndex = '100';
                    tooltip.style.marginTop = '-25px';
                    tooltip.style.marginLeft = '10px';
                    tooltip.className = 'tooltip';
                    
                    word.appendChild(tooltip);
                    word.style.position = 'relative';
                }
            });
            
            // 결과 표시
            resultEl.style.display = 'block';
            if (correctCount === droppedWords.length && droppedWords.length === randomWords.length) {
                resultEl.textContent = `축하합니다! ${correctCount}개 모두 정확하게 맞추셨습니다!`;
                resultEl.style.backgroundColor = '#E8F5E9';
                resultEl.style.color = '#388E3C';
            } else {
                resultEl.textContent = `${droppedWords.length}개 중 ${correctCount}개 맞았습니다. 틀린 답은 빨간색으로 표시됩니다.`;
                resultEl.style.backgroundColor = '#FFEBEE';
                resultEl.style.color = '#D32F2F';
            }
        });
        
        activityContent.appendChild(checkButton);
        
        // 모달 표시
        createModal("품사 분류 게임", activityContent, '#4CAF50');
        
        // 모든 단어가 배치되었는지 확인하는 함수
        function checkAllWordsPlaced() {
            const visibleWords = document.querySelectorAll('.word-item[style*="display: inline-block"]');
            if (visibleWords.length === 0) {
                checkButton.disabled = false;
                checkButton.style.opacity = '1';
            } else {
                checkButton.disabled = true;
                checkButton.style.opacity = '0.5';
            }
        }
        
        // 초기 버튼 상태 설정
        checkButton.disabled = true;
        checkButton.style.opacity = '0.5';
    }
};

// 활동 핸들러 초기화
function initActivityHandlers() {
    document.addEventListener('DOMContentLoaded', function() {
        // 모든 학습 활동 버튼에 이벤트 리스너 추가
        const activityButtons = document.querySelectorAll('.activity-button');
        activityButtons.forEach(button => {
            button.addEventListener('click', function() {
                // 버튼의 data-activity 속성에서 활동 유형 가져오기
                const activityType = this.dataset.activity;
                
                // 활동 유형에 따라 적절한 핸들러 호출
                if (activityType && activityHandlers[activityType]) {
                    activityHandlers[activityType]();
                } else {
                    // 기본 구현: 활동 유형을 판단하여 적절한 활동 제공
                    const activityText = this.parentElement.querySelector('h3')?.textContent || '학습 활동';
                    
                    if (activityText.includes('문장 성분') || activityText.includes('찾기 게임')) {
                        activityHandlers['sentence-component-game']();
                    } else if (activityText.includes('시제') || activityText.includes('바꾸기')) {
                        activityHandlers['tense-conversion']();
                    } else if (activityText.includes('카드') || activityText.includes('매칭')) {
                        activityHandlers['word-matching-game']();
                    } else if (activityText.includes('품사')) {
                        activityHandlers['parts-of-speech-game']();
                    } else {
                        // 활동 유형을 알 수 없는 경우 기본 모달
                        createModal("학습 활동", `<p>${activityText} 활동을 시작합니다.</p><p>이 활동은 학습자의 문법 실력 향상에 도움이 되는 상호작용형 콘텐츠입니다.</p>`);
                    }
                }
            });
        });
    });
}

// 페이지 로드 시 핸들러 초기화
initActivityHandlers(); 