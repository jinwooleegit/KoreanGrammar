/**
 * favicon 추가 스크립트
 * 모든 HTML 파일에 favicon 태그를 추가합니다.
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

// Favicon이 이미 있는지 확인하는 함수
function hasFavicon(content) {
    return content.includes('<link rel="icon"') || 
           content.includes('<link rel="shortcut icon"') ||
           content.includes('<link rel="apple-touch-icon"');
}

// Favicon 태그 추가 함수
function addFaviconTag(filePath, content) {
    // 이미 favicon 태그가 있는 경우 건너뛰기
    if (hasFavicon(content)) {
        return { content, changed: false };
    }
    
    // head 태그 닫는 부분 찾기
    const headCloseIndex = content.indexOf('</head>');
    
    // head 태그가 없는 경우 처리
    if (headCloseIndex === -1) {
        return { content, changed: false };
    }
    
    // 파비콘 이미지 경로
    const faviconPath = 'assets/images/favicon.ico';
    
    // 상대 경로 계산
    const relativePath = calculateRelativePath(filePath, faviconPath);
    
    // Favicon 링크 태그 생성
    const faviconTag = `    <!-- 파비콘 -->
    <link rel="icon" href="${relativePath}" type="image/x-icon">
    <link rel="shortcut icon" href="${relativePath}" type="image/x-icon">
`;
    
    // head 태그 닫기 전에 favicon 태그 추가
    const updatedContent = content.slice(0, headCloseIndex) + faviconTag + content.slice(headCloseIndex);
    
    return { content: updatedContent, changed: true };
}

// 파일 처리 함수
function processFile(filePath) {
    console.log(`처리 중: ${filePath}`);
    
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Favicon 태그 추가
        const { content: updatedContent, changed } = addFaviconTag(filePath, content);
        
        // 변경 사항이 있는 경우에만 파일 저장
        if (changed) {
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            console.log(`Favicon 태그 추가됨: ${filePath}`);
            return true;
        } else {
            console.log(`이미 Favicon이 있거나 변경 필요 없음: ${filePath}`);
            return false;
        }
    } catch (error) {
        console.error(`파일 처리 중 오류 ${filePath}:`, error);
        return false;
    }
}

// Favicon 이미지 생성 함수
function createFaviconImage() {
    // assets/images 디렉토리가 있는지 확인하고 없으면 생성
    const imagesDir = path.join('.', 'assets', 'images');
    if (!fs.existsSync(imagesDir)) {
        fs.mkdirSync(imagesDir, { recursive: true });
        console.log('assets/images 디렉토리 생성됨');
    }
    
    // 간단한 favicon.ico 파일 생성 (16x16 크기의 투명 이미지로 대체)
    // 실제 프로젝트에서는 진짜 이미지 파일을 사용해야 함
    const faviconPath = path.join(imagesDir, 'favicon.ico');
    
    // 파일이 없는 경우에만 생성
    if (!fs.existsSync(faviconPath)) {
        // 간단한 ICO 파일 헤더 (16x16 빈 아이콘)
        const icoHeader = Buffer.from([
            0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x10, 0x10, 
            0x00, 0x00, 0x01, 0x00, 0x20, 0x00, 0x68, 0x04, 
            0x00, 0x00, 0x16, 0x00, 0x00, 0x00
        ]);
        
        // 16x16 이미지 데이터 (투명)
        const imageData = Buffer.alloc(16 * 16 * 4, 0);
        
        // 전체 파일
        const icoFile = Buffer.concat([icoHeader, imageData]);
        
        // 파일 작성
        fs.writeFileSync(faviconPath, icoFile);
        console.log(`Favicon 이미지 생성됨: ${faviconPath}`);
    } else {
        console.log(`Favicon 이미지가 이미 존재함: ${faviconPath}`);
    }
}

// 메인 함수
function main() {
    // Favicon 이미지 생성/확인
    createFaviconImage();
    
    // HTML 파일 찾기
    const htmlFiles = findAllHtmlFiles('.');
    console.log(`처리할 HTML 파일 ${htmlFiles.length}개를 찾았습니다.`);
    
    let updatedCount = 0;
    
    // 각 HTML 파일에 favicon 태그 추가
    htmlFiles.forEach(filePath => {
        if (processFile(filePath)) {
            updatedCount++;
        }
    });
    
    console.log(`모든 파일이 처리되었습니다. ${updatedCount}/${htmlFiles.length} 파일에 favicon이 추가되었습니다.`);
}

// 스크립트 실행
main(); 