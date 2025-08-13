// main.js

// * JavaScript有効化の確認 * //
document.body.classList.add('js-enabled');
document.body.classList.remove('no-js');

// * インポート * //
import { createReceipt } from './assets/js/receipt.js';


// * 変数 * //
let mode = 'standby'; // standby, play, result
let typeNumberBlock = true; // タイピング無効化
let tickerData = [];
let gameTimer = 30; // ゲームタイマー（秒）
let timerInterval = null; // タイマーのインターバルID
let bgmAudio = null; // BGMのAudioオブジェクト
let startBgmAudio = null; // スタート画面用BGMのAudioオブジェクト
let endBgmAudio = null; // リザルト画面用BGMのAudioオブジェクト
let isMuted = false; // ミュート状態
let showTickers = false; // 銘柄表示モード


// * ステータス * //
const state = {
	"personName": "プレーヤー",
	"date": "2025年07月31日",
	"time": "00:00",
	"receiptNo": 123456, // レシート番号
	"typeNumber": "",
	"products": [],
	"totalAmount": 0,
	"totalCount": 0,
	"totalSummary": "0点　　0円"
};


// * クッキー機能 * //
function setCookie(name, value, days = 365) {
	const expires = new Date();
	expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
	document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
	const nameEQ = name + "=";
	const ca = document.cookie.split(';');
	for (let i = 0; i < ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) === ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
}


// * SE * //
function playSound(file, volume = 0.3) {
	return new Promise((resolve) => {
		if (isMuted) {
			resolve(); // ミュート中は即座に完了
			return;
		}

		try {
			const audio = new Audio(`./assets/sounds/${file}.mp3`);
			audio.volume = volume;

			// 音声再生完了時にPromiseを解決
			audio.addEventListener('ended', () => {
				resolve();
			});

			// エラー時も解決（処理を止めないため）
			audio.addEventListener('error', () => {
				console.log(`音声ファイル ${file} を再生できませんでした`);
				resolve();
			});

			audio.play().catch(() => {
				console.log(`音声ファイル ${file} を再生できませんでした`);
				resolve();
			});
		} catch (e) {
			console.log(`音声ファイル ${file} を再生できませんでした`);
			resolve();
		}
	});
}


// * 🌲待つ🌲 * //
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}


// * アラートモーダル * //
function showModal(message) {
	return new Promise((resolve) => {
		const modal = document.getElementById('confirmModal');
		if (!modal) {
			console.error('モーダルが見つかりません');
			resolve();
			return;
		}

		// モーダル表示中はタイピングを無効化
		const previousTypeNumberBlock = typeNumberBlock;
		typeNumberBlock = true;

		// メッセージを設定
		const messageElement = modal.querySelector('[data-bind="confirmModalMessage"]');
		if (messageElement) {
			messageElement.textContent = message;
		}

		// モーダルを表示
		modal.style.display = 'block';
		modal.classList.remove('hidden');

		// 確認ボタンのクリックイベント
		const confirmButton = modal.querySelector('button');
		if (confirmButton) {
			const handleConfirm = () => {
				hideModal();
				typeNumberBlock = previousTypeNumberBlock; // 元の状態に戻す
				confirmButton.removeEventListener('click', handleConfirm);
				resolve();
			};
			confirmButton.addEventListener('click', handleConfirm);
		}

		// Escapeキーでも閉じる
		const handleKeyDown = (e) => {
			if (e.key === 'Escape') {
				hideModal();
				typeNumberBlock = previousTypeNumberBlock; // 元の状態に戻す
				document.removeEventListener('keydown', handleKeyDown);
				resolve();
			}
		};
		document.addEventListener('keydown', handleKeyDown);
	});
}

function hideModal() {
	const modal = document.getElementById('confirmModal');
	if (modal) {
		modal.style.display = 'none';
		modal.classList.add('hidden');
	}
}


