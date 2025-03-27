/**
 * 경로 수정 스크립트
 * 모든 HTML 파일에서 일관되지 않은 CSS, JavaScript, 내부 링크 경로를 수정합니다.
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
    
    // 파일 디렉토리와 루트 디렉토리 사이의 상대 경로 계산
    const depth = fileDir.split('/').length - 1;
    
    // 페이지 폴더 내의 파일인지 확인
    const isInPagesDir = normalizedFilePath.includes('/pages/');
    
    // 상대 경로 생성
    let relativePath = '';
    
    for (let i = 0; i < depth; i++) {
        relativePath += '../';
    }
    
    return relativePath + targetPath;
}

// CSS 경로 수정
function fixCssPath(filePath, content) {
    // 루트에 있는 styles.css에 대한 상대 경로 계산
    const relativePath = calculateRelativePath(filePath, 'assets/css/styles.css');
    
    // CSS 링크 태그 찾기 및 수정
    return content.replace(
        /<link\s+rel="stylesheet"\s+href="(?!https?:\/\/|\/\/)([^"]*\/)?assets\/css\/styles\.css">/g,
        `<link rel="stylesheet" href="${relativePath}">`
    );
}

// JavaScript 경로 수정
function fixJsPath(filePath, content) {
    // 루트에 있는 siteManager.js에 대한 상대 경로 계산
    const relativePath = calculateRelativePath(filePath, 'js/siteManager.js');
    
    // JavaScript 스크립트 태그 찾기 및 수정
    return content.replace(
        /<script\s+src="(?!https?:\/\/|\/\/)([^"]*\/)?js\/siteManager\.js"><\/script>/g,
        `<script src="${relativePath}"></script>`
    );
}

// 내부 링크 수정
function fixInternalLinks(filePath, content) {
    // 현재 파일의 디렉토리 경로
    const fileDir = path.dirname(filePath);
    
    // index.html 링크 수정
    let updatedContent = content.replace(
        /href="index\.html"/g,
        (match, offset, string) => {
            // 현재 위치가 루트에 있는 경우 수정하지 않음
            if (fileDir === '.') {
                return match;
            }
            
            // 링크가 같은 디렉토리의 index.html을 가리키는지 확인
            // 이전 텍스트에 breadcrumb 요소 등 네비게이션 관련 클래스가 있는지 확인
            const prevText = string.substring(Math.max(0, offset - 100), offset);
            
            if (prevText.includes('breadcrumb') || prevText.includes('nav')) {
                // 루트의 index.html에 대한 상대 경로 계산
                const relativePath = calculateRelativePath(filePath, 'index.html');
                return `href="${relativePath}"`;
            }
            
            return match;
        }
    );
    
    // topics.html 링크 수정
    updatedContent = updatedContent.replace(
        /href="topics\.html"/g,
        (match, offset, string) => {
            // 현재 파일이 /pages/topics/ 디렉토리에 있는 경우만 수정
            if (filePath.includes('/pages/topics/') || filePath.includes('\\pages\\topics\\')) {
                return 'href="index.html"';
            }
            
            // 그 외에는 상대 경로 계산
            const relativePath = calculateRelativePath(filePath, 'pages/topics/index.html');
            return `href="${relativePath}"`;
        }
    );
    
    // 기타 내부 링크 주제별, 학년별 등 수정
    // 학년별 학습 링크 수정
    updatedContent = updatedContent.replace(
        /href="grade-learning\.html"/g,
        (match) => {
            const relativePath = calculateRelativePath(filePath, 'pages/grade-learning/index.html');
            return `href="${relativePath}"`;
        }
    );
    
    // 활동 링크 수정
    updatedContent = updatedContent.replace(
        /href="activities\.html"/g,
        (match) => {
            const relativePath = calculateRelativePath(filePath, 'pages/activities/index.html');
            return `href="${relativePath}"`;
        }
    );
    
    return updatedContent;
}

// 파일 처리 함수
function processFile(filePath) {
    console.log(`Processing file: ${filePath}`);
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // CSS 경로 수정
        content = fixCssPath(filePath, content);
        
        // JavaScript 경로 수정
        content = fixJsPath(filePath, content);
        
        // 내부 링크 수정
        content = fixInternalLinks(filePath, content);
        
        // 수정된 내용 저장
        fs.writeFileSync(filePath, content, 'utf8');
        
        console.log(`Successfully updated: ${filePath}`);
    } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
    }
}

// 메인 함수
function main() {
    const rootDir = '.';
    const htmlFiles = findAllHtmlFiles(rootDir);
    
    console.log(`Found ${htmlFiles.length} HTML files to process.`);
    
    htmlFiles.forEach(filePath => {
        processFile(filePath);
    });
    
    console.log('All files have been processed.');
}

// 스크립트 실행
main(); 