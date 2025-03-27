const fs = require('fs');
const path = require('path');

// 메인 함수
async function fixIndexLinks() {
    console.log('홈페이지(index.html) 링크 검사 및 수정 시작...');
    
    // index.html 읽기
    const indexPath = path.join(__dirname, 'index.html');
    let indexContent = fs.readFileSync(indexPath, 'utf8');
    
    // 수정된 내용 여부 추적
    let modified = false;
    
    // 1. 파비콘 경로 수정 (루트 경로에 파비콘 추가)
    if (!fs.existsSync(path.join(__dirname, 'favicon.ico'))) {
        console.log('루트 디렉토리에 파비콘 복사...');
        try {
            const faviconSource = path.join(__dirname, 'assets', 'images', 'favicon.ico');
            const faviconDest = path.join(__dirname, 'favicon.ico');
            
            if (fs.existsSync(faviconSource)) {
                fs.copyFileSync(faviconSource, faviconDest);
                console.log('favicon.ico를 루트 디렉토리에 복사했습니다.');
                modified = true;
            } else {
                console.log('경고: assets/images/favicon.ico 파일을 찾을 수 없습니다.');
            }
        } catch (error) {
            console.error('파비콘 복사 중 오류:', error);
        }
    }

    // 2. 각 페이지 디렉토리에 대한 경로 검사 및 수정
    const linkChecks = [
        { path: 'pages/grade-learning/index.html', text: '학년별 학습' },
        { path: 'pages/topics/index.html', text: '학습 주제별' },
        { path: 'pages/activities/index.html', text: '학습 활동' },
        { path: 'pages/progress/index.html', text: '진행 상황' }
    ];
    
    // 각 링크 검사
    for (const link of linkChecks) {
        const filePath = path.join(__dirname, link.path);
        const fileExists = fs.existsSync(filePath);
        console.log(`${link.path}: ${fileExists ? '존재함' : '존재하지 않음'}`);
        
        // 파일이 존재하지 않으면 해당 디렉토리 확인
        if (!fileExists) {
            const dirPath = path.join(__dirname, path.dirname(link.path));
            const dirExists = fs.existsSync(dirPath);
            
            if (!dirExists) {
                console.log(`경고: ${path.dirname(link.path)} 디렉토리가 존재하지 않습니다.`);
            } else {
                console.log(`${path.dirname(link.path)} 디렉토리는 존재하지만 index.html이 없습니다.`);
            }
        }
    }
    
    // 3. 사이트맵 개선 - assets/images/sitemap_placeholder.html 대신 실제 사이트맵 페이지로 변경
    console.log('사이트맵 개선...');
    const sitemapPlaceholder = 'assets/images/sitemap_placeholder.html';
    if (indexContent.includes(sitemapPlaceholder)) {
        // 새 사이트맵 파일 경로
        const newSitemapPath = 'sitemap.html';
        
        // 기존 sitemap_placeholder.html 파일 읽기
        const oldSitemapPath = path.join(__dirname, sitemapPlaceholder);
        let sitemapContent = '';
        
        if (fs.existsSync(oldSitemapPath)) {
            sitemapContent = fs.readFileSync(oldSitemapPath, 'utf8');
            
            // 사이트맵 내용 개선 (제목, 스타일 등)
            sitemapContent = sitemapContent.replace('<title>사이트맵 이미지 생성</title>', '<title>문법놀이터 사이트맵</title>');
            
            // 개선된 스타일 추가
            const styleTagEnd = '</style>';
            const additionalStyles = `
        /* 추가 스타일 */
        .sitemap-title {
            text-align: center;
            margin: 20px 0;
            color: #333;
        }
        .back-to-home {
            display: inline-block;
            margin: 20px auto;
            padding: 10px 20px;
            background-color: #4A89DC;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            transition: background-color 0.3s;
        }
        .back-to-home:hover {
            background-color: #3A79CC;
        }
        .back-container {
            text-align: center;
        }
        @media (max-width: 768px) {
            .sitemap-container {
                width: 100%;
                height: auto;
                padding: 10px;
                overflow-x: auto;
            }
        }
        ${styleTagEnd}`;
            
            sitemapContent = sitemapContent.replace(styleTagEnd, additionalStyles);
            
            // 타이틀과 홈으로 돌아가기 링크 추가
            const bodyStart = '<body>';
            const headerHtml = `${bodyStart}
    <h1 class="sitemap-title">문법놀이터 사이트맵</h1>
    <div class="back-container">
        <a href="index.html" class="back-to-home">홈으로 돌아가기</a>
    </div>`;
            
            sitemapContent = sitemapContent.replace(bodyStart, headerHtml);
            
            // body 종료 태그 전에 홈으로 돌아가기 링크 추가
            const bodyEnd = '</body>';
            const footerHtml = `    <div class="back-container">
        <a href="index.html" class="back-to-home">홈으로 돌아가기</a>
    </div>
${bodyEnd}`;
            
            sitemapContent = sitemapContent.replace(bodyEnd, footerHtml);
            
            // 새로운 사이트맵 저장
            fs.writeFileSync(path.join(__dirname, newSitemapPath), sitemapContent, 'utf8');
            console.log(`개선된 사이트맵을 ${newSitemapPath}에 저장했습니다.`);
            
            // index.html에서 사이트맵 링크 업데이트
            indexContent = indexContent.replace(
                new RegExp(sitemapPlaceholder, 'g'), 
                newSitemapPath
            );
            console.log('index.html에서 사이트맵 링크를 업데이트했습니다.');
            modified = true;
        } else {
            console.log(`경고: ${sitemapPlaceholder} 파일을 찾을 수 없습니다.`);
        }
    }
    
    // 4. 경로 문제가 있는 학년별 페이지 링크 수정
    // CSS 및 JS 파일 경로를 상대경로에서 절대경로로 수정하는 부분 검사
    
    // 변경된 내용이 있으면 index.html 저장
    if (modified) {
        fs.writeFileSync(indexPath, indexContent, 'utf8');
        console.log('index.html 파일이 업데이트되었습니다.');
    } else {
        console.log('index.html 파일에 변경사항이 없습니다.');
    }
    
    // 5. 내부 페이지 경로 검사
    console.log('\n내부 페이지 경로 검사 중...');
    checkAndFixSubpageLinks();
    
    console.log('\n홈페이지 링크 검사 및 수정 완료!');
}

