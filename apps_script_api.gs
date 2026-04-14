// =====================================================
// apps_script_api.gs
// =====================================================
// 이 코드를 각 스프레드시트의 Apps Script에 붙여넣고
// 웹앱으로 배포하세요.
//
// 배포 방법:
// 1. 스프레드시트 열기 → 확장 프로그램 → Apps Script
// 2. 이 코드 전체를 복사하여 붙여넣기
// 3. 저장 (Ctrl+S)
// 4. 배포 → 새 배포 → 종류: 웹 앱
//    - 실행 대상: 나
//    - 액세스 권한: 모든 사용자
// 5. 배포 후 생성된 URL을 복사
// =====================================================

function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var result = {};

  for (var i = 0; i < sheets.length; i++) {
    var sheetName = sheets[i].getName();
    
    // _raw 또는 _RAW 또는 _Raw 로 끝나는 시트만 가져옴
    if (sheetName.match(/_[Rr][Aa][Ww]$/)) {
      var sheet = sheets[i];
      var data = sheet.getDataRange().getValues();
      
      // 첫 번째 행은 헤더
      var headers = data[0];
      var rows = [];
      
      for (var r = 1; r < data.length; r++) {
        var row = {};
        var hasData = false;
        
        for (var c = 0; c < headers.length; c++) {
          var val = data[r][c];
          
          // Date 객체를 문자열로 변환
          if (val instanceof Date) {
            val = Utilities.formatDate(val, Session.getScriptTimeZone(), "yyyy-MM-dd");
          }
          
          row[c] = val;
          
          // 빈 행 체크
          if (val !== "" && val !== null && val !== undefined) {
            hasData = true;
          }
        }
        
        if (hasData) {
          rows.push(row);
        }
      }
      
      result[sheetName] = {
        headers: headers,
        rows: rows
      };
    }
  }

  var output = ContentService.createTextOutput(JSON.stringify(result));
  output.setMimeType(ContentService.MimeType.JSON);
  
  // CORS 허용
  return output;
}