// * BGM * //
function startStartBGM() {
	if (isMuted) return; // ミュート中は再生しない

	try {
		if (startBgmAudio) {
			startBgmAudio.pause();
			startBgmAudio = null;
		}
		startBgmAudio = new Audio('./assets/sounds/start_bgm.mp3');
		startBgmAudio.volume = 0.3;
		startBgmAudio.loop = true;
		startBgmAudio.play();
	} catch (e) {
		console.log('スタート画面BGMの再生に失敗しました:', e);
	}
}

function stopStartBGM() {
	if (startBgmAudio) {
		startBgmAudio.pause();
		startBgmAudio = null;
	}
}

function startPlayBGM() {
	if (isMuted) return; // ミュート中は再生しない

	try {
		if (bgmAudio) {
			bgmAudio.pause();
			bgmAudio = null;
		}
		bgmAudio = new Audio('./assets/sounds/default_bgm.mp3');
		bgmAudio.volume = 0.3;
		bgmAudio.loop = true;
		bgmAudio.play();
	} catch (e) {
		console.log('BGMの再生に失敗しました:', e);
	}
}

function stopBGM() {
	if (bgmAudio) {
		bgmAudio.pause();
		bgmAudio = null;
	}
}

function startEndBGM() {
	if (isMuted) return; // ミュート中は再生しない

	try {
		if (endBgmAudio) {
			endBgmAudio.pause();
			endBgmAudio = null;
		}
		endBgmAudio = new Audio('./assets/sounds/end_bgm.mp3');
		endBgmAudio.volume = 0.3;
		endBgmAudio.loop = true;
		endBgmAudio.play();
	} catch (e) {
		console.log('リザルト画面BGMの再生に失敗しました:', e);
	}
}

function stopEndBGM() {
	if (endBgmAudio) {
		endBgmAudio.pause();
		endBgmAudio = null;
	}
}


// * ミュート機能 * //
function toggleMute() {
	isMuted = !isMuted;

	if (isMuted) {
		console.log('ミュートモード: ON');
		stopBGM();
		stopStartBGM();
		stopEndBGM();
	} else {
		console.log('ミュートモード: OFF');
		if (mode === 'standby') {
			startStartBGM();
		} else if (mode === 'play') {
			startPlayBGM();
		} else if (mode === 'result') {
			startEndBGM();
		}
	}
}


// * データ読み込み * //
async function loadData() {
	try {
		const response = await fetch('./assets/data/ticker-symbol.json');
		tickerData = await response.json();
	} catch (e) {
		console.error('銘柄データの読み込みに失敗しました:', e);
		alert('銘柄データの読み込みに失敗しました。');
		tickerData = [];
	}
}


// * ゲームスタート * //
async function handleGameStart() {
	// スタート画面からプレイヤー名とモードを取得
	const playerNameInput = document.getElementById('playerNameInput');
	const playerName = playerNameInput ? playerNameInput.value.trim() || 'プレーヤー' : 'プレーヤー';
	state.personName = playerName;
	setCookie('playerName', playerName);

	// モード選択を取得
	const showModeRadio = document.getElementById('showMode');
	showTickers = showModeRadio ? showModeRadio.checked : false;

	// スタート画面BGMを停止
	stopStartBGM();

	// モード変更&画面切り替え
	mode = 'play';
	setVisibility('startScreen', false);
	setVisibility('resultScreen', false);

	// レシート番号を生成
	const randomReceiptNo = Math.floor(Math.random() * 100000).toString().padStart(6, '0');
	setText('receiptNo', randomReceiptNo);

	// 銘柄表示エリアの表示/非表示とレイアウト調整
	updateTickerDisplay();

	// カウントダウン開始
	startCountdown();
}

// 銘柄表示エリアの更新
function updateTickerDisplay() {
	const tickerArea = document.getElementById('tickerDisplayArea');
	const mainRegisterGrid = document.getElementById('mainRegisterGrid');
	const mainRegisterArea = document.getElementById('mainRegisterArea');

	if (!tickerArea || !mainRegisterGrid || !mainRegisterArea) return;

	if (showTickers) {
		mainRegisterGrid.className = 'grid grid-cols-1 lg:grid-cols-4 gap-4';
		mainRegisterArea.className = 'lg:col-span-3';
		tickerArea.className = 'lg:col-span-1 w-full';
		tickerArea.style.display = 'block';
		updateTickerList();
	} else {
		mainRegisterGrid.className = 'grid grid-cols-1 gap-4';
		mainRegisterArea.className = 'w-full';
		tickerArea.style.display = 'none';
	}
}

