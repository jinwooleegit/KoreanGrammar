/**
 * add_polyfill.js
 * 모든 HTML 파일에 polyfills.js 및 IE 호환성 CSS 참조를 추가하는 스크립트
 */

const fs = require('fs');
const path = require('path');

// 프로젝트 루트 디렉토리
const rootDir = './';

// HTML 파일 찾기
function findHtmlFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        // node_modules 및 .git 디렉토리 제외
        if (file === 'node_modules' || file === '.git') {
            return;
        }
        
        if (stat && stat.isDirectory()) {
            // 재귀적으로 모든 하위 디렉토리 검색
            results = results.concat(findHtmlFiles(filePath));
        } else if (path.extname(file).toLowerCase() === '.html') {
            // HTML 파일만 추가
            results.push(filePath);
        }
    });
    
    return results;
}

// 상대 경로 계산
function calculateRelativePath(htmlFilePath, targetPath) {
    const htmlDir = path.dirname(htmlFilePath);
    const fullTargetPath = path.join(rootDir, targetPath);
    
    // HTML 파일 위치에서 대상 파일까지의 상대 경로
    let relativePath = path.relative(htmlDir, fullTargetPath);
    
    // Windows 경로를 웹 URL 형식으로 변환 (백슬래시를 슬래시로)
    relativePath = relativePath.replace(/\\/g, '/');
    
    return relativePath;
}

// 폴리필 스크립트 태그 추가
function addPolyfillToHtml(htmlFilePath) {
    try {
        let content = fs.readFileSync(htmlFilePath, 'utf8');
        
        // 이미 폴리필 참조가 있는지 확인
        if (content.includes('polyfills.js')) {
            console.log(`${htmlFilePath} - 이미 폴리필 참조가 포함되어 있습니다.`);
            return false;
        }
        
        // head 태그 닫는 부분 찾기
        const headCloseIndex = content.indexOf('</head>');
        
        // head 태그가 없는 경우 처리
        if (headCloseIndex === -1) {
            console.log(`${htmlFilePath} - <head> 태그를 찾을 수 없습니다.`);
            return false;
        }
        
        // 상대 경로 계산
        const relativePath = calculateRelativePath(htmlFilePath, 'js/polyfills.js');
        
        // 폴리필 스크립트 태그 생성
        const polyfillScript = `    <!-- 구형 브라우저 지원을 위한 폴리필 -->
    <script src="${relativePath}"></script>
`;
        
        // head 태그 닫기 전에 폴리필 스크립트 삽입
        content = content.slice(0, headCloseIndex) + polyfillScript + content.slice(headCloseIndex);
        
        // 변경된 내용 파일에 쓰기
        fs.writeFileSync(htmlFilePath, content, 'utf8');
        
        console.log(`${htmlFilePath} - 폴리필 참조가 추가되었습니다.`);
        return true;
    } catch (error) {
        console.error(`${htmlFilePath} 처리 중 오류 발생:`, error);
        return false;
    }
}

// IE 호환성 CSS 파일 참조 추가
function addIeCompatCssToHtml(htmlFilePath) {
    try {
        let content = fs.readFileSync(htmlFilePath, 'utf8');
        
        // 이미 IE 호환성 CSS 참조가 있는지 확인
        if (content.includes('ie-compatibility.css')) {
            console.log(`${htmlFilePath} - 이미 IE 호환성 CSS 참조가 포함되어 있습니다.`);
            return false;
        }
        
        // head 태그 닫는 부분 찾기
        const headCloseIndex = content.indexOf('</head>');
        
        // head 태그가 없는 경우 처리
        if (headCloseIndex === -1) {
            console.log(`${htmlFilePath} - <head> 태그를 찾을 수 없습니다.`);
            return false;
        }
        
        // 상대 경로 계산
        const relativePath = calculateRelativePath(htmlFilePath, 'css/ie-compatibility.css');
        
        // IE 호환성 CSS 링크 태그 생성
        const ieCompatCssLink = `    <!-- IE 호환성을 위한 CSS -->
    <link rel="stylesheet" href="${relativePath}">
`;
        
        // head 태그 닫기 전에 IE 호환성 CSS 링크 삽입
        content = content.slice(0, headCloseIndex) + ieCompatCssLink + content.slice(headCloseIndex);
        
        // 변경된 내용 파일에 쓰기
        fs.writeFileSync(htmlFilePath, content, 'utf8');
        
        console.log(`${htmlFilePath} - IE 호환성 CSS 참조가 추가되었습니다.`);
        return true;
    } catch (error) {
        console.error(`${htmlFilePath} IE 호환성 CSS 처리 중 오류 발생:`, error);
        return false;
    }
}

