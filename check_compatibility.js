/**
 * 브라우저 호환성 검사 스크립트
 * 웹사이트의 브라우저 호환성을 검사하고 보고서를 생성합니다.
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

// CSS 파일 찾기
function findAllCssFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.git')) {
            findAllCssFiles(filePath, fileList);
        } else if (file.endsWith('.css')) {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

// JS 파일 찾기
function findAllJsFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !filePath.includes('node_modules') && !filePath.includes('.git')) {
            findAllJsFiles(filePath, fileList);
        } else if (file.endsWith('.js') && file !== 'check_compatibility.js' && file !== 'fix_paths.js' && file !== 'standardize_responsive.js') {
            fileList.push(filePath);
        }
    });
    
    return fileList;
}

// HTML 호환성 검사
function checkHtmlCompatibility(filePath) {
    const issues = [];
    const content = fs.readFileSync(filePath, 'utf8');
    
    // HTML5 doctype 검사
    if (!content.includes('<!DOCTYPE html>')) {
        issues.push('HTML5 doctype이 없음');
    }
    
    // 뷰포트 메타 태그 검사
    if (!content.includes('viewport')) {
        issues.push('뷰포트 메타 태그 없음');
    }
    
    // 오래된 HTML 태그 검사
    const deprecatedTags = ['font', 'center', 'marquee', 'frameset', 'frame'];
    deprecatedTags.forEach(tag => {
        const regex = new RegExp(`<${tag}[\\s>]`, 'i');
        if (regex.test(content)) {
            issues.push(`지원 중단된 HTML 태그 사용: ${tag}`);
        }
    });
    
    // 이미지 alt 속성 검사
    const imgTags = content.match(/<img[^>]*>/g) || [];
    imgTags.forEach(imgTag => {
        if (!imgTag.includes('alt=')) {
            issues.push('이미지에 alt 속성 없음');
        }
    });
    
    return issues;
}

// CSS 호환성 검사
function checkCssCompatibility(filePath) {
    const issues = [];
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 벤더 프리픽스 검사
    const vendorPrefixes = ['-webkit-', '-moz-', '-ms-', '-o-'];
    vendorPrefixes.forEach(prefix => {
        if (content.includes(prefix)) {
            issues.push(`벤더 프리픽스 사용: ${prefix}`);
        }
    });
    
    // 오래된 CSS 속성 검사
    const deprecatedProperties = ['box-shadow', 'border-radius', 'text-shadow', 'transition', 'transform'];
    deprecatedProperties.forEach(prop => {
        if (content.includes(prop)) {
            issues.push(`최신 CSS 속성 사용: ${prop} (IE9 이하에서 지원 안됨)`);
        }
    });
    
    // flexbox 사용 검사
    if (content.includes('display: flex') || content.includes('display:flex')) {
        issues.push('Flexbox 사용 (IE10 이하에서 제대로 작동 안함)');
    }
    
    // grid 사용 검사
    if (content.includes('display: grid') || content.includes('display:grid')) {
        issues.push('CSS Grid 사용 (IE11 이하에서 제대로 작동 안함)');
    }
    
    return issues;
}

// JavaScript 호환성 검사
function checkJsCompatibility(filePath) {
    const issues = [];
    const content = fs.readFileSync(filePath, 'utf8');
    
    // ES6 기능 검사
    const es6Features = [
        { feature: 'let', desc: 'let 키워드 사용 (IE11 이하에서 지원 안됨)' },
        { feature: 'const', desc: 'const 키워드 사용 (IE11 이하에서 지원 안됨)' },
        { feature: '=>', desc: '화살표 함수 사용 (IE11 이하에서 지원 안됨)' },
        { feature: '`', desc: '템플릿 리터럴 사용 (IE11 이하에서 지원 안됨)' },
        { feature: 'class', desc: 'class 키워드 사용 (IE11 이하에서 지원 안됨)' },
        { feature: 'async', desc: 'async/await 사용 (IE 전체에서 지원 안됨)' },
        { feature: 'fetch', desc: 'fetch API 사용 (IE 전체에서 지원 안됨)' }
    ];
    
    es6Features.forEach(({ feature, desc }) => {
        if (content.includes(feature)) {
            issues.push(desc);
        }
    });
    
    return issues;
}

// 보고서 생성
function generateReport(htmlIssues, cssIssues, jsIssues) {
    const report = [];
    
    report.push('# 브라우저 호환성 보고서');
    report.push('');
    report.push('## HTML 호환성 이슈');
    
    if (Object.keys(htmlIssues).length === 0) {
        report.push('- HTML 호환성 이슈가 없습니다.');
    } else {
        Object.entries(htmlIssues).forEach(([file, issues]) => {
            if (issues.length > 0) {
                report.push(`### ${file}`);
                issues.forEach(issue => {
                    report.push(`- ${issue}`);
                });
            }
        });
    }
    
    report.push('');
    report.push('## CSS 호환성 이슈');
    
    if (Object.keys(cssIssues).length === 0) {
        report.push('- CSS 호환성 이슈가 없습니다.');
    } else {
        Object.entries(cssIssues).forEach(([file, issues]) => {
            if (issues.length > 0) {
                report.push(`### ${file}`);
                issues.forEach(issue => {
                    report.push(`- ${issue}`);
                });
            }
        });
    }
    
    report.push('');
    report.push('## JavaScript 호환성 이슈');
    
    if (Object.keys(jsIssues).length === 0) {
        report.push('- JavaScript 호환성 이슈가 없습니다.');
    } else {
        Object.entries(jsIssues).forEach(([file, issues]) => {
            if (issues.length > 0) {
                report.push(`### ${file}`);
                issues.forEach(issue => {
                    report.push(`- ${issue}`);
                });
            }
        });
    }
    
    report.push('');
    report.push('## 브라우저 호환성 요약');
    report.push('');
    report.push('### 지원되는 브라우저');
    report.push('- Chrome (최신 버전)');
    report.push('- Firefox (최신 버전)');
    report.push('- Safari (최신 버전)');
    report.push('- Edge (최신 버전)');
    report.push('- IE11 (일부 기능 제한)');
    report.push('');
    report.push('### 권장 사항');
    report.push('1. 모든 IE11 이하 사용자에게는 최신 브라우저로 업그레이드하라는 메시지 표시');
    report.push('2. 주요 ES6 기능에 대한 폴리필 추가');
    report.push('3. CSS Flexbox 및 Grid에 대한 대체 스타일 제공');
    
    return report.join('\n');
}

// 메인 함수
function main() {
    const rootDir = '.';
    const htmlFiles = findAllHtmlFiles(rootDir);
    const cssFiles = findAllCssFiles(rootDir);
    const jsFiles = findAllJsFiles(rootDir);
    
    console.log(`Found ${htmlFiles.length} HTML files, ${cssFiles.length} CSS files, and ${jsFiles.length} JS files to check.`);
    
    const htmlIssues = {};
    const cssIssues = {};
    const jsIssues = {};
    
    // HTML 호환성 검사
    htmlFiles.forEach(filePath => {
        const issues = checkHtmlCompatibility(filePath);
        if (issues.length > 0) {
            htmlIssues[filePath] = issues;
        }
    });
    
    // CSS 호환성 검사
    cssFiles.forEach(filePath => {
        const issues = checkCssCompatibility(filePath);
        if (issues.length > 0) {
            cssIssues[filePath] = issues;
        }
    });
    
    // JavaScript 호환성 검사
    jsFiles.forEach(filePath => {
        const issues = checkJsCompatibility(filePath);
        if (issues.length > 0) {
            jsIssues[filePath] = issues;
        }
    });
    
    // 보고서 생성 및 저장
    const report = generateReport(htmlIssues, cssIssues, jsIssues);
    fs.writeFileSync('browser_compatibility_report.md', report, 'utf8');
    
    console.log('Browser compatibility check completed. Report generated as browser_compatibility_report.md');
}

// 스크립트 실행
main(); 