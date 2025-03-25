/**
 * 모든 HTML 파일에서 헤더와 푸터를 제거하고 공통 JavaScript 파일을 추가하는 스크립트
 * 실행 방법: node update_pages.js
 */

const fs = require('fs');
const path = require('path');

// 디렉토리 내의 모든 HTML 파일을 재귀적으로 찾는 함수
function findHtmlFiles(directory, fileList = []) {
    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && file !== 'node_modules' && file !== '.git') {
            findHtmlFiles(filePath, fileList);
        } else if (path.extname(file) === '.html') {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

// HTML 파일의 상대 경로를 계산하는 함수
function calculateRelativePath(filePath) {
    // 절대 경로에서 프로젝트 루트까지의 상대 경로 계산
    const normalizedPath = filePath.replace(/\\/g, '/');
    let relativePath = '';
    
    // 주의: 중첩된 디렉토리 구조에 대해 정확한 상대 경로 계산
    if (normalizedPath.includes('/pages/topics/') || 
        normalizedPath.includes('/pages/activities/') || 
        normalizedPath.includes('/pages/grade-learning/')) {
        relativePath = '../../'; // 두 단계 위로 (루트로)
    } else if (normalizedPath.includes('/pages/')) {
        relativePath = '../'; // 한 단계 위로
    } else {
        relativePath = ''; // 루트 경로인 경우
    }
    
    console.log(`  - 파일 경로: ${normalizedPath}`);
    console.log(`  - 계산된 상대 경로: ${relativePath}`);
    return relativePath;
}

// HTML 파일에서 헤더와 푸터를 제거하고 공통 JavaScript 파일을 추가하는 함수
function updateHtmlFile(filePath) {
    console.log(`처리 중: ${filePath}`);
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let updated = false;
        
        // 헤더와 푸터 코드 패턴
        const headerPattern = /<header[\s\S]*?<\/header>/i;
        const footerPattern = /<footer[\s\S]*?<\/footer>/i;
        
        // 헤더와 푸터 제거
        if (headerPattern.test(content)) {
            content = content.replace(headerPattern, '');
            updated = true;
            console.log(`  - 헤더 제거됨`);
        }
        
        if (footerPattern.test(content)) {
            content = content.replace(footerPattern, '');
            updated = true;
            console.log(`  - 푸터 제거됨`);
        }
        
        // 상대 경로 계산 - 함수 호출
        const relativePath = calculateRelativePath(filePath);
        
        // 기존 common.js 스크립트 태그 제거
        const scriptRegex = /<script[^>]*src=["']([^"']*)common\.js["'][^>]*><\/script>/i;
        if (scriptRegex.test(content)) {
            content = content.replace(scriptRegex, '');
            updated = true;
            console.log(`  - 기존 common.js 스크립트 제거됨`);
        }
        
        // 공통 JavaScript 파일 추가 - 계산된 상대 경로 사용
        if (!content.includes('common.js')) {
            const scriptTag = `<script src="${relativePath}js/common.js"></script>`;
            
            // body 태그 바로 앞에 스크립트 추가
            if (content.includes('</body>')) {
                content = content.replace('</body>', `    ${scriptTag}\n</body>`);
                updated = true;
                console.log(`  - common.js 추가됨 (${relativePath}js/common.js)`);
            } else {
                console.warn(`  - body 태그를 찾을 수 없습니다: ${filePath}`);
            }
        }
        
        // 폰트어썸 CDN이 없는 경우 추가
        if (!content.includes('font-awesome') && !content.includes('cdnjs.cloudflare.com/ajax/libs/font-awesome')) {
            const fontAwesomeLink = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">';
            
            if (content.includes('</head>')) {
                content = content.replace('</head>', `    ${fontAwesomeLink}\n</head>`);
                updated = true;
                console.log(`  - Font Awesome CDN 추가됨`);
            }
        }
        
        // 필요한 경우에만 파일 저장
        if (updated) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`✅ 업데이트 완료: ${filePath}`);
        } else {
            console.log(`⏩ 변경 사항 없음: ${filePath}`);
        }
        
    } catch (error) {
        console.error(`❌ 오류 발생: ${filePath}`, error);
    }
}

// 메인 함수
function main() {
    const rootDirectory = '.'; // 현재 디렉토리를 루트로 설정
    const htmlFiles = findHtmlFiles(rootDirectory);
    
    console.log(`총 ${htmlFiles.length}개의 HTML 파일을 찾았습니다.`);
    
    let updatedCount = 0;
    htmlFiles.forEach(file => {
        updateHtmlFile(file);
        updatedCount++;
        console.log(`진행률: ${updatedCount}/${htmlFiles.length} (${Math.round(updatedCount/htmlFiles.length*100)}%)`);
        console.log('------------------------------------------------');
    });
    
    console.log('모든 파일 업데이트가 완료되었습니다.');
}

// 스크립트 실행
main(); 