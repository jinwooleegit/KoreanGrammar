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

// HTML 파일에 header와 footer 태그 추가
function addHeaderFooter(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 이미 header 또는 footer가 있는지 확인
        if (content.includes('<header>') || content.includes('<footer>')) {
            console.log(`${filePath}: 이미 header 또는 footer가 존재합니다.`);
            return;
        }
        
        // body 시작 태그 다음에 header 추가
        content = content.replace(/<body[^>]*>(\s*)/i, `<body$1\n    <!-- 헤더 영역 -->\n    <header></header>\n    \n    `);
        
        // body 종료 태그 직전에 footer 추가
        const scriptTags = content.match(/<script[^>]*>[^<]*<\/script>\s*<\/body>/gi);
        
        if (scriptTags) {
            // script 태그가 마지막에 있는 경우
            const firstScriptTag = content.lastIndexOf('<script');
            const bodyEndPos = content.lastIndexOf('</body>');
            
            if (firstScriptTag !== -1 && firstScriptTag < bodyEndPos) {
                content = content.slice(0, firstScriptTag) + 
                        '\n    <!-- 푸터 영역 -->\n    <footer></footer>\n    \n    ' + 
                        content.slice(firstScriptTag);
            }
        } else {
            // script 태그가 없는 경우
            content = content.replace(/<\/body>/i, `\n    <!-- 푸터 영역 -->\n    <footer></footer>\n    \n</body>`);
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`${filePath}: header와 footer를 추가했습니다.`);
    } catch (error) {
        console.error(`${filePath} 처리 중 오류 발생:`, error);
    }
}

// 메인 실행 부분
const htmlFiles = findHtmlFiles('.');
console.log(`총 ${htmlFiles.length}개의 HTML 파일을 찾았습니다.`);

let processedCount = 0;
for (const filePath of htmlFiles) {
    addHeaderFooter(filePath);
    processedCount++;
}

console.log(`${processedCount}개의 HTML 파일을 처리했습니다.`); 