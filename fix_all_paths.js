/**
 * 모든 파일 경로 수정 스크립트
 * HTML 파일의 모든 자원(CSS, JavaScript, 이미지, 폴리필) 경로를 상대 경로로 수정합니다.
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

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
async function fixAllPaths() {
    console.log('전체 파일 경로 수정 시작...');
    
    // 모든 HTML 파일 찾기
    const htmlFiles = glob.sync('**/*.html', {
        ignore: ['node_modules/**', '.git/**'],
        cwd: __dirname
    });
    
    console.log(`총 ${htmlFiles.length}개의 HTML 파일을 찾았습니다.`);
    
    let totalFixed = 0;
    let filesModified = 0;
    
    // 각 HTML 파일 처리
    for (const file of htmlFiles) {
        const filePath = path.join(__dirname, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let modified = false;
        let fixCount = 0;
        
        // 상대 경로 확인 기준 디렉토리 (파일이 있는 디렉토리)
        const fileDir = path.dirname(file);
        const depthFromRoot = fileDir.split(path.sep).length - 1;
        const relativePrefix = depthFromRoot > 0 ? '../'.repeat(depthFromRoot) : './';
        
        // 1. 잘못된 CSS 경로 수정
        const cssPatterns = [
            // 잘못된 상대 경로 패턴들
            { pattern: /(?:\.\.\/)+assets\/css\/styles\.css/g, replacement: '/assets/css/styles.css' },
            { pattern: /(?:\.\.\/)*pages\/assets\/css\/styles\.css/g, replacement: '/assets/css/styles.css' },
            { pattern: /(?:\.\.\/)*assets\/css\/styles\.css/g, replacement: '/assets/css/styles.css' }
        ];
        
        for (const { pattern, replacement } of cssPatterns) {
            if (pattern.test(content)) {
                const originalContent = content;
                content = content.replace(pattern, replacement);
                if (originalContent !== content) {
                    fixCount++;
                    modified = true;
                }
            }
        }
        
        // 2. 잘못된 JavaScript 경로 수정
        const jsPatterns = [
            // siteManager.js 경로 수정
            { pattern: /(?:\.\.\/)+js\/siteManager\.js/g, replacement: '/js/siteManager.js' },
            { pattern: /(?:\.\.\/)*pages\/js\/siteManager\.js/g, replacement: '/js/siteManager.js' },
            // scripts.js 경로 수정
            { pattern: /(?:\.\.\/)+assets\/js\/scripts\.js/g, replacement: '/assets/js/scripts.js' },
            { pattern: /(?:\.\.\/)*pages\/assets\/js\/scripts\.js/g, replacement: '/assets/js/scripts.js' }
        ];
        
        for (const { pattern, replacement } of jsPatterns) {
            if (pattern.test(content)) {
                const originalContent = content;
                content = content.replace(pattern, replacement);
                if (originalContent !== content) {
                    fixCount++;
                    modified = true;
                }
            }
        }
        
        // 3. 내부 링크 수정
        // index.html이 아닌 디렉토리로 끝나는 링크를 찾아 index.html 명시
        const linkPattern = /<a\s+(?:[^>]*?\s+)?href=["']([^"']*\/)["'][^>]*>(.*?)<\/a>/g;
        let match;
        
        while ((match = linkPattern.exec(content)) !== null) {
            const linkHref = match[1];
            const linkText = match[2];
            
            // 외부 링크는 건너뛰기 (http, https로 시작하는 링크)
            if (linkHref.startsWith('http://') || linkHref.startsWith('https://')) {
                continue;
            }
            
            // 디렉토리로 끝나는 내부 링크인 경우 index.html 추가
            if (linkHref.endsWith('/') && !linkHref.endsWith('index.html')) {
                const newHref = `${linkHref}index.html`;
                const newLink = `<a href="${newHref}">${linkText}</a>`;
                const originalLink = match[0];
                
                // 링크 교체
                content = content.replace(originalLink, newLink);
                fixCount++;
                modified = true;
            }
        }
        
        // 4. 이미지 경로 수정
        const imgPatterns = [
            { pattern: /(?:\.\.\/)+assets\/images\//g, replacement: '/assets/images/' },
            { pattern: /(?:\.\.\/)*pages\/assets\/images\//g, replacement: '/assets/images/' }
        ];
        
        for (const { pattern, replacement } of imgPatterns) {
            if (pattern.test(content)) {
                const originalContent = content;
                content = content.replace(pattern, replacement);
                if (originalContent !== content) {
                    fixCount++;
                    modified = true;
                }
            }
        }
        
        // 5. 파비콘 경로 수정
        if (content.includes('<link rel="icon"') || content.includes('<link rel="shortcut icon"')) {
            const faviconPatterns = [
                { pattern: /<link rel="icon" href="[^"]*favicon\.ico"/, replacement: '<link rel="icon" href="/favicon.ico"' },
                { pattern: /<link rel="shortcut icon" href="[^"]*favicon\.ico"/, replacement: '<link rel="shortcut icon" href="/favicon.ico"' }
            ];
            
            for (const { pattern, replacement } of faviconPatterns) {
                if (pattern.test(content)) {
                    const originalContent = content;
                    content = content.replace(pattern, replacement);
                    if (originalContent !== content) {
                        fixCount++;
                        modified = true;
                    }
                }
            }
        }
        
        // 변경사항이 있으면 파일 저장
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`${file}: ${fixCount}개 경로 수정됨`);
            totalFixed += fixCount;
            filesModified++;
        }
    }
    
    console.log(`\n총 결과: ${filesModified}개 파일에서 ${totalFixed}개 경로가 수정되었습니다.`);
    console.log('전체 파일 경로 수정 완료!');
}

// glob 모듈 확인 및 설치
function ensureGlobModule() {
    try {
        require.resolve('glob');
        return Promise.resolve();
    } catch (e) {
        console.log('glob 모듈을 설치합니다...');
        return new Promise((resolve, reject) => {
            const { exec } = require('child_process');
            exec('npm install glob', (error, stdout, stderr) => {
                if (error) {
                    console.error(`glob 모듈 설치 실패: ${error.message}`);
                    reject(error);
                    return;
                }
                if (stderr) {
                    console.error(`glob 모듈 설치 중 경고: ${stderr}`);
                }
                console.log(`glob 모듈 설치 완료: ${stdout}`);
                resolve();
            });
        });
    }
}

// 루트에 favicon.ico 복사
function copyFaviconToRoot() {
    const faviconSource = path.join(__dirname, 'assets', 'images', 'favicon.ico');
    const faviconDest = path.join(__dirname, 'favicon.ico');
    
    if (fs.existsSync(faviconSource) && !fs.existsSync(faviconDest)) {
        console.log('루트 디렉토리에 favicon.ico 복사...');
        try {
            fs.copyFileSync(faviconSource, faviconDest);
            console.log('favicon.ico를 루트 디렉토리에 복사했습니다.');
        } catch (error) {
            console.error('파비콘 복사 중 오류:', error);
        }
    }
}

// 실행
(async function run() {
    try {
        await ensureGlobModule();
        copyFaviconToRoot();
        await fixAllPaths();
    } catch (error) {
        console.error('오류 발생:', error);
    }
})(); 