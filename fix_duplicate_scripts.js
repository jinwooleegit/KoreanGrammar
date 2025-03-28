const fs = require('fs');
const path = require('path');

// 검색할 경로들
const directories = [
  'pages/grade-learning/grade1',
  'pages/grade-learning/grade2',
  'pages/grade-learning/grade3',
  'pages/grade-learning/grade4',
  'pages/grade-learning/grade5',
  'pages/grade-learning/grade6',
  'pages/topics',
  'pages/activities',
  'pages/progress',
  '.'
];

// 수정할 패턴
const scriptPatterns = [
  // 중복된 siteManager.js 참조 제거 (두 번째 경우)
  {
    search: /<script src="[^"]*\/KoreanGrammar\/js\/siteManager\.js"><\/script>\s+<script src="[^"]*\/KoreanGrammar\/assets\/js\/scripts\.js"><\/script>\s+<script src="[^"]*\/KoreanGrammar\/js\/siteManager\.js"><\/script>/g,
    replace: '<script src="/KoreanGrammar/js/siteManager.js"></script>\n    <script src="/KoreanGrammar/assets/js/scripts.js"></script>'
  },
  // 중복된 siteManager.js 참조 제거 (첫 번째 경우)
  {
    search: /<script src="[^"]*\/KoreanGrammar\/js\/siteManager\.js"><\/script>\s+<script src="[^"]*\/KoreanGrammar\/js\/siteManager\.js"><\/script>/g,
    replace: '<script src="/KoreanGrammar/js/siteManager.js"></script>'
  },
  // 상대 경로를 절대 경로로 변경
  {
    search: /<script src="(?:\.\.\/)*(js|assets\/js)\/siteManager\.js"><\/script>/g,
    replace: '<script src="/KoreanGrammar/js/siteManager.js"></script>'
  },
  // 스크립트 순서 통일 (scripts.js가 siteManager.js보다 먼저 로드되어야 함)
  {
    search: /<script src="[^"]*\/KoreanGrammar\/js\/siteManager\.js"><\/script>\s+<script src="[^"]*\/KoreanGrammar\/assets\/js\/scripts\.js"><\/script>/g,
    replace: '<script src="/KoreanGrammar/assets/js/scripts.js"></script>\n    <script src="/KoreanGrammar/js/siteManager.js"></script>'
  }
];

// 파일 수정 함수
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    scriptPatterns.forEach(pattern => {
      if (pattern.search.test(content)) {
        content = content.replace(pattern.search, pattern.replace);
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (err) {
    console.error(`Error processing file ${filePath}:`, err);
    return false;
  }
}

// 디렉토리 처리 함수
function processDirectory(dir) {
  try {
    const files = fs.readdirSync(dir);
    let fixedCount = 0;
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        fixedCount += processDirectory(filePath);
      } else if (stat.isFile() && file.endsWith('.html')) {
        if (fixFile(filePath)) {
          fixedCount++;
        }
      }
    });
    
    return fixedCount;
  } catch (err) {
    console.error(`Error processing directory ${dir}:`, err);
    return 0;
  }
}

// 메인 실행 코드
let totalFixed = 0;

directories.forEach(dir => {
  console.log(`Processing directory: ${dir}`);
  totalFixed += processDirectory(dir);
});

console.log(`Total files fixed: ${totalFixed}`); 