// 銘柄リストの更新
function updateTickerList() {
	const tickerList = document.getElementById('tickerList');
	if (!tickerList || !showTickers) return;

	// 使用されていない銘柄をランダムに3個選択
	const unusedTickers = tickerData.filter(ticker =>
		!state.products.find(product => product.code === ticker.code)
	);

	const randomTickers = unusedTickers
		.sort(() => Math.random() - 0.5)
		.slice(0, 3);

	tickerList.innerHTML = '';
	randomTickers.forEach((ticker, index) => {
		const tickerItem = document.createElement('div');
		tickerItem.className = 'bg-white border border-gray-200 rounded-lg p-4 mb-3 hover:shadow-md transition-shadow duration-200';
		tickerItem.id = `ticker-${ticker.code}`;

		tickerItem.innerHTML = `
			<div class="flex justify-between items-start mb-2">
				<span class="text-lg font-mono font-bold text-gray-900">${ticker.code}</span>
				<span class="text-xs text-gray-500">#${index + 1}</span>
			</div>
			<div class="text-sm text-gray-700 mb-3 leading-tight">
				${ticker.name}
			</div>
			<div class="text-right">
				<span class="text-lg font-bold text-green-600">${ticker.price.toLocaleString()}</span>
				<span class="text-sm text-gray-500">円</span>
			</div>
		`;
		tickerList.appendChild(tickerItem);
	});
}

// カウントダウン
function startCountdown() {
	setVisibility('countdownScreen', true);
	startPlayBGM(); // BGM開始
	const countdownImg = document.getElementById('countdownImg');
	const goImageContainer = document.getElementById('goImage');
	const goImg = goImageContainer ? goImageContainer.querySelector('img') : null;

	if (!countdownImg || !goImageContainer || !goImg) {
		console.error('カウントダウン要素が見つかりませんでした。');
		return;
	}

	// カウントダウン中は入力禁止
	typeNumberBlock = true;

	const countdownImageDiv = document.getElementById('countdownImage');
	if (countdownImageDiv) {
		countdownImageDiv.style.display = 'flex';
	}
	goImageContainer.style.display = 'none';
	goImg.style.cssText = 'transition: none; transform: scale(1); opacity: 1;';

	let currentNumber = 3;
	const executeCountdown = () => {
		if (currentNumber > 0) {
			showNumber(currentNumber--);
			setTimeout(executeCountdown, 1000);
		} else {
			setTimeout(() => {
				showGo();
			}, 100);
		}
	};
	executeCountdown();
}

// カウントダウン数字表示
function showNumber(number) {
	const countdownImg = document.getElementById('countdownImg');
	if (!countdownImg) return;

	countdownImg.classList.remove('hidden');
	countdownImg.src = `./assets/img/countdown_${number}.png`;
	countdownImg.alt = number.toString();

	// アニメーションリセット
	countdownImg.style.cssText = 'transition: none; transform: scale(0.5); opacity: 0;';

	playSound('count', 0.8);

	requestAnimationFrame(() => {
		countdownImg.style.cssText = 'transition: transform 0.3s ease-out, opacity 0.3s ease-out; transform: scale(1); opacity: 1;';
	});

	setTimeout(() => {
		countdownImg.style.cssText = 'transition: transform 0.2s ease-in, opacity 0.2s ease-in; transform: scale(0.8); opacity: 0.7;';
	}, 600);
}

