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

// HTML 파일에서 헤더와 푸터를 제거하고 공통 JavaScript 파일을 추가하는 함수
function updateHtmlFile(filePath) {
    console.log(`처리 중: ${filePath}`);
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 이미 업데이트된 파일인지 확인
        if (content.includes('common.js')) {
            console.log(`이미 업데이트됨: ${filePath}`);
            return;
        }
        
        // 헤더와 푸터 코드 패턴
        const headerPattern = /<header[\s\S]*?<\/header>/i;
        const footerPattern = /<footer[\s\S]*?<\/footer>/i;
        
        // 헤더와 푸터 제거
        content = content.replace(headerPattern, '');
        content = content.replace(footerPattern, '');
        
        // 상대 경로 계산
        let relativePath = '';
        const depth = filePath.split(path.sep).length - 1;
        
        if (depth > 1) {
            // 루트 디렉토리로부터의 상대 경로 계산
            relativePath = '../'.repeat(depth - 1);
        }
        
        // 공통 JavaScript 파일 추가
        if (!content.includes('common.js')) {
            const scriptTag = `<script src="${relativePath}js/common.js"></script>`;
            content = content.replace('</body>', `    ${scriptTag}\n</body>`);
        }
        
        // CSS 경로 수정
        if (content.includes('href="styles.css"')) {
            content = content.replace('href="styles.css"', `href="${relativePath}assets/css/styles.css"`);
        }
        
        // 업데이트된 내용 저장
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`업데이트 완료: ${filePath}`);
        
    } catch (error) {
        console.error(`오류 발생: ${filePath}`, error);
    }
}

// 메인 함수
function main() {
    const rootDirectory = '.'; // 현재 디렉토리를 루트로 설정
    const htmlFiles = findHtmlFiles(rootDirectory);
    
    console.log(`총 ${htmlFiles.length}개의 HTML 파일을 찾았습니다.`);
    
    htmlFiles.forEach(file => {
        updateHtmlFile(file);
    });
    
    console.log('모든 파일 업데이트가 완료되었습니다.');
}

// 스크립트 실행
main(); 