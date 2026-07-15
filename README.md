# 2026 臺愛醫療科技創新合作論壇網站

本資料夾可直接發布至 GitHub Pages，不需要安裝程式或執行編譯。

## 上傳到 GitHub

1. 登入 GitHub，按右上角 `＋`，選擇 `New repository`。
2. Repository name 可輸入 `taiwan-ireland-medtech-forum`。
3. 建立後選擇 `uploading an existing file`。
4. 將本資料夾內的所有檔案與資料夾拖曳至上傳區。
5. 按下 `Commit changes`。
6. 進入 Repository 的 `Settings → Pages`。
7. 在 `Build and deployment` 選擇 `Deploy from a branch`。
8. Branch 選擇 `main`，資料夾選擇 `/(root)`，再按 `Save`。
9. 等待數分鐘後，GitHub Pages 會顯示網站網址。

> 上傳的是本資料夾「裡面的內容」，不要多包一層資料夾，確保 `index.html` 位於Repository最外層。

## 日後修改活動資料

活動資料與版型已分開管理：

- `data/event.json`：活動名稱、日期、地點、介紹、報名網址、主題重點。
- `data/agenda.json`：活動議程。
- `data/speakers.json`：講者姓名、職稱與機構。
- `data/organizers.json`：主辦及協辦單位與Logo。
- `assets/css/styles.css`：主題色、排版及響應式設計。
- `assets/js/app.js`：網頁資料載入與選單功能。
- `assets/images/`：Logo、議程海報及講者照片來源。

修改JSON資料時，請保留英文雙引號、逗號及括號格式，避免網站無法讀取。

## 報名系統

網站所有「立即報名」按鈕都會讀取 `data/event.json` 中的 `registrationUrl`，並另開金屬中心外部報名頁。

## 建議檢查

每次更新後請確認：

- 活動日期與報到／論壇時間。
- 講者姓名、職稱、機構與議程順序。
- 報名網址及截止日期。
- 主辦及協辦單位Logo。
- 手機版選單、議程與報名按鈕是否正常。