// GO画像表示
function showGo() {
	const goImageContainer = document.getElementById('goImage');
	const goImg = goImageContainer ? goImageContainer.querySelector('img') : null;
	if (!goImg || !goImageContainer) {
		setVisibility('countdownScreen', false);
		typeNumberBlock = false;
		startGame();
		return;
	}

	setVisibility('countdownScreen', true);

	// カウントダウン画像を完全に非表示
	const countdownImageDiv = document.getElementById('countdownImage');
	if (countdownImageDiv) {
		countdownImageDiv.style.display = 'none';
	}
	goImageContainer.style.display = 'flex';
	goImg.style.cssText = 'transition: none; transform: scale(1); opacity: 1;';

	playSound('go', 0.8);

	// アニメーション
	requestAnimationFrame(() => {
		goImg.style.cssText = 'transition: transform 1.5s ease-out, opacity 1.5s ease-out; transform: scale(3); opacity: 0;';
	});

	setTimeout(() => {
		// GO画像を非表示に戻す
		goImageContainer.style.display = 'none';
		setVisibility('countdownScreen', false);
		// カウントダウン終了後に入力許可
		typeNumberBlock = false;
		startGame();
	}, 1600);
}

// ゲーム開始
function startGame() {
	typeNumberBlock = false;
	startTimer(); // タイマー開始
}


// * ゲーム終了 * //
async function gameEnd() {
	typeNumberBlock = true; // タイピング無効化
	mode = 'result'; // モードの変更

	// モーダルが開いている場合は強制的に閉じる
	hideModal();

	// タイマー停止
	stopTimer();
	const timerElement = document.getElementById('gameTimer');
	if (timerElement) {
		timerElement.textContent = '終了';
	}

	await playSound('the_end', 0.5); // サウンドを再生
	stopBGM(); // BGM停止
	await sleep(500); // 5秒まつ
	await playSound('peypay', 0.6); // PayPay風の決済音を再生

	// レシートを垂れ流す
	const receiptHTML = createReceipt(state);
	const printContainer = document.createElement('div');

	printContainer.id = 'receiptPrintContainer';
	printContainer.style.cssText = `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; overflow: hidden; pointer-events: none; z-index: 50;`;

	// レシート本体を作成（最初は逆さまで左上から出現）
	const receiptElement = document.createElement('div');
	receiptElement.className = 'receipt-printing';
	receiptElement.style.cssText = `position: absolute; top: -500px; left: 20px; width: 250px; transform: rotate(180deg); transition: none; background: white; box-shadow: 2px 2px 10px rgba(0,0,0,0.3); border: 1px solid #ddd; z-index: 51;`;
	receiptElement.innerHTML = receiptHTML;

	printContainer.appendChild(receiptElement);
	document.body.appendChild(printContainer);

	// レシート音を再生
	playSound('receipt', 0.2);

	// アニメーション開始
	setTimeout(() => {
		receiptElement.style.cssText += 'transition: top 3s linear; top: 100vh;';
	}, 100);

	setTimeout(() => {
		receiptElement.style.cssText += 'transition: opacity 0.5s ease; opacity: 0;';

		setTimeout(() => {
			printContainer?.remove();
			setTimeout(() => { showResult() }, 500);
		}, 500);
	}, 3500);
}


// * リザルト画面 * //
function showResult() {
	// レシートモーダルを削除
	document.getElementById('receiptModal')?.remove();

	// リザルト画面用BGMを開始
	startEndBGM();
	playSound('8888', 0.5);

	// リザルト画面の表示
	setVisibility('resultScreen', true);

	// レシートを左側に表示
	const resultReceipt = document.getElementById('resultReceipt');
	if (resultReceipt) {
		const receiptHTML = createReceipt(state);
		resultReceipt.innerHTML = receiptHTML;
	}

	// スコア情報の表示
	updateResultScore();

	// タイマーをリセット
	gameTimer = 30;
	updateTimer();

	// イベントリスナーの設定
	setupResultEventListeners();
}

