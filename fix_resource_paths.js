const fs = require('fs');
const path = require('path');
const glob = require('glob');

// HTML 파일에서 상대 경로를 절대 경로로 변환하는 함수
function convertPathsToAbsolute(content) {
  // CSS 파일 경로 수정 
  content = content.replace(/href="(\.\.\/)*assets\/css\/styles\.css"/g, 'href="/assets/css/styles.css"');
  
  // polyfill.js 경로 수정
  content = content.replace(/src="(\.\.\/)*js\/polyfills\.js"/g, 'src="/js/polyfills.js"');
  
  // IE 호환성 CSS 경로 수정
  content = content.replace(/href="(\.\.\/)*css\/ie-compatibility\.css"/g, 'href="/css/ie-compatibility.css"');
  
  // 스크립트 파일 경로 수정
  content = content.replace(/src="(\.\.\/)*assets\/js\/scripts\.js"/g, 'src="/assets/js/scripts.js"');
  content = content.replace(/src="(\.\.\/)*js\/siteManager\.js"/g, 'src="/js/siteManager.js"');
  
  // 닫힐 때 푸터 스크립트가 있는지 확인하고 없으면 추가
  if (!content.includes('</footer>')) {
    // 푸터가 없으면 </main> 태그 뒤나 </body> 태그 앞에 추가
    if (content.includes('</main>')) {
      content = content.replace('</main>', '</main>\n\n    <!-- 푸터 영역 -->\n    <footer></footer>');
    } else {
      content = content.replace('</body>', '    <!-- 푸터 영역 -->\n    <footer></footer>\n\n</body>');
    }
  }
  
  // scripts.js와 siteManager.js가 로드되는지 확인하고 없으면 추가
  if (!content.includes('scripts.js') || !content.includes('siteManager.js')) {
    const scriptsTag = `
    <script src="/assets/js/scripts.js"></script>
    <script src="/js/siteManager.js"></script>`;
    
    // </body> 태그 앞에 스크립트 태그 추가
    content = content.replace('</body>', `${scriptsTag}\n</body>`);
  }
  
  return content;
}

// 모든 HTML 파일 검색
const htmlFiles = glob.sync('**/*.html', { ignore: 'node_modules/**' });

let modifiedCount = 0;

// 각 HTML 파일 처리
htmlFiles.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const modifiedContent = convertPathsToAbsolute(content);
    
    // 내용이 변경되었는지 확인
    if (content !== modifiedContent) {
      fs.writeFileSync(filePath, modifiedContent, 'utf8');
      modifiedCount++;
      console.log(`✅ 수정됨: ${filePath}`);
    } else {
      console.log(`⏩ 변경 없음: ${filePath}`);
    }
  } catch (err) {
    console.error(`❌ 오류 발생 (${filePath}): ${err.message}`);
  }
});

console.log(`\n총 ${htmlFiles.length}개 파일 중 ${modifiedCount}개 파일의 리소스 경로가 수정되었습니다.`); 