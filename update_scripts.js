const fs = require('fs');
const path = require('path');

// HTML 파일 찾기
function findHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            findHtmlFiles(filePath, fileList);
        } else if (path.extname(file) === '.html') {
            fileList.push(filePath);
        }
    }
    
    return fileList;
}

// HTML 파일의 스크립트 참조 업데이트
function updateScriptReferences(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 상대 경로 계산
        let relativePath = '';
        const fileDir = path.dirname(filePath);
        const rootDir = path.resolve('.');
        const relativeToRoot = path.relative(fileDir, rootDir);
        
        if (relativeToRoot === '') {
            relativePath = './';
        } else {
            relativePath = relativeToRoot.replace(/\\/g, '/') + '/';
        }
        
        // common.js 참조 확인 및 업데이트
        if (content.includes('common.js')) {
            // common.js의 상대 경로 찾기
            const commonJsPathMatch = content.match(/(["'])(\.{0,2}\/.*?\/?)common\.js\1/);
            
            if (commonJsPathMatch) {
                // 기존 common.js 경로에 맞게 siteManager.js 경로 설정
                const basePath = commonJsPathMatch[2] || '';
                let newScriptPath = `${basePath}js/siteManager.js`;
                
                // common.js 참조를 siteManager.js로 대체
                const newContent = content.replace(
                    /(["'])(\.{0,2}\/.*?\/?)common\.js\1/g, 
                    `$1${newScriptPath}$1`
                );
                
                fs.writeFileSync(filePath, newContent, 'utf8');
                console.log(`${filePath}: common.js → siteManager.js 업데이트 완료`);
            } else {
                // 경로를 추출할 수 없는 경우, 경로 추론 시도
                let newScriptRef = '';
                
                if (filePath.includes('\\pages\\')) {
                    if (filePath.match(/\\pages\\[^\\]+\\[^\\]+\.html$/)) {
                        // 2단계 깊이 (예: /pages/topics/xxx.html)
                        newScriptRef = '<script src="../../js/siteManager.js"></script>';
                    } else {
                        // 1단계 깊이 (예: /pages/xxx.html)
                        newScriptRef = '<script src="../js/siteManager.js"></script>';
                    }
                } else {
                    // 루트 레벨
                    newScriptRef = '<script src="js/siteManager.js"></script>';
                }
                
                // common.js 스크립트 태그 전체를 새 참조로 대체
                const newContent = content.replace(
                    /<script[^>]*common\.js[^>]*><\/script>/g,
                    newScriptRef
                );
                
                fs.writeFileSync(filePath, newContent, 'utf8');
                console.log(`${filePath}: common.js → siteManager.js 업데이트 완료 (경로 추론)`);
            }
        } else {
            // common.js가 없는 경우 body 종료 태그 앞에 스크립트 추가
            let scriptPath = '';
            
            if (filePath.includes('\\pages\\')) {
                if (filePath.match(/\\pages\\[^\\]+\\[^\\]+\.html$/)) {
                    scriptPath = '../../js/siteManager.js';
                } else {
                    scriptPath = '../js/siteManager.js';
                }
            } else {
                scriptPath = 'js/siteManager.js';
            }
            
            const scriptTag = `\n    <script src="${scriptPath}"></script>\n`;
            const newContent = content.replace('</body>', `${scriptTag}</body>`);
            
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`${filePath}: siteManager.js 추가 완료`);
        }
    } catch (error) {
        console.error(`${filePath} 처리 중 오류 발생:`, error);
    }
}

// 메인 실행 부분
const htmlFiles = findHtmlFiles('.');
console.log(`총 ${htmlFiles.length}개의 HTML 파일을 찾았습니다.`);

let processedCount = 0;
for (const filePath of htmlFiles) {
    updateScriptReferences(filePath);
    processedCount++;
}

console.log(`${processedCount}개의 HTML 파일을 처리했습니다.`); 