// リザルトスコアの更新
function updateResultScore() {
	// 時価総額合計
	const totalAmount = document.getElementById('resultTotalAmount');
	if (totalAmount) {
		totalAmount.textContent = `${state.totalAmount.toLocaleString()}円`;
	}

	// レシートの長さ
	const receiptLength = document.getElementById('resultReceiptLength');
	let totalLines = 0;
	if (receiptLength) {
		const basicLines = 15; // ヘッダー、区切り線、合計など
		const productLines = state.products.length;
		totalLines = basicLines + productLines;
		receiptLength.textContent = `${totalLines}行`;
	}

	// 総スコア(時価総額を10000で割った平方根 + レシート行数)
	const totalScore = document.getElementById('resultTotalScore');
	let score = 0;
	if (totalScore) {
		if (state.totalAmount > 0) {
			score = Math.floor(Math.log10(state.totalAmount) * 10000 + totalLines);
		} else {
			score = totalLines;
		}
		totalScore.textContent = `${score.toLocaleString()}点`;
	}

	// 称号の決定と表示
	const titleElement = document.getElementById('resultTitle');
	if (titleElement) {
		const title = getTitleByScore(score, state.totalCount); // 称号を取得
		titleElement.innerHTML = `<span class="text-purple-200 font-bold text-xl md:text-2xl">${title}</span>`;
	}

	// 買収企業数
	const companyCount = document.getElementById('resultCompanyCount');
	if (companyCount) {
		companyCount.textContent = `${state.totalCount}社`;
	}

	// 平均時価総額
	const averageAmount = document.getElementById('resultAverageAmount');
	if (averageAmount) {
		const average = state.totalCount > 0 ? Math.floor(state.totalAmount / state.totalCount) : 0;
		averageAmount.textContent = `${average.toLocaleString()}円`;
	}
}