// 서브페이지 경로 검사 및 수정
function checkAndFixSubpageLinks() {
    const gradePages = [
        'pages/grade-learning/grade1/index.html',
        'pages/grade-learning/grade2/index.html',
        'pages/grade-learning/grade3/index.html',
        'pages/grade-learning/grade4/index.html',
        'pages/grade-learning/grade5/index.html',
        'pages/grade-learning/grade6/index.html'
    ];
    
    for (const pagePath of gradePages) {
        const fullPath = path.join(__dirname, pagePath);
        if (fs.existsSync(fullPath)) {
            console.log(`${pagePath} 파일 검사 중...`);
            
            // 파일 내용 읽기 및 수정 로직 추가
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;
            
            // CSS 경로 수정 (잘못된 상대 경로를 절대 경로로)
            const cssWrongPath = '../assets/css/styles.css';
            const cssCorrectPath = '/assets/css/styles.css';
            if (content.includes(cssWrongPath)) {
                content = content.replace(new RegExp(cssWrongPath, 'g'), cssCorrectPath);
                modified = true;
                console.log(`  - CSS 경로 수정: ${cssWrongPath} → ${cssCorrectPath}`);
            }
            
            // JS 경로 수정
            const jsWrongPath = '../js/siteManager.js';
            const jsCorrectPath = '/js/siteManager.js';
            if (content.includes(jsWrongPath)) {
                content = content.replace(new RegExp(jsWrongPath, 'g'), jsCorrectPath);
                modified = true;
                console.log(`  - JS 경로 수정: ${jsWrongPath} → ${jsCorrectPath}`);
            }
            
            // 변경사항이 있으면 저장
            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`  ${pagePath} 파일이 업데이트되었습니다.`);
            } else {
                console.log(`  ${pagePath} 파일에 변경사항이 없습니다.`);
            }
        } else {
            console.log(`${pagePath} 파일이 존재하지 않습니다.`);
        }
    }
}

// 실행
fixIndexLinks().catch(error => {
    console.error('오류 발생:', error);
}); 