/**
 * 반응형 디자인 표준화 스크립트
 * 모든 HTML 파일에서 미디어 쿼리 중단점을 표준화합니다.
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

// 미디어 쿼리 표준화 함수
function standardizeMediaQueries(content) {
    // 600px를 768px로 표준화
    let updatedContent = content.replace(/@media\s*\(\s*max-width\s*:\s*600px\s*\)/g, '@media (max-width: 768px)');
    
    // 두 번째 미디어 쿼리가 있는 경우 480px로 표준화
    if (content.includes('@media') && content.match(/@media/g).length > 1) {
        // 여러 미디어 쿼리가 있는 경우, 두 번째 미디어 쿼리가 있는지 확인
        const mediaQueries = content.match(/@media\s*\([^)]+\)/g) || [];
        if (mediaQueries.length > 1) {
            // 두 번째 미디어 쿼리 찾기
            const secondMediaQuery = mediaQueries[1];
            // 두 번째 미디어 쿼리를 480px로 표준화
            if (!secondMediaQuery.includes('480px')) {
                updatedContent = updatedContent.replace(secondMediaQuery, '@media (max-width: 480px)');
            }
        }
    }
    
    return updatedContent;
}

// 반응형 디자인 속성 추가
function addResponsiveProperties(content) {
    // 반응형 스타일이 없는 경우 기본 반응형 스타일 추가
    if (!content.includes('@media')) {
        // style 태그 끝을 찾기
        const styleEndIndex = content.lastIndexOf('</style>');
        
        if (styleEndIndex !== -1) {
            // 기본 반응형 스타일 추가
            const responsiveStyles = `
        /* 반응형 설정 */
        @media (max-width: 768px) {
            .main-content {
                padding: 0 15px;
            }
            
            .topic-card, .activity-card, .exercise-card {
                width: 100%;
            }
        }
        
        @media (max-width: 480px) {
            h1 {
                font-size: 24px;
            }
            
            p {
                font-size: 14px;
            }
        }`;
            
            // 스타일 태그 끝 이전에 반응형 스타일 추가
            content = content.substring(0, styleEndIndex) + responsiveStyles + content.substring(styleEndIndex);
        }
    }
    
    return content;
}

// META 뷰포트 태그 확인 및 추가
function ensureViewportMeta(content) {
    if (!content.includes('viewport')) {
        // head 태그 끝을 찾기
        const headEndIndex = content.indexOf('</head>');
        
        if (headEndIndex !== -1) {
            // 뷰포트 메타 태그 추가
            const metaTag = '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
            
            // head 태그 끝 이전에 메타 태그 추가
            content = content.substring(0, headEndIndex) + metaTag + content.substring(headEndIndex);
        }
    }
    
    return content;
}

// 파일 처리 함수
function processFile(filePath) {
    console.log(`Processing file: ${filePath}`);
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let updatedContent = content;
        
        // 뷰포트 메타 태그 확인 및 추가
        updatedContent = ensureViewportMeta(updatedContent);
        
        // 미디어 쿼리 표준화
        updatedContent = standardizeMediaQueries(updatedContent);
        
        // 반응형 디자인 속성 추가
        updatedContent = addResponsiveProperties(updatedContent);
        
        // 변경 사항이 있는 경우에만 파일 저장
        if (content !== updatedContent) {
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            console.log(`Successfully standardized responsive design in: ${filePath}`);
        } else {
            console.log(`No changes needed for: ${filePath}`);
        }
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