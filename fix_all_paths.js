/**
 * 모든 파일 경로 수정 스크립트
 * HTML 파일의 모든 자원(CSS, JavaScript, 이미지, 폴리필) 경로를 상대 경로로 수정합니다.
 */

const fs = require('fs');
const path = require('path');

// 모든 HTML 파일 찾기
function findAllHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.git')) {
            findAllHtmlFiles(filePath, fileList);
        } else if (file.endsWith('.html')) {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

// 상대 경로 계산 함수
function calculateRelativePath(filePath, targetPath) {
    // 파일 경로를 /로 통일
    const normalizedFilePath = filePath.replace(/\\/g, '/');
    
    // 파일의 디렉토리 계산
    const fileDir = path.dirname(normalizedFilePath);
    
    // 절대 경로 변환
    const absoluteTargetPath = path.resolve(targetPath);
    
    // 상대 경로 계산
    let relativePath = path.relative(fileDir, absoluteTargetPath);
    
    // Windows 경로를 웹 URL 형식으로 변환 (백슬래시를 슬래시로)
    relativePath = relativePath.replace(/\\/g, '/');
    
    return relativePath;
}

// CSS 파일 경로 수정
function fixCssPath(filePath, content) {
    // 기본 CSS 파일 경로 수정
    let updatedContent = content.replace(
        /<link\s+rel="stylesheet"\s+href="(?!https?:\/\/|\/\/|data:)([^"]*\/)?assets\/css\/styles\.css"[^>]*>/g,
        () => {
            const relativePath = calculateRelativePath(filePath, 'assets/css/styles.css');
            return `<link rel="stylesheet" href="${relativePath}">`;
        }
    );
    
    // grade_styles.css 경로 수정
    updatedContent = updatedContent.replace(
        /<link\s+rel="stylesheet"\s+href="(?!https?:\/\/|\/\/|data:)([^"]*\/)?assets\/css\/grade_styles\.css"[^>]*>/g,
        () => {
            const relativePath = calculateRelativePath(filePath, 'assets/css/grade_styles.css');
            return `<link rel="stylesheet" href="${relativePath}">`;
        }
    );
    
    // progress-styles.css 경로 수정
    updatedContent = updatedContent.replace(
        /<link\s+rel="stylesheet"\s+href="(?!https?:\/\/|\/\/|data:)([^"]*\/)?assets\/css\/progress-styles\.css"[^>]*>/g,
        () => {
            const relativePath = calculateRelativePath(filePath, 'assets/css/progress-styles.css');
            return `<link rel="stylesheet" href="${relativePath}">`;
        }
    );
    
    // IE 호환성 CSS 경로 수정
    updatedContent = updatedContent.replace(
        /<link\s+rel="stylesheet"\s+href="(?!https?:\/\/|\/\/|data:)([^"]*\/)?css\/ie-compatibility\.css"[^>]*>/g,
        () => {
            const relativePath = calculateRelativePath(filePath, 'css/ie-compatibility.css');
            return `<link rel="stylesheet" href="${relativePath}">`;
        }
    );
    
    return updatedContent;
}

// JavaScript 파일 경로 수정
function fixJsPath(filePath, content) {
    // script.js 경로 수정
    let updatedContent = content.replace(
        /<script\s+src="(?!https?:\/\/|\/\/|data:)([^"]*\/)?assets\/js\/scripts\.js"[^>]*><\/script>/g,
        () => {
            const relativePath = calculateRelativePath(filePath, 'assets/js/scripts.js');
            return `<script src="${relativePath}"></script>`;
        }
    );
    
    // siteManager.js 경로 수정
    updatedContent = updatedContent.replace(
        /<script\s+src="(?!https?:\/\/|\/\/|data:)([^"]*\/)?js\/siteManager\.js"[^>]*><\/script>/g,
        () => {
            const relativePath = calculateRelativePath(filePath, 'js/siteManager.js');
            return `<script src="${relativePath}"></script>`;
        }
    );
    
    // progress.js 경로 수정
    updatedContent = updatedContent.replace(
        /<script\s+src="(?!https?:\/\/|\/\/|data:)([^"]*\/)?assets\/js\/progress\.js"[^>]*><\/script>/g,
        () => {
            const relativePath = calculateRelativePath(filePath, 'assets/js/progress.js');
            return `<script src="${relativePath}"></script>`;
        }
    );
    
    // polyfills.js 경로 수정
    updatedContent = updatedContent.replace(
        /<script\s+src="(?!https?:\/\/|\/\/|data:)([^"]*\/)?js\/polyfills\.js"[^>]*><\/script>/g,
        () => {
            const relativePath = calculateRelativePath(filePath, 'js/polyfills.js');
            return `<script src="${relativePath}"></script>`;
        }
    );
    
    return updatedContent;
}

