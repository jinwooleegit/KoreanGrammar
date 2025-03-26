/**
 * 모든 HTML 파일의 siteManager.js 경로를 직접 수정하는 스크립트
 * 실행 방법: node fix_paths.js
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

// HTML 파일의 siteManager.js 경로를 수정하는 함수
function fixJsPath(filePath) {
    console.log(`처리 중: ${filePath}`);
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let updated = false;
        
        // 파일 경로 정규화 및 분석
        const normalizedPath = filePath.replace(/\\/g, '/');
        const dirs = normalizedPath.split('/');
        let depth = 0;
        
        // 경로에 'pages'와 그 이하 경로가 포함되어 있는지 확인
        let hasSubdirs = false;
        let pagesIndex = -1;
        
        for (let i = 0; i < dirs.length; i++) {
            if (dirs[i] === 'pages') {
                hasSubdirs = true;
                pagesIndex = i;
                break;
            }
        }
        
        // depth 계산
        if (hasSubdirs) {
            depth = dirs.length - pagesIndex - 1;
        }
        
        // 경로에 따른 상대 경로 계산
        let relativePath = '';
        let pathType = '';
        
        if (depth >= 2) {
            // 두 수준 이상 (예: pages/topics/..., pages/activities/..., pages/grade-learning/...)
            relativePath = '../../';
            pathType = `최소 2단계 이상 깊이의 서브디렉토리 (깊이: ${depth})`;
        } else if (depth === 1) {
            // 한 수준 (예: pages/...)
            relativePath = '../';
            pathType = `1단계 깊이의 디렉토리 (깊이: ${depth})`;
        } else {
            // 루트 수준
            relativePath = '';
            pathType = `루트 수준 (깊이: ${depth})`;
        }
        
        console.log(`  - 파일 경로: ${normalizedPath}`);
        console.log(`  - 경로 유형: ${pathType}`);
        console.log(`  - 계산된 상대 경로: ${relativePath}`);
        
        // 기존 common.js 또는 siteManager.js 스크립트 태그 찾기와 교체
        const commonJsRegex = /<script[^>]*src=["']([^"']*)common\.js["'][^>]*><\/script>/i;
        const siteManagerJsRegex = /<script[^>]*src=["']([^"']*)siteManager\.js["'][^>]*><\/script>/i;
        
        if (commonJsRegex.test(content)) {
            const oldScriptTag = content.match(commonJsRegex)[0];
            const newScriptTag = `<script src="${relativePath}js/siteManager.js"></script>`;
            
            content = content.replace(commonJsRegex, newScriptTag);
            updated = true;
            console.log(`  - common.js 경로를 siteManager.js로 수정됨: ${relativePath}js/siteManager.js`);
        } else if (siteManagerJsRegex.test(content)) {
            const oldScriptTag = content.match(siteManagerJsRegex)[0];
            const newScriptTag = `<script src="${relativePath}js/siteManager.js"></script>`;
            
            // 경로가 올바른지 확인
            if (oldScriptTag !== newScriptTag) {
                content = content.replace(siteManagerJsRegex, newScriptTag);
                updated = true;
                console.log(`  - siteManager.js 경로 수정됨: ${relativePath}js/siteManager.js`);
            } else {
                console.log(`  - siteManager.js 경로가 이미 올바름: ${relativePath}js/siteManager.js`);
            }
        } else if (content.includes('</body>')) {
            // siteManager.js 스크립트가 없으면 추가
            const scriptTag = `<script src="${relativePath}js/siteManager.js"></script>`;
            content = content.replace('</body>', `    ${scriptTag}\n</body>`);
            updated = true;
            console.log(`  - siteManager.js 추가됨: ${relativePath}js/siteManager.js`);
        } else {
            console.warn(`  - body 태그를 찾을 수 없습니다: ${filePath}`);
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
        fixJsPath(file);
        updatedCount++;
        console.log(`진행률: ${updatedCount}/${htmlFiles.length} (${Math.round(updatedCount/htmlFiles.length*100)}%)`);
        console.log('------------------------------------------------');
    });
    
    console.log('모든 파일의 경로 수정이 완료되었습니다.');
}

// 스크립트 실행
main(); 