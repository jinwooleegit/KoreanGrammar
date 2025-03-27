const fs = require('fs');
const path = require('path');

// 메인 함수
function fixRoadmapLinks() {
    console.log('로드맵 링크 수정 시작...');
    
    // index.html 파일 읽기
    const indexPath = path.join(__dirname, 'index.html');
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    let modified = false;
    
    // 잘못된 링크 목록
    const wrongLinks = [
        'pages/grade-learning/grade1_words.html',
        'pages/grade-learning/grade3_sentence_components.html'
    ];
    
    // 올바른 링크로 변경
    const correctLinks = [
        'pages/grade-learning/grade1/grade1_words.html',
        'pages/grade-learning/grade3/grade3_sentence_components.html'
    ];
    
    // 링크 수정
    for (let i = 0; i < wrongLinks.length; i++) {
        if (indexContent.includes(wrongLinks[i])) {
            console.log(`잘못된 링크 발견: ${wrongLinks[i]} -> ${correctLinks[i]}`);
            indexContent = indexContent.replace(
                new RegExp(wrongLinks[i], 'g'), 
                correctLinks[i]
            );
            modified = true;
        }
    }
    
    // 콘텐츠 카드의 잘못된 링크 찾기
    const cardWrongLink = 'pages/grade-learning/grade1_words.html';
    if (indexContent.includes(cardWrongLink)) {
        const cardCorrectLink = 'pages/grade-learning/grade1/grade1_words.html';
        console.log(`콘텐츠 카드 잘못된 링크 발견: ${cardWrongLink} -> ${cardCorrectLink}`);
        indexContent = indexContent.replace(
            new RegExp(cardWrongLink, 'g'), 
            cardCorrectLink
        );
        modified = true;
    }
    
    // 변경된 내용이 있으면 파일 저장
    if (modified) {
        fs.writeFileSync(indexPath, indexContent, 'utf8');
        console.log('index.html 파일이 업데이트되었습니다.');
    } else {
        console.log('수정할 링크가 없습니다.');
    }
    
    console.log('로드맵 링크 수정 완료!');
}

// 실행
fixRoadmapLinks(); 