// 이미지 경로 수정
function fixImagePath(filePath, content) {
    // 이미지 태그의 src 속성 수정
    return content.replace(
        /<img\s+([^>]*?)src="(?!https?:\/\/|\/\/|data:)([^"]*\/)?assets\/images\/([^"]*)"([^>]*?)>/g,
        (match, before, pathPrefix, imageName, after) => {
            const relativePath = calculateRelativePath(filePath, `assets/images/${imageName}`);
            return `<img ${before}src="${relativePath}"${after}>`;
        }
    );
}

// 내부 링크 수정
function fixInternalLinks(filePath, content) {
    // 내부 링크의 href 속성 수정 (index.html, grade-learning/index.html 등)
    // 색인 페이지 링크 수정
    let updatedContent = content.replace(
        /href="(?!https?:\/\/|\/\/|#|javascript:|mailto:|tel:)([^"]*\/)?index\.html"/g,
        (match, pathPrefix) => {
            // pathPrefix가 없으면 루트 index.html로 간주
            if (!pathPrefix) {
                const relativePath = calculateRelativePath(filePath, 'index.html');
                return `href="${relativePath}"`;
            }
            
            // 동일한 디렉토리의 index.html 참조 확인
            const currentDir = path.dirname(filePath);
            const targetDir = path.dirname(path.join(currentDir, pathPrefix || ''));
            
            if (pathPrefix && pathPrefix.includes('grade-learning')) {
                const relativePath = calculateRelativePath(filePath, 'pages/grade-learning/index.html');
                return `href="${relativePath}"`;
            } else if (pathPrefix && pathPrefix.includes('topics')) {
                const relativePath = calculateRelativePath(filePath, 'pages/topics/index.html');
                return `href="${relativePath}"`;
            } else if (pathPrefix && pathPrefix.includes('activities')) {
                const relativePath = calculateRelativePath(filePath, 'pages/activities/index.html');
                return `href="${relativePath}"`;
            } else if (pathPrefix && pathPrefix.includes('progress')) {
                const relativePath = calculateRelativePath(filePath, 'pages/progress/index.html');
                return `href="${relativePath}"`;
            }
            
            return match;
        }
    );
    
    // 다른 주요 내부 페이지 링크 수정
    const pagePatterns = [
        { pattern: /grade-learning\.html/, target: 'pages/grade-learning/index.html' },
        { pattern: /topics\.html/, target: 'pages/topics/index.html' },
        { pattern: /activities\.html/, target: 'pages/activities/index.html' },
        { pattern: /progress\.html/, target: 'pages/progress/index.html' }
    ];
    
    pagePatterns.forEach(({ pattern, target }) => {
        updatedContent = updatedContent.replace(
            new RegExp(`href="(?!https?:\\/\\/|\\/\\/|#)([^"]*\\/)?${pattern.source}"`, 'g'),
            () => {
                const relativePath = calculateRelativePath(filePath, target);
                return `href="${relativePath}"`;
            }
        );
    });
    
    return updatedContent;
}

// 파일 처리 함수
function processFile(filePath) {
    console.log(`처리 중: ${filePath}`);
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let updatedContent = content;
        
        // CSS 경로 수정
        updatedContent = fixCssPath(filePath, updatedContent);
        
        // JavaScript 경로 수정
        updatedContent = fixJsPath(filePath, updatedContent);
        
        // 이미지 경로 수정
        updatedContent = fixImagePath(filePath, updatedContent);
        
        // 내부 링크 수정
        updatedContent = fixInternalLinks(filePath, updatedContent);
        
        // 변경 사항이 있는 경우에만 파일 저장
        if (content !== updatedContent) {
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            console.log(`성공적으로 업데이트됨: ${filePath}`);
            return true;
        } else {
            console.log(`변경 사항 없음: ${filePath}`);
            return false;
        }
    } catch (error) {
        console.error(`파일 처리 중 오류 ${filePath}:`, error);
        return false;
    }
}

// 메인 함수
function main() {
    const rootDir = '.';
    const htmlFiles = findAllHtmlFiles(rootDir);
    
    console.log(`처리할 HTML 파일 ${htmlFiles.length}개를 찾았습니다.`);
    
    let updatedCount = 0;
    
    htmlFiles.forEach(filePath => {
        if (processFile(filePath)) {
            updatedCount++;
        }
    });
    
    console.log(`모든 파일이 처리되었습니다. ${updatedCount}/${htmlFiles.length} 파일이 업데이트되었습니다.`);
}

// 스크립트 실행
main(); 