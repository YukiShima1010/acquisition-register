// assets/js/receipt.js

export function createReceipt(state) {
	const now = new Date();
	const currentDate = `${now.getFullYear()}年${String(now.getMonth() + 1).padStart(2, '0')}月${String(now.getDate()).padStart(2, '0')}日 ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

	// スコア計算(時価総額を10000で割った平方根 + レシート行数)
	const lineCount = state.products.length;
	const totalLines = lineCount + 15;

	let score;
	if (state.totalAmount > 0) {
		score = Math.floor(Math.log10(state.totalAmount) * 10000 + totalLines);
	} else {
		score = totalLines;
	}

	return `
		<div style="font-family: 'BIZ UDGothic', sans-serif; font-size: 10px; padding: 5px; width: 226.77px; background: white; box-sizing: border-box;">
			<div style="text-align: center; margin: 6px 0;">
				<img src="./assets/img/store_logo.png" style="width: 120px; height: auto; margin: 0 auto; display: block;" />
			</div>

			<div style="margin-left: 8px; margin-right: 8px;">
				<div style="text-align: center; font-size: 12px; letter-spacing: 1px; margin-top: 3px; margin-bottom: 3px;">
					【お買上げ明細】
				</div>

				<div style="display: flex; justify-content: space-between; margin-top: 8px;">
					<span style="font-size: 10px;">${currentDate}</span>
					<span style="font-size: 10px; text-align: right;">責 ${state.personName}</span>
				</div>

				${state.products.map((product, i) => `
					<div style="margin-top: 8px;">
						<div style="display: flex; justify-content: space-between;">
							<span style="font-size: 10px; letter-spacing: -0.2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 150px;">${product.name}</span>
							<span style="font-size: ${product.price >= 1000000 ? '8px' : '10px'}; text-align: right;">¥${product.price.toLocaleString()}</span>
						</div>
					</div>
				`).join('')}

				<div style="margin: 8px 0; border-bottom: 1px solid #000;"></div>

				<div>
					<div style="display: flex; justify-content: space-between;">
						<span style="font-size: 11px;">合計(${state.totalCount}点)</span>
						<span style="font-size: ${state.totalAmount >= 1000000 ? '9px' : '11px'}; text-align: right;">¥${state.totalAmount.toLocaleString()}</span>
					</div>

					<div style="display: flex; justify-content: space-between; margin-top: 4px;">
						<span style="font-size: 10px;">PeyPay</span>
						<span style="font-size: ${state.totalAmount >= 1000000 ? '9px' : '10px'}; text-align: right;">¥${state.totalAmount.toLocaleString()}</span>
					</div>

					<div style="display: flex; justify-content: space-between; margin-top: 4px;">
						<span style="font-size: 10px;">お釣り</span>
						<span style="font-size: 10px; text-align: right;">¥0</span>
					</div>
				</div>

				<div style="margin: 8px 0; border-bottom: 1px solid #000;"></div>

				<div style="margin-top: 8px;">
					<div style="display: flex; justify-content: space-between;">
						<span style="font-size: 10px;">レシートの長さ</span>
						<span style="font-size: 10px; text-align: right;">${lineCount + 15}行</span>
					</div>
					<div style="display: flex; justify-content: space-between; margin-top: 4px;">
						<span style="font-size: 10px;">合計買収額</span>
						<span style="font-size: ${state.totalAmount >= 1000000 ? '9px' : '10px'}; text-align: right;">¥${state.totalAmount?.toLocaleString?.() ?? '0'}</span>
					</div>
					<div style="display: flex; justify-content: space-between; margin-top: 4px;">
						<span style="font-size: 10px;">スコア</span>
						<span style="font-size: 10px; text-align: right;">${score.toLocaleString()}点</span>
					</div>
					<div style="display: flex; justify-content: space-between; margin-top: 4px;">
						<span style="font-size: 10px;">ゲーム名</span>
						<span style="font-size: 10px; text-align: right;">銘柄買収レジスター</span>
					</div>
					<div style="display: flex; justify-content: space-between; margin-top: 4px;">
						<span style="font-size: 10px;">製作者</span>
						<span style="font-size: 10px; text-align: right;">YukiShima1010</span>
					</div>
				</div>

				<div style="margin: 8px 0; border-bottom: 1px solid #000;"></div>

				<div>
					<div style="font-size: 9px;">本明細書は税法上の領収書ではありません。</div>
					<div style="font-size: 9px;">返品は7日以内で承ります。</div>
				</div>

				<div style="font-size: 10px; text-align: right; margin: 6px 0;">#${state.receiptNo}</div>
			</div>
		</div>
	`;
}


// -------------------------------- //
// Copyright (C) 2025 YukiShima1010 //
// -------------------------------- //