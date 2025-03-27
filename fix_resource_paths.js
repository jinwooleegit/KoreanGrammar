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
  'pages/activities'
];

// 수정할 패턴
const patterns = [
  { search: /href="\/assets\//g, replace: 'href="/KoreanGrammar/assets/' },
  { search: /href="\/css\//g, replace: 'href="/KoreanGrammar/css/' },
  { search: /href="\/favicon\.ico"/g, replace: 'href="/KoreanGrammar/favicon.ico"' },
  { search: /src="\/js\//g, replace: 'src="/KoreanGrammar/js/' },
  { search: /src="\/assets\//g, replace: 'src="/KoreanGrammar/assets/' },
  { search: /<script src="\/js\/siteManager\.js"><\/script>/g, replace: '<script src="/KoreanGrammar/js/siteManager.js"></script>' }
];

// 파일 수정 함수
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    patterns.forEach(pattern => {
      if (pattern.search.test(content)) {
        content = content.replace(pattern.search, pattern.replace);
        modified = true;
      }
    });
    
    // 중복된 스크립트 참조 제거
    if (content.includes('</script>\n\n    <script src="/KoreanGrammar/js/siteManager.js"></script>')) {
      content = content.replace(/(<script src="\/KoreanGrammar\/js\/siteManager\.js"><\/script>)\s+<script src="\/KoreanGrammar\/js\/siteManager\.js"><\/script>/g, '$1');
      modified = true;
    }
    
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
}

// 메인 실행 코드
let totalFixed = 0;

directories.forEach(dir => {
  console.log(`Processing directory: ${dir}`);
  totalFixed += processDirectory(dir);
});

console.log(`Total files fixed: ${totalFixed}`); 