// リザルトボタン
function setupResultEventListeners() {
	// シェアボタン
	const shareButton = document.getElementById('shareResultBtn');
	if (shareButton) {
		shareButton.onclick = () => {
			const basicLines = 15;
			const productLines = state.products.length;
			const totalLines = basicLines + productLines;
			let totalScore;
			if (state.totalAmount > 0) {
				totalScore = Math.floor(Math.log10(state.totalAmount) * 10000 + totalLines);
			} else {
				totalScore = totalLines;
			}
			const title = getTitleByScore(totalScore, state.totalCount, state.totalAmount);
			const modeText = showTickers ? '銘柄表示モード' : '銘柄なしモード';

			// Twitter文字数制限を考慮してモード情報の表示を判断
			let baseTweetText = `銘柄買収レジスターで遊んだよ！\n${title}\n⭐ 総スコア: ${totalScore.toLocaleString()}点\n🏢 買収企業数: ${state.totalCount}社\n💰 時価総額合計: ${state.totalAmount.toLocaleString()}円\n📄 レシートの長さ: ${totalLines}行\n\n#銘柄買収レジスター`;

			// モード情報を追加できるかチェック（Twitter文字数制限280文字）
			const tweetTextWithMode = `銘柄買収レジスターで遊んだよ！\n${title}\n⭐ 総スコア: ${totalScore.toLocaleString()}点\n🏢 買収企業数: ${state.totalCount}社\n💰 時価総額合計: ${state.totalAmount.toLocaleString()}円\n📄 レシートの長さ: ${totalLines}行\n🎮 モード: ${modeText}\n\n#銘柄買収レジスター`;

			const finalTweetText = tweetTextWithMode.length <= 280 ? tweetTextWithMode : baseTweetText;
			const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(finalTweetText)}`;
			window.open(tweetUrl, '_blank');
		};
	}

	// 再挑戦ボタン
	const retryButton = document.getElementById('retryGameBtn');
	if (retryButton) {
		retryButton.onclick = async () => {
			stopEndBGM(); // リザルト画面BGMを停止
			resetGame();
			setVisibility('resultScreen', false);

			// 前回と同じ設定でゲーム開始
			mode = 'play';

			// レシート番号を生成
			const randomReceiptNo = Math.floor(Math.random() * 100000).toString().padStart(6, '0');
			setText('receiptNo', randomReceiptNo);

			// 銘柄表示エリアの表示/非表示とレイアウト調整
			updateTickerDisplay();

			// カウントダウン開始
			typeNumberBlock = true;
			startCountdown();
		};
	}

	// スタート画面に戻るボタン
	const backButton = document.getElementById('backToStartBtn');
	if (backButton) {
		backButton.onclick = () => {
			// ページをリロードしてスタート画面に戻る
			window.location.reload();
		};
	}
}


// * 称号関数 * //
function getTitleByScore(score, companyCount) {
	// 最上位実績（スコア + 企業数クロス条件、10個）
	if (score >= 150000 && companyCount >= 25) return "💰 日本経済ジャック";
	if (score >= 140000 && companyCount >= 24) return "🚀 東証フルコンプリート";
	if (score >= 130000 && companyCount >= 22) return "🏦 株式市場のラスボス";
	if (score >= 120000 && companyCount >= 20) return "🛒 会計も買収も秒速";
	if (score >= 110000 && companyCount >= 19) return "📈 バーコード成金";
	if (score >= 100000 && companyCount >= 18) return "👑 レジ界の独占企業";
	if (score >= 90000 && companyCount >= 16) return "💸 買収バーゲン王";
	if (score >= 80000 && companyCount >= 15) return "📦 株と夢を詰め込むレジ袋";
	if (score >= 70000 && companyCount >= 14) return "🎯 狙い撃ちM&A";
	if (score >= 60000 && companyCount >= 12) return "⚡ 高速買収マシーン";
	if (score >= 50000 && companyCount >= 10) return "🧾 レシート製造工場";
	if (score >= 40000 && companyCount >= 8) return "🏹 株価スナイパー";
	if (score >= 30000 && companyCount >= 6) return "🔥 レジ暴走モード";
	if (score >= 25000 && companyCount >= 5) return "💳 社長カード乱用者";
	if (score >= 20000 && companyCount >= 4) return "📊 チャート荒らし";
	if (score >= 18000 && companyCount >= 8) return "🎪 株式サーカス団";
	if (score >= 15000 && companyCount >= 6) return "🎭 レジ裏工作員";
	if (score >= 12000 && companyCount >= 5) return "🎨 レシートコレクター";
	if (score >= 10000 && companyCount >= 4) return "🎵 ピッピッ音楽隊";
	if (score >= 8000 && companyCount >= 3) return "🎲 株式かるた名人";

	return "👶 投資って美味しいの？";
}


// * ゲームリセット関数 * //
function resetGame() {
	// 状態をリセット
	state.products = [];
	state.totalAmount = 0;
	state.totalCount = 0;
	state.totalSummary = "0点　　0円";
	state.typeNumber = "";

	// タイマーリセット
	gameTimer = 30;
	updateTimer();

	// UI更新
	updateProductsTable();
	updateTotalCount();
	updateBindings();

	// レイアウトをデフォルトに戻す
	const tickerArea = document.getElementById('tickerDisplayArea');
	const mainRegisterGrid = document.getElementById('mainRegisterGrid');
	const mainRegisterArea = document.getElementById('mainRegisterArea');

	if (tickerArea && mainRegisterGrid && mainRegisterArea) {
		mainRegisterGrid.className = 'grid grid-cols-1 gap-4';
		mainRegisterArea.className = 'w-full';
		tickerArea.style.display = 'none';
	}

	// タイピング有効化
	typeNumberBlock = false;
}


// * タイマー機能 * //
function updateTimer() {
	const timerElement = document.getElementById('gameTimer');
	if (!timerElement) return;

	timerElement.textContent = gameTimer;

	// 残り時間に応じて色を変更
	if (gameTimer <= 5) {
		timerElement.className = 'font-bold text-2xl text-red-600 animate-pulse';
	} else if (gameTimer <= 10) {
		timerElement.className = 'font-bold text-2xl text-orange-600';
	} else {
		timerElement.className = 'font-bold text-2xl text-gray-700';
	}
}

// タイマー開始関数
function startTimer() {
	if (timerInterval) clearInterval(timerInterval);

	gameTimer = 30;
	updateTimer();

	timerInterval = setInterval(() => {
		gameTimer--;
		updateTimer();

		// 警告音（残り10秒、5秒）
		if (gameTimer > 0 && gameTimer <= 5) {
			playSound('count', 0.4);
		}

		if (gameTimer <= 0) {
			clearInterval(timerInterval);
			gameEnd();
		}
	}, 1000);
}

// タイマー停止関数
function stopTimer() {
	if (timerInterval) {
		clearInterval(timerInterval);
		timerInterval = null;
	}
}

// CSSアニメーションを追加
const style = document.createElement('style');
style.textContent = `
	.receipt-printing {
		animation: receiptShake 0.05s infinite alternate;
	}

	@keyframes receiptShake {
		0% { transform: rotate(180deg) translateX(0px); }
		100% { transform: rotate(180deg) translateX(1px); }
	}
`;
if (!document.head.querySelector('style[data-receipt-styles]')) {
	style.setAttribute('data-receipt-styles', 'true');
	document.head.appendChild(style);
}


// * set・更新系関数 * //

// 全体の更新
function updateBindings() {
	document.querySelectorAll('[data-bind]').forEach(el => {
		const key = el.getAttribute('data-bind');
		if (key in state) {
			el.textContent = state[key];
		}
	});
}

// 合計表示を更新
function updateTotalCount() {
	state.totalCount = state.products.length;
	state.totalAmount = state.products.reduce((sum, product) => sum + product.price, 0);
	state.totalSummary = `${state.totalCount}点　　${state.totalAmount.toLocaleString()}円`;
	updateBindings();
}

// 商品テーブルを更新
function updateProductsTable() {
	const tableBody = document.getElementById('productsTable');
	if (!tableBody) return;

	// テーブルをクリア
	tableBody.innerHTML = '';

	// 最新の6個のみ表示（配列の後ろから6個取得）
	const displayProducts = state.products.slice(-6);

	// 商品リストに追加
	displayProducts.forEach((product, index) => {
		const row = document.createElement('tr');
		const actualIndex = state.products.length - displayProducts.length + index + 1;
		row.className = index % 2 === 0 ? 'bg-white text-center' : 'bg-green-100 text-center'; // 偶数行と奇数行で背景色を変える

		row.innerHTML = `
			<td class="border px-2 py-2">${actualIndex}</td>
			<td class="border px-2 py-2">${product.code} ${product.name}</td>
			<td class="border px-2 py-2">${product.price.toLocaleString()}</td>
			<td class="border px-2 py-2">1</td>
			<td class="border px-2 py-2">0%</td>
			<td class="border px-2 py-2">${product.price.toLocaleString()}円</td>
		`;

		tableBody.appendChild(row);
	});

	// 6行未満の場合、空行を追加
	const currentRows = displayProducts.length;
	const minRows = 6;
	for (let i = currentRows; i < minRows; i++) {
		const row = document.createElement('tr');
		row.className = i % 2 === 0 ? 'bg-white text-center' : 'bg-green-100 text-center';

		row.innerHTML = `
			<td class="border px-2 py-2">&nbsp;</td>
			<td class="border px-2 py-2">&nbsp;</td>
			<td class="border px-2 py-2">&nbsp;</td>
			<td class="border px-2 py-2">&nbsp;</td>
			<td class="border px-2 py-2">&nbsp;</td>
			<td class="border px-2 py-2">&nbsp;</td>
		`;

		tableBody.appendChild(row);
	}
}

// 文字更新
function setText(id, text) {
	state[id] = text;
	updateBindings();
}

// 表示・非表示の切り替え
function setVisibility(id, isVisible) {
	const element = document.getElementById(id);
	if (element) {
		if (isVisible) {
			// スタート画面とリザルト画面は flex で表示
			if (id === 'startScreen' || id === 'resultScreen') {
				element.style.display = 'flex';
			} else {
				element.style.display = 'block';
			}
			element.classList.remove('hidden');
		} else {
			element.style.display = 'none';
			element.classList.add('hidden');
		}
	}
}


// * ボタン系関数 * //

// クリア
function handleClear() {
	playSound('click');
	setText('typeNumber', '');
}

// PULL
async function handlePull() {
	if (typeNumberBlock) return; // タイピングブロック中は無効化
	typeNumberBlock = true;
	playSound('click');

	const code = state.typeNumber;
	if (!code) {
		await showModal('商品コードを入力してください。');
		typeNumberBlock = false; // タイピング有効化
		return;
	}

	const data = tickerData.find(ticker => ticker.code === code);
	if (data) {
		// 銘柄コードがすでに商品欄に存在するかチェック
		const existingProduct = state.products.find(product => product.code === data.code);
		if (existingProduct) {
			await showModal(`銘柄コード「${code}」はすでに登録されています。`);
		} else {
			// 新規追加
			state.products.push({ code: data.code, name: data.name, price: data.price });
			updateProductsTable();
			updateTotalCount();

			// 銘柄表示を更新
			if (showTickers) {
				updateTickerList();
			}
		}
	} else {
		await showModal(`銘柄コード「${code}」が見つかりません。`);
	}
	setText('typeNumber', '');
	typeNumberBlock = false; // タイピング有効化
}


// * タイピング検知 * //
function handleKeyClick(e) {
	// Mキーはタイピングブロック中でも有効
	if (e.key === 'm' || e.key === 'M') {
		toggleMute();
		return;
	}

	if (typeNumberBlock) return;

	if (e.key >= '0' && e.key <= '9') {

		// 数字キー
		playSound('click');
		const newValue = state.typeNumber + e.key;
		setText('typeNumber', newValue);

	} else if (e.key === '.') {

		//「.」の場合は「00」を入力
		playSound('click');
		const newValue = state.typeNumber + '00';
		setText('typeNumber', newValue);

	} else if (e.key === 'Enter' && typeNumberBlock === false) {

		// Enterキー(キー入力無効化中は無効)
		const pullButton = document.querySelector('button[onclick="handlePull()"]');
		if (pullButton) {
			pullButton.classList.add('bg-blue-600');
			setTimeout(() => pullButton.classList.remove('bg-blue-600'), 150);
		}
		handlePull();

	} else if (e.key === 'Backspace') {

		// Backspaceキー
		const clearButton = document.querySelector('button[onclick="handleClear()"]');
		if (clearButton) {
			clearButton.classList.add('bg-gray-500');
			setTimeout(() => clearButton.classList.remove('bg-gray-500'), 150);
		}
		handleClear();

	}
}


// * ロード時の処理 * //
window.addEventListener('DOMContentLoaded', async () => {
	await loadData(); // 銘柄データを読み込む

	// クッキーからプレイヤー名を読み込み
	const savedPlayerName = getCookie('playerName');
	if (savedPlayerName) {
		state.personName = savedPlayerName;
		// スタート画面の入力欄にも設定
		const playerNameInput = document.getElementById('playerNameInput');
		if (playerNameInput) {
			playerNameInput.value = savedPlayerName;
		}
	}

	// 初期画面設定
	setVisibility('startScreen', true);
	setVisibility('resultScreen', false);

	updateBindings(); // 初期バインディング更新
	updateTotalCount(); // 合計表示を更新
	updateProductsTable(); // 商品テーブルを更新
	updateTimer(); // タイマー初期表示

	// スタート画面BGMを開始
	startStartBGM();

	// ゲームスタートボタンのイベントリスナー
	const startGameBtn = document.getElementById('startGameBtn');
	if (startGameBtn) {
		startGameBtn.addEventListener('click', handleGameStart);
	}

	// タイピングイベント
	window.addEventListener('keydown', handleKeyClick);

	// 時刻更新
	setInterval(() => {
		const now = new Date();
		const date = `${now.getFullYear()}/${(now.getMonth() + 1)
			.toString()
			.padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}`;
		const time = `${now.getHours().toString().padStart(2, '0')}:${now
			.getMinutes()
			.toString()
			.padStart(2, '0')}`;
		setText('date', date);
		setText('time', time);
	}, 1000);
});


// * グローバルスコープ * //
window.handleClear = handleClear;
window.handlePull = handlePull;
window.gameStart = handleGameStart;


// -------------------------------- //
// Copyright (C) 2025 YukiShima1010 //
// -------------------------------- //