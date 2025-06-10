const walletButton = document.getElementById('walletButton');
const messageEl   = document.getElementById('message');
const claimButton = document.getElementById('claimButton');

let isConnected = false;

// 버튼 클릭 핸들러
walletButton.addEventListener('click', async () => {
  if (!isConnected) {
    // — Connect flow —
    if (!(window.solana && window.solana.isPhantom)) {
      messageEl.textContent = 'Phantom wallet not detected.';
      return;
    }
    try {
      const resp = await window.solana.connect({ onlyIfTrusted: false });
      const pubkey = resp.publicKey.toString();
      messageEl.textContent = `Connected: ${pubkey.slice(0,4)}…${pubkey.slice(-4)}`;
      isConnected = true;
      claimButton.disabled = false;
      walletButton.textContent = 'Disconnect Wallet';
    } catch (err) {
      console.error('Connect error', err);
      messageEl.textContent = 'Connection rejected.';
    }
  } else {
    // — Disconnect flow —
    try {
      await window.solana.disconnect();
      resetUI('Wallet disconnected.');
    } catch (err) {
      console.error('Disconnect failed', err);
      messageEl.textContent = 'Error during disconnect.';
    }
  }
});

// 외부에서 Disconnect 이벤트 발생 시 UI 초기화
window.solana?.on('disconnect', () => {
  resetUI('Wallet disconnected (external).');
});

function resetUI(msg) {
  isConnected = false;
  claimButton.disabled = true;
  walletButton.textContent = 'Connect Wallet';
  messageEl.textContent = msg;
}