// HTML5 Doctype이 있는지 확인하고 없으면 추가
function ensureHtml5Doctype(htmlFilePath) {
    try {
        let content = fs.readFileSync(htmlFilePath, 'utf8');
        
        // HTML5 doctype 확인
        if (!content.trim().startsWith('<!DOCTYPE html>')) {
            // 기존 doctype 제거 (있는 경우)
            content = content.replace(/^\s*<!DOCTYPE[^>]*>/i, '');
            
            // HTML5 doctype 추가
            content = '<!DOCTYPE html>\n' + content;
            
            // 변경된 내용 파일에 쓰기
            fs.writeFileSync(htmlFilePath, content, 'utf8');
            
            console.log(`${htmlFilePath} - HTML5 doctype이 추가되었습니다.`);
            return true;
        }
        
        return false;
    } catch (error) {
        console.error(`${htmlFilePath} doctype 처리 중 오류 발생:`, error);
        return false;
    }
}

// viewport 메타 태그가 있는지 확인하고 없으면 추가
function ensureViewportMeta(htmlFilePath) {
    try {
        let content = fs.readFileSync(htmlFilePath, 'utf8');
        
        // viewport 메타 태그 확인
        if (!content.includes('viewport')) {
            // head 태그 찾기
            const headIndex = content.indexOf('<head>');
            
            if (headIndex === -1) {
                console.log(`${htmlFilePath} - <head> 태그를 찾을 수 없습니다.`);
                return false;
            }
            
            // viewport 메타 태그 추가
            const metaTag = `    <meta name="viewport" content="width=device-width, initial-scale=1.0">
`;
            
            // head 태그 다음에 viewport 메타 태그 삽입
            content = content.slice(0, headIndex + 6) + '\n' + metaTag + content.slice(headIndex + 6);
            
            // 변경된 내용 파일에 쓰기
            fs.writeFileSync(htmlFilePath, content, 'utf8');
            
            console.log(`${htmlFilePath} - viewport 메타 태그가 추가되었습니다.`);
            return true;
        }
        
        return false;
    } catch (error) {
        console.error(`${htmlFilePath} viewport 메타 태그 처리 중 오류 발생:`, error);
        return false;
    }
}

// 메인 함수
function main() {
    // js 디렉토리가 없으면 생성
    const jsDir = path.join(rootDir, 'js');
    if (!fs.existsSync(jsDir)) {
        fs.mkdirSync(jsDir);
        console.log('js 디렉토리를 생성했습니다.');
    }
    
    // css 디렉토리가 없으면 생성
    const cssDir = path.join(rootDir, 'css');
    if (!fs.existsSync(cssDir)) {
        fs.mkdirSync(cssDir);
        console.log('css 디렉토리를 생성했습니다.');
    }
    
    // HTML 파일 찾기
    const htmlFiles = findHtmlFiles(rootDir);
    console.log(`총 ${htmlFiles.length}개의 HTML 파일을 찾았습니다.`);
    
    let polyfillAdded = 0;
    let ieCompatCssAdded = 0;
    let doctypeAdded = 0;
    let viewportAdded = 0;
    
    // 각 HTML 파일에 폴리필, IE 호환성 CSS, doctype, viewport 메타 태그 추가
    htmlFiles.forEach(htmlFile => {
        if (addPolyfillToHtml(htmlFile)) {
            polyfillAdded++;
        }
        
        if (addIeCompatCssToHtml(htmlFile)) {
            ieCompatCssAdded++;
        }
        
        if (ensureHtml5Doctype(htmlFile)) {
            doctypeAdded++;
        }
        
        if (ensureViewportMeta(htmlFile)) {
            viewportAdded++;
        }
    });
    
    // 결과 요약
    console.log('\n===== 결과 요약 =====');
    console.log(`총 처리된 HTML 파일: ${htmlFiles.length}개`);
    console.log(`폴리필 참조 추가: ${polyfillAdded}개 파일`);
    console.log(`IE 호환성 CSS 추가: ${ieCompatCssAdded}개 파일`);
    console.log(`HTML5 doctype 추가: ${doctypeAdded}개 파일`);
    console.log(`Viewport 메타 태그 추가: ${viewportAdded}개 파일`);
}

// 스크립트 실행
main(); 